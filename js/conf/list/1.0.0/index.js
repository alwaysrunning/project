define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var cart = require('module/add-to-cart/addcart');
    var io = require('common/kit/io/request');
    var Lazyload = require('common/widget/lazyload');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');
    var Dialog = require('common/ui/dialog/dialog');
    var goodsNotice = require('module/add-to-cart/goods-notice');
    var productInfo = require('module/common/productInfo');
    var search = require('module/search/search');
    var $_get = require('lib/core/1.0.0/utils/util').parseParams(location.search);

    var groupGoods = require('module/goods/group-goods');
    groupGoods.select('.group-goods', '.group-type-item', '.goods-item');


    require('common/ui/nav/back2top')();

    // search module
    search();

    //底部导航
    var nav = require('common/ui/nav/nav');
    new nav();

    // 修复微信浏览器下.page-view高度不够导致底部浮动菜单不显示的情况
    if ($('.page-view').height() < $(window).height()) {
        $('.page-view').height($(window).height());
    }

    //  加入购物车
    $('.goods-list').on('click', '.jAdd2Cart', function (e) {
        stop
        var _this = $(this);
        var id = _this.closest('.jProduct').attr('data-id');
        cart.addcart(id, '1', _this, function(){
            cart.getcart();
        });
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
        var url = _this.siblings('a[href]').attr('href');
        location.href = url;
    });

    //  到货通知
    goodsNotice('', '.jArrival');


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

    //  初始化懒加载
    new Lazyload('img.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url'
    });

    function initStreamPage(el){
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
            data.pageNo = n;
            data.page_type = 'search';
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

    //  choose show animate
    $('.jChooseShow').on('click', function () {
        window.location.hash = "filter";
        var div = $('.page-view');

        $('html').toggleClass(div.attr('data-animate'));

        window.onhashchange = function () {
            if (location.hash == "") {
                closeFilter();
            }
        };

        return false;
    });
    //  close choose
    function closeFilter() {
        var div = $('.page-view');
        $('html').removeClass(div.attr('data-animate'));
    }

    $('.choose .jClose').on('click', function () {
        window.history.back(-1);
    });

    //  toggle show and hide
    $('.choose dt').on('click', function () {
        var div = $(this).siblings('dd').find('ul');
        $(this).parent().toggleClass("choose-open");
        var li = div.find('li');

        if (div.height() === 0) {
            div.height(li.height() * li.length);
        } else {
            div.height(0);
        }
    });

    //  choose url
    (function () {
        //  base url
        var url = window.location.href.replace(/[?#].*?$/, '');

        //  clear all
        $('.jChooseClear').on('click', function () {
            $('.jCon').removeClass('active');
            $('[data-node-type=choose-pros]').text("");
            $('#jPriceFormLi').attr('data-value', '');
            $('#jConhs').attr('data-value', '3');
        });

        //  add condition
        $('.jCon').on('click', function () {
            var $this = $(this);
            var closestDl = $this.closest('dl');
            var closestDt = $this.closest('dt');
            $this.toggleClass('active');
            if (closestDl.find('dt').attr('data-type') === 'priceLeft,priceRight') {
                closestDl.find('.jCon').removeClass('active');
                $this.addClass('active');
            } else if (closestDt.attr('data-type') === 'hasStore') {
                if (closestDt.hasClass('active')) {
                    closestDt.attr('data-value', '1');
                } else {
                    closestDt.attr('data-value', '3');
                }
            }

            // 填充选中的属性数值
            var args = [];
            $this.parent().children('li').each(function (k, v) {
                if ($(v).hasClass("active")) {
                    args.push($(v).children("span").text());
                }
            });
            closestDl.find('dt [data-node-type=choose-pros]') ? closestDl.find('dt [data-node-type=choose-pros]').text(args.join(",")) : "";
        });

        // 输入价格区间
        var inputPriceStart = $('#jInputPriceStart'),
            inputPriceEnd = $('#jInputPriceEnd'),
            pricesHolder = $('#jPricesHolder'),
            priceFormLi = $('#jPriceFormLi');

        $('#jBtnConfirmPrices').on('click', function() {

            var priceStart  = parseInt(inputPriceStart.val() * 100),
                priceEnd    = parseInt(inputPriceEnd.val() * 100),
                priceStartT = (inputPriceStart.val() * 1).toFixed(2),
                priceEndT   = (inputPriceEnd.val() * 1).toFixed(2),
                args = [];

            priceStart > 9999900 && (priceStart = 9999900);
            priceEnd > 10000000 && (priceEnd = 10000000);

            priceStartT > 99999 && (priceStartT = 99999.00);
            priceEndT > 100000 && (priceEndT = 100000.00);

            if (priceStart >= 0 && priceEnd > 0 && priceEnd > priceStart) {
                $('.choose-l-r .jCon').removeClass('active');
                pricesHolder.text(priceStartT + '-' + priceEndT);
                priceFormLi.attr('data-value', priceStart + ',' + priceEnd).addClass('active');
            }

        });

        if ($_get['hasStore'] && $_get['hasStore'] == '1') {
            $('#jConhs').addClass('active').attr('data-value', '1');
        }

        if ($_get['priceLeft'] && $_get['priceRight']) {
            inputPriceStart.val(parseInt($_get['priceLeft'])/100);
            inputPriceEnd.val(parseInt($_get['priceRight'])/100);
            $('#jBtnConfirmPrices').trigger('click');
        }

        var o = urlArgument2Obj();

        //  commit
        $('.jChooseCommit').on('click', function () {
            $('._wap-choose dt').each(function (i) {
                var a = $(this).attr('data-type') ? $(this).attr('data-type').split(',') : [];
                for (var i = 0, len = a.length; i < len; i = i + 1) {
                    if (o.hasOwnProperty(a[i])) {
                        delete o[a[i]];
                    }
                }
            });

            var s = '',
                key = '',
                value = '';

            $('._wap-choose dl').each(function (i) {
                //  是否有货
                if (i === 0) {
                    key = $(this).find('dt').attr('data-type');
                    value = $(this).find('dt').attr('data-value');

                    //  一般情况
                } else {
                    key = $(this).find('dt').attr('data-type');
                    value = '';
                    $(this).find('dd ul .active').each(function (idx) {
                        if (idx !== 0) {
                            value += '|';
                        }
                        value += $(this).attr('data-value');
                    });
                }

                if (value !== '') {
                    //  拆分价格
                    if (key === 'priceLeft,priceRight') {
                        o[key.split(',')[0]] = value.split(',')[0];
                        o[key.split(',')[1]] = value.split(',')[1];
                    } else if (o.hasOwnProperty(key)) {
                        o[key] += '_' + value;
                    } else {
                        o[key] = value;
                    }
                }
            });

            for (var p in o) {
                s += '&' + p + '=' + encodeURIComponent(o[p]);
            }
            window.location.href = url + s.replace('&', '?');
        });
    } ());

});
