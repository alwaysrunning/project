define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var cart = require('module/add-to-cart/addcart');
    var io = require('common/kit/io/request');
    var Lazyload = require('common/widget/lazyload');
    var Dialog = require('common/ui/dialog/dialog');
    var getCoupon = require('module/common/get-counpon');


    //导航
    var nav = require('common/ui/nav/nav'); 
    new nav({ 
        clickBtn : '#jCategory', 
        isShowCloud : false 
    });
    
    //更新购物车
    if($('.jAdd2Cart:visible').length>0){
        cart.getcart();
    }

        
    //  加入购物车
    $('.pro-box-list').on('click', '.jAdd2Cart', function() {
        var _this = $(this);
        var id = _this.parent().attr('data-productid').split('-')[1];
        cart.addcart(id, '1', _this);
    });

     //添加优惠劵 
     if($('.jActCouponApply').length>0){
        getCoupon({
            selector: $('.jActCouponApply')
        });
      }

    //  初始化懒加载
    new Lazyload('img.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url'
    });
});

