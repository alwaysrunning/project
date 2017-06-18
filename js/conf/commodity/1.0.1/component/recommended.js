/**
 * @author	taotao
 * @desc    basic component
 * @daet    2016-03-09
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');
    var Slider = require('lib/ui/slider/3.0.4/slider');
    var io = require('lib/core/1.0.0/io/request');


    //获取推荐商品
    $('#jViewDetail').attr('href', 'javascript:;').before([
        '<div class="mod-recommended-items-wrap" id="jRecommendItems">',
        '<h5 class="mod-title">看了又看</h5>',
        '<div class="recommended-items" id="jRcmdItemsScroller">',
        '<div class="recommended-items-inner" id="jRcmdItems">',
        '</div>',
        '</div>',
        '</div>'
    ].join(''));
    var rcmdItemsWrap = $('#jRecommendItems');
    var rcmdItems = $('#jRcmdItems');
    var rcmdItemsURL = '//m.yunhou.com/item/ajaxGetRecommend';
    io.jsonp(rcmdItemsURL, {
        'product_id' : gProductId
    }, function(data) {
        var _rcmdHTML = '<div class="rmcd-item-slider" id="jRcmdItemsSlider"><div class="rmcd-slide-item">';
        // var _imgHeight = 0;
        if (data instanceof Array && data.length) {
            data.forEach(function(item, index) {
                _rcmdHTML += [
                    '<a href="' + item.url + '" class="recommended-item" data-bpm="8.1.1.' + (index * 1 + 1) + '.0.' + item.product_id + '">',
                    '<img class="jImg img-error" data-url="' + item.image + '" src="" alt="">',
                    '<h5 class="caption">' + item.title + '</h5>',
                    '<span class="price-pri">￥' + item.price + '</span>',
                    '<span class="price-mkt">' + ((item.mktprice * 1 > item.price * 1) ? '<em>￥' + item.mktprice + '</em>' : '&nbsp;&nbsp;&nbsp;') + '</span>',
                    '</a>',
                    ((index + 1) % 3 === 0) && (index < data.length - 1) ? '</div><div class="rmcd-slide-item">' : ''
                ].join('');
            });
            rcmdItems.html(_rcmdHTML + '</div></div>');
            rcmdItemsWrap.show();

            var rmcdSlider = new Slider('#jRcmdItemsSlider', {
                height: $('#jRcmdItemsSlider').find('.recommended-item').height() + $('#jViewDetail').height() / 1.5,
                lazyLoad: {
                    attr: 'data-url',
                    loadingClass: 'img-error'
                },
                play: {
                    auto: false,
                    interval: 4000,
                    swap: true,
                    pauseOnHover: true,
                    restartDelay: 2500,
                    pagination: false
                }
            });
        }
    });
});

