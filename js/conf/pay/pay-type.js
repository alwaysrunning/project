define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');

    var logger = require('common/kit/io/logger');
    var wx = require('common/base/jweixin-1.0.0');

    var urlMap = {
        initPayMethods: "http://m.yunhou.com/pay/payData",
        initOrder: "http://m.yunhou.com/pay/payMethods",
        orderPay: "",
        orderTimeout: "http://m.yunhou.com/checkout/cancelTimeoutOrders"
    };

    //  上一个页面带过来一个orderId，在返回的时候其实用不到的
    var urlSearch =  /\&orderId.*?&/.test(window.location.search) ? window.location.search.replace(/orderId=.*?&/, '') : window.location.search.replace(/&orderId=.*?$/, '');
    var billCallbackUrl = 'http://m.yunhou.com/html/pay/pay.html' + urlSearch;

    var btnTextMap = {
        "0": "立即支付",
        "1": "支付成功",
        "2": "已过期",
        "3":"暂不支持"
    };

    var pay = {
        init: function () {
            var _self = this;
            _self.$orderLi = $(".jOrderLi");

            pay.pay_init(); //初始化支付列表
            pay.order_pay();
        },
        /**
         * 订单分开支付显示初始化
         * */
        order_init: function (orderList) {
            var _self = this;
            _self._renderOrderList(orderList);
        },
        _renderOrderList: function (orderData) {
            var _self = this;
            var $index = $("<div></div>");
            var orderId = pay.getUrlParam('orderId');
            var idx = 0;

            for (var i = 0; i < orderData.length; i++) {
                if (orderData[i].tradeNos === orderId) {
                    idx = i;
                }
            }
            for (var i = 0; i < orderData.length; i++) {
                if (i === idx ) {
                    $('.jBillPrice').text('￥' + orderData[i].paymentTotal);
                    var classname = orderData[i].tradeStatus != 0 ? 'pay-btn-disabled' : '';
                    var listr = [
                        '<li>',
                        '<div class="order-btn">',
                        '<div class="order-pay-btn jPayBtn ' + classname + '">' + btnTextMap[orderData[i].tradeStatus] + '</div>',
                        '</div>',
                        '</li>'
                    ].join("");
                    $(listr).appendTo($index).data("orderData", orderData[i]);

                    //  判断是不是全球购订单
                    //  如果在微信浏览器则不触法顶部显示的tips和不默认使用支付宝
                    if (orderData[i].orderType === 1) {
                        if (!pay.isWeixin()) {
                            $('.jGlobalOrderTips').show();
                            $('#jPayLi li').filter("[data-code='2']").click();

                        } else {
                            $('.jGlobalOnWxOrderTips').show();
                        }
                    }
                    //  直接移除不支持的支付方式
                    var payList = $('#jPayLi li');
                    if (!!orderData[i].unSupportPaymentmethod) {
                        for(var key in orderData[i].unSupportPaymentmethod){
                            payList.filter('[data-code="' + key + '"]').remove();
                        }
                    }
                    if ($('#jPayLi li').length < 2) {
                        $('.jChange').hide();
                    }
                }
            }
            _self.$orderLi.append($index.find("li"));
        },

        lihover: function () {
            var _self = this;
            $('#jPayLi li').click(function () {
                var index = $('#jPayLi li').index(this),
                    img = $('.jcheckImg'),
                    code = $(this).attr('data-code');
                $('#jPayLi').attr('data-code', code);
                //点击后支付方式显示到第一个
                $(this).prependTo(_self.$ulList);
                //触发收起
                if (_self.$listContent.hasClass("stretch")) {
                    _self.$changeMethodBtn.click();
                }
                //添加支付方式逻辑判断
                _self._judgeOrder(code);
            });
        },
        _judgeOrder : function(code){
            var _self = this;
            var $orders =  _self.$orderLi.find("li").removeClass("li-disabled");
            for(var i = 0 ; i<$orders.length;i++) {
                var $this = $orders.eq(i);
                var unSup   = $this.data("orderData").unSupportPaymentmethod;
                var $payBtn = $this.find(".jPayBtn");
                var $notice = $this.find(".jbtnNote");
                if(unSup[code] && !$payBtn.hasClass("pay-btn-disabled")){
                    //如果在不支持的范围内
                    $notice.text(unSup[code]);
                    $this.addClass("li-disabled");
                }
            }
        },

        pageShow: function() {
            $('.jPageBody').show();
            $('.jPageLoading').hide();
        },

        pay_init: function () {
            var self = this;
            var data = {
                'sign': pay.getUrlParam('sign'),
                'token': pay.getUrlParam('token'),
                'isWeixin' :self.isWeixin() ?1:0
            };

            io.jsonp(urlMap.initPayMethods, data, function (data) {
                pay.pageShow();
                var pay_time = data.data;
                var html = "", isWxFlag = false;
                //判断是否微信浏览器
                if (self.isWeixin()) {
                    isWxFlag = true;
                }
                for (var i = 0; i < data.data.pay_methods.length; i++) {
                    //判断微信浏览器显示微信支付
                    var code = data.data.pay_methods[i].code,
                        flag = true;
                    if (code == 6 && !isWxFlag) {
                        flag = false;
                    }
                    if (code == 2 && isWxFlag) {
                        flag = false;
                    }
                    if (flag) {
                        html += '<li data-code="' + code + '"><span class="bank-name"><img class="jcheckImg" src="//s1.bbgstatic.com/gshop/images/pay/pay-qx.png"></span><span class="pay-icon"><img src="' + data.data.pay_methods[i].iconUrl + '"></span><span>' + data.data.pay_methods[i].name + '</span>';
                        var discountAd = data.data.pay_methods[i].discountAd;
                        var curDateRemainActNum = data.data.pay_methods[i].curDateRemainActNum;
                        if (discountAd) {
                            //添加打折活动dom结构
                            html += '<div class="favorable"><span class="favorable-val">' + discountAd + '</span></div>';
                            if (curDateRemainActNum && curDateRemainActNum <= 0) {
                                //添加打折图标
                                html += '<div class="favorable-ico"></div>';
                            }
                        }
                        //结尾标签闭合
                        html += '</li>';
                    }
                }
                $('#jPayLi').append(html);
                pay._bindPayChange();


                //  时间到期，则不显示这个订单情况
                io.jsonp('http://api.mall.yunhou.com/Time', {},function(data) {
                    //(new Date(data)).getTime()
                    if(!!data && data > pay_time.timeoutEndTime) {
                        $('#jPayDom').remove();
                        $('#jPayErrorDom').show();
                    }
                });

                pay._initForm(data);
                pay.lihover();  //列表点击效果
                pay.order_init(data.data.order_list);
                pay.defaultSelect();

            }, function (e) {
                if (e.error == -100) {
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function () {
                        window.location.href = "https://ssl.yunhou.com/passport/h5/login?returnUrl=" + encodeURIComponent(window.location.href);
                    });
                }
                else {
                    Dialog.tips(e.msg);
                }
                $('#jPayLi').append('<li style="text-align: center">加载失败，请刷新重试！</li>');
                $(".jOrderLi").append('<li style="text-align: center">订单加载失败，请刷新重试！</li>');
            });
        },
        defaultSelect: function () {
            //如果是微信浏览器，默认选中微信支付方式
            var isWX = pay.isWeixin();
            var $lis = $('#jPayLi li');
            var $weixinLi = $lis.filter("[data-code='6']");
            if (isWX && $weixinLi.length != 0) {
                $weixinLi.click();
            } else {
                $lis.eq(0).click();
            }
        },
        _bindPayChange: function () {
            var _self = this;
            _self.$listContent = $(".jPayListContent");
            _self.$ulList = _self.$listContent.find(".pay-list");
            _self.$changeMethodBtn = _self.$listContent.find(".jChange");
            _self.$changeMethodBtn.on("click", function (e) {
                e.stopPropagation();
                var flag = _self.$listContent.hasClass("stretch");
                var $lis = _self.$listContent.find("li");
                if (flag) {
                    //收起
                    _self.$ulList.css({
                        height: $lis.eq(0).height() + "px"
                    });
                } else {
                    //展开
                    var height = 0;
                    for (var i = 0; i < $lis.length; i++) {
                        height += $lis.eq(i).height();
                    }
                    _self.$ulList.css({
                        height: height + "px"
                    });
                }
                _self.$listContent.toggleClass("stretch");
            });
        },
        _initForm: function (data) {
            var _self = this;
            _self.payData = data.data;
            urlMap.orderPay = _self.payData.payUrl;
            $('#jForm').attr({'action': _self.payData.payUrl, 'method': 'POST'});
        },

        order_pay: function () {
            var _self = this;
            _self.$subForm = $('#jForm');
            _self.$orderLi.on("click", "li .jPayBtn", function () {
                var $this = $(this);
                var $parent = $this.parents("li");
                if ($this.hasClass("pay-btn-disabled") || $parent.hasClass("li-disabled")) {
                    return;
                }
                var orderData = $this.parents("li").data("orderData");
                var reset = function () {
                    $this.removeClass('pay-btn-disabled').text('立即支付');
                };
                _self.$subForm.html('');
                var code = $('#jPayLi').attr('data-code');
                if (code != '') {
                    $this.addClass('pay-btn-disabled').text('正在提交');
                    if (code == 6) {
                        io.jsonp(urlMap.orderPay, {
                            tradeType     : orderData.tradeType,
                            orderType     : orderData.orderType,
                            tradeCode     : orderData.tradeCode,
                            tradeStatus   : orderData.tradeStatus,
                            paymentTotal  : orderData.realPaymentTotal,
                            discountTotal : orderData.realDiscountTotal,
                            paymentMethod : code,
                            jSign         : _self.payData.jSign,
                            tradePayToken : _self.payData.tradePayToken ,
                            sign          : orderData.sign,
                            callbackUrl   : billCallbackUrl
                        }, function (d) {

                            var data = d.data || {};
                            _self.callWxMethod('config', {
                                debug: false,
                                appId: data.appId,
                                timestamp: data.timeStamp,
                                nonceStr: data.nonceStr,
                                signature: data.paySign,
                                jsApiList: [
                                    'chooseWXPay'
                                ]
                            });
                            _self.callWxMethod('ready', function () {
                                _self.callWxMethod('checkJsApi', {
                                    jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                                    success: function (res) {
                                        if (res.checkResult.chooseWXPay) {
                                            _self.callWxMethod('chooseWXPay', {
                                                timestamp: data.timeStamp,
                                                nonceStr: data.nonceStr,
                                                package: data.package,
                                                signType: data.signType, // 注意：新版支付接口使用 MD5 加密
                                                paySign: data.paySign,
                                                success: function (res) {
                                                    window.location.href = data.linkUrl;
                                                },
                                                cancel: function (res) {
                                                    Dialog.tips('支付已取消！');
                                                    reset();
                                                    //取消回调
                                                },
                                                fail: function (res) {
                                                    Dialog.tips('支付失败！');
                                                    reset();
                                                    //失败回调
                                                }
                                            });
                                        } else {
                                            Dialog.tips('请将您的微信升级到最新版！');
                                            reset();
                                        }
                                    },
                                    fail: function () {
                                        Dialog.tips('请将您的微信升级到最新版！');
                                        reset();
                                    }
                                });
                            });
                        }, function (e) {
                            Dialog.tips(e.msg);
                            reset();
                        });
                    } else {
                        var html = '';
                        html += '<input type="text" name="tradeType" value="' + orderData.tradeType + '" />';
                        html += '<input type="text" name="orderType" value="' + orderData.orderType + '" />';
                        html += '<input type="text" name="tradeCode" value="' + orderData.tradeCode + '" />';
                        html += '<input type="text" name="tradeStatus" value="' + orderData.tradeStatus + '" />';
                        html += '<input type="text" name="paymentTotal" value="' + orderData.realPaymentTotal + '" />';
                        html += '<input type="text" name="discountTotal" value="' + orderData.realDiscountTotal + '" />';
                        html += '<input type="text" name="jSign" id="jSign" value="' + _self.payData.jSign + '"/>';
                        html += '<input type="text" name="callbackUrl"  value="' + billCallbackUrl + '"/>';
                        html += '<input type="text" name="paymentMethod"  value="' + code + '"/>';
                        html += '<input type="text" name="tradePayToken" id="tradePayToken" value="' + _self.payData.tradePayToken  + '"/>';
                        html += '<input type="text" name="sign" value="' + orderData.sign + '" />';
                        _self.$subForm.html(html);
                        _self.$subForm.submit();
                    }
                }
            });
        },
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); // 匹配目标参数
            if (r != null)
                return unescape(r[2]);
            return null; // 返回参数值
        },
        //判断微信内置浏览器
        isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            return /micromessenger/.test(ua);
        },
        //抛错异常处理
        callWxMethod: function (methodName, opts) {
            try {
                return wx[methodName].apply(wx, [].slice.call(arguments, 1));
            } catch (e) {
                logger.error(e);
            }
        }
    };

    pay.init();
});
