/**
 * @author	taotao
 * @date    2016-02-29
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');
    var cookie = require('common/kit/io/cookie');
    var io = require('common/kit/io/request');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');
    var Lazyload = require('common/widget/lazyload');
    var countDown = require('common/ui/countdown/countdown');
    var txtPromote = require('module/label/promote');


    //  image lazy loader
    var imageLazyLoader = new Lazyload('img.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url',
        load : function(self){
            if($(self).hasClass('img-error')){
                $(self).removeClass('img-error').removeAttr('data-url');
            }
        }
    });


    //  地址选择
    //  用户没有cookie，从后台获取地址填充到相关地方
    var provinceHdl = $('.jProvince');
    if (!cookie('_address')) {
        io.jsonp('http://www.yunhou.com/api/getUserRegion',{
            action: 'get_def_area',
            platform: 'js'
        }, function(data) {
            cookie('_address', data, {
                path: '/',
                domain: 'yunhou.com'
            });
            provinceHdl.text(cookie('_address').split(':')[0].split('_')[0]);
        });

    } else {
        provinceHdl.text(cookie('_address').split(':')[0].split('_')[0]);
    }

    provinceHdl.click(function() {
        linkageTab({
            lastChangeCallBack : function(){
                $('html').removeClass('freez-page');
                location.reload();
            },
            onShow : function(){
                $('html').addClass('freez-page');
            },
            onHide : function(){
                $('html').removeClass('freez-page');
            }
        });
    });

    //  搜索组件
    var search = require('module/search/search');
    new search({
        ctx: '.jHeaderSearch'
    });


    //  回到顶部
    require('common/ui/nav/back2top')();


    //底部导航
    var nav = require('common/ui/nav/nav');
    new nav();

    //  滚图
    var Slider = require('lib/ui/slider/3.0.4/slider');
    var slider = new Slider('#slides', {
        width: 750,
        height: 310,
        lazyLoad: {
            attr: 'data-url',
            loadingClass: 'img-error'
        },
        play: {
            auto: true,
            interval: 4000,
            swap: true,
            pauseOnHover: true,
            restartDelay: 2500
        }
    });



    //  通知栏
    (function() {
        var topNotice    = $('.jTopNotice a'),
            topNoticeIdx = 0;

        setInterval(function() {
            topNotice.css({
                display: 'none'
            });
            topNoticeIdx = ((topNoticeIdx + 1) % topNotice.length);
            topNotice.eq(topNoticeIdx).css({
                display: 'block'
            });
        }, 5000);
    }());


    //  miaosha port
    var msPort = $('[node-type="ms-port"]');


    var dateChange = function(time) {
        var n = new Date();
        var d = new Date(+time);

        var dStr = '';

        var now = Math.floor((+n + 8 * 1000 * 3600)/86400000);
        var day = Math.floor((+time + 8 * 1000 * 3600)/86400000);

        if (now === day) {
            dStr = '今天';

        } else if (now + 1 === day) {
            dStr = '明天';
        } else {
            dStr = (d.getMonth() + 1) + '-' + d.getDate();
        }

        return dStr;
    };

    //  in countdown
    var time = msPort.find('[data-type="next"]').attr('data-time');
    var d = new Date(+time);
    var dStr = '';
    if (msPort.find('.ms-info-now').length > 0) {

        //  if not today or yesterday, hide the tips
        //  the reg return true, hide
        if (!/^[0-9]/.test(dateChange(time))) {

            dStr = '<span>下一场</span> ' + dateChange(time) + ' <span class="red">' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2) + '</span>';
            msPort.find('.next').css({
                'display': 'block'
            });
            msPort.find('.next').html(dStr);
        }

        var endTime = msPort.find('.date').attr('data-endtime');

        countDown({
            targetTime     : endTime,
            timeText       : [':', ':', ':', '', ''],
            container      : msPort.find('.jCountTime'),
            isShowTimeText : true,
            type : {
                'd' : false,
                'h' : true,
                'm' : true,
                's' : true,
                'ms' : false
            },
            afterGetTime: function() {
                var aniClass = msPort.find('.date').attr('data-animate');
                msPort.find('.date').addClass(aniClass);
            }
        });


        //  follow time
    } else {
        dStr = dateChange(time) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
        msPort.find('.date').html(dStr);
    }



    //  加入购物车等操作
    var cart = require('module/add-to-cart/addcart');


    var renderList = function(data) {
        var str = '';

        for (var i = 0, len = data.length; i < len; i = i + 1) {
            str += ['<div class="mod-item jProductItem" data-id="' + data[i].productId + '">',
                '<a data-bpm="4.recommend_generalProduct.1.' + i + '.0.0" href="//m.yunhou.com/item/' + data[i].productId + '.html">',
                '<img src="//s3.bbgstatic.com/pub/img/blank.gif" data-url="' + data[i].img + '" class="jImg gd-img img-error" />',
                '<div class="gd-tag"></div>',
                '<div class="gd-labels"></div>',
                '<div class="gd-info">',
                '<div class="gd-name">',
                '<div class="title">' + data[i].productName + '</div>',
                '</div>',
                '<div class="gd-price">',
                '<div class="gd-price-now"><em>￥' + data[i].saleprice + '</em></div>',
                '<div class="gd-price-ori"><em>￥' + data[i].mktprice + '</em></div>',
                '</div>',
                '</div>',
                '</a>',
                '<div class="gd-cmd ' + (data[i].isbuynow === '1' ? 'jBuyNow' : 'jAdd2Cart') + '" data-bpm="4.recommend_generalProduct.1.' + i + '.0.' + data[i].productId + '" data-id="' + data[i].productId + '">',
                '<i class="iconglobal">' + (data[i].isbuynow === '1' ? '&#xe612;' : '&#xe603;') + '</i>',
                '</div>',
                '</div>'].join('');
        }
        return str;
    };


    function initStreamPage(el) {
        var productItem = $(el).find('.jProductItem');

        if (productItem.length > 0) {
            //  image lazy loading
            new Lazyload(productItem.find('img.jImg'), {
                effect: 'fadeIn',
                dataAttribute: 'url',
                load : function(self){
                    if($(self).hasClass('img-error')){
                        $(self).removeClass('img-error').removeAttr('data-url');
                    }
                }
            });

            //  绑定按钮事件
            productItem.on('click', '.jAdd2Cart', function () {
                var _this = $(this);
                var id = _this.parents('.jProductItem').attr('data-id');
                cart.addcart(id, '1', _this);
            });

            // 立即购买
            productItem.find('.jBuyNow').on('click', function () {
                var _this = $(this);
                var id = _this.parents('.jProductItem').attr('data-id');
                cart.buyNow(id, '1', _this);
            });


            //  查询营销价格
            var autoload = {
                productIds: '',
                valueTypes: 'hasStore,price,downTag,umpTags,productLabels'
            };
            productItem.each(function() {
                var id = $(this).data('id') || '';
                autoload.productIds += ',' +  id;
            });
            autoload.productIds = autoload.productIds.replace(/^,/, '');
            io.jsonp('//api.mall.yunhou.com/Product/productInfoOtherForValues', autoload, function (res) {
                var data = res.data.products;
                for (var i = 0, len = data.length; i < len; i = i + 1) {
                    var item = $(el).find('[data-id="' + data[i].id + '"]');

                    item.find('.gd-price-now').html('<em>¥</em>' + data[i].price);

                    if (!data[i].hasStore) {
                        item.find('.gd-tag').css({
                            display: 'block'
                        });
                        item.find('.gd-cmd').addClass('btn-disable');
                        item.find('.gd-cmd').removeClass('jAdd2Cart');
                        item.find('.gd-cmd').removeClass('jBuyNow');
                    }
                    if (!!data[i].umpTags) {
                        item.find('.gd-labels').css({
                            display: 'block'
                        });
                        txtPromote.decorate(item.find('.gd-labels'), data[i].umpTags[0]);
                    }
                }
            });
        }
    }



    //  海外
    initStreamPage($('[data-floor="top"]'));


    //  精选商品懒加载
    var activeId = $('.jPage').parent().parent().attr('data-active-id');
    var lazyMore = new LazyStream('.jPage', {
        plUrl: 'http://api.mall.yunhou.com/Widgets/widgetget?method=getMoreProduct&activeId=' + activeId,
        paramFormater: function(n) {
            return { param: JSON.stringify({p: n}) };
        },
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
        dataFilter: function(el) {
            var data = el.data;
            if (data && data.tabContent && data.tabContent.generalProduct && data.tabContent.generalProduct.list) {
                return renderList(data.tabContent.generalProduct.list);
            }
        },
        load: function(el) {
            initStreamPage(el);
        },
        noAnyMore: '<div class="loading">sorry,已经没有下一页了...</div>'
    });

});
