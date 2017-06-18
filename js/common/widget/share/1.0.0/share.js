/**
 * @description 分享插件,基于之前的插件，直接弹出相关窗口
 * @author	taotao
 * @date    2015-12-08
 * @desc    默认只有QQ空间、QQ好友、新浪微博
 *
 */

define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var base = require('./base');
    var Box = require('lib/ui/box/1.0.1/box');


    var str = [
        '<div class="_mod-share">',
        '<div class="mod-box">',
        '<h5 class="mod-box-hd">分享到</h5>',
        '<div class="mod-box-bd">',
        '<div class="sharebox" data-url="" data-pic="" data-text="" data-summary="" data-desc="">',
        '<a title="分享到QQ空间" target="_blank" class="bds_qzone" data-cmd="qzone"><i class="iconglobal">&#xe631;</i> <span>QQ空间</span></a>',
        '<a title="分享到QQ好友" target="_blank" class="bds_sqq" data-cmd="mqq"><i class="iconglobal">&#xe629;</i> <span>手机QQ</span></a>',
        '<a title="分享到新浪微博" target="_blank" class="bds_tsina" data-cmd="tsina"><i class="iconglobal">&#xe628;</i> <span>新浪微博</span></a>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('');

    var setting = {
        dialog: {
            skin: '_share_box',
            modal: true,
            close: false,
            clickBlankToHide: true,
            content: str,
            autofocus: false,

        },
        boxHdl: '.sharebox',
        exClass: '',
        data: {
            url: window.location.href,
            pic: '',
            title: '',
            desc: '',
            summary: ''
        }
    };

    var setCfg = function(hdl, data) {
        var ele = $(hdl);
        ele.attr('data-url', data.url);
        ele.attr('data-pic', data.pic);
        ele.attr('data-text', data.title);
        ele.attr('data-desc', data.desc);
        ele.attr('data-summary', data.summary || data.desc);
    };
    var bindEvent = function(hdl, opt) {
        base.init({
            selector: hdl,
            addClass: opt.exClass
        });
    };



    var share = function(opt) {
        var opts = $.extend(true, setting, opt || {});
        var hdl = '.' + opts.dialog.skin + ' ' + opts.boxHdl;
        var shareBox = Box.create(opts.dialog);

        shareBox.show();
        setCfg(hdl, opts.data);
        bindEvent(hdl, opts);
    };

    return share;
});


