/**
 * Created by hema on 16/3/3.
 */

define(function(require,exports,module){
    'use strict';

    var $ = require('jquery');
    var Lazyload = require('lib/gallery/widget/lazyload/1.0.0/lazyload');

    /**
     * 回到顶部
     * */
    require('common/ui/nav/back2top')();

    /**
     * 图片懒加载
     * */
    var _lazyLoader = new Lazyload('.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url',
        load : function(self){
            var _self = $(self);
            if(_self.hasClass('img-error')){
                _self.removeClass('img-error');
            }
        }
    });

});
