define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var Lazyload = require('common/widget/lazyload');
    
    //懒加载
    var imageLazyLoader = null;
    var resetImageLoader = function() {
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url',
          load : function(self){
            if($(self).hasClass('img-error')){
                $(self).removeClass('img-error');
            }
          }
        });
        return imageLazyLoader;
    }

    resetImageLoader();

    
    $('.jEditShop').click(function(){
    	var s = $('.jRomeCent');
    	if(s.css('display') == "none"){
    		s.css('display','block');
            $(this).text('取消编辑');
    	}
    	else{
    		s.css('display','none');
            $(this).text('编辑');
    	}
    });

    var rome = $('.jRome');
    rome.click(function() {
        var id = $(this).attr('data-id');
        var favoriteType = $(this).attr('data-favoriteType');
        var data = {
                'id': id,
                'favoriteType': favoriteType
            }
            
        Dialog.confirm({
            cnt: '确定要取消收藏吗？',
            lock: true
        }, function() {
            io.get('/member/collection_cancle', data, function(){
                Dialog.tips('取消成功！', function() {
                    window.location.reload();
                });
            }, function(e) {
                Dialog.tips(e.msg);
            });
        });
        return false;

    });

    var lazyMore = function(){
        new Lazyload('.jPage', {
            type: 'html',
            placeholder: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                var data = {
                    'callback': 'callback',
                    'page': page
                };
                if(!$(el).hasClass('load')){
                    var src = '/member/collection_shop';
                    io.jsonp(src, data, function(data) { 
                        if(data.data == ''){
                            $(el).remove();
                            return false;
                        }
                        else{
                            var html = unescape(data.data);
                            $(el).html(html).addClass('load'); 
                            $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
                            lazyMore();
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
