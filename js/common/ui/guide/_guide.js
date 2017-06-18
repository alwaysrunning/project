define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var _ = require('common/ui/guide/_cookie');

    var guide = null, time = null;

    var div =  '<div class="guide-mod" id="jGuideMod">';
        div +=      '<div class="guide-bg"></div>';
        div +=      '<div class="guide-area">';
        div +=          '<div class="guide-icon icon iconfont">&#xe60a;</div>';
        div +=          '<div class="guide-tips">';
        div +=              '<span class="guide-txt">点击展开更多功能哦!</span>';
        div +=              '<span class="up-arrow up-arrow-top"></span>';
        div +=              '<span class="up-arrow up-arrow-buttom"></span>';
        div +=          '</div>';
        div +=          '<div class="guide-nav">';
        div +=              '<div class="nav-list">';
        div +=                  '<a href="javascript:;">';
        div +=                      '<i class="icon iconfont">&#xe606;</i>';
        div +=                      '<p>首页</p>';
        div +=                  '</a>';
        div +=                  '<a href="javascript:;">';
        div +=                      '<i class="icon iconfont">&#xe636;</i>';
        div +=                      '<p>分类</p>';
        div +=                  '</a>';
        div +=                  '<a href="javascript:;">';
        div +=                      '<i class="icon iconfont">&#xe605;</i>';
        div +=                      '<p>购物车</p>';
        div +=                  '</a>';
        div +=                  '<a href="javascript:;">';
        div +=                      '<i class="icon iconfont">&#xe607;</i>';
        div +=                      '<p>我的</p>';
        div +=                  '</a>';
        div +=              '</div>';
        div +=          '</div>';
        div +=          '<a href="javascript:;" class="guide-btn" id="jGuideKnow">我知道了</a>';
        div +=      '</div>';
        div +=  '</div>';

    guide = function(options,showFn,closeFn){
        this.defaults = {
            close: false,    //是否点击空白关闭
            btn : '#jGuideKnow',    //新手导引关闭按钮
            contains: '#jGuideMod', //新手导引内容
            bgcnt: '.page-view',    //需要模糊的背景内容
            isDialog: true,     //是否每次弹出
            cookieName: '_guide', //写入cookie名称
            expires : 36500,    //cookie失效时间(天数)
            cnt : div,   //弹出内容
            auto: 0,     //多久时间自动关闭，0表示不自动关闭
            blur: true,  //背景是否高斯模糊
            showFn: showFn || '',
            closeFn: closeFn || ''
        }
        this._extentOpts(options);
        this._init();
    }

    guide.prototype = {
        //extend
    	_extentOpts: function(opts) {
            this.opts = $.extend(this.defaults, opts);
        },
        //默认执行
        _init: function(){
            var self = this;
            self._isShow();
            self._addEvent();
            self._blur();
            self._auto();
        },
        //根据cookie确认是否显示新手引导
        _isShow: function(){
            var self = this, name = self.opts.cookieName;
            if(!$.cookie(name)){
                self._set(name,'on');
                $('body').append(self.opts.cnt);
                self._callback(self.opts.showFn);
            }
        },
        //设置cookie
        _set : function(name, value) {
            var self = this;
            $.cookie(name, value, {
                expires : self.opts.expires,
                path : '/'
            });
        },
        //点击关闭事件
        _addEvent: function(){
            var self = this;
            $(self.opts.btn).on('click',function(){
                self._destoryGuide();
            });
            if(self.opts.close){
                $(self.opts.contains).on('click',function(){
                    self._destoryGuide();
                });
            }
        },
        //背景是否高斯模糊(毛玻璃效果)
        _blur: function(){
            var self = this;
            if(self.opts.blur && $(self.opts.contains).length){
                $(self.opts.bgcnt).addClass('blur');
                $('html').addClass('over-flow');
            }
        },
        //是否自动关闭
        _auto: function(){
            var self = this;
            if(self.opts.auto){
                time = setTimeout(function(){
                    self._destoryGuide();
                },self.opts.auto);
            }
        },
        //去除导引
        _destoryGuide: function(){
            var self = this, $contains = $(self.opts.contains);
            $contains.length?$contains.remove():'';
            $(self.opts.bgcnt).removeClass('blur');
            $('html').removeClass('over-flow');
            clearInterval(time);
            self._callback(self.opts.closeFn);
        },
        //回调函数
        _callback:function(fn){
            fn && fn(this.opts);
        }

    }

    return guide;
    
});
