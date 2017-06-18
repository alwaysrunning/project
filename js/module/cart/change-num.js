/**
 * @description 改变数量
 * @author licuiting 250602615@qq.com
 * @date 2015-02-10 20:42:23
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var com = require('module/cart/common');
    var chk = require('module/cart/chk');
    // 购物车容器
    var eCart = com.o;
    var delay = com.delay();
    var changeNum = {
        defaultSetting: {
            selector: ''
        },
        init: function() {
            var self = this;
            $.extend(this, this.defaultSetting);
            self.chk = chk;
        },
        /**
         * 更新购物车数量
         */
        update: function(btn) {
            var self = this;
            var info = btn.getProducts({
                isChecked: false
            });
            //
            delay(function() {
                com.ajax(com.url.update, {
                    productId: info.productId,
                    quantity: info.quantity
                }, function(data) {
                    com.refreshCartModule(data);
                    // 如果没选择立即选择
                    self.chk.chkCur(btn);
                });
            }, 200);
        },
        event: function() {
            var self = this;
            eCart.on("change", ".jQtyTxt", function() {
                var $p = $(this).closest('.jNumDisabled');
                if ($p.length != 0) {
                    return;
                }
                var $this = $(this),
                    max = Number($this.attr('data-max')),
                    val = Number($this.val());
                var isUnableDis = ($(this).closest('.jQty').attr('data-q-flag') == 1); //是否无法配送
                if ($this.hasClass(com.disClass) || isUnableDis) {
                    return;
                }
                if (isNaN(val)) {
                    $this.val('1');
                } else {
                    if (max < val) {
                        $this.val(max);
                        com.dialog.tips('库存有限，此商品最多只能购买' + max + '件');
                    } else if (val <= 0) {
                        $this.val('1');
                        // com.dialog.tips('此商品最小购买数量为1');
                    }
                }
                self.update($this);
            });

            // 商品数量操作-减少
            eCart.on("click", ".jQtyMin", function() {
                var $p = $(this).closest('.jNumDisabled');
                if ($p.length != 0 || $(this).hasClass('jBoxDisabled')) {
                    return;
                }
                var $this = $(this),
                    eQtyTxt = $this.closest('.jQty').find('.jQtyTxt'),
                    val = eQtyTxt.val() * 1;
                var isUnableDis = ($(this).closest('.jQty').attr('data-q-flag') == 1); //是否无法配送
                if ($this.hasClass(com.disClass) || isUnableDis) {
                    return;
                }
                val--;
                if (val > 0) {
                    eQtyTxt.val(val);
                    self.update($this);
                } else {
                    // com.dialog.tips('此商品最小购买数量为1');
                }
            });

            // 商品数量操作-增加
            eCart.on("click", ".jQtyAdd", function() {
                var $p = $(this).closest('.jNumDisabled');
                if ($p.length != 0) {
                    return;
                }
                var $this = $(this),
                    eQtyTxt = $this.closest('.jQty').find('.jQtyTxt'),
                    max = eQtyTxt.attr('data-max') * 1,
                    val = eQtyTxt.val() * 1;
                var isUnableDis = ($(this).closest('.jQty').attr('data-q-flag') == 1); //是否无法配送 
                if ($this.hasClass(com.disClass) || isUnableDis) {
                    return;
                }
                val++;
                if (val <= max) {
                    eQtyTxt.val(val);
                    self.update($this);
                } else {
                    com.dialog.tips('库存有限，此商品最多只能购买' + max + '件');
                }
            });
        }
    }
    module.exports = changeNum;
});
