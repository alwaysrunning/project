/**
 * @description 自提点，只有坑爹的3天的生命周期
 * @author leaytam
 * @date 2017-01-07 10:17:06
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    require('common/widget/happy/happy');

    var $ = require('jquery');
    var com = require('module/order/common');
    var Dialog = require('common/ui/dialog/dialog');
	var ztd = {
        enable: true,

        /**
         * 保存自提点地址
         * 校验成功，格式上传数据内容，发送保存自提点地址请求
         * @param {Function} success 保存成功的回调函数
         */
        setAddrInfo: function(success) {
            var data,
                self = this,
                ztdAddrUrl = 'http://m.yunhou.com/checkout/selectdDelivery';

            if (self.flag) {
                data = $('#jZtdAddrForm').serializeJson();
                // 发送保存信息请求
                com.ajax(ztdAddrUrl, data, function(){
                    self.setTimeInfo(success);
                }, error);
            }
        },

        /**
         * 保存自提时间地址
         * 校验成功，格式上传数据内容，发送保存自提时间请求
         * @param {Function} success 保存成功的回调函数
         */
        setTimeInfo: function(success) {
            var data,
                self = this,
                ztdTimeUrl = 'http://m.yunhou.com/checkout/savedMemo';

            if (self.flag) {
                data = $('#jZtdTimeForm').serializeJson();
                // 发送保存信息请求
                com.ajax(ztdTimeUrl, data, function(){
                    if(self.enable){
                        success && success();
                    }
                }, error);
            }
        },
        /**
         * 验证自提点信息是否已选择
         */
        valid: function(){
            var self = this;
            self.flag = false;

            var addrValue = $('#jZtdAddrSel').val(),
            timeValue = $('#jZtdTimeSel').val()


            if (addrValue == 'none') {
                Dialog.tips('请务必选择正确的门店');
            }else if(timeValue == 'none'){
                Dialog.tips('请选择自提时间段');
            }else{
                self.flag = true
            }

            return self.flag;
        },
        getZtd: function(){
            return $('.mod-ztd').length;
        },
        /**
         * 提交的外部调用接口
         * @param {Function} success 保存成功的回调函数
         */
        submit: function(callback) {
            var self = this;
            if(self.valid()){
                self.setAddrInfo(callback);
            }
        }
    };

    function error(data) {
        var code = data.error.toString();
        if (code === '500') {
            Dialog.tips(data.msg);
            ztd.enable = false;
        }
    }

    $.fn.serializeJson=function(){
        try {
            var serializeObj={};
            var array=this.serializeArray();
            var str=this.serialize();
            $(array).each(function(){
                if(serializeObj[this.name]){
                    if($.isArray(serializeObj[this.name])){
                        serializeObj[this.name].push(this.value);
                    }else{
                        serializeObj[this.name]=[serializeObj[this.name],this.value];
                    }
                }else{
                    serializeObj[this.name]=this.value;
                }
            });
            return serializeObj;
        } catch (e) {
            console.error("表单数据转json失败！");
        }
    };
	// invoice.init();
    module.exports = ztd;
});
