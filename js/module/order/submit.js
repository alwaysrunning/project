/**
 * @description 提交订单
 * @author licuiting 250602615@qq.com
 * @date 2015-02-12 16:51:17
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';

    //import public lib
    var com = require('module/order/common');
    var scroll = require('common/widget/scroll');
    var follow = require('module/order/follow');
    var Invoice = require('module/order/invoice');
    var Ztd = require('module/order/ztd');
    var EventEmitter = require('lib/core/1.0.0/event/emitter');

    var emitter = new EventEmitter();
    var EVENT_SUB_ORDER = 'event_sub_order';

    var INFO = {
        'idCheckType1': '您的订单中含有保税区商品，请补全身份证号，用于海关申报',
        'idCheckType2': '您的订单中含有国际直邮商品，请补全身份证号与照片，用于海关申报',
        'idCheckType3': '您的订单中含有国际直邮商品，请补全身份证照片，用于海关申报'
    };
    var submit = {
        defaultSetting: {
            selector: '',
            //三级地址提示
            threeAddrInfo: '由于商城系统地址升级，请重新更新地址，让配送服务更精确！'
        },
        init: function() {
            $.extend(this, this.defaultSetting);
            this.event();
            this.initProps();
        },
        initProps: function() {
            this.invoice =Invoice.init(); 
            follow.init();
        },
        bindEvents: function() {
            var _self = this;
            emitter.on(EVENT_SUB_ORDER, function(status) {
                _self.orderHandler(status);
            });
        },
        orderHandler: function(status) {
            var success = true,
                _self = this,
                subs = this.subs;

            if (typeof status !== 'undefined') {
                this[status] = true;
            }

            subs.forEach(function(value) {
                if (!_self[value]) {
                    success = false;
                }
            });

            if (success) {
                _self.subOrderFun();
            }
        },
        // 提交订单
        subOrderFun: function() {
            var _self = this;

            if(Ztd.getZtd()){
                Ztd.submit(_self.orderSub);
                return false;
            }

            
            _self.orderSub();

            // $('#jSubBtn').addClass(com.disClass);
            // // follow.submit();
            // com.ajax('http://www.baidu.com', {}, function(data) {
            //     if (data && data.length != 0) {
            //         location.href = com.url.payAddr + "?sign=" + data.jSign + '&token=' + data.tradePayToken + '&showwxpaytitle=1';
            //     }
            //     $('#jSubBtn').removeClass(com.disClass);
            // }, function(data) {
            //     $('#jSubBtn').removeClass(com.disClass);
            // });
        },
        orderSub: function(){
            $('#jSubBtn').addClass(com.disClass);
            // follow.submit();
            com.ajax(com.url.subOrder, {}, function(data) {
                if (data && data.length != 0) {
                    location.href = com.url.payAddr + "?sign=" + data.jSign + '&token=' + data.tradePayToken + '&showwxpaytitle=1';
                }
                $('#jSubBtn').removeClass(com.disClass);
            }, function(data) {
                $('#jSubBtn').removeClass(com.disClass);
            });
        },
        // 创建表单隐藏域
        createFormHidden: function(data) {
            var str = '';
            var $form = $('#jSubForm');
            $.each(data, function(k, v) {
                str += '<input type="hidden" name="' + v.name + '" value="' + v.value + '"/>';
            });
            $form.prepend(str);
        },
        //验证身份信息
        veriIdInfo: function() {
            // var self = this;
            // var msgAr = ['请填写身份证号码！', '请添加身份证正反照片！'];
            // var idBox = $('#jIdTxt');//身份证号码;
            // var idPicBox = $('#idPicBox');//图片box;
            // var idPic = $('#idPic');//身份正面;
            //
            // if($('#jIdInfoBox').length!=0){
            //     if($('#jIdInfo').find('.jNoData').length!=0||(idBox.length!=0 && $.trim(idBox.text()).length==0)){
            //         verPop(msgAr[0]);
            //         return false;
            //     }else if(idPicBox.length!=0 && idPic.length==0){
            //         verPop(msgAr[1]);
            //         return false;
            //     }
            // }
            // //身份证定位框
            // function verPop(msg){
            //     com.dialog.alert(msg, function() {
            //         // 滚动条定位;
            //         $.scrollTo({
            //             endY: $('#jIdInfo').position().top,
            //             duration: 400
            //         });
            //     });
            // }
            var info, requestImg,
                idCheckType = $('#idCheckType').val(),
                idChecked = $('#idChecked').val(),
                idCheckImage = $('#idCheckImage').val(); //true 图片为空

            if (idCheckType === '2' && idCheckImage === 'true') {
                requestImg = true;
            }
            //身份证信息存在，并且不需要身份证图片
            if (typeof idCheckType === 'undefined' || idCheckType === '0' || (idChecked === 'true' && !requestImg)) {
                return true;
            }

            if (idCheckType === '1') {

                info = INFO.idCheckType1;

            } else if (idCheckType === '2') {

                if (idCheckImage === 'true' && idChecked === 'true') {
                    info = INFO.idCheckType3;
                } else {
                    info = INFO.idCheckType2;
                }

            }

            com.dialog.tips(info);
        },
        triggerSubmit: function() {
            var subEnable = true,
                subs = [],
                invoice = this.invoice;


            if (invoice.getChecked()) {
                invoice.submit(invoiceSuccess);
                subs.push('invoiceSuccess');
                subEnable = false;
            }

            if (follow.getEanble()) {
                follow.submit(followSuccess);
                subs.push('followSuccess');
                subEnable = false;
            }

            this.subs = subs;

            if (subEnable) {
                emitter.emit(EVENT_SUB_ORDER);
            }
        },
        event: function() {
            var _self = this;
            com.o.on('click', '#jSubBtn', function() {
                var $this = $(this);
                if ($(this).hasClass(com.disClass)) {
                    return;
                }
                var $sbTag = $(this).attr('data-sbTag'); //0:可以正常提交; 非0:弹出submitTips信息
                var $tips = $(this).attr('data-tips'); //提示信息
                //
                var $chk = $('#jAddress').find('.jNoData').length;
                var $invoice = $('[name=jInvoiceType]:checked'); //发票
                // 判断是否选中了默认地址
                if ($('.jProductlistTable').length == 0) {
                    com.dialog.alert('当前无可结算商品，您可去首页继续逛逛！', function() {
                        //location.href = com.bbgUrl.index.page;
                    });
                } else if ($chk && $chk.length != 0) {
                    //
                    com.dialog.alert('请先填写收货人和收货地址！', function() {
                        // 滚动条定位;
                        $.scrollTo({
                            endY: $("#jAddress").position().top,
                            duration: 400,
                            callback: function() {

                            }
                        });
                    });
                } else if ($('#jAddrDiv') && $('#jAddrDiv').attr('data-is-old') == 1) {
                    com.dialog.alert(_self.threeAddrInfo, function() {
                        // 滚动条定位;
                        $.scrollTo({
                            endY: $("#jAddress").position().top,
                            duration: 400
                        });
                    });
                } else if (!_self.veriIdInfo()) {
                    return false;
                } else if ($sbTag && $sbTag != 0) {
                    com.dialog.tips($tips);
                } else {
                    _self.triggerSubmit();
                }
            });
            _self.bindEvents();
        }
    };

    // help
    function callback(data, status) {
        if (typeof data !== 'undefined') {
            emitter.emit(EVENT_SUB_ORDER, status);
        }
    }

    function followSuccess(data) {
        callback(data, 'followSuccess');
    }

    function invoiceSuccess(data) {
        callback(data, 'invoiceSuccess');
    }
    // submit.init();
    module.exports = submit;
});
