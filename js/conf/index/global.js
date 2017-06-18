/**
 * @author	taotao
 * @date    2015-08-19
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');
    var cookie = require('common/kit/io/cookie');
    var io = require('common/kit/io/request');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');

    //  地址选择
    //  用户没有cookie，从后台获取地址填充到相关地方
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');
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
    if($('.jSliderImg').length > 1) {
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
            },
            callback:{
                start:function(index){
                },
                loaded : function(){
                }
            }
        });
    } else {
        var el = $('.jSliderImg').eq(0);
        var src = el.attr('data-url');
        sliderImgLoad(src,el);
        $('#slides').addClass('ui-slider-one');
    }

    function sliderImgLoad(src,el) {
        if (isImgUrl(src)) {
            var objImg = new Image();
            objImg.src = src;
            if (objImg.complete) {
                el.attr('src',src).removeClass('img-error').removeAttr('data-url');
            } else {
                objImg.onload = function() {
                    el.attr('src',src).removeClass('img-error').removeAttr('data-url');
                };
            }
        }
    }

    function isImgUrl(str) {
        return (/^((https?|ftp|rmtp|mms):)?\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(str);
    }

    var Lazyload = require('common/widget/lazyload');

    var imageLazyLoader = null;
    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
            imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
            effect: 'fadeIn',
            dataAttribute: 'url',
            load : function(self){
                if($(self).hasClass('img-error')){
                    $(self).removeClass('img-error').removeAttr('data-url');
                }
            }
        });
        return imageLazyLoader;
    };

    resetImageLoader();


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


    //  秒杀模块
    require('module/global/miaosha');


    //  加入购物车等操作
    var cart = require('module/add-to-cart/addcart');
    $('.jProductItem').find('.jAdd2Cart').on('click', function () {
        var _this = $(this);
        var id = _this.parents('.jProductItem').attr('data-id');
        cart.addcart(id, '1', _this);
    });

    // 立即购买
    $('.jProductItem').find('.jBuyNow').on('click', function () {
        var _this = $(this);
        var id = _this.parents('.jProductItem').attr('data-id');
        cart.buyNow(id, '1', _this);
    });


    // 判断商品库存
    var productIdData = {
        productid_str: ''
    };
    $('.jProductItem').each(function() {
        var id = $(this).data('id') || '';
        productIdData.productid_str += ',' +  id;
    });
    productIdData.productid_str = productIdData.productid_str.replace(/^,/, '');
    io.get('/Promotion/productInfo', productIdData, function (data) {
        for (var i = 0, len = data.length; i < len; i = i + 1) {
            if (data[i].store < 1 ) {
                var hdl = $('.jProductItem[data-id="'+ data[i].productId +'"]');
                hdl.find('.jAdd2Cart').addClass('btn-disable').removeClass('jAdd2Cart').unbind('click');
            }
        }
    });

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

            //  查询营销价格
            var autoload = {
                productid_str: ''
            };
            productItem.each(function() {
                var id = $(this).data('id') || '';
                autoload.productid_str += ',' +  id;
            });
            autoload.productid_str = autoload.productid_str.replace(/^,/, '');
            io.get('/Promotion/productInfo', autoload, function (data) {
                for (var i = 0, len = data.length; i < len; i = i + 1) {
                    if (!!data[i].price && !!data[i].price.Mprice) {
                        var item = $(el).find('[data-id="' + data[i].productId + '"]');
                        item.find('.gd-price-now').html('<em>¥</em>' + data[i].price.Mprice);
                    }
                }
            });
        }
    }

    var activeId = $('.jPage').parent().parent().attr('data-active-id');

    //  精选商品懒加载
    var lazyMore = new LazyStream('.jPage', {
        plUrl: 'http://api.mall.yunhou.com/Widgets/widgetget?method=get_more_product&activeId=' + activeId,
        paramFormater: function(n) {
            return { param: JSON.stringify({p: n}) };
        },
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
        load: function(el) {
            initStreamPage(el);
        },
        noAnyMore: '<div class="loading">sorry,已经没有下一页了...</div>'
    });


    //  app download banner
    (function() {
        var show = function() {
            if ($('.down-app').length > 0) {
                $('body').addClass('_downloadBanner');
            }
        };
        var close = function() {
            $('body').removeClass('_downloadBanner');
        };
        $('.down-app').on('click', '.banner-close', function() {
            $(this).closest('.down-app').remove();
            close();
        });
        show();
    })();
});
