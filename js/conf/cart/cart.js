/**
 * @description 购物车
 * @author licuiting 250602615@qq.com
 * @date 2015-02-10 14:39:30
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    //var goTop = require('common/widget/go-top');
    var com = require('module/cart/common');
    //列表
    var list = require('module/cart/list');
    var _ = require('module/cart/addr');
    var editBar = require('module/cart/edit-bar');
	var Channel = require('lib/gallery/channel/1.0.0/channel');
	Channel.define('cartChannel', ['list/tariffLimit']);
	var isFirst = true;
	com.on('del', function(data){
		list.del(data);
	})
    //切换编辑bar的状态
    com.on('initJsMod', function(data) {
        if (editBar) {
            editBar.toggle(data);
        }
        list.init();
    });
    //刷新购物车模板
    com.getCartData({}, function(data) {
		list.events();
        window.TJ && window.TJ.item && window.TJ.item(data);
		insertBPM();
    });
	function insertBPM(){
		(function(f,c,d,e,g,a,b){a=c.createElement(d);b=c.getElementsByTagName(d)[0];a.async=1;a.src=e;b.parentNode.insertBefore(a,b)
		})(window,document,"script","//"+(location.protocol=="http:"?"s1":"ssl")+".bbgstatic.com/tracer/bpm.js?v=1.0.5","bpm");
	}
});
