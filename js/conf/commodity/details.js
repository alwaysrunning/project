define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    require('common/ui/nav/back2top')();

    var Lazyload = require('common/widget/lazyload');

	var eGoodsDetailCntData = $('#jGoodsDetailCntData'), // 商品详情内容数据
		eGoodsDetailCnt = $('#jGoodsDetailCnt'), // 商品详情内容
		defaultUrl = '//s3.bbgstatic.com/pub/img/blank.gif';	//默认图片地址

    var imageLazyLoader = null;
    var detailsLoaded = false;

    $('#jItemTabHeader').find('.item-tab-handler').eq(1).on('click', function(){
        if (!detailsLoaded) {
            window.scrollTo(0, 1);
            //window.scrollTo(0, 0);
            detailsLoaded = true;
        }
    });

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

    /**
	 * 商品详情页图片懒加载
	 */
	loadGoodsDetail();

	function loadGoodsDetail() {
		var eGoodsIntro = $('<div>'+eGoodsDetailCntData.val()+'</div>');
		var eImg = eGoodsIntro.find('img');
        // var sizeFix = setSizeFix();//'!l2';// 
		eImg.each(function() {
			var $this = $(this), src = $this.attr('src'), size = getSizeByUri(src);
            $this.attr('data-url', src);
			// $this.attr('data-url', src.replace(/(\.jpg|\.png|\.gif|\.jpeg)/i,'$1' + sizeFix));
			$this.removeClass('jImg');
			$this.attr('src', defaultUrl);
			// 防止编辑没有定义宽度，导致数据一次性加载
			if (size) {
				var w = $('body').width(), h = size.h;
				$this.css({
					width : w,
					height : size.h * w / size.w
				});
			}
			$this.addClass('jImg img-error');
		});
		eGoodsDetailCnt.html(eGoodsIntro);
		resetImageLoader();
	}

    //设置图片尺寸，防止加载原图
    function setSizeFix() {
        var screenWidth = $(window).width();
        if (screenWidth >= 750) { //6 plus以及更大
            return '!l2';
        } else if (screenWidth >= 640) {
            return '!sp1';
        } else {
            return '!m';
        }
    }

	//获取图片大小
	function getSizeByUri(picUri) {
		var size = {};
		var ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)\!([0-9]+)$/;
		var items = ptn.exec(picUri);
		if (items) {
			size.w = parseInt(items[1]);
			size.h = parseInt(items[2]);
			size.size = parseInt(items[4]);
		} else {
			ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)$/;
			items = ptn.exec(picUri);
			if (items) {
				size.w = parseInt(items[1]);
				size.h = parseInt(items[2]);
				size.size = size.w;
			} else {
				size = null;
			}
		}
		return size;
	}

});
