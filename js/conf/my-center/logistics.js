/**
 * 个人中心 - 订单页面
 * add: wugeng
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var modSlt = '.mod-logistics';
    var $ = require('jquery');
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

    var clickHandles = {
        morePros: function() {
            var $this = $(this);
            var $dom = $this.prev().toggle();
            $this.toggleClass("shown");
            resetImageLoader();
        },
        logisDt: function () {
            var self = $(this);
            self.next().toggle();
            self.find('b').toggleClass('shown');
        }
    }
    for(var k in clickHandles){
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(modSlt).on("click",key,handle);
        }
    }

});
