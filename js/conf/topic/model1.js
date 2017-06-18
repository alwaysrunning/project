define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var cart = require('module/add-to-cart/addcart');
    var io = require('common/kit/io/request');
    var Lazyload = require('common/widget/lazyload');
    var Dialog = require('common/ui/dialog/dialog');


    //  初始化懒加载
    new Lazyload('img.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url'
    });
    $("#icon1").on("click",function(){
    	$("#icon1").html("&#xe603;");
    });
        $("#icon2").on("click",function(){
    	$("#icon2").html("&#xe638;");
    });
});

