/**
 * 领取优惠券
 *
 * @author jianchaoyi
 */
define(function(require, exports, module) {
    'use strict';
     
    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var cookie = require('common/kit/io/cookie');

    // 登录
    function login() { 
        if(!cookie('_nick')){
            Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
            });
            return;
        }
    }


    function GetCoupon(opt) { 
        var apiUrl = 'http://api.mall.yunhou.com/coupon/apply';

        var defaultSetting = {
            selector: null, //jquery对象
            attr: 'data-active-id',
            url: 'data-url',
            callback: function() {}
        };

        opt = $.extend(true, defaultSetting, opt);
        if (!opt.selector) {
            return;
        }
        var eSelector = $(opt.selector);

        eSelector.each(function() {
            var $this = $(this);
            var activeId = $this.attr(opt.attr);
            $this.click(function() {
                var url = $this.attr(opt.url);
                if (cookie('_nick')) {
                    if(url == '' || url == 'undefined') url = apiUrl;
                     io.jsonp(url,{
                            activeId: activeId
                     }, function(data) { 
                        if (!data._error) {
                             Dialog.tips('恭喜您，领取成功！有效期：' + data.effectStartTime + '至' + data.effectEndTime);
                        } else if(data._error){
                             Dialog.tips(data._error.msg);
                        }else{
                             Dialog.tips('貌似领取系统感冒了，再试试看！');
                        }
                    }, function(data) {
                        var code = null || data._error.code;
                        if (code == -100) {
                            login();
                        } else if (code == 106) {
                             Dialog.tips('当前优惠券仅限手机用户领取，请先进行<a style="color:#c33;" href="http://safe.yunhou.com/safe/mobile">手机绑定</a>');
                        } else {
                             Dialog.tips(data._error.msg);
                        }
                    });
                } else {
                    login();
                }
            });
        });
    }
    return GetCoupon;
});