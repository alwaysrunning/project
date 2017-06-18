/**
 * Created by tangwei on 16/3/3.
 */

define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cookie = require('common/kit/io/cookie');
    var Lazyload = require('common/widget/lazyload');
    var shareMod = require("module/group/share");
    var URL = require("url").URL;
    var pageURL = window.location.href;
    var addCart = require("module/add-to-cart/addcart");
    var domain  = require("module/group/domain");

    var pageData = window.$PAGE_DATA.group;
    var _lazyLoader;

    var plugin = {
        init: function () {
            //初始化分享
            shareMod.init();
            //初始化图片懒加载
            this.initLazyLoader();
            //初始化按钮元素
            this.initBtns();
            //添加按钮的事件
            this.addBtnEvents();
        },

        /**
         * 图片懒加载
         * */
        initLazyLoader: function () {
            _lazyLoader = new Lazyload(' img.jImg', {
                effect: 'fadeIn',
                dataAttribute: 'url',
                load: function (self) {
                    var _self = $(self).css({"width": "100%"});
                    if (_self.hasClass('img-error')) {
                        _self.removeClass('img-error');
                    }
                }
            });
            _lazyLoader = new Lazyload(' img.jm-img', {
                effect: 'fadeIn',
                dataAttribute: 'url',
                load: function (self) {
                    var _self = $(self).css({"width": "100%"});
                    var $parent = _self.parent(".m-img");
                    if ($parent.hasClass("df-img")) {
                        $parent.removeClass('df-img');
                    }
                },
                appear: function (self) {
                    var $this = $(self);
                    if ($this.attr("data-url")) {
                        $this.attr("src", domain['js']+"/gshop/images/my-center/user.png");
                        $this.removeAttr("data-url");
                    }
                }
            });

        },
        /**
         * 页面按钮对象
         * */
        initBtns: function () {
            var $btncontent = $(".g-btn-inner");
            var $acBar = $(".ac-bar").addClass("show-bar");

            this.btns = {
                check: $btncontent.find(".g-btn-left"),
                invite: $btncontent.find(".jInvite"),
                pay: $btncontent.find(".jGoPay"),
                open: $acBar.find(".jGoOpen")
            }
        },
        /**
         * 是否登录
         * @param  [url]  将要跳转的页面url
         * */
        judgeLogin: function (url /*可选*/) {
            if (!cookie('_nick')) {
                var returnUrl = url ? encodeURIComponent(url) : encodeURIComponent(pageURL);
                if (shareMod.isWeiXin()) {
                    cookie('_bbgReferer', returnUrl, {
                        path: '/',
                        domain: domain['@'],
                        expires: 0.2
                    });
                    window.location.href = domain['ssl']+'/bubugao-passport/oauth2/weixin?type=h5&bind=false&returnUrl=' +returnUrl;
                    return false;
                } else {
                    window.location.href = URL.Login.login + '?returnUrl=' + returnUrl;
                    return false;
                }
            }
            return true;
        },
        /**
         * 添加按钮的点击事件
         * */
        addBtnEvents: function () {
            var self = this;

            //查看参团详情
            this.btns.check.on("click", function () {
                window.location.href = domain['m']+"/fightgroups/join/" + pageData.fightGroupsId;
            });

            //显示分享引导
            this.btns.invite.on("click", function () {
                shareMod.showGuide();
            });

            //去开团
            this.btns.open.on("click", function () {
                window.location.href = domain['m']+"/fightgroups/fightlist";
            });

            //去支付
            this.btns.pay.on("click", function () {
                addCart.buyNow(pageData.productId, 1);
            });
        }

    };


    plugin.init();

});
