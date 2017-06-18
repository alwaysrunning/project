/**
 * Created by tangwei on 16/3/3.
 */

define(function(require,exports,module){
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
    var domain = require("module/group/domain");

    var URL   = require("url").URL;
    var pageURL = window.location.href;

    var pageData = window.$PAGE_DATA.group;
    var hasClick = false;
    var _lazyLoader;

    var urlMap = {
        open: domain['m']+"/fightgroups/dojoin",
        join: domain['m']+"/fightgroups/dojoin"
    };

    var plugin = {
        init : function(){
            //初始化分享
            shareMod.init();
            //预处理商品详情内容
            this.translatDetail();
            //初始化图片懒加载
            this.initLazyLoader();
            //初始化活动规则的显示
            this.initRule();
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
        translatDetail : function(){
            imgTranslator.translat({
                targetContent: $(".gd-des .gd-des-inner"),
                resourceContent: $("#des")
            });
        },

        /**
         * 活动规则
         * */
        initRule : function(){
            var $ruleContent = $("[node-type='r-ms']").eq(0);
            var ruleHeight = $ruleContent.height();
            var $rulleBtn = $ruleContent.find("[node-type='r-btns']").eq(0);
            var innerHeight = $ruleContent.find("[node-type='r-inner']").eq(0).height();
            var btnHeight = $rulleBtn.height();
            ruleHeight = ruleHeight-btnHeight;
            var indexHeight = innerHeight-ruleHeight;
            if(indexHeight<0 || (indexHeight> 0 && indexHeight< btnHeight)){
                //在很小的范围内,直接全部显示
                $rulleBtn.hide();
                $ruleContent.css({
                    height: "auto"
                });
            }
            $rulleBtn.on("click",function(){
                $rulleBtn.hide();
                $ruleContent.css({
                    height: "auto"
                });
            });
        },

        /**
         * 图片懒加载
         * */
        initLazyLoader : function(){
            _lazyLoader = new Lazyload('img.jImg', {
                effect: 'fadeIn',
                dataAttribute: 'url',
                load: function (self) {
                    var _self = $(self).css({"width": "100%"});
                    var $parent = _self.parent(".gd-img");
                    if (_self.hasClass('img-error')) {
                        _self.removeClass('img-error');
                    }
                    if($parent.length!=0 && $parent.hasClass('img-error')){
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
                appear : function(self){
                    var $this = $(self);
                    if($this.attr("data-url")){
                        $this.attr("src",domain['js']+"/gshop/images/my-center/user.png");
                        $this.removeAttr("data-url");
                    }
                }
            });
        },
        /**
         * 是否登录
         * */
        judgeLogin : function(url){
            if (!cookie('_nick')) {
                var returnUrl = url?encodeURIComponent(url):encodeURIComponent(pageURL);
                if(shareMod.isWeiXin()){
                    cookie('_bbgReferer', returnUrl, {
                        path: '/',
                        domain: domain['@'],
                        expires: 0.2
                    });
                    window.location.href = domain['ssl']+'/bubugao-passport/oauth2/weixin?type=h5&bind=false&returnUrl=' +returnUrl ;
                    return false;
                }else{
                    window.location.href = URL.Login.login+ '?returnUrl=' +returnUrl ;
                    return false;
                }
            }
             return true;
        },
        /**
         * 定位按钮元素
         * */
        initBtns : function(){
            var $btnContent = $(".ac-bar ").addClass("show-bar");
            this.btns = {
                open : {
                    open : $btnContent.find(".btn-open"),
                    invite : $btnContent.find(".btn-invite"),
                    noGoods : $btnContent.find(".btn-no-goods"),
                    over : $btnContent.find(".btn-over"),
                    success:$btnContent.find(".btn-success")
                },
                join : {
                    join : $btnContent.find(".btn-join"),
                    full : $btnContent.find(".btn-full"),
                    check : $btnContent.find(".btn-check"),
                    other : $btnContent.find(".btn-other"),
                    over : $btnContent.find(".btn-over")
                }
            }
        },
        /**
         *  按钮添加点击事件
         * */
        addEvetns : function(){
            var self = this;
            //开团按钮事件
            if(pageData.isOpen){
                //开团操作
                this.btns.open.open.on("click","button",function(e){
                    if(!hasClick && self.judgeLogin()){
                        hasClick = true;
                        io.jsonp(urlMap.open,{
                            activityId : pageData.activityId,
                            productId : pageData.productId,
                            isOpen : pageData.isOpen
                        },function(data){
                            hasClick = false;
                            if(data.error==0){
                                //开团成功
                                self.btns.open.open.hide();
                                self.btns.open.invite.show();
                                self.setCountDown({
                                    container : self.btns.open.invite.find(".cd"),
                                    currentTime: data.data.currentTime,
                                    targetTime:data.data.enabledTime+data.data.currentTime,
                                    callback :function(){
                                        self.btns.open.invite.hide();
                                        self.btns.open.over.show();
                                    }
                                });
                                //转换分享url
                                shareMod.changeShareUrl(data.data.fightGroupsId);
                                //显示成员信息
                                self.showMember(data.data.members[0]);
                                //提示用户;
                                dialog.tips("开团成功");
                                return ;
                            }

                        },function(e){
                            hasClick = false;
                            dialog.tips(e.msg);
                            if(e.error == 8){
                                //已经开团,自动跳开团页
                                setTimeout(function(){
                                    window.location.href =domain['m']+"/fightgroups/fightlist";
                                },4000);
                            }
                            if(e.error == 10){
                                //无库存
                                self.setCountDown();//清除倒计时
                                self.btns.open.noGoods.show();
                                self.btns.open.open.hide();
                                return ;
                            }
                        });
                    }
                });
                //邀请好友
                this.btns.open.invite.on("click","button",function(){
                    shareMod.showGuide();
                });
                //拼团成功
                this.btns.open.success.on("click","button",function(){
                    window.location.href = domain['m']+"/fightgroups/success/"+pageData.activityId+"/"+pageData.productId+"/"+pageData.fightGroupsId;
                });
            }else{
                //参团按钮事件
                this.btns.join.join.on("click","button",function(){

                    if(!hasClick && self.judgeLogin()){
                        hasClick = true;
                        io.jsonp(urlMap.join,{
                            activityId : pageData.activityId,
                            fightGroupsId: pageData.fightGroupsId,
                            productId : pageData.productId,
                            isOpen : pageData.isOpen
                        },function(data){
                            hasClick = false;
                            if(data.error==0){
                                window.location.href = domain['m']+"/fightgroups/success/"+pageData.activityId+"/"+pageData.productId+"/"+pageData.fightGroupsId;
                                return ;
                            }
                        },function(e){
                            hasClick = false;
                            if(e.error==14){
                                self.showMask(e.msg);
                            }else{
                                dialog.tips(e.msg);
                                if(e.error == 9){
                                    //参团人数已经满
                                    self.setCountDown();//清除倒计时
                                    self.btns.join.full.show();
                                    self.btns.join.join.hide();
                                    return ;
                                }
                            }
                        });
                    }
                });

                this.btns.join.check.on("click","button",function(){
                    window.location.href = domain['m']+"/fightgroups/success/"+pageData.activityId+"/"+pageData.productId+"/"+pageData.fightGroupsId;
                });

                //老用户查看参团页面
                this.btns.join.other.on("click",".c-t",function(){
                    //跳转该团详情页
                    window.location.href =domain['m']+"/fightgroups/fightlist";

                });

                this.btns.join.other.on("click","button",function(){
                    //开团列表
                    window.location.href =domain['m']+"/fightgroups/go/"+pageData.activityId+"/"+pageData.productId;

                });
            }
        },
        /**
         * 显示提示遮罩
         * */
        showMask : function(msg){
            var d = box.create({
                xtype: 'none',
                autofocus: true,
                className:"e-cnt",
                id: "e-msg",
                modal: true,
                autoRelease: true,
                content: '<div>' + msg + '</div>',
                close: false,
                ok: {
                    text: '去开团',
                    fn: function() {
                        window.location.href =domain['m']+"/fightgroups/fightlist";
                    }
                },
                cancel: {
                    text: '知道了',
                    fn: function() {d.hide(true); }
                }});
            return d.show();
        },

        /**
         * 初始化倒计时
         * */
        initCountDown : function(){
            var self  = this;
            if(pageData.isOpen){
                //如果是开团
                if(!pageData.fightGroupsId || (pageData.fightGroupsId && pageData.openMemberId!=pageData.memberId)){
                    //如果没有开团
                    this.setCountDown({
                        container : self.btns.open.open.find(".cd"),
                        currentTime: pageData.currentTime,
                        targetTime:pageData.activityEndTime,
                        callback :function(){
                            self.btns.open.open.hide();
                            self.btns.open.over.show();
                        }
                    });
                }else{
                    //如果已经开团
                    if(pageData.groupStatus==0){
                        // 还没有成团
                        if(pageData.memberId == pageData.openMemberId){
                            //同一人查看
                            this.setCountDown({
                                container : self.btns.open.invite.find(".cd"),
                                currentTime: pageData.currentTime,
                                targetTime:pageData.enabledTime+pageData.currentTime,
                                callback :function(){
                                    self.btns.open.invite.hide();
                                    self.btns.open.over.show();
                                }
                            });
                        }else{
                            //不同的人查看

                        }

                    }
                }
            }else{
                //如果是参团
                //如果还没有成团的时候需要初始化倒计时
                if(pageData.groupStatus ==0){
                    this.setCountDown({
                        container : self.btns.join.join.find(".cd"),
                        currentTime: pageData.currentTime,
                        targetTime:pageData.enabledTime+pageData.currentTime,
                        callback :function(){
                            self.btns.join.join.hide();
                            self.btns.join.over.show();
                        }
                    });
                }
            }
        },

        /**
         * 设置倒计时
         * */
        setCountDown : function(opt){
           //清除原来的倒计时
            if(this._countDown){
                this._countDown.destroy();
                this._countDown = null;
            }
            if(!opt){
                return;
            }
             this._countDown = CountDown({
                container: opt.container,
                currentTime:opt.currentTime,
                targetTime: opt.targetTime,
                type: {'d': false, 'h': true, 'm': true, 's': true},
                timeText: ['', ':', ':', ''],
                callback: opt.callback
            });
        },
        /**
         * 显示新增成员
         * */
        showMember: function(memberData){
            var $member = $(".ac-m.m-ms").show();
            var $i = $member.find('.m-i').eq(0).addClass("king").data("m-data",memberData);
            var $img = $i.find("img").attr("data-url",memberData.photo);
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
                    appear : function(self){
                        var $this = $(self);
                        if($this.attr("data-url")){
                            $this.attr("src",domain['js']+"/gshop/images/my-center/user.png");
                            $this.removeAttr("data-url");
                        }
                    }
                });
            //自动滑动到成员列表处.
            this.scrollTo($(document).height()-$(window).height());

        },
        scrollTo: function(m){
            var n = window.scrollY, timer = null, that = $('html,body');
            var smoothScroll = function(m){
                var per = Math.round(m / 50);
                n = n + per;
                if(n > m){
                    window.clearInterval(timer);
                    return false;
                }
                that.scrollTop(n);
            };

            timer = window.setInterval(function(){
                smoothScroll(m);
            }, 20);
        }
    };

    plugin.init();

});
