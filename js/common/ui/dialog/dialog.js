define(function(require, exports, module) {
    'use strict';

	var $ = require('jquery');
	var dialog = require('common/base/dialog');

	module.exports = {
		tips : function(opt, callback) {
			var _opt = {
				id : 'dialog-tips',
				cnt : '',// 弹出框内容，支持text和html
				time : 3000,// 0表示不自动隐藏
				lock : false,
				callBack : function(){
					callback&&callback();
				}
			};
			(typeof opt == 'string') ? _opt.cnt = opt : _opt = $.extend(_opt, opt)
			$('document.body').dialog(_opt);
		},
				// alert
		alert : function(opt, sureFun) {
			var _opt = {
				id : '_dialog',
				cnt : '',// 弹出框内容，支持text和html
				time : 0,// 0表示不自动隐藏
				lock : true,
				btn : [ {
					value : '确定',
					isHide : true,
					callBack : function() {
						sureFun && sureFun();
					}
				} ]
			};
			(typeof opt == 'string') ? _opt.cnt = opt : _opt = $.extend(_opt, opt)
			$('document.body').dialog(_opt);
		},
		// confirm
		confirm : function(opt, sureFun, cancelFun) {
			var _opt = {
				id : '_dialog',
				cnt : '',// 弹出框内容，支持text和html
				time : 0,// 0表示不自动隐藏
				lock : false,
				btn : [ {
					value : '取消',
					isHide : true,
					callBack : function() {
						cancelFun && cancelFun();
					}
				},{
					value : '确定',
					isHide : true,
					callBack : function() {
						sureFun && sureFun();
					}
				} ]
			};
			(typeof opt == 'string') ? _opt.cnt = opt : _opt = $.extend(_opt, opt)
			$('document.body').dialog(_opt);
		},
		// 强制弹窗:背景置灰,强制提示信息,弹窗不消失
		forcedPop : function( opt ){
			var _opt = {
				id : '_dialog',
				cnt : '',// 弹出框内容，支持text和html
				time : 0,// 0表示不自动隐藏
				lock : true
			};
			(typeof opt == 'string') ? _opt.cnt = opt : _opt = $.extend(_opt, opt)
			$('document.body').dialog(_opt);
		}
	}
});
