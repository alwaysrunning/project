define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var io = require('common/kit/io/request');

    var cart = require('module/add-to-cart/addcart');

    // var wx = require('common/base/jweixin-1.0.0');

    var Dialog = require('common/ui/dialog/dialog');

    var nav = null;


    //  分类导航
    var cataMenu = require('common/ui/menu/menu4global')();


    nav = function(options){
        this.extentOpts(options);
        this.init();
    };

    nav.prototype = {
        opts : {
            clickBtn: '',//点击的按钮弹出按钮
            isShowCloud : false,//是否展示云朵标示
            onClick : function(){},//点击事件
            isScroll : false,   //是否滚动隐藏
            direction : 'left', //默认便宜方向
            distance : '-100%', //默认便宜位置
            isShow : true,  //是否默认显示
            position: 'bottom', //默认出现位置
            positionVal: '0',   //默认偏移位置
            isScanWx: true, //屏蔽微信扫一扫
            wxUrl : '//m.yunhou.com/ump/getJs', //获取微信参数
            urlReg : '^(http|https):\/\/(\w*\.)+(yunhou)+(\.com\/)'
        },

        extentOpts: function(options) {
            this.opts = $.extend(this.opts, options);
        },

        init: function(){
            var self = this;
            $('body').append(self.createDiv());
            self.animateShow();

            // if(self.isWeixin()){
            //     $('#jNav').addClass('wx-fix-nav');
            //     $('#jWxScan').show();
            //     self.wxConfig();
            // }
            // if(this.opts.isShow){
            //     $('#jNav').css('left',0).show();
            // }else{
            //     if(self.opts.isShowCloud){
            //         $('#jNav').css('left','-100%').show();
            //     }
            // }
            cart.getcart();

            self.clickEvent();
            self.scrollEvent();
        },
        isPage: function(page) {
            return window.location.origin + window.location.pathname === page;
        },

        //  add by taotao
        animateShow: function() {
            var ele = $('#jNav');
            setTimeout(function() {
                ele.addClass(ele.attr('data-animate'));
            }, 100);
        },

        //生成盒子
        createDiv : function() {
            var self = this;
            var div = '';
            // div +=  '<div class="fix-nav" id="jNav" style="'+self.opts.position+':'+self.opts.positionVal+'">';
            div +=  '<div class="fix-nav" id="jNav" data-animate="_nav-show">';
            div +=      '<div class="nav-list">';
            if (self.isPage('http://m.yunhou.com/')) {
                div +=          '<a class="active" href="//m.yunhou.com/">';
            } else {
                div +=          '<a href="//m.yunhou.com/">';
            }
            div +=              '<i class="icon iconglobal"></i>';
            div +=              '<p>首页</p>';
            div +=          '</a>';
            div +=          '<a class="jHeaderCata" id="global-cata">';
            div +=              '<i class="icon iconglobal"></i>';
            div +=              '<p>分类</p>';
            div +=          '</a>';
            div +=          '<a forward-to="cart" href="//m.yunhou.com/html/cart/cart.html">';
            div +=              '<i class="icon iconglobal">&#xe605;<span class="buy-num" id="jGetSimple"></span></i>';
            div +=              '<p>购物车</p>';
            div +=          '</a>';
            div +=          '<a href="//m.yunhou.com/member/">';
            div +=              '<i class="icon iconglobal">&#xe64e;</i>';
            div +=              '<p>我的</p>';
            div +=          '</a>';
            div +=          '<a href="javascript:;" id="jWxScan" class="wx-scan">';
            div +=              '<i class="icon iconfont">&#xe637;</i>';
            div +=              '<p>扫一扫</p>';
            div +=          '</a>';
            div +=      '</div>';
            //
            if(self.opts.isShowCloud){
                div +=      '<span class="arrow" id="jArrow"><i class="icon iconfont">&#xe60d;</i></span>';
                div +=      '<span class="nav-logo" id="jNavLogo"><i class="icon iconfont">&#xe61b;</i></span>';
            }
            div +=  '</div>';
            if(!self.opts.isShowCloud){
                div += '<div class="tips-mask" id="jMask"></div>'
            }
            return div;
        },
        toggle: function(flg) {
            var self = this;
            var $nav = $('#jNav');
            var $mask = $('#jMask');
            $mask[flg?'show':'hide']().css({'opacity':'0.5'});
            $nav[flg?'show':'hide']();
            $('html')[flg?'addClass':'removeClass']('bd-hidden');
        },
        clickEvent : function() {
            var self = this;
            var opt = self.opts;
            //按钮
            if(!opt.isShow || opt.clickBtn){
                $(document).on('click', opt.clickBtn, function(){
                    self.showMenuBox();
                });
            }
            //遮罩
            $('#jMask').click(function(){
                self.showMenuBox();
            });


            //  购物车添加时间戳
            $('#jNav').find('a[forward-to="cart"]').click(function(e) {
            // $('#jNav').find('a').click(function(e) {
                e.preventDefault();
                var url = $(this).attr('href');
                url += /\?/.test(url) ? '&': '?' + '_t_=' + new Date().getTime();
                window.location.href = url;
            });


            //  分类插件显示，隐藏
            $('.jHeaderCata').click(function() {
                cataMenu.toggle();
            });


            var fixDirection = function(val, opacity){
                $('#jNav').css(self.opts.direction,val);
                $('#jNavLogo').css('opacity',opacity);
            };

            //
            $('#jArrow').on('click',function(){
                fixDirection('-100%', '0.4');
            });

            $('#jNavLogo').on('click',function(){
                fixDirection('0', '1');
            });
        },
        //展示菜单
        showMenuBox : function(){
            var self = this;
            var $nav = $('#jNav');
            var $mask = $('#jMask');
            var isShow = $mask.is(':visible');
            if(self.opts.isShowCloud){
              $nav.css(self.opts.direction,0);
            }else{
                $mask[isShow?'hide':'show']().css({'opacity':'0.5'});
                $nav[isShow?'hide':'show']();
                $('html')[isShow?'removeClass':'addClass']('bd-hidden');
            }
            $('#jNavLogo').css('opacity',0);
            self.opts.onClick();
        },
        scrollEvent : function(){
            var self = this;
            if(!self.opts.isScroll){
                window.onscroll = null;
                return false;
            }
            window.onscroll = function(){
                if(self.opts.isShowCloud){
                    $('#jNav').css(self.opts.direction,'-100%');
                    $('#jNavLogo').css('opacity',0.4);
                }
            }
        },
        //微信扫一扫功能 update leaytam
        wxEvent: function(){
            var self = this;
            $('body').on('click','#jWxScan',function(){
                Dialog.tips('微信扫一扫正在启动，请稍后...');
                self.wxReady();
            });
        },
        //微信配置消息
        wxConfig: function(result){
            var self = this;
            io.jsonp(self.opts.wxUrl,{
                url:window.location.href
            },function (result) {
                self.callWxMethod('config', {
                    debug: false,
                    appId: result.msg.appId,
                    timestamp: result.msg.timestamp,
                    nonceStr: result.msg.noncestr,
                    signature: result.msg.signature,
                    jsApiList: ["scanQRCode"]
                });

                self.wxEvent();

                //处理微信config
                wx.error(function(res){
                    Dialog.tips('微信数据初始化失败，请稍后重试！');
                });
            }, function () {
                //拉取初始化参数失败
                Dialog.tips('获取接口初始化参数失败！');
            });
        },
        //微信接口准备好后调用
        wxReady: function(){
            var self = this;
            self.callWxMethod('ready', function(){
                self.callWxMethod('checkJsApi', {
                    jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {
                        if (res.checkResult.scanQRCode) {
                            self.wxScan()
                        } else {
                            Dialog.tips('请将您的微信升级到最新版！');
                        }
                    },
                    complete: function(){
                        self.wxDestory();
                    }
                });
            });

        },
        //微信扫一扫功能
        wxScan: function(){
            var self = this;
            self.callWxMethod('scanQRCode', {
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    var reg = new RegExp(self.opts.urlReg);
                    if(reg.test(result)){
                        window.location.href = result;
                    }else{
                        Dialog.tips('扫一扫仅支持yunhou.com下的链接');
                    }
                },
                fail: function(){
                    Dialog.tips('摄像头信息获取失败，请重新打开试试！');
                }
            });
        },
        //判断是否是微信浏览器
        isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        wxDestory: function(){
            $('#_dialog') && $('#_dialog').remove();
        },
        //抛错异常处理
        callWxMethod: function(methodName,opts){
            try{
                return wx[methodName].apply(wx, [].slice.call(arguments, 1));
            } catch (e) {}
        }
    }

    return nav;

});
