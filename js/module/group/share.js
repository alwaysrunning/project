/**
 * Created by tangwei on 16/3/3.
 */

define(function (require, exports, module) {
    'use strict';
    var Dialog = require('common/ui/dialog/dialog');
    var cookie = require('common/kit/io/cookie');
    var io = require('common/kit/io/request');
    var share = require('common/widget/share');
    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    var pageData = window.$PAGE_DATA && window.$PAGE_DATA.group;
    var domain = require("module/group/domain");
    var preUrl = domain['m'] + "/fightgroups/join/";
    var shareUrl = window.location.href;
    if (pageData && pageData.fightGroupsId) {
        shareUrl = preUrl + pageData.fightGroupsId;
    }


    var shareMod = {
        /**
         * 初始化分享
         * */
        init: function () {
            this.initShareGuide();
            this.webShare();
            this.isWeixin() && this.weixinShare();
        },
        /**
         * 判断是否微信浏览器
         * */
        isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },

        /**
         * 初始化页面分享组件
         */
        webShare: function () {
            var self = this;
            var shareMox = $('#jItemShareBox');
            this.shareBtnsWrap = shareMox.find('.sharebuttonbox').attr("data-url", shareUrl);
            share.init({
                selector: '.sharebuttonbox'
            });
            $('#jBtnShare').on('click', function () {
                shareMox.show();
            });
            //关闭模态框
            $('.jCloseModalBox').on('click', function () {
                $(this).closest('.modal-box-wrap').hide();
            });
        },
        /**
         * 初始化分享导航
         * */
        initShareGuide: function () {
            var self = this;
            var $guide = this.$guide = $("#jGuide");
            var $weixinGuide = $guide.find(".jweixin");
            var $webGuide = $guide.find(".jweb");
            if (this.isWeixin()) {
                $weixinGuide.show();
                $webGuide.hide();
                //微信浏览器下要隐藏普通分享渠道
                $('#jBtnShare').hide();

            } else {
                $weixinGuide.hide();
                $webGuide.show();
            }
            this.$guide.on("click", function (e) {
                e.stopPropagation();
                self.$guide.hide();
            });
        },

        /**
         * 获取微信分享参数
         * */
        getConfig: function (source) {
            var _self = this;
            return {
                title: _self.shareBtnsWrap.attr("data-text"), // 分享标题
                desc: _self.shareBtnsWrap.attr("data-desc"), // 分享描述
                link: shareUrl, // 分享链接
                imgUrl: _self.shareBtnsWrap.attr("data-pic"), // 分享图标
                success: function (res) {
                    _self.getIntegral(source);
                }
            }
        },

        /**
         * 微信分享
         * */
        weixinShare: function () {
            var _self = this;
            io.jsonp(domain['api.mall'] + "/Pennyshare/getWeixinConfig", {},
                function (result) {
                    if (result.error == 0) {
                        wx.config({
                            debug: false,
                            appId: result.data.appId,
                            timestamp: result.data.timestamp,
                            nonceStr: result.data.noncestr,
                            signature: result.data.signature,
                            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "showAllNonBaseMenuItem"]
                        });
                        wx.ready(function () {
                            _self.resetWeixinShare();
                        });
                    } else {
                        Dialog.tips(result.msg);
                    }
                },
                function (e) {
                    Dialog.tips(e.msg);
                }
            );
        },
        /**
         * 分享引导
         * **/
        showGuide: function () {
            this.$guide.show();

        },
        /**
         * 重置微信分享内容
         * */
        resetWeixinShare: function () {
            var self = this;
            wx.showAllNonBaseMenuItem();
            wx.onMenuShareTimeline(self.getConfig('WEIXIN'));
            wx.onMenuShareAppMessage(self.getConfig('WEIXIN'));
            wx.onMenuShareQQ(self.getConfig('QQ'));
            wx.onMenuShareWeibo(self.getConfig('QQ'));
            wx.onMenuShareQZone(self.getConfig('QQ'));
        },
        /**
        * 分享成功后获取积分
        **/
        getIntegral: function(source){
            var url = 'http://m.yunhou.com/peach/shareEvent';
            var gProductId = window.gProductId && window.gProductId;
            var gShopId = window.gShopId && window.gShopId;
            var type = gProductId ? 'item': window.$PAGE_DATA && window.$PAGE_DATA.activityid ? 'activity' : 'common';
            var targetId = gProductId ? gProductId: window.$PAGE_DATA && window.$PAGE_DATA.activityid ? window.$PAGE_DATA.activityid : '';
            var shopId = gShopId ? gShopId : '';
            var data = {
                type: type,
                targetId: targetId,
                shopId: shopId,
                source: source
            }
            io.jsonp(url, data);
        }
    };

    module.exports = {
        init: shareMod.init.bind(shareMod),
        showGuide: shareMod.showGuide.bind(shareMod),
        isWeiXin: shareMod.isWeixin,
        changeShareUrl: function (fightGroupsId) {
            shareUrl = preUrl + fightGroupsId;
            this.shareBtnsWrap.attr('data-url', shareUrl);
            if (shareMod.isWeixin()) {
                shareMod.resetWeixinShare();
            }
        }.bind(shareMod)
    }


});
