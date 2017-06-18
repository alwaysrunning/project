/**
 * @description 发票信息
 * @author licuiting 250602615@qq.com
 * @date 2014-11-05 10:17:06
 * @update 2015-9-1 HouJian
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    require('common/widget/happy/happy');

    var $ = require('jquery');
    var com = require('module/order/common');
    var Dialog = require('common/ui/dialog/dialog');
    var Ztd = require('module/order/ztd');
	var invoice = {
        init: function() {
            this.bindEvent();
			return this;
        },
        // 绑定事件
        bindEvent: function() {
            var _self = this;

            $('#jInvoice').on('click', '.jHdZone', function(e) {
                _self.clickHandler(this, e);
            });

        },
        /**
         * click事件处理
         * @param  {DOM} checkbox DOM Object
         */
        clickHandler: function(element, e) {
            var isCheckbox = true;

            if (!this.isCheckbox(e.target)) {
                isCheckbox = false;
            }

            this.checkHandler(this.getCheckbox(element), isCheckbox);
        },
        isCheckbox: function(element) {
            if ($(element).hasClass('checkbox')) {
                return true;
            }
        },

        checkHandler: function(checkbox, isCheckbox) {
            this.setup();
            this.check(checkbox, isCheckbox);
        },
        /**
         * DOM初始化
         */
        setup: function() {
            // render未执行
            if (!(this.taxListRendered)) {
                this.renderTaxList();
            }
        },
        getCheckbox: function(element) {
            var element = $(element);
            return $(element).find('.checkbox')[0];
        },
        /**
         * 改变选中状态，同时显示隐藏发票详细
         * @param  {DOM} checkbox DOM Object
         */
        check: function(checkbox, isCheckbox) {
            checkbox = $(checkbox);

            if (!isCheckbox) {
                checkbox.prop('checked', !checkbox.prop('checked'));
            }

            this.toggle(checkbox.prop('checked'));
        },
        /**
         * 渲染发票内容列表
         * 发送数据请求，请求成功时，加载列表数据并且渲染发票列表
         */
        renderTaxList: function() {
            var _invoice = this;

            com.ajax(com.url.getInvoiceList, {}, function(data) {
                var potStr = '<option value=\"\">请选择</option>';

                $.each(data, function(i, content) {
                    potStr += '<option value=\"' + content + '\"' + '>' + content + '</option>';
                });

                // 插入DOM节点
                $('#taxContent').html(potStr);
                // 渲染完成，改变rendered的状态
                _invoice.taxListRendered = true;
            });
        },

        /**
         * 保存发票信息
         * 当发票有效开关被checked，进行发票内容校验
         * 校验成功，格式上传数据内容，发送保存发票信息请求
         * @param {Function} success 保存成功的回调函数
         */
        setTaxInfo: function(success) {
            var enable, data,
                titleVal = $('#taxTitle').val(),
                contentVal = $('#taxContent').val();

            if(Ztd.getZtd() && !Ztd.valid()){
                return false;
            }

            // 选中发票
            // 进行验证
            // if ( this.getChecked() ) {
            if (titleVal || contentVal) {
                enable = testTitle(titleVal) && testContent(contentVal);
            }

            if (enable) {
                data = {
                    taxType: '',
                    taxTitle: $.trim(titleVal),
                    taxContent: $.trim(contentVal)
                };
                // 发送保存信息请求
                com.ajax(com.url.saveInvoiceInfo, data, success, error);
            }
        },
        /**
         * 提交的外部调用接口
         * @param {Function} success 保存成功的回调函数
         */
        submit: function(callback) {
            this.setTaxInfo(callback);
        },
        getElement: function() {
            var el = $('#jInvoice').find('.bd');
            if (el.length > 0) {
                return el;
            }
        },
        setChecked: function(checked) {
            this.checked = checked;
        },
        /**
         * 获取checked状态
         * @return {Boolean} checked状态
         */
        getChecked: function() {
            // return this.checked;
            var titleVal = $('#taxTitle').val(),
                contentVal = $('#taxContent').val();
            if (!isEmpty(titleVal) || !isEmpty(contentVal)) {
                return true;
            }
        },
        /**
         * 发票内容显示切换
         * @param  {DOM} checkbox DOM Object
         */
        toggle: function(checked) {
            var el = this.getElement();
            if (typeof el !== 'undefined') {
                el[checked ? 'show' : 'hide']();
                this.setChecked(checked);
            }
        }
    };
    // help
    function testContent(value) {
        if (isEmpty(value)) {
            Dialog.tips('请选择发票内容!');
        } else {
            return true;
        }
    }

    function testTitle(value) {
        if (isEmpty(value)) {
            Dialog.tips('请输入发票抬头!');
        } else if (com.isHasSpChar(value)) {
            Dialog.tips('不支持~#^$@%&!*\'<>!等特殊符号');
        } else {
            return true;
        }
    }

    function isEmpty(value) {
        if (typeof value === 'undefined' || value === '') {
            return true;
        }
    }

    function error(data) {
        var code = data.error.toString();
        if (code === '500') {
            Dialog.tips(data.msg);
        }
    }
	// invoice.init();
    module.exports = invoice;
});
