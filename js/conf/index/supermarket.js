define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    //图片轮播
    var Slider = require('lib/ui/slider/3.0.4/slider');

    //底部滑出导航
    // var nav = require('common/ui/nav/nav');

    // new nav();

    //弹窗JS引入
    var dialog = require('common/ui/dialog/dialog');

    //ajax引入
    var io = require('common/kit/io/request');

    //搜索引入
    var search = require('module/search/search');

    new search();

    //右上角导航
    var nav = require('common/ui/nav/nav');
    new nav({
        clickBtn : '#jCategory',
        isShowCloud : false
    });

    //倒计时引入
    var countDown = require('common/ui/countdown/countdown');

    //懒加载引入
    var Lazyload = require('common/widget/lazyload');

    var url = {
        selectedUrl : 'http://www.yunhou.com/api/getUserRegion',
        changeCallBackUrl : 'http://www.yunhou.com/api/setUserRegion',
        url : 'http://www.yunhou.com/api/getRegion/jsonp/',
        collection : 'http://m.yunhou.com/member/collection_add',
        uncollection : 'http://m.yunhou.com/member/collection_cancle',
        category : 'http://m.yunhou.com/shop/category/'
    }

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
                $(self).removeClass('img-error').removeAttr('data-url');
            }
          }
        });
        return imageLazyLoader;
    }

    resetImageLoader();

    //图片轮播
    if($('#slides').length>0){
        var Slider = new Slider('#slides', {
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
    }

    //四级地址
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');

    $('#jAddrPop').click(function(){
        var pageCnt = $('.page-view');
        //地址一
        linkageTab({
            //调用多级地址的对象
            linkageBox : $('#jAddrPop'),
            // 下拉列表隐藏域的id
            selectValInput : 'f1',
            // 只存选中的value值
            selectValId : 'f2',
            // area 存文本和id的隐藏域的id
            areaId : 'areaInfo2',
            // 存最后一个值的隐藏域的id
            lastValueId : 'f4',
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

    //店铺收藏
    $('#jShopCollect').on('click',function(){
        var _self = this;
        var opt = {
            id: $(_self).attr('data-id'),
            favoriteType: 2
        }
        if($(_self).hasClass('active')){
            io.jsonp(url.uncollection,opt,function(data){
                $(_self).removeClass('active');
                $(_self).find('.icon').html('&#xe604;');
                dialog.tips(data.msg);
            },function(data){
                dialog.tips(data.msg);
                if(data.error == '-100'){
                    setTimeout(function(){
                        window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
                    },2000);
                }
            },_self);
        }else{
            io.jsonp(url.collection,opt,function(data){
                $(_self).addClass('active');
                $(_self).find('.icon').html('&#xe603;');
                dialog.tips(data.msg);
            },function(data){
                dialog.tips(data.msg);
                if(data.error == '-100'){
                    setTimeout(function(){
                        window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
                    },2000);
                }
            },_self);
        }
    });

    //分类
    var Menu = require('common/ui/menu/menu');

    var shop = $('#jShopClassify');

    var shopId = shop.attr('data-shop');

    Menu('#jShopClassify', url.category, {"data":{"shopId":shopId}});

    //倒计时
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
