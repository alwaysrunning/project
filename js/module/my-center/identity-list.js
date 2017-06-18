define(function(require, exports, module) {
    
    'use strict';

    var $ = require('jquery'),
        Lazyload = require('common/widget/lazyload'),
    
        // 图片懒加载--start
        imageLazyLoader = null;

    function resetImageLoader() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
            imageLazyLoader.destroy();
        }

        imageLazyLoader = new Lazyload('img.jImg', {
            effect: 'fadeIn',
            dataAttribute: 'url',
            load: function(self) {
                if ($(self).hasClass('img-error')) {
                    $(self).removeClass('img-error');
                }
            }
        });

        return imageLazyLoader;
    }

    resetImageLoader();
 
});    
