define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazyload = require('common/widget/lazyload');
    var io = require('common/kit/io/request');
    var currentType = '';
    var currentTabIndex = 0;

    var lazyMore = function() {
        new Lazyload('.jPage', {
            type: 'html',
            placeholder: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                var data = {
                    'callback'   : 'callback',
                    'page'       : page,
                    'goods_id'   : gGoodsId,
                    'product_id' : gProductId,
                    'type'       : currentType || '',
                    'is_ajax'    : 1
                };
                if (!$(el).hasClass('load')) {
                    var src = '//m.yunhou.com/item/commentList';
                    io.jsonp(src, data, function(data) {
                        if (data.html === '') {
                            $(el).remove();
                            return false;
                        } else {
                            var html = window.unescape(data.html);
                            $(el).html(html).addClass('load');
                            $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
                            lazyMore();
                        }
                    },function(res) {
                        $(el).find('.loading').html('网络错误，点击重试').attr('id','jNetError');
                    }).on('error',function(res){
                        if(res.error=='1'){
                            $(el).find('.loading').html('网络错误，点击重试').attr('id','jNetError');
                        }
                    });
                }
            }
        });
    };

    //评论切换
    var $jCommentList = $('.evaluation-pl a');
    var commentTypesText = {
        'good'   : '好评',
        'normal' : '中评',
        'bad'    : '差评'
    };
    var currentCommentText = '评论';
    $('body').on('click','.evaluation-pl a',function() {
        var src = $(this).attr('data-url'),
            $cnt = $('.comment-cnt'),
            $this = $(this);
            currentTabIndex = $jCommentList.index(this);

        $jCommentList.removeClass('hover');
        $this.addClass('hover');
        currentType = $(this).attr('data-type');
        currentCommentText = commentTypesText[currentType] || '评论';

        if(src !== '') {
            $cnt.html('<div class="empty"><p><img src="http://s1.bbgstatic.com/gshop/images/public/loading.gif" class="load-gif" /></p><p class="emt-txt loading-txt">正在加载,请稍后...</p></div>');
            io.jsonp(src, {}, function(data) {
                if(data.html === '') {
                    $cnt.html('<div class="no-content"><div class="icon"><i class="iconfont">&#xe608;</i></div><div class="content">暂无' + currentCommentText + '</div></div>');
                    return false;
                } else{
                    var html = window.unescape(data.html);
                    $cnt.html('<div class="jPage load" data-page="1">' + html + '</div><div class="jPage" data-page="2"></div>');
                    lazyMore();
                }
            }, function() {
                $cnt.html('网络错误，点击重试').attr('id','jNetError');
            }).on('error',function(res){
                if(res.error=='1'){
                    $cnt.html('<div class="empty"><i class="icon iconfont">&#xe620;</i><p class="emt-txt">数据加载失败...</p><a href="#" class="ui-button-white jReloadCmt">刷新试试</a></div>');
                }
            });
        } else {
            $cnt.html('<div class="no-content"><div class="icon"><i class="iconfont">&#xe608;</i></div><div class="content">暂无' + currentCommentText + '</div></div>');
        }

        return false;
    });
    
    var commentTab = $('#jItemTabHeader').find('a').eq(2);
    commentTab.on('click', function() {
        if (!$(this).hasClass('btn-checked')) {
            $jCommentList.eq(0).trigger('click');
            $(this).addClass('btn-checked');
        }
    });

    //列表加载网络出错，重试
    $('body').on('click','#jNetError',function() {
        lazyMore();
    }).on('click', '.jReloadCmt', function() {
        $jCommentList.eq(currentTabIndex).trigger('click');
    }).append('<i class="icon-holder iconfont">&#xe620;</i>');

});
