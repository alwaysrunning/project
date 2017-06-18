/**
 * @description 购物车公用模块
 * @author licuiting 250602615@qq.com
 * @date 2015-02-10 14:46:52
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var template = require('common/widget/template');
    var getProducts = require('module/cart/get-products');
    var cookie = require('common/kit/io/cookie');
    var BBG = require('url');
    var io = require('common/kit/io/request');
    var dialog = require('common/ui/dialog/dialog');
    var imageLazyLoader = null;
    var Lazyload = require('common/widget/lazyload'); //图片赖加载
    // 购物车容器
    var eCart = $('#jCart');
    // var editBar = require('module/cart/edit-bar');
    var Delegator = require('lib/core/1.0.0/dom/delegator');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var com = {
        defaultSetting: {
            selector: '',
            //购物车模板id
            moduleId: 'jCart',
            //公用请求
            url: BBG.URL.Cart,
            //
            bbgUrl: BBG.URL,
            //btn disabled class
            disClass: 'disabled', //'ui-button-disabled',
            //登陆界面
            loginUrl: BBG.URL.Login.login,
            //当前界面url
            pageUrl: 'http:' + BBG.URL.Cart.page,
            Delegator: Delegator,
            Emitter: Emitter,
            //弹出框
            dialog: dialog
        },
        init: function() {
            var self = this;
            $.extend(this, this.defaultSetting);
            self.delegator = Delegator('#' + self.moduleId);
            self.o = $('#' + self.moduleId);
            Emitter.applyTo(this);
            //扩展删除多余的html标签
            template.helper('delHtmlTag', function(str) {
                return str ? str.replace(/<[^>]+>/g, "") : '';
            });
            //获取图片类型
            template.helper('getImgByType', function(src, type) {
                var obj = {
                    s1: 's1',
                    s2: 's2',
                    m1: 'm1',
                    l1: 'l1',
                    l2: 'l2'
                };
                type = obj[type];
                return self.getImgByType(src, type);
            });
        },
        delay: function() {
            var timer = 0;
            return function(callback, time) {
                clearTimeout(timer);
                timer = setTimeout(callback, time);
            };
        },
        ajax: function(url, data, successFun, errorFun, $btn) {
            var self = this;
            var str = self.errorStr();
            var _data = self.o.data('cartData');
            var publicData = {
                source: 'wap'
            };
            io.jsonp(url, $.extend(publicData, data || {}),
                function(data) {
                    if (data.msg) {
                        self.dialog.tips(data.msg);
                    }
                    if (data.data) {
                        data = data.data
                    }
                    successFun && successFun(data);
                }, function(data) {
                    //
                    var _code = data.error;
                    if (_code) {
                        if (_code < 1000) {
                            //提示登录
                            if (_code == -100) {
                                location.href = self.loginUrl + '?returnUrl=' + encodeURIComponent(self.pageUrl);
                            } else if (_code == 500) {
                                self.dialog.tips(data.msg);
                            } else {
                                //$('#jNoData').html(str);
                            }
                        } else {
                            self.dialog.tips(data.msg);
                        }
                    } else {
                        //$('#jNoData').html(str);
                    }
                    $('#jNoData').html(str);
                    errorFun && errorFun(data);
                }, $btn).on('error', function(res) {
                if (res.error == '1') {
                    $('#jNoData').html(str);
                }
            });
        },
        //错误字符串
        errorStr: function() {
            var newAr = [];
            newAr.push('<div class="page-view">',
                '<div class="empty">',
                '<i class="icon iconfont">&#xe620;</i>',
                '<p class="emt-txt">数据加载失败...</p>',
                '<a href="javascript:location.reload();" class="ui-button-white">刷新</a>',
                '</div>',
                '</div>');
            return newAr.join('');
        },
        //刷新购物车模板,包括js逻辑处理;
        refreshCartModule: function(data, callback) {
            var self = this,
                context;
            //是否空对象,null,false的判断;
            if (self.isEmptyObject(data) || data == null || !data) {
                return false;
            }
            //缓存数据
            this.o.data('cartData', data);
            //渲染模板
            this.renderModule(data);
            //图片懒加载
            this.resetImageLoader();
            //替换url
            this.setUrl();
            //
            callback && callback(data);
            // 调用
            self.emit('initJsMod', data);
        },
        //图片加载
        resetImageLoader: function() {
            // Please make sure destroy it firts if not null
            if (imageLazyLoader) {
                imageLazyLoader.destroy();
            }
            imageLazyLoader = new Lazyload('img.jImg', {
                effect: 'fadeIn'
            });
            return imageLazyLoader;
        },
        //给模板设置url
        setUrl: function() {
            $('#goToIndex').attr({
                'href': BBG.URL.index.page
            });
            $('#goToLogin').attr({
                'href': BBG.URL.Login.login
            });
            $('#goBack').attr({
                'href': 'javascript:history.back();'
            });
            $('#goUc').attr({
                'href': BBG.URL.UC.page
            });
        },
        //渲染模板
        renderModule: function(data) {
            var self = this;
            data = self.setMemberData(data);
            self.o.html(template.render(self.moduleId + 'Tmpl', data));
        },
        setMemberData: function(data) {
            var groups;
            data.groups && (groups = data.groups);

            if ('data' in data && data.data === null) {
                data = {
                    memberId: cookie('_nick')
                };
            } else if (!data.groups || !groups.length) {
                data.memberId = cookie('_nick');
            }

            return data;
        },
        //是否为空
        isEmptyObject: function(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        getImgByType: function(src, type) {
            var self = this;
            var reg = /[!]((s1)|(s2)|(m1)|(l1)|(l2))$/
                // 有后缀就替换，无后缀就添上;
            if (self.isPicUrl(src)) {
                if (reg.test(src)) {
                    return src.replace(reg, '!' + type);
                } else {
                    return src + '!' + type;
                }
            }
            return src;
        },
        //是否是商城图片url(ps:_md5编码_数字x数字.);
        isPicUrl: function(src) {
            var reg = /[_]([0-9a-zA-Z]{32})[_][0-9]+[x][0-9]+\./;
            return reg.test(src);
        },
        //获取购物车数据,并加载相应的js逻辑;
        getCartData: function(data, callback) {
            var self = this;
            self.ajax(self.url.get, data || {}, function(data) {
                self.refreshCartModule(data, callback);
                //callback && callback();
            });
        }
    }
    com.init();
    module.exports = com;
});
