/**
 * @author	taotao
 * @date    2015-08-19
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');


    //  回到顶部
    require('common/ui/nav/back2top')();

    //  底部悬挂
    // require('common/ui/nav/fix-nav')();

    //底部导航
    var nav = require('common/ui/nav/nav');
    new nav();

    //  分类插件
    var cataMenu = require('common/ui/menu/menu4global')();

    $('.jNavCata').click(function() {
        var self = $(this);
        if (self.attr('state-btn') === 'show') {
            self.attr('state-btn', 'hide').attr('id', 'cata-hide');
            cataMenu.menuShow('hide');

        } else {
            self.attr('state-btn', 'show').attr('id', 'cata-show');
            cataMenu.menuShow('show');
        }
    });

    var Lazyload = require('common/widget/lazyload');

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
                    $(self).removeClass('img-error').removeAttr('data-url');
                }
            }
        });
        return imageLazyLoader;
    };

    resetImageLoader();

    //  秒杀模块
    require('module/global/miaosha');
});
