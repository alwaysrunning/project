define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var dialog = require('common/ui/dialog/dialog');

    var search = require('module/search/search');

    new search();

    var Lazyload = require('common/widget/lazyload');

  	var io = require('common/kit/io/request');

    //右上角导航
    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

  	var url = {
  		list :　'//m.yunhou.com/widgets/list'
  	}
  	
  	function lazyMore(){
  		var id = $('.jScroll').attr('data-id');
  		new Lazyload('.jScroll .jPage', {
	      	type: 'html',
	        placeholder: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
	        load: function(el) {
	        	var page = $(el).attr('data-page');
	        	if(!$(el).hasClass('load')){
	          		io.jsonp(url.list,{"wid":id,"page":page}, function(res) { 
	          			var html = unescape(res.data);
	          			if(res.data){
		          			$(el).html(html).addClass('load'); 
		          			$(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
		          			lazyMore();
		          			resetImageLoader();
	          			}else{
	          				$(el).remove();
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
                $(self).removeClass('img-error');
            }
          }
        });
        return imageLazyLoader;
    }

    resetImageLoader();

});
