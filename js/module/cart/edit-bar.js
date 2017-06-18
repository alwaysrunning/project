/**
 * @description 工具条
 * @Author houjian
 * @Date 2015-8-24
 */
define(function(require, exports, module) {
    'use strict';
    var cookie = require('common/kit/io/cookie');
    var com = require('module/cart/common');
    //数量增减
    var chk = require('module/cart/chk');
    var // Dom element
        _default = {
            editBtn: '#jEdit',
            editBar: '#jEditBar',
            totalBar: '.jTotal',
            editText: '编辑',
            returnText: '完成'
        },
        _editBar = {
            init: function() {
                var self = this;
                self.delegator = com.Delegator(_default.editBar);
                self.chk = chk;
                this.initProps();
                this.bindEvents();
            },
            initProps: function() {
                this.$editBtn = $(_default.editBtn);
                this.$editBar = $(_default.editBar);
                this.$totalBar = $(_default.totalBar);
            },
            bindEvents: function() {
                var self = this;
                //编辑
                com.Delegator('#jCartHd').on('click', 'editCart', function() {
                    self.editCart($(this));
                });
                //全选
                self.delegator.on('click', 'selectAll', function() {
                    self.chk.toggleAllChecked($(this));
                });
                //批量删除
                self.delegator.on('click', 'batchDelete', function() {
                    self.batchDelete();
                });
                //清空购物车
                self.delegator.on('click', 'emptyCart', function() {
                    self.emptyCart();
                });
                //批量加入收藏夹
                self.delegator.on('click', 'batchCollect', function() {
                    self.chk.proMsg() && self.cols(self.chk.getChecked(), $(this));
                });
            },
            emptyCart: function() {
                com.dialog.confirm({
                    cnt: '确定要清空购物车吗？清空后不能恢复哦!',
                    lock: true
                }, function() {
                    com.ajax(com.url.emptyCart, {}, function(data) {
                        com.refreshCartModule(data);
                    });
                }, null);
            },
            cols: function(btn, $btn) {
                var info = btn.getProducts({
                        isChecked: false
                    }),
                    name = cookie('_nick');
                if (name) {
                    com.ajax(com.url.cols, {
                        ids: info.productId
                    }, function(data) {
                        if (data.error == 0) {
                            com.dialog.tips(data.msg, function() {
                                // com.getCartData();
                            });
                        }
                    }, function(data) {
                        if (data.error == '-100') {
                            location.href = com.loginUrl;
                        } else {
                            com.dialog.tips(data.msg);
                        }
                    }, $btn);
                } else {
                    // 未登录，请先登录
                    location.href = com.loginUrl;
                }
            },
            batchDelete: function() {
                var self = this;
                self.chk.proMsg() && com.dialog.confirm({
                    cnt: '确定要删除这些商品吗？',
                    lock: true
                }, function() {
                    com.emit('del', self.chk.getChecked());
                }, null);
            },
            editCart: function($this) {
                var flag = $this.hasClass('checked');
                var ar = [_default.editText, _default.returnText];
                $this.text(ar[flag ? 0 : 1])[flag ? 'removeClass' : 'addClass']('checked');
                this.toggle(!flag);
            },
            hideAll: function() {
                this.$editBtn.hide()
                this.$totalBar.hide();
                this.$editBar.hide();
            },
            toggle: function(flag) {
                this.$totalBar[flag ? 'hide' : 'show']();
                this.$editBar[!flag ? 'hide' : 'show']();
            }
        };
    //
    var editBar = {
            toggle: function(data) {
                if (data && data.groups && data.groups.length != 0) {
                    data = data.groups;
                    _editBar.$editBtn.show();
                    _editBar.chk.isChkAll();
                } else {
                    _editBar.hideAll();
                }
                // _editBar.toggle();
            }
        }
        //
    _editBar.init();
    com.Emitter.applyTo(editBar);
    return editBar;

});
