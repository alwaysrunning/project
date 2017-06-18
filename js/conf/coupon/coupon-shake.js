define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    var $couponAddBtn = $(".coupon-content .img-d .jActCouponApply");
    var urlMap = {
        initAPI: "//m.yunhou.com/ump/getJs",
        fetchCard: "//m.yunhou.com/ump/cardList",
        sendCard: "//m.yunhou.com/ump/sendCard"
    };
    var isClicking = false;
    var currentUrl = "";




    var coupon = {
        _isWeixin: function () {
            //判断是否是微信浏览器
            var ua = navigator.userAgent.toLowerCase();
            // ua.substring(ua.lastIndexOf("/") + 1)
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //判断是否为微信浏览器并且版本6.0或以上
                return true;
            } else {
                return false;
            }
        },
        _bindEvents: function () {
            wx.ready(function () {
                coupon.readyFunc();
                wx.checkJsApi({
                    jsApiList: ['hideOptionMenu'],  // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        if (res.checkResult.hideOptionMenu) {
                            wx.hideOptionMenu();
                        }
                    }
                });
            });
        },
        _initWXInterface: function () {
            //初始化微信JS API
            currentUrl = window.location.href;
            io.jsonp(urlMap.initAPI, {
                url: currentUrl
            }, function (result) {
                //获取接口初始化参数成功的逻辑
                //初始化微信接口配置
                wx.config({
                    debug: false,
                    appId: result.msg.appId,
                    timestamp: result.msg.timestamp,
                    nonceStr: result.msg.noncestr,
                    signature: result.msg.signature,
                    jsApiList: ["addCard", "hideOptionMenu"]
                });
                //成功后绑定微信接口事件
                coupon._bindEvents();
            }, function () {
                //拉取初始化参数失败
                Dialog.tips('获取接口初始化参数失败！');
            });

        },
        pushCouponToService: function (dataList) {
            io.jsonp(
                urlMap.sendCard,
                {
                    cardList: dataList
                },
                function (data) {

                },
                function () {
                }
            );
        },
        readyFunc: function () {
            $couponAddBtn.addClass("showBtn");
            $couponAddBtn.on("click", function () {
                if (isClicking) {
                    return;
                }
                isClicking = true;
                io.jsonp(
                    urlMap.fetchCard,
                    {
                        scheme: JSON.stringify([{
                            code:coupon.getUrlParam("code"),
                            sign:coupon.getUrlParam("sign"),
                            partnerKey : $(".partnerKey").val(),
                            outlucky :$(".outlucky").val()=="true"?true:false
                        }])
                    },
                    function (data) {
                        if (data.error == 0 && data.msg.length!=0) {
                                WeixinJSBridge.invoke('batchAddCard', {
                                        "card_list": data.msg
                                    },
                                    function (res) {
                                        isClicking = false;
                                        if(res.err_msg=="batch_add_card:ok"){
                                            coupon.pushCouponToService(res.card_list);
                                        }else{
                                            res.err_msg=="batch_add_card:cancel"? Dialog.tips('领券已取消！如已领取，请到微信卡包中查看^_^'):Dialog.tips('领券已取消！');
                                        }
                                    });
                        } else {
                            isClicking = false;
                            Dialog.tips('券已领完！');
                        }
                    },
                    function () {
                        isClicking = false;
                    }
                );
            });
        },
        getUrlParam: function (paramName) {
                var reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)', 'i');
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return null;
        },
        init: function () {
            //判断是否是微信浏览器
            if (coupon._isWeixin()) {
                //初始化微信接口
                coupon._initWXInterface();
            } else {
                Dialog.tips('不支持的浏览器！请切换到微信浏览器6.0以上版本');
            }
        }
    };
    coupon.init();
});
