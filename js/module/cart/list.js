/**
 * @description 购物车列表
 * @author licuiting 250602615@qq.com
 * @date 2015-02-10 16:04:30
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var cookie = require('common/kit/io/cookie');
    var com = require('module/cart/common');
    var dialog = require('common/ui/dialog/dialog');
    var scroll = require('common/widget/scroll');
    var Channel = require('lib/gallery/channel/1.0.0/channel');
    var channelCart = Channel.get('cartChannel');
    var pop = require('common/ui/dialog/1.0.1');
    //mod
    var goodsCol = require('module/cart/goodsCol');
    var changeNum = require('module/cart/change-num');
    var chk = require('module/cart/chk');
    var tariff = require('./list/tariff');
    // 购物车容器
    var eCart = com.o;
    var list = {
        defaultSetting: {
            selector: ''
        },
        // 购物车初始化
        init: function() {
            var self = this;
            $.extend(this, this.defaultSetting);
            //获取复选框的方法
            changeNum.init();
            chk.init();
            tariff.init();
            self.chk = chk;
        },
        checkPro: function(btn, callBack) {
            var self = this;
            var info = btn.getProducts();
            com.ajax(com.url.checked, {
                productId: info.productId
            }, function(data) {
                callBack && callBack();
            });
        },
        isShowProTypeBox: function() {
            var len = $('.jGlobalPro').length;
            return (len != 0 && len != $('.jChkItem:checked').length);
        },
        getLen: function(selector) {
            var len = 0;
            $(selector).each(function() {
                var quantity = Number($(this).attr('data-quantity'));
                len += quantity;
            });
			return len;
        },
        //全球购或非全球购选择
        proTypeBox: function(callback) {
            var self = this;
            if (!self.isShowProTypeBox()) {
                callback && callback();
                return;
            }
            var globalLen = self.getLen('.jGlobalPro'),
                otherLen = self.getLen('.jChkItem:checked') - globalLen;
            var ar = ['<div class="mod-choice-box">',
                '<div class="box-hd">请分开结算以下商品</div>',
                '<div class="box-bd">',
                '<div class="bd-item"><input type="radio" name="proType" value="1" checked class="checkbox"/>全球购商品<span class="item-len">' + globalLen + '件</span></div>',
                '<div class="bd-item"><input type="radio" name="proType" value="2" class="checkbox"/>其他商品<span class="item-len">' + otherLen + '件</span></div>',
                '</div>',
                '</div>'
            ];
            pop.confirm(ar.join(''), null, function() {
                var val = $('[name=proType]:checked').val();
                //全球购商品
                if (val == 1) {
                    self.checkPro($('.jGlobalPro'), function() {
                        callback && callback();
                    });
                } else {
                    self.checkPro($('.jChkItem:checked:not(.jGlobalPro)'), function() {
                        callback && callback();
                    });
                }
            }, '返回购物车', '去结算');
        },
        events: function() {
            var self = this;
            changeNum.event();
            chk.event();
            tariff._events();
            self.event();
        },
        event: function() {
            var self = this;
            // 单个删除
            eCart.on("click", ".jDel", function() {
                var $this = $(this);
                if ($this.hasClass(com.disClass)) {
                    return;
                }
                com.dialog.confirm({
                    cnt: '确认要删除这个商品吗？',
                    lock: true
                }, function() {
                    self.del($this);
                }, null);
            });

            // 单个收藏
            eCart.on("click", ".jCol", function() {
                var $this = $(this);

                if ($this.hasClass(com.disClass)) {
                    return;
                }
                self.col($this);
            });
            //优惠方式的显示和隐藏
            eCart.on('click', '.jCtit', function() {
                    var $parent = $(this).closest('.jPrefer');
                    var $ico = $parent.find('.jPreferIcon'); //图标
                    var $cnt = $parent.find('.jCnt'); //内容
                    var isVisible = $cnt.is(':visible');
                    $cnt[isVisible ? 'hide' : 'show']();
                    $ico.addClass('display-n').eq(isVisible ? '0' : '1').removeClass('display-n');
                })
                // 下单结算
            eCart.on("click", "#jSubmit", function() {
                var $this = $(this);
                if ($(this).hasClass(com.disClass)) {
                    return;
                }
                //税费
                var flag = chk.validateTariffLimited('[data-tariff-limit]');
                $(this)[flag ? 'removeClass' : 'addClass'](com.disClass);
                if (!flag) {
                    chk.verPop('[data-tariff-limit]');
                    return false;
                };
                if (!chk.validateTariffLimited('[data-tariff-up]') && !com.o.attr('data-tariff-flag')) {
                    $this.text('继续结算');
                    com.o.attr({
                        'data-tariff-flag': 1,
                        'data-tariff-txt': '继续结算'
                    });
                    chk.verPop('[data-tariff-up]');
                    return false;
                };
                // 未登陆状态
                if (!cookie('_nick')) {
                    location.href = com.loginUrl + '?returnUrl=' + encodeURIComponent(com.pageUrl);
                    return false;
                }
                if (self.checkSubmit()) {
                    com.dialog.tips('请至少选择一个商品!');
                    return false;
                }
                // self.proTypeBox(function() {
				window.location.href = com.bbgUrl.settlement.page;
                // });
            });
            //清空失效商品
            com.delegator.on('click', 'emptyFailPro', function() {
                self.batchEmptyPro(com.url.emptyFailPro, '确定清空失效商品么？清空后不能恢复哦！')
            });
            // $('#jHomeBtn').on('click', function() {
            //     self.goHome();
            // });
            //点击当前行跳转页面
            eCart.on('click', '.jTableTr', function(e) {
                var $tg = $(e.target);
                var $a = $(this).find('.pro-img');
                var href = $a.attr('href');
                var isOther = ($tg.closest('.jOther').length != 0); //点击排除元素
                $(this).addClass('active-bg');
                if (href && $.trim(href).length != 0 && !isOther) {
                    location.href = href;
                } else {
                    $(this).removeClass('active-bg');
                }
            });
        },
        //清空失效商品
        batchEmptyPro: function(url, msg) {
            var self = this;
            com.dialog.confirm({
                cnt: msg,
                lock: true
            }, function() {
                com.ajax(url, {}, function(data) {
                    com.refreshCartModule(data);
                });
            }, null);
        },
        goHome: function() {
            window.location.href = com.bbgUrl.index.page;
        },
        /**
         * 判断提交按纽是否可用
         */
        checkSubmit: function() {
            var eSubmit = $('#jSubmit');
            var self = this;
            if (!eSubmit) {
                return false;
            }
            var eChkItem = eCart.find('.jChkItem'),
                count = 0;
            eChkItem.each(function() {
                var $this = $(this);
                if ($this.prop('checked')) {
                    count++;
                }
            });
            if (count > 0) {
                eSubmit.removeClass(com.disClass);
                return false;
            } else {
                eSubmit.addClass(com.disClass);
                return true;
            }
        },
        /**
         * 删除购物车
         */
        del: function(btn) {
            var self = this;
            var info = btn.getProducts({
                isChecked: false
            });
            com.ajax(com.url.dels, {
                productIds: info.productId
            }, function(data) {
                com.refreshCartModule(data);
                self.chk.setChk(); //重置复选框状态
            });
        },
        /**
         * 收藏商品
         */
        col: function(btn) {
            var $parent = btn.closest('.jTable');
            var eCol = btn.parent('.collection'),
                info = btn.getProducts({
                    isChecked: false
                });
            btn.attr('data-product-id', info.productId);
            btn.attr('data-goods-id', $parent.attr('data-goods-id'));
            btn.goodsCol();
        }
    }
    module.exports = list;
});
