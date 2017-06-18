/**
 * get simple
 * 获取购物车数量
 * @author  leay
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var io = require('common/kit/io/request');

    var getSimple = null;

    getSimple = function(options){
        this.extentOpts(options);
        this.init();
    };

    getSimple.prototype = {
        opts : {
            cart : '[id=jGetSimple]',// 这样可以选出页面多个id:jGetSimple,如果#jGetSimple只会返回页面一个dom
            url : '//m.yunhou.com/cart/getSimple',
            time : 300
        },

        extentOpts: function(options) {
            this.opts = $.extend(this.opts, options);
        },

        init : function(){
            var _self = this;
            var el = $(_self.opts.cart);
            if(el && el.length>0){
                setTimeout(function(){
                    io.jsonp(_self.opts.url,function(res){
                        if (res.data.totalType === 0) {
                            el.hide();
                        } else {
                            el.html(res.data.totalType).show();
                        }
                    });
                },_self.opts.time);
            }
        }
    }

    return getSimple;

});
