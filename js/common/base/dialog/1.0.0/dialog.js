/**
 * @deprecated 弹出框
 * @author leay 2014.12.9
 * @param
 * var opts = {
 *		id : '_dialog',
 *		cnt : '<div class="loading"><i class="icon-spin4"></i><span>努力加载中,请稍后...</span></div>',// 弹出框内容，支持text和html
 *		time : 3000,// 0表示不自动隐藏
 *		lock : false,// 是否启用遮罩
 *		btn : [ {
 *			value : '确定',
 *			isHide : false,
 *			callBack : function() {
 *			}
 *		}, {
 *			value : '取消',
 *			isHide : true,
 *			callBack : function() {
 *			}
 *		} ],
 *		ajax : {// 当设置ajax值时，忽略time和btn；当不需要ajax的时候，设置为null
 *			url : '/ajax/loading/get-loading.php',
 *			data : {// 参数
 *			}
 *		},
 *		callBack : function() {
 *		}
 *	};
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    // module.exports = {
    $.fn.dialog = function(options) {
        var opts = $.extend({
            id : '_dialog',
            cnt : '<div class="loading"><i class="icon-spin4"></i><span>努力加载中,请稍后...</span></div>',// 弹出框内容，支持text和html
            time : 3000,// 0表示不自动隐藏
            lock : false,// 是否启用遮罩
            btn : [],
            ajax : null,
            callBack : function() {
            }
        }, options);

        var eMask = $('<div/>', {
            'class' : 'mask',
            id : opts.id+'_mask'
        }),
        eDialog = $('<div/>', {
            'class' : 'dialog',
            id : opts.id
        }),
        ePop = $('<div/>', {
            'class' : 'd-pop'
        }),
        eCnt = $('<div/>', {
            'class' : 'd-cnt',
            'html' : opts.cnt
        }),
        eBtn = $('<div/>', {
            'class' : 'd-btn'
        }),
        eBtns = [];

        function init() {
            if ($('#' + opts.id).length == 0) {
                $(document.body).append(eDialog);
            }
            if($('#' + opts.id+'_mask').length == 0 && opts.lock){
                $(document.body).append(eMask);
            }
            eDialog = $('#' + opts.id);
            eMask = $('#' + opts.id+'_mask');
            for(var i=0;i<opts.btn.length;i++){
                eBtns[i] = $('<a />',{
                    'class' : 'jBtn',
                    'html' : opts.btn[i].value,
                    'href' : 'javascript:;'
                })
            }
            ePop.append(eCnt);
            if(!opts.ajax && eBtns.length > 0){
                regBtn();
            }
            eDialog.html(ePop);
            show();

        }

        function show(){
            var hideType = $('#_dialog').attr('hide-type');
            var eventBind = $('#_dialog').attr('event-bind');
            if (!eventBind) {
                $('#_dialog').attr('enent-bind', '1');
                $('#_dialog').on('click', function() {
                    console.log(hideType);
                    if (hideType === 'tap') {
                        console.log('value');
                        hide();
                    }
                });
            }
            eDialog.length > 0 && eDialog.css({
                opacity : 1,
                '-webkit-transition': 'opacity 0.3s linear',
                transition: 'opacity 0.3s linear',
                display : 'block'
            });
            setPosition();
            eMask.length > 0 && eMask.show();
            !opts.ajax && opts.time > 0 && setTimeout(function(){
                hide();
            },opts.time);
        }

        function doAjax(){
            $.getJSON(opts.ajax.url, opts.ajax.data, function(data) {
                if (data._error) {

                } else if (data.data) {
                    data = data.data;
                    if (data.length == 0) {
                        isLast = true;
                        return;
                    }
                    opts.callBack();
                }
            });
        }

        function setPosition(){
            if(eDialog.length > 0){
                var wW = window.innerWidth,
                    wH = window.innerHeight,
                    curH = eDialog.height(),
                    curW = eDialog.width();
                eDialog.css({
                    left: 0,
                    top : (wH-curH)/2
                });
            }
        }

        function hide(){
            eDialog.length > 0 && eDialog.css({
                opacity : 0,
                display : 'none'
            });
            eMask.length > 0 && eMask.hide();
            opts.callBack();
        }

        function regBtn(){
            for(var i=0;i<eBtns.length;i++){
                (function(i){
                    eBtn.append(eBtns[i]);
                    eBtns[i].bind('click',function(){
                        opts.btn[i].callBack();
                        opts.btn[i].isHide && hide();
                    });
                })(i);
            }
            ePop.append(eBtn);
        }

        init();
        return this;
    }
    //}
});
