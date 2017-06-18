/**
 * @description 优惠券
 * @author licuiting 250602615@qq.com
 * @date 2015-02-11 17:25:44
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var com = require('module/order/common');
    var coupon = {
        defaultSetting: {
            selector: ''
        },
        init: function() {
            $.extend(this, this.defaultSetting);
            this.event();
        },
        event: function() {
            var self = this;
            // 站外优惠券---确定或取消优惠券
            com.o.on('click', '.jCouponsSure', function() {
                    // 优惠券名称;
                    var _this = this;
                    var $this = $(this);
                    var $parent = $(this).closest('.jShoppingInfo'); // parent
                    var $tips = $parent.find('.coupons-tips'); // 提示信息对象;
                    var shopId = $parent.attr('data-shopId');
                    var msg = ['请输入现金券券码', '不能输入特殊字符']; // 验证输入信息
                    var textArr = ['使用', '取消'];
                    var isSure = ($this.text() == textArr[0]); // 是否是'确定'文字
                    var $coupon = $parent.find('[name=jCouponInput]'); //优惠券对象
                    var $val = $coupon.val(); // 站外优惠券内容
                    var isEmpty = $.trim($val).length == 0; // 是否为空
                    var isHasSpChar = com.isHasSpChar($.trim($val)); // 是否包含特殊字符
                    // 验证是否为空,是否包含特殊字符;
                    if (isEmpty || isHasSpChar) {
                        $tips.show().html(msg[(isEmpty ? 0 : 1)]);
                    } else {
                        $tips.hide();
                        // 使用或取消优惠券
                        com.ajax(com.url[(isSure ? 'use' : 'cancel') + 'Offers'], {
                            couponType: 'out',
                            code: $val,
                            shopId: shopId
                        }, function(data) {
                            // 有数据就显示
                            if (data) {
                                com.dialog.tips((isSure ? '使用' : '取消') + '优惠券成功');
                                // 切换文字
                                $this.text(textArr[(isSure ? 1 : 0)]);
                                com.refreshOrderModule(data);
                            }
                        }, function() {
                            //清空文本框
                            if (isSure) {
                                $coupon.val('').focus();
                            } else {
                                $coupon.focus();
                            }
                        });
                    }
                })
                // 站内优惠券--使用
                .on('change', '[name=jCouponsList]', function() {
                    var _this = this;
                    var $parent = $(this).closest('.jShoppingInfo'); // 父级
                    var shopId = $parent.attr('data-shopId'); // shopId
                    var $couponsBtn = $parent.find('.jCouponsSure'); // 使用优惠券确定按钮
                    var isSelecteOption = $(this).val() == 'null'; // 是否是'请选择'选项
                    var _cCode = $.trim($parent.attr('data-coupon-code')); //优惠券码
                    //
                    if (_cCode && _cCode.length != 0) {
                        $(_this).attr('data-value', _cCode);
                    }
                    //
                    var attrValue = $(this).attr('data-value'); // 缓存的优惠券的值
                    var flag = (isSelecteOption && attrValue) || !isSelecteOption;
                    flag && com.ajax(com.url[isSelecteOption ? 'cancelOffers' : 'useOffers'], {
                        couponType: 'in',
                        shopId: shopId,
                        code: (isSelecteOption ? $(this).attr('data-value') : $(_this).val())
                    }, function(data) {
                        if (data) {
                            if (!isSelecteOption) {
                                $(_this).attr('data-value', $(_this).val());
                            } else {
                                $(_this).removeAttr('data-value');
                            }
                            com.dialog.tips((isSelecteOption ? '取消' : '使用') + '优惠券成功!');
                            // 切换文字
                            $couponsBtn.text('使用');
                            com.refreshOrderModule(data);
                        }
                    }, function() {
                        //报错要还原下拉框初始状态
                        $(_this).val('null');
                    })
                })
        },
        // 生成下拉列表字符串
        createCouponsStr: function(data) {
            var str = '<option value="null">不使用优惠券</option>';
            for (var i = 0; i < data.length; i++) {
                str += '<option value="' + data[i]['code'] + '">' + data[i]['cpnsName'] + '</option>';
            }
            return str;
        }
    };
    coupon.init();
});
