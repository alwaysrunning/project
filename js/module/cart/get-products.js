/**
* @description 获取商品
* @author licuiting 250602615@qq.com
* @date 2015-02-10 20:53:36
* @version $Id$
*/
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    /**
     * 根据dom节点获取选中的商品信息
     * 
     * @returns {array} 数组
     */
    $.fn.getProducts = function(options) {
        var defaults = {
            isChecked : true
        // 是否判断选择
        };
        var opt = $.extend({}, defaults, options || {});
        var info = {}, ids = '', qty = '', count = 0, obj = $(this);
        obj.each(function() {
            var eTable = $(this).parents('.jTable'), eChkItem = eTable.find('.jChkItem'),
            eQtyTxt = eTable.find('.jQtyTxt');
            if (!opt.isChecked || eChkItem.prop('checked')) {
                if (count == 0) {
                    ids = eTable.attr('data-id');
                    qty = eQtyTxt.val();
                } else {
                    ids += ',' + eTable.attr('data-id')
                    qty += ',' + eQtyTxt.val();
                }
            }
            count++;
        });
        info = {
            productId : ids,
            quantity : qty
        };
        return info;
    }

});