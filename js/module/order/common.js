/**
 * @description 结算公用模块
 * @author licuiting 250602615@qq.com
 * @date 2014-11-05 10:03:13
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var template = require('common/widget/template');
    var BBG = require('url');
    var io = require('common/kit/io/request');
    var dialog = require('common/ui/dialog/dialog');
    var imageLazyLoader = null;
    var Lazyload = require('common/widget/lazyload'); //图片赖加载
    var cookie = require('common/kit/io/cookie');

    var com = {
        defaultSetting: {
            //结算模板id
            moduleId: 'jOrder',
            //公用请求
            url: BBG.URL.settlement,
            //
            bbgUrl: BBG.URL,
            //btn disabled class
            disClass: 'ui-button-disabled',
            //登陆界面
            loginUrl: BBG.URL.Login.login,
            //当前界面url
            pageUrl: 'http:' + BBG.URL.settlement.page,
            //弹出框
            dialog: dialog
        },
        //初始化
        init: function() {
            var self = this;
            $.extend(this, this.defaultSetting);
            self.o = $('#' + self.moduleId);
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
            //
        },
        //获取购买类型
        getBuyType: function() {
            //购买流程( normal原流程, direct立即购买 )
            return this.isBuyNowFlag() ? 'direct' : 'normal';
        },
        //source url
        getSourceBuyType: function() {
            return this.isSourceBuyNowFlag() ? 'direct' : 'normal';
        },
        isSourceBuyNowFlag: function() {
            var self = this;
            var ar = ['buy-now', 'buy-at-once']
            var sce = self.getUrlParam('source');
            var flag = false;
            $(ar).each(function(k, v) {
                if (sce.indexOf(v) > -1) {
                    flag = true;
                    return false;
                }
            });
            return flag;
        },
        //是否是'buyAtOnce',点击立即购买,走正常发货流程
        isBuyAtOnce: function() {
            return (location.href.indexOf('buy-at-once.html') > -1);
        },
        //购买类型判断标示
        isBuyNowFlag: function() {
            var ar = ['buy-now', 'buy-at-once']
            var flag = false;
            $(ar).each(function(k, v) {
                if (location.href.indexOf(v + '.html') > -1) {
                    flag = true;
                    return false;
                }
            });
            return flag;
        },
        //是否走立即购买流程
        isBuyNow: function() {
            return location.href.indexOf('buy-now.html') > -1;
        },
        //获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return null;
        },
        //导航
        // showMenu : function(){
        //     new nav({
        //         clickBtn : '#jCategory',
        //         isShowCloud : false
        //     });
        // },
        //通用ajax,用于传递公用参数
        ajax: function(url, data, successFun, errorFun, $btn) {
            var self = this;
            var _data = self.o.data('OrderData');
            var deliveryType = _data ? _data.deliveryType : '';
            var _buyType = self.getUrlParam('source') ? self.getSourceBuyType() : self.getBuyType();
            var str = self.errorStr();
            //公用的data
            var publicData = {
                //memberId       : 194053,
                source: 'wap',
                //platformSource : 'pc',
                //getSourceBuyType
                buyType: _buyType
            };
            //第二次加载，就添加'deliveryType';
            if (_data) {
                publicData.deliveryType = deliveryType;
            }
            //
            io.jsonp(url, $.extend(publicData, data || {}),
                function(data) {
                    if (data.msg) {
                        self.dialog.tips({
                            cnt: data.msg,
                            time: 1000
                        });
                    }
                    if (data.data) {
                        data = data.data
                    };
                    successFun && successFun(data);
                }, function(data) {
                    var _code = data.error;
                    if (_code) {
                        if (_code < 1000) {
                            //提示登录
                            if (_code == -100) {
                                location.href = self.loginUrl + '?returnUrl=' + encodeURIComponent(self.pageUrl);
                            } else if (_code == 500) {
                                self.dialog.tips({
                                    cnt: data.msg,
                                    time: 1000
                                });
                            } else {
                                //$('#jNoData').html(str);
                            }
                        } else {
                            if (_code == '14001') {
                                location.href = BBG.URL.Cart.page;
                            } else if (_code == '15003') {
                                var $chk = $('.jAddrListItem [name=addressType]:checked');
                                var $p = $chk.closest('.jAddrListItem');
                                $p.attr('data-is-old', '1');
                                $p.find('.jOperEdit').click();
                            } else if (_code == '10015') {
                                self.dialog.tips(data.msg, function() {
                                    location.reload();
                                });
                            } else if (15200 < _code &&  _code < 15300) {
                                self.dialog.tips({
                                    cnt: data.msg,
                                    time: 1000
                                });
                                setTimeout(function() {
                                    location.reload();
                                }, 3000);
                            } else {
                                self.dialog.tips({
                                    cnt: data.msg,
                                    time: 1000
                                });
                            }
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
            var self = this;
            $('#goBack').attr({
                'href': BBG.URL.Cart.page
            });
            $('#goUc').attr({
                'href': BBG.URL.UC.page
            });
        },
        getSource: function() {
            var self = this;
            var _source = 'order';
            if (self.isBuyNow()) {
                _source = 'buy-now';
            } else if (self.isBuyAtOnce()) {
                _source = 'buy-at-once';
            };
            return _source;
        },
        //渲染结算模板
        renderModule: function(data) {
            var self = this;
            var isNoFirst = self.o.attr('data-is-first');
            //是否立即购买(isBuyNow:自提点流程; isBuyAtOnce:发货流程,不显示'返回购物车'按钮);
            $.extend(data, {
                _isBuyNow: self.isBuyNow(),
                _isBuyAtOnce: self.isBuyAtOnce(),
                _source: self.getSource()
            })
            if (!isNoFirst) {
                this.createMailModule(data)
            } else {
                this.createModule(data);
            }
        },
        //提取选中的自提点信息,用作地址;
        getSelectedZtdInfo: function(data) {
            var ztdArr = data['selfPoints'];
            var ztdStr = '';
            if (ztdArr && ztdArr.length != 0) {
                for (var i = 0; i < ztdArr.length; i++) {
                    if (ztdArr[i]['selected']) {
                        ztdStr = ztdArr[i]['name'];
                    }
                }
            }
            return ztdStr;
        },
        //创建主模块
        createMailModule: function(data) {
            var self = this;
            self.o.html(template.render(self.moduleId + 'Tmpl', data)).attr('data-is-first', '1');
        },
        //分模块渲染模板
        createModule: function(data) {
            var moduleArr = [
                    'jAddress', //收货地址
                    'jIdInfo', //实名认证
                    'jPayment', //支付方式
                    //'jInvoice',//发票信息---这是不会刷新的模块
                    'jList', //列表
                    // 'jListNoDel', //不在配送范围之内
                    'jPrice', //总价
                    'jSubmit' //提交
                ]
                //分模块渲染模板
            $(moduleArr).each(function(i, v) {
                $('#' + v).html(template.render(v + 'Tmpl', data));
            });
        },
        //刷新结算模板,包括js逻辑处理;
        refreshOrderModule: function(data, callback) {
            //缓存数据
            this.o.data('orderData', data);
            //是否空对象,null,false的判断;
            if (this.isEmptyObject(data) || data == null || !data) {
                return false;
            }
            //渲染模板
            this.renderModule(data);
            //折叠效果
            this.slideBox();
            //图片懒加载
            this.resetImageLoader();
            //替换url
            this.setUrl();
            //
            callback && callback(data);
            //添加placeholder效果
            //BBG.placeholder($('.jInput'), $('.jLabel'));
        },
        slideBox: function() {
            var self = this;
            self._slideBox();
            self.o.off('click.slideBox').on('click.slideBox', '.jTitleBox', function(e) {
                var txtAr = ['&#xe60c;', '&#xe60b;'];
                var $wrap = $(this).closest('.jWrapBox');
                var i = $(this).find('.jIconBox');
                var ctn = $wrap.find('.jCtnBox');
                var isShow = ctn.is(':visible');
                $(this)[(isShow ? 'remove' : 'add') + 'Class']('jTitleBoxHover');
                i.html(txtAr[isShow ? 0 : 1]);
                ctn[isShow ? 'hide' : 'show']();
            });
        },
        //是否显示下拉箭头
        _slideBox: function() {
            $('.jTitleBox').each(function() {
                var $wrap = $(this).closest('.jWrapBox');
                var i = $(this).find('.jIconBox');
                var ctn = $wrap.find('.jCtnBox');
                if (ctn.length == 0) {
                    i.hide();
                } else if (i.hasClass('jShoBox')) {
                    ctn.show();
                }
            });
        },
        //是否为空
        isEmptyObject: function(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },
        // 验证特殊字符
        isHasSpChar: function(val) {
            var reg = /[~#^$@%&!*'<>]/gi;
            return reg.test(val);
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
        //获取结算数据,并加载相应的js逻辑;
        getOrderData: function(data, callback) {
            var _self = this;
            var isRefresh = (_self.getUrlParam('isRefresh') == 1);
            // 未登陆状态
            if (!cookie('_nick')) {
                location.href = _self.loginUrl+ '?returnUrl=' + encodeURIComponent(self.pageUrl);
                return false;
            }
            _self.ajax(_self.url[isRefresh ? 'getRefresh' : 'getSettlementList'], data || {}, function(data) {
                _self.refreshOrderModule(data, callback);
                //callback && callback();
            });
        }
    }
    com.init();
    module.exports = com;
});
