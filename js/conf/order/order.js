/**
 * @description 结算模块
 * @author licuiting 250602615@qq.com
 * @date 2014-11-05 10:07:37
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    //var goTop = require('common/widget/go-top');
    //发票信息
    // var idInfo = require('module/order/invoice');
    var com = require('module/order/common');
    //列表
    var list = require('module/order/list');
    //使用优惠券
    var coupon = require('module/order/coupon');
    //提交订单
    var submit = require('module/order/submit');

    com.getOrderData({}, function(data) {
        window.TJ && window.TJ.item && window.TJ.item(data);
		submit.init();
		insertBPM();
	});

    //  add by taotao
    //  补充逻辑，点击返回按钮的时候判断页面来源
    $('.ui-header .ui-back').on('click', function(e) {
        if (document.referrer.split('?')[0] === 'http://m.yunhou.com/html/cart/cart.html') {
            e.stopPropagation();
            e.preventDefault();
            window.history.back();
        }
    });
	//
	function insertBPM(){
		(function(f,c,d,e,g,a,b){a=c.createElement(d);b=c.getElementsByTagName(d)[0];a.async=1;a.src=e;b.parentNode.insertBefore(a,b)
		})(window,document,"script","//"+(location.protocol=="http:"?"s1":"ssl")+".bbgstatic.com/tracer/bpm.js?v=1.0.5","bpm");
	}
});
