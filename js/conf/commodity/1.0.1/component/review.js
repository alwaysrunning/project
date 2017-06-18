/**
 * @author	taotao
 * @desc    basic component
 * @daet    2016-03-09
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');
    var currentType = '';
    var currentPage = 0;
    var lazyMore = '';

    var commentTypesText = {
        'good'   : '好评',
        'normal' : '中评',
        'bad'    : '差评'
    };



    // return true;
    var resetList = function() {
        // if ($('.comment-cnt').length > 0 && $('.comment-cnt').text().trim() === '') {
        //     $('.comment-cnt').html('<div class="jPage" data-page="1"><div class="loading">正在加载，请稍后...</div></div>');
        // }
        return new LazyStream('.comment-cnt', {
            plUrl: '//m.yunhou.com/item/commentList',
            paramFormater: function(n) {
                currentPage = n;
                return {
                    'page'       : n,
                    'goods_id'   : gGoodsId,
                    'product_id' : gProductId,
                    'type'       : currentType || '',
                    'is_ajax'    : 1
                };
            },
            errorText: '<div class="loading">网络错误，点击重试</div>',
            loadingClass: 'loading',
            loadingText: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
            // loadingText: '<div class="empty"><p><img src="http://s1.bbgstatic.com/gshop/images/public/loading.gif" class="load-gif" /></p><p class="emt-txt loading-txt">正在加载,请稍后...</p></div>',
            dataFilter: function(el) {
                if (el.html === '' && currentPage === 1) {

                    $('.comment-cnt').html('<div class="no-content"><div class="icon"><i class="iconfont">&#xe608;</i></div><div class="content">暂无' + (commentTypesText[currentType] || '评论') + '</div></div>');
                }
                return el.html;
            },
            noAnyMore: ''
        });
    };

    lazyMore = resetList();

    //  评论切换
    var $jCommentList = $('.evaluation-pl a');

    $('.evaluation-pl li').on('click', function() {
        if (!$(this).find('a').hasClass('hover')) {
            $('.comment-cnt').html('');
            $jCommentList.removeClass('hover');
            $(this).find('a').addClass('hover');
            currentType = $(this).find('a').attr('data-type');
            currentPage = 1;
            lazyMore = resetList();
            lazyMore.update();
        }
    });

    //  reviews init
    var commentTab = $('#jItemTabHeader').find('a').eq(2);
    commentTab.on('click', function() {
        setTimeout(function() {
            lazyMore.update();
        }, 1);
        // $('body').trigger('scroll');
    });

    module.exports = {
        lazyMore: lazyMore
    };
});
