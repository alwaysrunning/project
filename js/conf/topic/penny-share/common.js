define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');
    var wx = require('common/base/jweixin-1.0.0');
    var com = {
        moduleId: '',
        init: function() {},
		url: {
            getWeixinConfig: 'http://api.mall.yunhou.com/Pennyshare/getWeixinConfig',
            getRecord: 'http://api.mall.yunhou.com/Pennyshare/index',
            getJoined: 'http://api.mall.yunhou.com/Pennyshare/getjoined',
            redeemGift: 'http://api.mall.yunhou.com/Pennyshare/save',
            getPresent: 'http://api.mall.yunhou.com/Pennyshare/getPro',
            getSecurityCode: 'http://api.mall.yunhou.com/Pennyshare/fill',
            checkCatpcha: 'http://api.mall.yunhou.com/Pennyshare/checkCatpcha',
            getQualification: 'http://api.mall.yunhou.com/Pennyshare/qualification'
        },
        _url: {
		    getWeixinConfig: 'http://m.yunhou.com/ump/getJs?url='+window.location.href,
            getRecord: 'http://test.data.com/topic/getRecord.php',
            getJoined: 'http://test.data.com/topic/getjoined.php',
            redeemGift: 'http://test.data.com/topic/redeemGift.php',
            getPresent: 'http://test.data.com/topic/getPresent.php',
            getSecurityCode: 'http://test.data.com/topic/getSecurityCode.php',
            checkCatpcha: 'http://test.data.com/topic/validatePhoneRepeate.php',
            getQualification: 'http://test.data.com/topic/getQualification.php'
        },
		//获取地址栏参数
        getUrlParam : function(name) {  
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");  
            var r = window.location.search.substr(1).match(reg);  
            if (r!=null) return decodeURIComponent(r[2]); return null;  
        },
		jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'],
        getWeixinConfig: function() {
            var self = this;
            com.ajax(com.url.getWeixinConfig, {}, function(data) {
                var rs = data.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: rs.appId, // 必填，公众号的唯一标识
                    timestamp: rs.timestamp, // 必填，生成签名的时间戳
                    nonceStr: rs.noncestr, // 必填，生成签名的随机串
                    signature: rs.signature, // 必填，签名，见附录1
                    jsApiList: self.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            });
        },
        afterWeixinShare: function(successFun, cancelFun) {
            var self = this;
			var link = $('#jIndexUrl').val()?$('#jIndexUrl').val():'';
			var imgUrl = 'http://s1.bbgstatic.com/gshop/images/topic/penny-share/index-flag.jpg';
            var shareAr = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'];
            var opt = {
				title:$('#jShareTitle').val()?$('#jShareTitle').val():'9块9领取超值礼物', // 分享标题
				desc :$('#jShareDesc').val()?$('#jShareDesc').val():'我刚花了9块9领取了一个超值礼物，包邮到家，你也来看看吧！',
				link:  link,// 分享链接
				imgUrl: imgUrl, // 分享图标
                success: function() {
                    successFun && successFun();
                },
                cancel: function() {
                    cancelFun && cancelFun();
                }
            }
            for (var i = 0; i < shareAr.length; i++) {
				eval('com.wx.'+shareAr[i]+'(opt)');
            }
        },
		wx : wx,
        //判断微信内置浏览器
        isWeixin: function() {
            var ua = navigator.userAgent.toLowerCase();
            return (ua.match(/MicroMessenger/i) == "micromessenger");
        },
        getPageUrl: function() {
            var pageUrl = '';
            if ($('#jUrlCache').length != 0) {
                pageUrl = $.trim($('#jUrlCache').val());
            }
            return pageUrl;
        },
        ajax: function(url, data, successFun, errorFun) {
            io.jsonp(url, data, function(data) {
                if (data.msg && data.msg.length != 0) {
                    dialog.tips('<div class="dialog-tips">' + data.msg + '</div>', function() {
                        successFun && successFun(data);
                    });
                } else {
                    if (data.data!=null&&data.data!=undefined) {
                        successFun && successFun(data);
                    }
                }
            }, function(data) {
                if (data.msg && data.msg.length != 0) {
                    dialog.tips('<div class="dialog-tips">' + data.msg + '</div>');
                }
                errorFun && errorFun(data);
            });
        }
    }
    com.init();
    module.exports = com;
});
