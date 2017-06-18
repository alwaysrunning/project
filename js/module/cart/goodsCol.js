/**
 * 收藏商品
 * 
 * @author djune update@2014.8.26
 */
define(function(require, exports, module) {
	'use strict';
    //import public lib
	var $ = require('jquery');
	var cookie = require('common/kit/io/cookie');
	var com = require('module/cart/common');

	$.fn.goodsCol = function(options) {
		var defautls = {
			event : null,// 如果不想要绑定事件，设为null即可
			btn : null,//按钮对象
			colText : ['收藏','已收藏'],
			colClass : 'jColBtn',
			callback : function() {

			}// 回调函数
		};
		var opt = $.extend({}, defautls, options || {});

		$(this).each(function() {
			var obj = $(this);
			col();
			// 收藏
			function col() {
				var name = cookie('_nick');
				if (name) {
					// 已登录，立即收藏
					var goodsId = obj.attr('data-goods-id');
					var isColed = obj.hasClass(opt.colClass);//是否已收藏
					var str = '';//文本
					var colUrl = isColed?'cancelCol':'cols';//url
					com.ajax(com.url[colUrl], 
						{
							id : obj.attr('data-product-id'),//商品ID或店铺ID
							goodsId : obj.attr('data-goods-id'),
							favoriteType : 1//收藏类别  1为商品，2为店铺

						}, function(data){
							/*if ((typeof data.favoriteCount == 'number') && data.favoriteCount >= 0) {
								str += '(' + data.favoriteCount + ')';
							}*/
							obj[(isColed?'remove':'add')+'Class'](opt.colClass);
							obj.html(opt.colText[isColed?0:1]);
						}, function(){
							if (data.error == '-100') {
								location.href = com.loginUrl;
							} else {
								com.dialog.tips(data.msg, obj);
							}
						});
				} else {
					// 未登录，请先登录
					location.href = com.loginUrl;
				}
			}
		});
	}
});
