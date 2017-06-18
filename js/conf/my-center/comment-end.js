/**
 * 个人中心 - 已评论页
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Lazyload = require('common/widget/lazyload');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');


    // 图片懒加载--start
    var imageLazyLoader = null;
    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url'
        });
        return imageLazyLoader;
    }

    resetImageLoader();
    // 图片懒加载--end

    var lazyMore = function(){
        new Lazyload('.jScroll .jPage', {
            type: 'html',
            placeholder: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                if(!$(el).hasClass('load')){
                    io.get(window.location.href,{"p":page}, function(res) {
                        if(res.error == "0"){
                            var html = "";
                            if(res.data != ""){
                                html = unescape(res.data);
                                $(el).html(html).addClass('load');
                                $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
                                resetImageLoader(); // 为新加的图片使用懒加载
                                lazyMore();  // 为新加的内容添加懒加载
                            }
                            else{
                                $(el).remove();
                                console.log("end");
                            }
                        }
                        else{
                            console.log("返回error");
                            Dialog.tips(res.msg||'加载更多失败，请稍后重试');
                            $(el).html("");
                            $(window).scrollTop($(window).scrollTop()-60);
                            setTimeout(function(){
                                lazyMore();
                            },3000);
                        }
                    },function(){
                        $(el).find('.loading').html('网络错误，点击重试').attr('id','jNetError');
                    });
                }
            }
        });
    }

    lazyMore();

    //列表加载网络出错，重试
    $('body').on('click','#jNetError',function(){
        lazyMore();
    })

});
