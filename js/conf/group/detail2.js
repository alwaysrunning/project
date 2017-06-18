/**
 * Created by tangwei on 16/3/3.
 */
define(function (require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cookie = require('common/kit/io/cookie');
    var CountDown = require('common/ui/countdown/countdown');
    var Lazyload = require('common/widget/lazyload');
    var shareMod = require("module/group/share");
    var dialog = require('common/ui/dialog/dialog');
    var box = require("lib/ui/box/1.0.1/box");
    var imgTranslator = require("module/group/imgTranslate");
    var addCart = require("module/add-to-cart/addcart");
    var domain = require("module/group/domain");
    var URL = require("url").URL;
    var pageURL = window.location.href;
    var pageData = window.$PAGE_DATA.group;
    var hasClick = false;
    var _lazyLoader;
    var urlMap = {
        open: domain['m'] + "/fightgroups/dojoin",
        join: domain['m'] + "/fightgroups/dojoin"
    };

    var plugin = {
        init: function () {
            //初始化分享
            shareMod.init();
            //预处理商品详情内容
            this.translatDetail();
            //初始化banner切换
            this.initBanner();
            //初始化规则
            this.initRule();
            //初始化图片懒加载
            this.initLazyLoader();
            //定位按钮
            this.initBtns();
            //按钮添加点击事件
            this.addEvetns();
            //初始化倒计时
            this.initCountDown();
        },
        /**
         * 预处理商品类容
         * */
        translatDetail: function () {
            imgTranslator.translat({
                targetContent: $(".gd-des .gd-des-inner"),
                resourceContent: $("#des")
            });
        },
        /**
         * banner切换
         * */
        initBanner: function () {
            var $tabs = $(".bn-content");
            var $pages = $(".bn-page-wrap");
            var $leftPage = $(".bn-page-left [node-type='bn-page-cnt']", $pages);
            var $rightPage = $(".bn-page-right [node-type='bn-page-cnt']", $pages).hide();
            $tabs.on("click", ".bn-left", function () {
                if ($tabs.hasClass("show-right")) {
                    $leftPage.show();
                    $('html,body').scrollTop(0);
                    $tabs.removeClass("show-right");
                    $pages.removeClass("show-right");
                    setTimeout(function () {
                        $rightPage.hide();
                    }, 150);
                }
            });
            $tabs.on("click", ".bn-right", function () {
                if (!$tabs.hasClass("show-right")) {
                    $rightPage.show();
                    $('html,body').scrollTop(0);
                    $tabs.addClass("show-right");
                    $pages.addClass("show-right");
                    setTimeout(function () {
                        $leftPage.hide();
                    }, 150);
                }
            });
        },
        /**
         * 图片懒加载
         * */
        initLazyLoader: function () {
            _lazyLoader = new Lazyload('img.jImg', {
                effect: 'fadeIn',
                dataAttribute: 'url',
                load: function (self) {
                    var _self = $(self).css({"width": "100%"});
                    var $parent = _self.parent(".gd-img");
                    if (_self.hasClass('img-error')) {
                        _self.removeClass('img-error');
                    }
                    if ($parent.length != 0 && $parent.hasClass('img-error')) {
                        $parent.removeClass('img-error');
                    }
                }
            });
            _lazyLoader = new Lazyload('img.jm-img', {
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
                        $this.attr("src", domain['js'] + "/gshop/images/my-center/user.png");
                        $this.removeAttr("data-url");
                    }
                }
            });
        },
        /**
         * 是否登录
         * */
        judgeLogin: function (url) {
            if (!cookie('_nick')) {
                var returnUrl = url ? encodeURIComponent(url) : encodeURIComponent(pageURL);
                if (shareMod.isWeiXin()) {
                    cookie('_bbgReferer', returnUrl, {
                        path: '/',
                        domain: domain['@'],
                        expires: 0.2
                    });
                    window.location.href = domain['ssl'] + '/bubugao-passport/oauth2/weixin?type=h5&bind=false&returnUrl=' + returnUrl;
                    return false;
                } else {
                    window.location.href = URL.Login.login + '?returnUrl=' + returnUrl;
                    return false;
                }
            }
            return true;
        },
        /**
         * 判断是否绑定了手机号码
         * */
        judgeNumber: function () {
            if (pageData.verifyMobile ==1) {
                return true;
            } else {
                window.location.href = domain['ssl'] + '/passport/h5/mobile_bind?returnUrl=' + encodeURIComponent(pageURL);
                return false;
            }
        },
        /**
         * 定位按钮元素
         * */
        initBtns: function () {
            var $btnContent = this.$btnContent = $(".ac-bar ").addClass("show-bar");
            this.btns = {
                guide: $btnContent.find(".btn-guide"),
                open: $btnContent.find(".btn-open"),
                invite: $btnContent.find(".btn-invite"),
                noGoods: $btnContent.find(".btn-no-goods"),
                success: $btnContent.find(".btn-success"),  //去支付
                join: $btnContent.find(".btn-join"),
                full: $btnContent.find(".btn-full"),
                over: $btnContent.find(".btn-over"),
                noPay: $btnContent.find(".btn-no-pay"),
                comp: $btnContent.find(".btn-complete"),
                lost: $btnContent.find(".btn-lost")
            }
        },
        /**
         *  按钮添加点击事件
         * */
        addEvetns: function () {
            var self = this;
            //开团或参团事件
            this.addJoinEvent();
            //引导按钮的点击事件
            function aotohander (e){
                var $this = $(this);
                var url = $this.attr("data-url");
                if(!$this.hasClass("disabled") && url){
                    window.location.href = url;
                }
            }
            this.btns.guide.on("click", "button", aotohander);
            //完成支付的状态
            this.btns.comp.on("click","button",aotohander);
            //参团满员
            this.btns.full.on("click","button",aotohander);
            //邀请好友
            this.btns.invite.on("click", "button", function () {
                shareMod.showGuide();
            });
            //拼团成功
            this.btns.success.on("click", "button", function () {
                if(pageData.onlyApp==0){
                    addCart.buyNow(pageData.productId, 1);
                    return ;
                }
                if(pageData.onlyApp==1){
                    window.location.href = domain['m'] + "/fightgroups/guide";
                }
            });
            //有未支付
            this.btns.noPay.on("click","button",function(){
                window.location.href = domain['m'] + "/member/orders";
            });
        },
        /**
         * 参团或开团操作
         * */
        addJoinEvent: function () {
            var self = this;
            var handler = function (e) {
                if (!hasClick && self.judgeLogin() && self.judgeNumber()) {
                    hasClick = true;
                    var url = urlMap[pageData.isOpen ? 'open' : 'join'];
                    io.jsonp(url, {
                        activityId: pageData.activityId,
                        productId: pageData.productId,
                        isOpen: pageData.isOpen,
                        fightGroupsId: pageData.isOpen ? "" : pageData.fightGroupsId
                    }, function (data) {
                        hasClick = false;
                        if (data.error == 0) {
                            var lastMemberIndex = data.data.members.length;
                            if (pageData.isOpen) {
                                //开团成功
                                self.btns.open.hide();
                                //显示剩余成团人数
                                self.btns.invite.find("i").text(data.data.groupsNum - lastMemberIndex);
                                self.btns.invite.show();
                                self.setCountDown({
                                    container: self.btns.invite.find(".cd"),
                                    currentTime: data.data.currentTime,
                                    targetTime: data.data.enabledTime + data.data.currentTime,
                                    callback: function () {
                                        self.btns.invite.hide();
                                        self.btns.over.show();
                                    }
                                });
                                //转换分享url
                                shareMod.changeShareUrl(data.data.fightGroupsId);
                            } else {
                                //参团成功
                                self.btns.join.hide();
                                if (data.data.groupStatus == 0) {
                                    //参团后任然未成团
                                    //显示剩余成团人数
                                    self.btns.invite.find("i").text(data.data.groupsNum - lastMemberIndex);
                                    self.btns.invite.show();
                                    self.setCountDown({
                                        container: self.btns.invite.find(".cd"),
                                        currentTime: data.data.currentTime,
                                        targetTime: data.data.enabledTime + data.data.currentTime,
                                        callback: function () {
                                            self.btns.invite.hide();
                                            self.btns.over.show();
                                        }
                                    });
                                }
                                if (data.data.groupStatus == 1) {
                                    //参团后成团
                                    var $this = self.btns.success.show();
                                    self.setCountDown({
                                        container: $this.find(".cd"),
                                        currentTime: data.data.currentTime,
                                        targetTime: data.data.payTimeLimit,
                                        callback: function () {
                                            $this.hide();
                                            self.btns.lost.show();
                                        }
                                    });
                                }
                            }
                            //显示成员信息
                            self.showMember(lastMemberIndex-1, data.data.members[lastMemberIndex-1]);
                            //提示用户;
                            dialog.tips(pageData.isOpen ? "开团成功" : "参团成功");
                        }
                    }, function (e) {
                        hasClick = false;
                        if (e.error == 14) {
                            self.showMask(e.msg);
                        } else {
                            dialog.tips(e.msg);
                            if (e.error == 8) {
                                //已经开团,自动跳开团页
                                setTimeout(function () {
                                    window.location.href = domain['m'] + "/fightgroups/fightlist";
                                }, 4000);
                                return;
                            }
                            if (e.error == 10) {
                                //无库存
                                self.setCountDown();//清除倒计时
                                self.btns.noGoods.show();
                                self.btns.open.hide();
                                return;
                            }
                            if (e.error == 9) {
                                //参团人数已经满
                                self.setCountDown();//清除倒计时
                                self.btns.full.show();
                                self.btns.join.hide();
                                return;
                            }
                        }
                    });
                }
            };
            this.btns.open.on("click", "button", handler);
            this.btns.join.on("click", "button", handler);
        },
        /**
         * 显示提示遮罩
         * */
        showMask: function (msg) {
            var d = box.create({
                xtype: 'none',
                autofocus: true,
                className: "e-cnt",
                id: "e-msg",
                modal: true,
                autoRelease: true,
                content: '<div>' + msg + '</div>',
                close: false,
                ok: {
                    text: '去开团',
                    fn: function () {
                        window.location.href = domain['m'] + "/fightgroups/fightlist";
                    }
                },
                cancel: {
                    text: '知道了',
                    fn: function () {
                        d.hide(true);
                    }
                }
            });
            return d.show();
        },
        /**
         * 活动规则
         * */
        initRule: function () {
            var $ruleContent = $("[node-type='r-ms']").eq(0);
            var $rulleBtn = $ruleContent.find("[node-type='r-btns']").eq(0);
            $rulleBtn.hide();
            $ruleContent.css({
                height: "auto"
            });
        },
        /**
         * 初始化倒计时
         * */
        initCountDown: function () {
            var self = this;
            var $visibleBtn = this.$btnContent.find(".b-i:visible").eq(0);
            if ($visibleBtn.hasClass("btn-open") || $visibleBtn.hasClass("btn-invite") || $visibleBtn.hasClass("btn-join")) {
                var $this = $visibleBtn;
                this.setCountDown({
                    container: $this.find(".cd"),
                    currentTime: pageData.currentTime,
                    targetTime: pageData.enabledTime + pageData.currentTime,
                    callback: function () {
                        $this.hide();
                        self.btns.over.show();
                    }
                });
            } else if ($visibleBtn.hasClass("btn-success") || $visibleBtn.hasClass("btn-no-pay")) {
                var $this = $visibleBtn;
                this.setCountDown({
                    container: $this.find(".cd"),
                    currentTime: pageData.currentTime,
                    targetTime: pageData.payTimeLimit,
                    callback: function () {
                        $this.hide();
                        self.btns.lost.show();
                    }
                });
            }
        },
        /**
         * 设置倒计时
         * */
        setCountDown: function (opt) {
            //清除原来的倒计时
            if (this._countDown) {
                this._countDown.destroy();
                this._countDown = null;
            }
            if (!opt) {
                return;
            }
            this._countDown = CountDown({
                container: opt.container,
                currentTime: opt.currentTime,
                targetTime: opt.targetTime,
                type: {'d': false, 'h': true, 'm': true, 's': true},
                timeText: ['', ':', ':', ''],
                callback: opt.callback
            });
        },
        /**
         * 显示新增成员
         * */
        showMember: function (index, memberData) {
            var $member = $(".ac-m.m-ms");
            //修改参团人数提示
            $member.find(".ac-title em").eq(1).text(index+1);
            var $first = $member.find('.m-i').eq(0);
            if (!$first.hasClass("king")) {
                $first.addClass("king");
            }
            var $index = $member.find('.m-i').eq(index);
           // $index.find("img.jm-img").attr("data-url", memberData.photo);
            if(memberData.photo){
                $index.find("img.jm-img").attr("data-url", memberData.photo);
            }else{
                var $img = $index.find("img.jm-img");
                $img.attr("src", domain['js'] + "/gshop/images/my-center/user.png");
                $img.removeAttr("data-url");
                var $parent = $img.parent(".m-img");
                if ($parent.hasClass("df-img")) {
                    $parent.removeClass('df-img');
                }
            }
            //是否需要替换名称
            // var $name = $i.find(".m-name span").text("");
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
                        $this.attr("src", domain['js'] + "/gshop/images/my-center/user.png");
                        $this.removeAttr("data-url");
                    }
                }
            });
        }
    };
    plugin.init();
});
