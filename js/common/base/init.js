define(function(require, exports, module) {
    'use strict';
	
	var isWeiXin = (function(){
	   var ua = navigator.userAgent.toLowerCase();
	   if(ua.match(/MicroMessenger/i)=="micromessenger") {
	       	return true;
	   } else {
	   		alert('请使用微信访问！')
	       	return false;
	   }
	})()

});