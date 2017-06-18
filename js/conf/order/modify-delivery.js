/**
 * @description 配送方式
 * @author licuiting 250602615@qq.com
 * @date 2015-02-11 17:25:44
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var com = require('module/order/common');
    var template = require('common/widget/template');
    var modifyDelivery = {
        defaultSetting: {
            selector: ''
        },
        init: function() {
            var self = this;
            $.extend(this, this.defaultSetting);
            self.getDeliveryList(function(data) {
                self.event();
            });
        },
        event: function() {
            var self = this;
            //选择
            $('#jMdInvoice').on('click', '[name=jInType]', function() {
                var $radio = $(this);
                var shopId = $radio.attr('data-shopId');
                var deliveryId = $radio.attr('data-id');
                self.saveSeletedDelivery(shopId, deliveryId);
            });
        },
        //获取配送方式列表
        getDeliveryList: function(callback) {
            com.ajax(com.url.deliveryList, {
                shopId: com.getUrlParam('shopId')
            }, function(data) {
                $('#jMdInvoice').html(template.render('jMdInvoiceTmpl', {
                    list: data
                }));
                callback && callback(data);
            });
        },
        // 保存选中的配送方式
        saveSeletedDelivery: function(shopId, deliveryId) {
            var _self = this;
            com.ajax(com.url.selectDeliveryType, {
                shopId: shopId,
                deliveryId: deliveryId
            }, function(data) {
                location.href = com.getUrlParam('source') + '.html?isRefresh=1';
            });
        }
    };
    modifyDelivery.init();
});
