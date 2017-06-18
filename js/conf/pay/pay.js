define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    //倒计时
    var countDown = require('common/ui/countdown/countdown');
    var cookie = require("common/kit/io/cookie");

    var wx = require('common/base/jweixin-1.0.0');

    var urlMap = {
        initPayMethods: "http://m.yunhou.com/pay/payData",
        initOrder: "http://m.yunhou.com/pay/payMethods",
        orderPay: "",
        orderTimeout: "http://m.yunhou.com/checkout/cancelTimeoutOrders"
    };

    var btnTextMap = {
        "0": "立即支付",
        "1": "支付成功",
        "2": "已过期",
        "3": "暂不支持"
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
            for (var i = 0; i < orderData.length; i++) {
                var classname = orderData[i].tradeStatus != 0 ? 'pay-btn-disabled' : '';
                var listr = [
                    '<li>',
                    '<div class="order-b">',
                    '<div><span>订单号</span><div>' + orderData[i].tradeNos + '</div></div>',
                    '<div><span>类型</span><div>' + orderData[i].orderName + '</div></div>',
                    '<div><span>金额</span><div>' + '<span class="p-price">￥' + orderData[i].paymentTotal + '</span>' + '</div></div>',
                    '</div>',
                    '<div class="order-btn">',
                    '<div class="order-pay-btn jPayBtn ' + classname + '">' + btnTextMap[orderData[i].tradeStatus] + '</div>',
                    '</div>',
                    '</li>'
                ].join("");
                $(listr).appendTo($index).data("orderData", orderData[i]);
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
        _judgeOrder: function (code) {
            var _self = this;
            var $orders = _self.$orderLi.find("li").removeClass("li-disabled");
            for (var i = 0; i < $orders.length; i++) {
                var $this = $orders.eq(i);
                var unSup = $this.data("orderData").unSupportPaymentmethod;
                var $payBtn = $this.find(".jPayBtn");
                var $notice = $this.find(".jbtnNote");
                if (unSup[code] && !$payBtn.hasClass("pay-btn-disabled")) {
                    //如果在不支持的范围内
                    $notice.text(unSup[code]);
                    $this.addClass("li-disabled");
                }
            }
        },

        pay_init: function () {
            var self = this;
            var data = {
                'sign': pay.getUrlParam('sign'),
                'token': pay.getUrlParam('token'),
                'isWeixin': self.isWeixin() ? 1 : 0
            };
            io.jsonp(urlMap.initPayMethods, data, function (data) {
                var pay_time = data.data;
                $("#jTimePay").attr({
                    'data-starttime': pay_time.timeoutStartTime,
                    'data-endTime': pay_time.timeoutEndTime
                });
                // $('#jTimePay').text(data.data.pay_timeout.notPayCancelOrderTimeout);
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
                pay.time();
                pay._initForm(data);
                pay.order_init(data.data.order_list);
                pay.lihover();  //列表点击效果
                pay.defaultSelect();
                //添加统计
                pay._statistics(data.data);
            }, function (e) {
                if (e.error == -100) {
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function () {
                        //   io.jsonp("https://ssl.yunhou.com/login/h5/login.html?ref=" + encodeURIComponent(window.location.href),{});
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
                    })
                } else {
                    //展开
                    var height = 0;
                    for (var i = 0; i < $lis.length; i++) {
                        height += $lis.eq(i).height();
                    }
                    _self.$ulList.css({
                        height: height + "px"
                    })
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
                            tradeType: orderData.tradeType,
                            orderType: orderData.orderType,
                            tradeCode: orderData.tradeCode,
                            tradeStatus: orderData.tradeStatus,
                            paymentTotal: orderData.realPaymentTotal,
                            discountTotal: orderData.realDiscountTotal,
                            paymentMethod: code,
                            jSign: _self.payData.jSign,
                            tradePayToken: _self.payData.tradePayToken,
                            sign: orderData.sign,
                            callbackUrl: window.location.href
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
                        html += '<input type="text" name="callbackUrl"  value="' + window.location.href + '"/>';
                        html += '<input type="text" name="paymentMethod"  value="' + code + '"/>';
                        html += '<input type="text" name="tradePayToken" id="tradePayToken" value="' + _self.payData.tradePayToken + '"/>';
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
        _statistics: function (data) {
            var _self = this;
            var type= cookie("__bbg_utm_source");
            if(!type){
                return;
            }
            if(type=="pinyou"){
                _py_before();
                if(data.tradeStatisInfoList && data.tradeStatisInfoList.length!=0){
                    for(var i =0 ;i<data.tradeStatisInfoList.length;i++){
                        _py_after(data.tradeStatisInfoList[i].tradeNo, data.tradeStatisInfoList[i].price, data.tradeStatisInfoList[i].productList);
                    }
                }
            }else if(type=="mediav"){
                _mvq_before(data);
                _mvq_after();
            }
        },
        time: function () {
            var time_pay = $("#jTimePay");
            countDown({
                currentTime: time_pay.attr('data-starttime'),
                targetTime: time_pay.attr('data-endTime'),
                timeText: ['', '小时', '分', '秒', ''],
                container: time_pay,
                isShowTimeText: true,
                isShowArea: true,
                type: {
                    'd': false,
                    'h': true,
                    'm': true,
                    's': true,
                    'ms': false
                },
                callback: function (dom) {
                    //倒计时为0后回调
                    $('#jPayDom').remove();
                    $('#jPayErrorDom').show();
                    //var data = {
                    //    'orderIds': pay.getUrlParam('orderid')
                    //};
                    //io.jsonp(urlMap.orderTimeout, data, function () {
                    //    $('#jPayDom').remove();
                    //    $('#jPayErrorDom').show();
                    //}, function (e) {
                    //    Dialog.tips(e.msg);
                    //})
                }
            });
        },
        //判断微信内置浏览器
        isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) === "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        //抛错异常处理
        callWxMethod: function (methodName, opts) {
            try {
                return wx[methodName].apply(wx, [].slice.call(arguments, 1));
            } catch (e) {
            }
        }
    };

    pay.init();




    var _py_before = function () {
        try{
            window._py = window._py || [];
            _py.push(['a', 'kD..-Bh-GwCDmskkzOTQp2i6hX']);
            _py.push(['domain', 'stats.ipinyou.com']);
            _py.push(['e', '']);
            var _ = function (d) {
                var s = d.createElement('script');
                var e = d.body.getElementsByTagName('script')[0];
                e.parentNode.insertBefore(s, e);
                var f = 'https:' == location.protocol;
                s.src = (f ? 'https' : 'http') + '://' + (f ? 'fm.ipinyou.com' : 'fm.p0y.cn') + '/j/adv.js';
            };
            _(document);
            var $noscript = $('<noscript><img src="//stats.ipinyou.com/adv.gif?a=kD..-Bh-GwCDmskkzOTQp2i6hX&e=" style="display:none;"/></noscript>');
            var firstScript = document.body.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore($noscript[0], firstScript);
        }catch(e){}
    };

    var _py_after = function (_orderno, _money, _productList) {
        try {
            var w = window,
                d = document,
                e = encodeURIComponent;
            var b = location.href, c = d.referrer, f, s, g = d.cookie, h = g.match(/(^|;)\s*ipycookie=([^;]*)/), i = g.match(/(^|;)\s*ipysession=([^;]*)/);
            if (w.parent != w) {
                f = b;
                b = c;
                c = f;
            }
            var u = '//stats.ipinyou.com/cvt?a=' + e('kD.W6.B_iGMpMZOUjtXcRU2d5zQ_') + '&c=' + e(h ? h[2] : '') + '&s=' + e(i ? i[2].match(/jump\%3D(\d+)/)[1] : '') + '&u=' + e(b) + '&r=' + e(c) + '&rd=' + (new Date()).getTime() + '&OrderNo=' + e(_orderno) + '&Money=' + e(_money) + '&ProductList=' + e(_productList) + '&e=';
            var _ = function () {
                if (!d.body) {
                    setTimeout(_(), 100);
                } else {
                    s = d.createElement('script');
                    s.src = u;
                    d.body.insertBefore(s, d.body.firstChild);
                }
            };
            _();
        } catch (e) {
        }
    };

    var _mvq_after = function(){
        var _ = function(){
            var mvl = document.createElement('script');
            mvl.type = 'text/javascript'; mvl.async = true;
            mvl.src = ('https:' == document.location.protocol ? 'https://static-ssl.mediav.com/mvl.js' : 'http://static.mediav.com/mvl.js');
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(mvl, s);
        };
        _();
    };

    var _mvq_before = function(data){
        window._mvq = window._mvq || [];
        _mvq.push(['$setAccount', 'm-28470-0']);
        _mvq.push(['$logConversion']);
        _mvq.push(['$logData']);
        if(data.tradeStatisInfoList && data.tradeStatisInfoList.length!=0){
            for(var i =0 ;i<data.tradeStatisInfoList.length;i++){
                _mvq.push(['$addOrder', data.tradeStatisInfoList[i].tradeNo, data.tradeStatisInfoList[i].price]);
            }
        }
    };
});
