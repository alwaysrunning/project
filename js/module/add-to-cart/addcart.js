/**
 * @des add2cart
 * @author	unknown
 *
 * @update  taotao  2015-09-24
 *
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var cookie = require('common/kit/io/cookie');
    var BBG = require('url');


    /**
     * @desc    update cart number
     *
     */
    var updateCart = function() {
        var data = {
            'source': 'wap'
        };
        var countWrap = $('.ui-num, #jGetSimple');
        io.jsonp('http://m.yunhou.com/cart/getSimple', data, function(data) {
            if (!!data.data) {
                countWrap.text(data.data.totalType);
                if (data.data.totalType === 0 || data.data.totalType === '0') {
                    countWrap.hide().parent('a').removeClass('active');
                } else {
                    countWrap.show().parent('a').addClass('active');
                }
            }
        },function(e){
            Dialog.tips(e.msg);
        });
    };



    //加入购物车
    exports.addcart = function(productId, quantity, obj) {
        var data = {
            'productId': productId,   //商品ID
            'quantity': quantity,      //商品数量
            'source': 'wap'                //来源
        };
        var countWrap = $('.ui-num,#jGetSimple');
        io.jsonp('http://m.yunhou.com/cart/add', data, function(){
            Dialog.tips({
                cnt: '添加成功</br>商品已成功加入购物车！',
                time: 1500
            });
            updateCart();

        },function(e){
            Dialog.tips(e.msg);
        },obj);
    };
    //加入购物车
    exports.buyNow = function(productId, quantity, obj) {
        var name = cookie('_nick');
        if (!name) {
            location.href = BBG.URL.Login.login+'?ref='+encodeURIComponent(location.href);
            return;
        }
        var data = {
            'productId': productId,   //商品ID
            'quantity': quantity,     //商品数量
            'source': 'wap'           //来源
        };
        io.jsonp('http://m.yunhou.com/cart/addDirect', data, function(data){
            if (data.data.deliveryType == 0) {
                location.href = BBG.URL.settlement.buyNow;
            } else {
                location.href = BBG.URL.settlement.buyAtOnce;
            }
        },function(e){
            if (e.error == -100) {
                Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                    window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
                });
            } else {
                Dialog.tips(e.msg);
            }
        },obj);
    };

    //更新迷你购物车
    exports.getcart = updateCart;
});
