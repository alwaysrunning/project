/**
 * @author	taotao
 * @date    2016-02-29
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var cookie = require('lib/core/1.0.0/io/cookie');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');
    var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
    var countDown = require('lib/gallery/countdown/1.0.0/countdown');
    var DateTime = require('lib/gallery/datetime/1.0.0/datetime');
    var Slider = require('lib/ui/slider/3.0.4/slider');
    var cart = require('module/add-to-cart/addcart');
    var txtPromote = require('module/label/promote');


    //  回到顶部
    require('common/ui/nav/back2top')();
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');

    //  地址选择
    //  用户没有cookie，从后台获取地址填充到相关地方
    var provinceHdl = $('.jProvince');
    if (!cookie('_address')) {
        io.jsonp('http://www.yunhou.com/api/getUserRegion', {
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

    //底部导航
    var nav = require('common/ui/nav/nav');
    new nav();


    // var context = require('lib/gallery/context/1.0.0/context');
    // var urlCtx = context.resolveUrl('api.mall', '/Widgets/widgetget');
    var urlCtx = '//api.mall.yunhou.com/Widgets/widgetget';

    //  直接从接口获取数据。因为数据需要和地址绑定
    var pageWidgetId = $('.page-view-body').attr('data-widget');
    io.jsonp(urlCtx,{
        'method':'getWidgetData',
        'activeId': pageWidgetId
    } , function (res) {
        if (!!res.data && !!res.data.pageinfo) {
            createHtml(res.data.pageinfo);
        }
    });

    var createHtml = function(res) {

        var str = '';
        var i = 0, j = 0;
        var len = 0, length = 0;

        //  slider
        if (res.slid && res.slid.length > 0) {
            var slidArr = res.slid;
            str += '<div class="mod-slider"><div id="slides" class="ui-slider">';

            for (i = 0, len = slidArr.length; i < len; i = i + 1) {
                str += '<a href="' + slidArr[i].adUrl + '" data-bpm="7.' + res.mark + '_slid' + '.1.' + i + '.0.0"' + '>';
                if (i===0) {
                    str += '<img src="' + slidArr[i].ad_img + '" alt="" class="jSliderImg">';
                } else {
                    str += '<img src="//s3.bbgstatic.com/pub/img/blank.gif" data-url="' + slidArr[i].ad_img + '" alt="" class="jSliderImg img-error">';
                }
                str += '</a>';
            }
            str += '</div></div>';
        }

        //  ms
        if (res.secKillProducts && res.secKillProducts.length > 0 ) {
            var msArr = res.secKillProducts;
            str +=  '<div class="mod-floor mod-common mod-port-ms"><div class="mod-hd"> </div><div class="mod-bd">';
            for (i = 0, len = msArr.length; i < len; i = i + 1) {
                str += '<div class="mod-item jProductItem" data-id="' + msArr[i].product_id + '">';
                str += '<a href="/item/' + msArr[i].product_id + '.html"' + ' data-bpm="4.' + res.mark + '_secKillProducts' + '.1.' + i + '.0.' + msArr[i].product_id + '"' + '>';
                str += '<img src="//s3.bbgstatic.com/pub/img/blank.gif" data-url="' + msArr[i].detailInfo.imgSrc + '" class="jImg gd-img img-error" />';
                str += '<div class="gd-tag"></div>';
                str += '<div class="gd-labels"></div>';
                str += '<div class="gd-info">';
                str += '<div class="gd-name">';
                str += '<div class="title">' + msArr[i].detailInfo.productName + '</div>';
                str += '</div>';
                str += '<div class="gd-price">';
                str += '<div class="gd-price-now"><em>￥</em>' + msArr[i].detailInfo.saleprice + '</div>';
                str += '<div class="gd-price-ori"><em>￥</em>' + msArr[i].detailInfo.mktprice + '</div>';
                str += '</div>';
                str += '';
                str += '<div class="gd-countdown">';
                str += '<div class="txt"></div>';
                str += '<div class="date jCountTime" data-endtime="' + msArr[i].end_time + '000" data-starttime="' + msArr[i].start_time + '000"></div>';
                str += '</div>';
                str += '</div>';
                str += '</a>';
                str += '<div class="gd-cmd ' + (msArr[i].detailInfo.isbuynow === '1'? 'jBuyNow' : 'jAdd2Cart') + '"' + ' data-bpm="3.' + res.mark + '_secKillProducts' + '.1.' + i + '.0.' + msArr[i].product_id + '"' + '>';
                str += '<i class="iconglobal">' + (msArr[i].detailInfo.isbuynow === '1'? '&#xe612;' : '&#xe603;')  + '</i>';
                str += '</div>';
                str += '</div>';
            }
            str += '</div></div>';
        }


        //  组合栏目——布局3
        if (res.combineColumnThree && res.combineColumnThree.length > 0) {
            var cThree = res.combineColumnThree;
            for (j = 0, length = cThree.length; j < length; j = j + 1) {
                var col = cThree[j];

                str += '<div class="mod-floor mod-banner">';
                str += '<div class="mod-hd">' + col.name + '</div>';
                str += '<div class="mod-bd">';
                str += '<div class="banner-img-3">';
                for (i = 0, len = col.columns.length; i < len; i = i + 1) {
                    var item = col.columns[i];
                    str += '<a href="' + item.adUrl + '"' + ' data-bpm="7.' + res.mark + '_combineColumnThree' + '.1.' + i + '.0.0"' + '>';
                    str += '<img data-url="' + item.img + '" src="//s3.bbgstatic.com/pub/img/blank.gif" class="jImg img-error">';
                    str += '</a>';
                }
                str += '</div></div></div>';
            }
        }

        //  单品栏目一
        if (res.productOne && res.productOne.length > 0 ) {
            var cA = res.productOne;
            str += '<div class="mod-floor mod-common">';
            str += '<div class="mod-hd">' + res.productOneTitle + '</div>';
            str += '<div class="mod-bd">';
            for (i = 0, len = cA.length; i < len; i = i + 1) {
                var item = cA[i];
                str += '<div class="mod-img-item jProductItem" data-id="' + item.product_id + '">';
                str += '<a href="/item/' + item.product_id + '.html"' + ' data-bpm="4.' + res.mark + '_productOne' + '.1.' + i + '.0.' + item.product_id + '"' + '>';
                str += '<img src="//s3.bbgstatic.com/pub/img/blank.gif" data-url="' + item.img + '" class="jImg gd-img img-error" />';
                str += '<div class="gd-tag"></div>';
                str += '<div class="gd-labels"></div>';
                str += '</a>';
                str += '<div class="gd-cmd jAdd2Cart" data-id="' + item.product_id + '"' + ' data-bpm="3.' + res.mark + '_productOne' + '.1.' + i + '.0.' + item.product_id + '"' + '>';
                str += '<i class="iconglobal">&#xe603;</i>';
                str += '</div>';
                str += '</div>';
            }
            str += '</div></div>';
        }

        //  组合栏目——布局1
        if (res.combineColumnOne && res.combineColumnOne.length > 0) {
            var cOne = res.combineColumnOne;
            for (i = 0, len = cOne.length; i < len; i = i + 1) {
                var colOne = cOne[i].columns;

                str += '<div class="mod-floor mod-img-3">';
                str += '<div class="mod-hd">' + cOne[i].name + '</div>';
                str += '<div class="mod-bd">';

                str += '<div class="img-1">';
                str += '<a href="' + colOne[0].adUrl + '"' + ' data-bpm="7.' + res.mark + '_combineColumnOne' + '.1.0' + '.0.0"' + '>';
                str += '<img data-url="' + colOne[0].img + '" src="//s3.bbgstatic.com/pub/img/blank.gif" class="jImg img-error">';
                str += '</a>';
                str += '</div>';

                str += '<div class="img-2">';
                str += '<a href="' + colOne[1].adUrl + '"' + ' data-bpm="7.' + res.mark + '_combineColumnOne' + '.1.1' + '.0.0"' + '>';
                str += '<img data-url="' + colOne[1].img + '" src="//s3.bbgstatic.com/pub/img/blank.gif" class="jImg img-error">';
                str += '</a>';

                str += '<a href="' + colOne[2].adUrl + '"' + ' data-bpm="7.' + res.mark + '_combineColumnOne' + '.1.2' + '.0.0"' + '>';
                str += '<img data-url="' + colOne[2].img + '" src="//s3.bbgstatic.com/pub/img/blank.gif" class="jImg img-error">';
                str += '</a>';
                str += '</div>';
                str += '</div>';
                str += '</div>';
            }
        }

        //  组合栏目——布局2
        if (res.combineColumnTow && res.combineColumnTow.length > 0) {
            var cTwo = res.combineColumnTow;
            for (i = 0, len = cTwo.length; i < len; i = i + 1) {
                var colTwo = cTwo[i].columns;
                str += '<div class="mod-floor mod-img-3">';
                str += '<div class="mod-hd">' + cTwo[i].name + '</div>';
                str += '<div class="mod-bd revert">';

                str += '<div class="img-1">';
                str += '<a href="' + colTwo[2].adUrl + '"' + ' data-bpm="7.' + res.mark + '_combineColumnTow' + '.1.2' + '.0.0"' +'>';
                str += '<img data-url="' + colTwo[2].img + '" src="//s3.bbgstatic.com/pub/img/blank.gif" class="jImg img-error">';
                str += '</a>';
                str += '</div>';

                str += '<div class="img-2">';
                str += '<a href="' + colTwo[1].adUrl + '"' + ' data-bpm="7.' + res.mark + '_combineColumnTow' + '.1.1' + '.0.0"' + '>';
                str += '<img data-url="' + colTwo[1].img + '" src="//s3.bbgstatic.com/pub/img/blank.gif" class="jImg img-error">';
                str += '</a>';

                str += '<a href="' + colTwo[0].adUrl + '"' + ' data-bpm="7.' + res.mark + '_combineColumnTow' + '.1.0' + '.0.0"' + '>';
                str += '<img data-url="' + colTwo[0].img + '" src="//s3.bbgstatic.com/pub/img/blank.gif" class="jImg img-error">';
                str += '</a>';
                str += '</div>';
                str += '</div>';
                str += '</div>';
            }
        }

        //  菜谱栏目
        if (res.cookbookColumn && res.cookbookColumn.length) {
            var recipeArr = res.cookbookColumn;
            for (i = 0, len = recipeArr.length; i < len; i = i + 1) {
                var recipe = recipeArr[i];

                str += '<div class="mod-floor mod-img-3">';
                str += '<div class="mod-hd">' + recipe.name + '</div>';
                str += '<div class="mod-bd">';
                str += '<div class="list">';

                for (j = 0, length = recipe.columns.length; j < length; j = j + 1) {
                    var item = recipe.columns[j];
                    str += '<a href="' + item.adUrl + '"' + ' data-bpm="7.' + res.mark + '_cookbookColumn' + '.1.' + j + '.0.0"' + '>';
                    str += '<img src="//s3.bbgstatic.com/pub/img/blank.gif" data-url="' + item.img + '" class="jImg img-error" />';
                    str += '</a>';
                }
                str += '</div>';
                str += '</div>';
                str += '</div>';
            }
        }

        //  单品栏目二
        str += '<div class="mod-floor mod-common" data-mark="' + res.mark + '" data-active-id="' + pageWidgetId + '">';
        str += '<div class="mod-hd">' + (res.productTwoTitle ? res.productTwoTitle: '') + '</div>';
        str += '<div class="mod-bd" >';
        str += '<div class="jPage" data-page="1"><div class="loading">正在加载，请稍后...</div></div>';
        str += '</div>';
        str += '</div>';

        $('.page-view-body').append(str);
        eventInit();
    };

    var eventInit = function() {

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

        if ($('#slides').length > 0) {
            var slider = new Slider('#slides', {
                width: 750,
                height: 380,
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
        }

        DateTime.getServerTime(function(now) {
            $('.mod-port-ms .jProductItem').each(function(idx) {
                var item = $(this);
                var stime = item.find('.jCountTime').attr('data-starttime');
                var etime = item.find('.jCountTime').attr('data-endtime');

                //  before start
                if (stime > now) {
                    item.find('.gd-countdown .txt').html(dateChange(stime));

                    // start and don't end
                } else if (etime > now) {
                    item.find('.gd-countdown .txt').html('距结束:');

                    countDown({
                        targetTime     : etime,
                        timeText       : [':', ':', ':', '', ''],
                        container      : item.find('.jCountTime'),
                        isShowTimeText : true,
                        type : {
                            'd' : false,
                            'h' : true,
                            'm' : true,
                            's' : true,
                            'ms' : false
                        },
                        callback: function() {
                            item.remove();
                            imageLazyLoader.update();
                            if ($('.mod-port-ms .jProductItem').length === 0 ) {
                                $('.mod-port-ms').remove();
                            }
                        }
                    });

                    // end
                } else {
                    item.remove();
                    imageLazyLoader.update();
                    if ($('.mod-port-ms .jProductItem').length === 0 ) {
                        $('.mod-port-ms').remove();
                    }
                }
            });
        });

        //  海外
        initStreamPage($('.page-view-body'));

        //  精选商品懒加载
        var activeId = $('.jPage').parent().parent().attr('data-active-id');
        var mark = $('.jPage').parent().parent().attr('data-mark');

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
                if (data) {
                    return renderList(data, mark);
                }
            },
            load: function(el) {
                initStreamPage(el);
            },
            noAnyMore: '<div class="loading">sorry,已经没有下一页了...</div>'
        });
    };

    var dateChange = function(time) {
        var d = new Date(+time);

        var dStr = (d.getMonth() + 1) + '月' + d.getDate() + '日 ' +
                   ('0' + d.getHours()).slice(-2) +
                   ':' +
                   ('0' + d.getMinutes()).slice(-2) + '开始';
        return dStr;
    };

    var renderList = function(data, mark) {
        var str = '';

        for (var i = 0, len = data.length; i < len; i = i + 1) {
            str += ['<div class="mod-img-item jProductItem" data-id="' + data[i].product_id + '">',
                '<a data-bpm="4.' + mark + '_generalProduct.1.' + i + '.0.' + data[i].product_id + '" href="//m.yunhou.com/item/' + data[i].product_id + '.html">',
                '<img src="//s3.bbgstatic.com/pub/img/blank.gif" data-url="' + data[i].img + '" class="jImg gd-img img-error" />',
                '<div class="gd-tag"></div>',
                '<div class="gd-labels"></div>',
                '<div class="gd-info">',
                '<div class="gd-name">',
                '<div class="title">' + data[i].product_name + '</div>',
                '</div>',
                '<div class="gd-price">',
                '<div class="gd-price-now"><em>￥' + data[i].saleprice + '</em></div>',
                '<div class="gd-price-ori"><em>￥' + data[i].mktprice + '</em></div>',
                '</div>',
                '</div>',
                '</a>',
                '<div class="gd-cmd ' + (data[i].isbuynow === '1' ? 'jBuyNow' : 'jAdd2Cart') + '" data-bpm="3.' + mark + '_generalProduct.1.' + i + '.0.' + data[i].product_id + '" data-id="' + data[i].product_id + '">',
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
            productItem.on('click', '.jBuyNow', function () {
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
});
