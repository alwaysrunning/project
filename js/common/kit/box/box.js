/**
 * box width loading
 *
 * @author	taotao
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var io = require('common/kit/io/request');
    require('common/base/dialog');

    var noop = function() {
    };

    var Box = {};


    Box.loading = function(opts) {
        var defaults = {
            url: '',                // ajax请求的地址
            data: {},               // ajax请求参数
            type: 'GET',            // ajax请求方式，默认是'GET'方式
            dataType: 'jsonp',   //  默认不使用jsonp
            cnt: '<img src="//static5.bubugao.com/public/img/loading/loading32x32.gif"/>', // loading gif 图片
            ctx: 'document.body',
            time: 0,
            success: noop,
            error: noop
        };
        var _opt = $.extend({}, defaults, opts);
        //  TODO
        // $(_opt.ctx).dialog(_opt);

        delete _opt.cnt;

        if (!!_opt.url) {
            io.ajax(_opt);
        }
    };

    module.exports = Box;
});

