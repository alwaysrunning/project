 define(function(require, exports, module) {
    'use strict';
   
    var io = require('common/kit/io/request');
    var Lazyload = require('common/widget/lazyload');


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
                if(!$(el).hasClass('load')) {
                    io.jsonp(window.location.href,{"p":page}, function(res) {
                        var html = unescape(res.data);
                        if(html) {
                            $(el).html(html).addClass('load');
                            $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
                            resetImageLoader();
                            lazyMore();

                        } else {
                            $(el).remove();
                        }
                    }, function(data){
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
