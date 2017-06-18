define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var cookie = require('common/kit/io/cookie');


    var linkageTab = require('common/ui/linkage-tab/linkage-tab');
    var provinceHdl = $('.jProvince');
    if (!cookie('_address')) {
        io.jsonp('http://www.yunhou.com/api/getUserRegion',{
            action: 'get_def_area',
            platform: 'js'
        }, function(data) {
            cookie('_address', data, {
                path: '/',
                domain: 'yunhou.com'
            });
            provinceHdl.text(cookie('_address').split(':')[0].split('_')[0]);
        });

    } else {
        provinceHdl.text(cookie('_address').split(':')[0].split('_')[0]);
    }

    provinceHdl.click(function() {
        linkageTab({
            isShowAddr: true,
            lastChangeCallBack : function(){
                $('html').removeClass('freez-page');
                location.reload();
            },
            onShow : function(){
                $('html').addClass('freez-page');
            },
            onHide : function(){
                $('html').removeClass('freez-page');
            }
        });
    });

    //  搜索组件
    var search = require('module/search/search');
    new search({
        ctx: '.jHeaderSearch'
    });

    //  分类插件
    var cataMenu = require('common/ui/menu/menu4global')();

    $('.jHeaderCata').click(function() {
        var self = $(this);
        if (self.attr('state-btn') === 'show') {
            self.attr('state-btn', 'hide').attr('id', 'cata-hide');
            cataMenu.menuShow('hide');

        } else {
            self.attr('state-btn', 'show').attr('id', 'cata-show');
            cataMenu.menuShow('show');
        }
    });



    //  回到顶部
    require('common/ui/nav/back2top')();

    //  底部悬挂
    // require('common/ui/nav/fix-nav')();

    //底部导航
    var nav = require('common/ui/nav/nav');
    new nav();




    var Slider = require('lib/ui/slider/3.0.4/slider');

    var slider = new Slider('#slides', {
        width:640,
        height:220,
        lazyLoad: {
            attr: 'data-url',
            loadingClass: 'img-error'
        },
        play: {
            auto: true,
            interval: 4000,
            swap: true,
            pauseOnHover: true,
            restartDelay: 2500
        },
        callback:{
            start:function(index){
            },
            loaded : function(){
            }
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

    var countDown = require('common/ui/countdown/countdown');

    countDown({
        targetTime: $('.jCountTime').attr('data-endTime'),
        timeText : ['',':',':','',''],
        container : '.jCountTime',
        isShowTimeText : true,
        isShowArea : true,
        type : {
            'd' : false,
            'h' : true,
            'm' : true,
            's' : true,
            'ms' : false
        },
        callback : function() {
            //倒计时为0后回调
        }
    });

});
