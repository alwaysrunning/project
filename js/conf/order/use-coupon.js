/**
 * @description  使用优惠券
 * @author licuiting 250602615@qq.com
 * @date 2015-02-11 17:25:44
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var com = require('module/order/common');
    var useCoupon = {
        defaultSetting: {
            selector: ''
        },
        init: function() {
            var self = this;
            $.extend(this, this.defaultSetting);
            self.getCouponsList();
            self.setCouponValue();
            self.event();
        },
        event: function() {
            var self = this;
            // 站外优惠券---确定或取消优惠券
            $('#jClrBtn').on('click', function() {
                $('#jCouponInput').val('');
            });
            $('#jUseCoupon').on('click', '#jSubBtn', function() {
                    // 优惠券名称;
                    var $this = $(this);
                    var $parent = $('#jUseCoupon'); // parent
                    var $tips = $('#msg'); // 提示信息对象;
                    var shopId = com.getUrlParam('shopId');
                    var msg = ['请输入现金券券码', '不能输入~#^$@%&!*\'<>等字符']; // 验证输入信息
                    var $coupon = $('#jCouponInput'); // 优惠券对象
                    var $val = $coupon.val(); // 站外优惠券内容
                    var isEmpty = $.trim($val).length == 0; // 是否为空
                    var isHasSpChar = com.isHasSpChar($.trim($val)); // 是否包含特殊字符
                    var isCancel = $this.hasClass('isCancel');
                    // 验证是否为空,是否包含特殊字符;
                    if (isEmpty || isHasSpChar) {
                        com.dialog.tips({
                            cnt: msg[(isEmpty ? 0 : 1)],
                            time: 1000
                        });
                    } else {
                        $tips.hide();
                        // 使用或取消优惠券
                        com.ajax(com.url[isCancel ? 'cancelOffers' : 'useOffers'], {
                            couponType: 'out',
                            code: $val,
                            shopId: shopId
                        }, function(data) {
                            // 有数据就显示
                            if (data) {
                                com.dialog.tips({
                                    cnt: isCancel ? '已取消使用优惠券' : '使用优惠券成功',
                                    time: 1000
                                }, function() {
                                    location.href = com.getUrlParam('source') + '.html?isRefresh=1';
                                });
                            }
                        }, function() {
                            $coupon.focus();
                        });
                    }
                })
                //点击使用优惠券
                .on('click', '.jCouponItem', function(e) {
                    var $target = $(e.target);
					var $this = $(this);
					$this.addClass('active-bg');
                    if ($target.hasClass('jShowCouponInfo') || $target.closest('.jShowCouponInfo').length != 0) {
						$this.removeClass('active-bg');
                        return false;
                    }
					var _this = this;
                    var $parent = $('#jUseCoupon'); // 父级
                    var shopId = com.getUrlParam('shopId'); // shopId
                    var _cCode = com.getUrlParam('code'); // 优惠券码
                    var attrValue = $(this).attr('data-value'); // 缓存的优惠券的值
                    com.ajax(com.url['useOffers'], {
                        couponType: 'in',
                        shopId: shopId,
                        code: $(this).attr('data-value')
                    }, function(data) {
                        if (data) {
                            com.dialog.tips({
                                cnt: '使用优惠券成功!',
                                time: 1000
                            }, function() {
                                // 切换文字
                                location.href = com.getUrlParam('source') + '.html?isRefresh=1';
                            });
                        }
						$this.removeClass('active-bg');
                    }, function(e) {
                        com.dialog.tips({
                            cnt: e,
                            time: 1000
                        });
						$this.addClass('active-bg');
                    });
                })
                // 取消使用优惠券
                .on('click', '#jBtnCancelCoupon', function() {
                    var shopId = com.getUrlParam('shopId'); // shopId
                    var _cCode = com.getUrlParam('code'); // 优惠券码
                    com.ajax(com.url['cancelOffers'], {
                        couponType: 'in',
                        shopId: shopId,
                        code: $(this).attr('data-value')
                    }, function(data) {
                        if (data) {
                            com.dialog.tips({
                                cnt: '已取消使用优惠券!',
                                time: 1000
                            }, function() {
                                location.href = com.getUrlParam('source') + '.html?isRefresh=1';
                            });
                        }
                    });
                })
                //下拉展示
            $('#jUseCoupon').on('click', '.jShowCouponInfo ', function() {
                var statusAr = ['&#xe641;', '&#xe642;'];
                var $arrow = $(this).find('.jCouponArrow');
                var $ctn = $(this).closest('.jItemBox').find('.jItemCtn');
                var $section = $(this).closest('.jCouponList');
                var $allCtn = $section.find('.jItemCtn');
                var $allArrow = $section.find('.jShowCouponInfo').find('.jCouponArrow');
                var isVisible = $ctn.is(':visible');
                $allCtn.hide();
                $allArrow.html(statusAr[0]);
                $ctn[isVisible ? 'hide' : 'show']();
                !isVisible && $arrow.html(statusAr[1]);
            })
        },
        // 获取优惠券列表
        getCouponsList: function() {
            var _self = this;
            var $availableCouponItems = $('#jAvailableCouponItems');
            var $invalidCouponItems = $('#jInvalidCouponItems');
            var $expiredCouponItems = $('#jExpiredCouponItems');
            var $parent = $('#jUseCoupon');
            var shopId = com.getUrlParam('shopId');
            var _cType = com.getUrlParam('type');
            var _cCode = com.getUrlParam('code');

            com.ajax(com.url.couponList, {
                shopId: shopId
            }, function(data) {
                $availableCouponItems.html(_self.createCouponsStr(data['available'], 'available'));
                $invalidCouponItems.html(_self.createCouponsStr(data['invalid'], 'invalid'));
                $expiredCouponItems.html(_self.createCouponsStr(data['expired'], 'expired'));
                $('#jAvailableCouponCount').text('(' + data['available'].length + ')');
                $('#jInvalidCouponCount').text('(' + (data['invalid'].length * 1 + data['expired'].length) + ')');
                if (data['available'].length === 0) {
                    $availableCouponItems.addClass('empty');
                    $('#jBtnCancelCoupon').hide();
                }

                if (_cType && _cType == 'in') {
                    (!_cCode || _cCode.length == 0) ? _cCode = 'null': '';
                    $availableCouponItems.attr('data-value', _cCode);
                    $availableCouponItems.find('.coupon-' + _cCode).addClass('active');
                }

                // 调整优惠券金额字体大小
                $('.jCouponList .cp-code').each(function() {
                    var _cpvalue = $(this).find('span');
                    var _cpvaluetxt = _cpvalue.text();
                    if (_cpvaluetxt.length > 3) {
                        _cpvalue.css('font-size', 3 / _cpvaluetxt.length * 1.70667 + 'rem');
                    }
                });
            });
        },
        //设置优惠券码的值
        setCouponValue: function() {
            var _cType = com.getUrlParam('type');
            var _cCode = com.getUrlParam('code');
            if (_cType == 'out' && _cCode && _cCode.length != 0) {
                $('#jCouponInput').val(_cCode);
                $('#jSubBtn').text('取消').addClass('isCancel');
            }
            if (!_cCode) {
                $('#jBtnCancelCoupon').text('暂未使用任何优惠券').prop('disabled', true);
            }
        },
        getCouponColor: function(amount) {
            /* if (amount >= 120) { */
            // return 'yellow';
            // } else if (amount >= 50) {
            // return 'red';
            // } else {
            // return 'green';
            /* } */
            return '';
        },
        // 生成优惠券列表
        createCouponsStr: function(data, type) {
            var str = '';
            var itemClass = '';
            for (var i = 0; i < data.length; i++) {
                if (type === 'available') { // 可用的优惠券
                    itemClass = 'jCouponItem ' + this.getCouponColor(data[i]['amountDouble']);
                } else if (type === 'invalid') { // 不可用的优惠券
                    itemClass = this.getCouponColor(data[i]['amountDouble']);
                } else if (type === 'expired') { // 失效的优惠券
                    itemClass = 'expired';
                }
                data[i]['class'] = itemClass;
            }
            str = template.render('jCouponListTmpl', {
                couponList: data
            });
            return str;
        }

    };
    // 优惠券列表切换
    var btnShowAvailableCoupons = $('#jShowAvailableCoupons');
    var btnShowInvalidCoupons = $('#jShowInvalidCoupons');
    var availableCouponList = $('#jAvailableCouponList');
    var invalidCouponList = $('#jInvalidCouponList');

    btnShowAvailableCoupons.on('click', function() {
        availableCouponList.show();
        invalidCouponList.hide();
        $(this).addClass('active');
        btnShowInvalidCoupons.removeClass('active');
    });
    btnShowInvalidCoupons.on('click', function() {
        availableCouponList.hide();
        invalidCouponList.show();
        $(this).addClass('active');
        btnShowAvailableCoupons.removeClass('active');
    });
    //
    useCoupon.init();
});
