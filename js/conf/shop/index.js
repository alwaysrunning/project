define(function (require) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cart = require('module/add-to-cart/addcart');
    var Dialog = require('common/ui/dialog/dialog');
    var productInfo = require('module/common/productInfo');
    var Lazyload = require('common/widget/lazyload');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');

    var groupGoods = require('module/goods/group-goods');
    groupGoods.select('.group-goods', '.group-type-item', '.goods-item');

    var search = require('module/search/search');
    new search({
        ctx: ".jSearch"
    });

    //  回到顶部
    require('common/ui/nav/back2top')();

    //  底部悬挂
    // require('common/ui/nav/fix-nav')();//底部导航
    var nav = require('common/ui/nav/nav');
    new nav();


    //  到货通知
    var goodsNotice = require('module/add-to-cart/goods-notice');
    goodsNotice('', '.jArrival');


    //  店铺分类筛选
    var Menu = require('common/ui/menu/menu_search');
    var url = '/html/demo/api/catalogue.php';
    var shop = $('#jShopClassify');
    var shopId = shop.attr('data-shop');
    Menu('#jShopClassify', 'http://m.yunhou.com/shop/category/', { "data": { "shopId": shopId } });

    // 清除输入框
    var searchKeyText = $('#jSearchKeyText');
    $('#jClearInput').on('click', function(){
        searchKeyText.val('');
    });


    //懒加载
    var imageLazyLoader = null;
    var resetImageLoader = function () {
        if (imageLazyLoader) {
            imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
            effect: 'fadeIn',
            dataAttribute: 'url',
            load: function (self) {
                if ($(self).hasClass('img-error')) {
                    $(self).removeClass('img-error');
                }
            }
        });
        return imageLazyLoader;
    };

    resetImageLoader();


    //收藏店铺
    var collection = $('#jCollection');
    collection.click(function () {

        if ($(this).hasClass('ui-button-disabled')) {
            return false;
        }

        if (collection.hasClass('span-color')) {
            $('#jCollection i').html('&#xe603');
            collection.removeClass('span-color');
            var data = {
                'callback': 'callback',
                'id': $(this).attr('data-shopid'),
                'favoriteType': '2'
            };
            io.jsonp('/member/collection_cancle', data, function (data) {

                Dialog.tips(data.msg);

            }, function (e) {
                if (e.error == -100) {
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function () {
                        window.location.href = "https://ssl.yunhou.com/passport/h5/login?returnUrl=" + encodeURIComponent(window.location.href);
                    });

                } else {
                    Dialog.tips(e.msg);
                }

            }, collection);

        } else {
            $('#jCollection i').html('&#xe603');
            collection.addClass('span-color');
            var data = {
                'callback': 'callback',
                'id': $(this).attr('data-shopid'),
                'favoriteType': '2'
            };
            io.jsonp('/member/collection_add', data, function () {
                Dialog.tips('收藏成功');
            }, function (e) {
                if (e.error == -100) {
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function () {
                        window.location.href = "https://ssl.yunhou.com/passport/h5/login?returnUrl=" + encodeURIComponent(window.location.href);
                    });
                }
                else {
                    Dialog.tips(e.msg);
                }
            }, collection);
        }
    });




    var urlArgument2Obj = function () {
        var o = {},
            urlA = window.location.search.replace(/^[?]/, '').split('&'),
            key = '',
            value = '';

        for (var ia = 0, len = urlA.length; ia < len; ia = ia + 1) {
            if (urlA[ia] !== '') {
                key = urlA[ia].split('=')[0];
                value = urlA[ia].split('=')[1];
                o[key] = decodeURIComponent(value);
            }
        }
        return o;
    };

    //  加入购物车
    $('.goods-list').on('click', '.jAdd2Cart', function () {
        var _this = $(this);
        var id = _this.closest('.jProduct').attr('data-id');
        cart.addcart(id, '1', _this);
    });
    // 立即购买
    $('.goods-list').on('click', '.jBuyNow', function () {
        var _this = $(this);
        var id = _this.closest('.jProduct').attr('data-id');
        cart.buyNow(id, '1', _this);
    });
    // 团购预售
    $('.goods-list').on('click', '.jHref', function () {
        var _this = $(this);
        var url = _this.siblings("a[href]").attr("href");
        location.href = url;
    });

    function initStreamPage(el) {
        var dataid = $(el).find('.jProduct');
        if (dataid.length > 0) {

            var ayId = [];
            for (var i = 0; i < dataid.length; i++) {
                ayId.push(dataid.eq(i).attr('data-id'));
            }
            var opt = {
                data: {
                    'productid_str': '' + ayId + ''
                },
                el: el
            };
            productInfo.sync(opt);
            groupGoods.select($(el).find('.group-goods'), '.group-type-item', '.goods-item');
        }
    }

    var lazyMore = new LazyStream('.jPage', {
        plUrl: '/Search/get_page_data',
        paramFormater: function(n) {
            var data = {};
            data = urlArgument2Obj();
            //data.shopCategory = data.shopCategory;
            data.pageNo = n;
            data.page_type = 'shop';
            data.shopIds = shopId;
            return data;
        },
        page:2,
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
        load: function(el) {
            initStreamPage(el);
        },
        noAnyMore:'<div class="loading">sorry,已经没有下一页了...</div>'
    });

    //营销数据
    var dataid = $('[data-page="1"] .jProduct'),
        ayId = [];
    for (var i = 0; i < dataid.length; i++) {
        ayId.push(dataid.eq(i).attr('data-id'));
    }

    var opt = {
        data: {
            'productid_str': '' + ayId + ''
        },
        el: null
    };
    productInfo.sync(opt);
});
