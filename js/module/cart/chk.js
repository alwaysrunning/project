/**
 * @description 复选框
 * @author licuiting 250602615@qq.com
 * @date 2015-02-10 16:04:30
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var com = require('module/cart/common');
    // 购物车容器
    var eCart = com.o;
    var chk = {
        defaultSetting: {
            selector: ''
        },
        // 购物车初始化
        init: function() {
            $.extend(this, this.defaultSetting);
            this.setChk();
            // this.event();
        },
        /**
         * 选中购物车
         */
        check: function(btn, $this) {
            var self = this;
            var info = btn.getProducts();
            com.ajax(com.url.checked, {
                productId: info.productId
            }, function(data) {
                com.refreshCartModule(data);
                self.setChk();
            }, null, $this);
        },
        // 选择当前
        chkCur: function(btn) {
            var eTable = btn.parents('.jTable'),
                eChk = eTable.find('.jChkItem');
            if (!$(this).prop('disabled')) {
                eChk.prop('checked', true);
                this.setChk();
            }
        },
        // 判断是否全选中
        setChk: function() {
            this.isChkWarehouseAll();
            this.isChkCatAll();
            this.isChkAll();
            this.changeSubmit();
        },
        //仓库
        isChkWarehouseAll: function() {
            var eChkCat = eCart.find('.jChkWarehouse');
            eChkCat.each(function() {
                var $this = $(this),
                    eChkItem = $this.closest('.jWarehouse').find('.jChkItem'),
                    len = eChkItem.length,
                    chkCount = 0,
                    disCount = 0;
                eChkItem.each(function() {
                    if ($(this).prop('checked')) {
                        chkCount++;
                    }
                    if ($(this).prop('disabled')) {
                        disCount++;
                    }
                });
                if (len == chkCount + disCount && disCount != len) {
                    $this.prop('checked', true);
                } else {
                    $this.prop('checked', false);
                }
            });
            // this.isChkAll();
        },
        // 判断分类全选
        isChkCatAll: function() {
            var eChkCat = eCart.find('.jChkCat');
            eChkCat.each(function() {
                var $this = $(this),
                    eChkItem = $this.closest('.list').find('.jChkItem'),
                    len = eChkItem.length,
                    chkCount = 0,
                    disCount = 0;
                eChkItem.each(function() {
                    if ($(this).prop('checked')) {
                        chkCount++;
                    }
                    if ($(this).prop('disabled')) {
                        disCount++;
                    }
                });
                if (len == chkCount + disCount && disCount != len) {
                    $this.prop('checked', true);
                } else {
                    $this.prop('checked', false);
                }
            });
            // this.isChkAll();
        },
        /**
         * 判断是否有被选中项
         * @return {Boolean}
         */
        hasChecked: function() {
            return (eCart.find('.jChkItem:not(:disabled):checked').length != 0);
        },
        validateTariffLimited: function(seletor) {
            var flag = true;
            var $selected = $(seletor);
            var $checked = $selected.find('.jChkItem:not(:disabled):checked');
            if ($selected.length != 0 && $checked.length != 0) {
                flag = false;
            };
            return flag;
        },
        verPop: function(seletor) {
            var $selected = $(seletor).eq(0);
            $selected.addClass('list-warehouse-selected')
            $.scrollTo({
                endY: $selected.position().top + $selected.height() - 300,
                duration: 400,
                callback: function() {}
            });
        },
        proMsg: function() {
            var self = this;
            var flag = self.hasChecked();
            !flag && com.dialog.tips('请至少选择一个商品！');
            return flag;
        },
        getChecked: function() {
            return eCart.find('.jChkItem:checked');
        },
        /**
         * 改变提交按钮的状态
         */
        changeSubmit: function() {
            //按钮文字判断
            if (com.o.attr('data-tariff-flag')) {
                $('#jSubmit').text(com.o.attr('data-tariff-txt'));
            }
            $('#jSubmit').toggleClass(com.disClass, !this.hasChecked());
        },
        // 判断全选
        isChkAll: function() {
            var eChkAll = $('.jChkAll'); //全选按钮
            var $chk = eCart.find('.jChkItem:not(:disabled)'); //二级商品checkbox
            var chk_len = $chk.length; //总个数
            var chked_len = $chk.filter(':checked').length; //选中的
            eChkAll.prop('checked', (chk_len != 0 && chked_len == chk_len));
        },
        toggleAllChecked: function(element) {
            var eChkItem = eCart.find('.jChkItem'),
                isChecked = element.prop('checked');

            if (element.hasClass(com.disClass)) {
                return;
            }

            eChkItem.each(function() {
                var $this = $(this);
                if (!$this.prop('disabled')) {
                    $this.prop('checked', isChecked);
                }
            });

            this.check(eCart.find('.jChkItem'), element);
        },
        event: function() {
            var self = this;
            // 全部全选
            eCart.on("click", ".jChkAll", function() {
                self.toggleAllChecked($(this));
            });

            // 分类全选
            eCart.on("click", ".jChkCatBox", function() {
                var $this = $(this).find('.jChkCat'),
                    $parent = $this.closest('.list'),
                    eChkItem = $parent.find('.jChkItem'),
                    $warehouse = $parent.find('.jChkWarehouse'),
                    isChecked = $this.prop('checked');
                if ($this.hasClass(com.disClass)) {
                    return;
                }
                //仓库
                $warehouse.each(function() {
                    var $this = $(this);
                    if (!$this.prop('disabled')) {
                        $this.prop('checked', isChecked);
                    }
                });
                eChkItem.each(function() {
                    var $this = $(this);
                    if (!$this.prop('disabled')) {
                        $this.prop('checked', isChecked);
                    }
                });
                //self.setChk();
                self.check(eCart.find('.jChkItem'), $(this));
            });
            //仓库
            eCart.on('click', '.jChkWarehouseBox', function() {
                var $this = $(this).find('.jChkWarehouse'),
                    eChkItem = $this.closest('.jWarehouse').find('.jChkItem'),
                    isChecked = $this.prop('checked');
                if ($this.hasClass(com.disClass)) {
                    return;
                }
                eChkItem.each(function() {
                    var $this = $(this);
                    if (!$this.prop('disabled')) {
                        $this.prop('checked', isChecked);
                    }
                });
                //self.setChk();
                self.check(eCart.find('.jChkItem'), $(this));
            });
            // 单选
            eCart.on('click', '.jChkBox', function(e) {
                var $tg = $(e.target);
                var $this = $(this).find('.jChkItem');
                var ischk = $this.is(':checked');
                if ($this.is(':disabled')) {
                    return;
                }
                if (!$tg.hasClass('jChkItem')) {
                    $this.prop('checked', ischk ? false : true);
                }
                //self.setChk();
                self.check(eCart.find('.jChkItem'), $(this));
            })
        }
    };
    module.exports = chk;
});
