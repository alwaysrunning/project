/**
 * @file 1.0.1.js
 * @synopsis  带样式弹框
 * @author licuiting, 250602615@qq.com
 * @version 1.0.1
 * @date 2016-06-28
 */

define(function(require, exports, module) {
    'use strict';

    var box = require('lib/ui/box/1.0.1/box');
    var createBtn = function(button) {
        var btn = ['ok', 'cancel'];
        var btnStr = '';
        $.each(button, function(i, v) {
            btnStr += '<a class="btn-' + i + '" action-type="' + btn[i] + '" style="width:' + (100 / button.length) + '%;">' + v.text + '</a> ';
        });
        return btnStr;
    };
    var createHtml = function(opt) {
        // return [' <div class = "pop-close icon iconfont" action-type="close">&#xe622;</div>',
		return[
            '<div class="pop-hd">',
            '</div> ',
            ' <div class = "pop-bd jPageBody" > ' + opt.html + ' </div>',
            '<div class="pop-ft">' + createBtn(opt.button) + '</div> ',
            ' </div>'
        ].join('');
    };

    module.exports = {
        alert: function(msg, callback, btnTxt) {
            var opt = {
                modal: true,
                html: msg,
                className: "ui-pop",
                button: [{
                    text: (btnTxt || '确定'),
                    id: 'ok',
                    fn: function(e) {
                        callback && callback();
                    }
                }],
                fixed: true
            };
            var pop = box.create(createHtml(opt), opt);
            pop.show();
        },
		//param: 内容 取消回调 确定回调 取消替换文本 确定替换文本
        confirm: function(msg, callback2, callback1, btnTxt1, btnTxt2) {
            var opt = {
                modal: true,
                html: msg,
                className: "ui-pop",
                button: [{
                    text: (btnTxt1 || '取消'),
                    id: 'cancel',
                    fn: function(e) {
                        callback1 && callback1();
                    }
                }, {
                    text: (btnTxt2 || '确定'),
                    id: 'ok',
                    fn: function(e) {
                        callback2 && callback2();
                    }
                }],
                fixed: true
            };
            var pop = box.create(createHtml(opt), opt);
            pop.show();
        }
    }
});
