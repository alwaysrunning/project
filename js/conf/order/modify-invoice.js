/**
 * @description 修改发票信息
 * @author licuiting 250602615@qq.com
 * @date 2014-11-05 10:17:06
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var com = require('module/order/common');
    var cookie = require('common/kit/io/cookie');
    var mdInvoice = {
        defaultSetting: {

        },
        init: function() {
            var self = this;
            $.extend(this, this.defaultSetting);
            self.getPage();
        },
        // 绑定事件
        bindEvent: function() {
            var self = this;
            // 发票信息列表
            $('#jMdInvoice').on('click', '#jTab li', function() {
                    var index = $('#jTab li').index($(this));
                    self.tab(index);
                    if (index == 0) {
                        //不需要发票发送取消发票请求
                        self.cancelInvoice();
                    } else {
                        self.getInvoiceInfoList();
                    }
                })
                // 保存发票信息
                .on('click', '#jSaveInvoiceinfo', function() {
                    self.saveInvoicesInfo();
                })
        },
        //生成页面
        getPage: function() {
            var self = this;
            var taxType = cookie('taxType');
            var taxTitle = cookie('taxTitle');
            var d = {
                taxType: taxType,
                taxTitle: taxTitle,
                tab: {}
            };
            com.ajax(com.url.taxType, {}, function(data) {
                d.tab = data;
                $('#jMdInvoice').html(template.render('jMdInvoiceTmpl', d));
                //
                self.bindEvent();
                //
                if (taxType && taxType != 0) {
                    $('#jTab-' + taxType).click();
                }
            });
        },
        tab: function(index) {
            var isFirst = (index == 0);
            $('#jTab li').removeClass('hover').eq(index).addClass('hover');
            $('#jCtn')[!isFirst ? 'show' : 'hide']();
        },
        //不需要发票
        cancelInvoice: function() {
            var _self = this;
            var delivery = com.getUrlParam('delivery');
            delivery = delivery ? {
                delivery: delivery
            } : ''
            com.ajax(com.url.noInvoice, delivery, function(data) {
                _self.goToBefore();
            });
        },
        goToBefore: function() {
            setTimeout(function() {
                location.href = com.getUrlParam('source') + '.html?isRefresh=1';
            }, 0);
        },
        //获取发票列表
        getInvoiceInfoList: function() {
            var $select = $('#jInvoiceCtn');
            var isHasOption = ($select.find('option').length == 0);
            var taxContent = cookie('taxContent'); //发票内容
            isHasOption && com.ajax(com.url.getInvoiceList, {}, function(data) {
                var potStr = '';
                $.each(data, function(i, v) {
                    var isSd = '';
                    if (taxContent && taxContent == v) {
                        isSd = 'selected';
                    }
                    potStr += '<option value="' + v + '" ' + isSd + '>' + v + '</option>';
                });
                $select.html(potStr);
            });
        },
        //验证发票信息
        validateInvoiceInfo: function() {
            var val = $.trim($('#jInvoiceText').val());
            if (val.length == 0) {
                $('#msg').show().text('发票抬头不能为空');
                return false;
            } else if (com.isHasSpChar(val)) {
                $('#msg').show().text('不能输入~#^$@%&!*\'<>等特殊字符');
                return false;
            } else {
                $('#msg').hide();
                return true;
            }
        },
        // 保存发票信息
        saveInvoicesInfo: function() {
            var _self = this;
            // 验证
            if (_self.validateInvoiceInfo()) {
                com.ajax(com.url.saveInvoiceInfo, {
                    taxType: $('#jTab li.hover').attr('data-index'),
                    taxTitle: $.trim($('#jInvoiceText').val()),
                    taxContent: $.trim($('#jInvoiceCtn').val())
                }, function(data) {
                    _self.goToBefore();
                })
            }
        }
    };
	mdInvoice.init();
});
