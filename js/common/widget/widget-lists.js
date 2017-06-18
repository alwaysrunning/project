/**
 * @author	taotao
 * @desc    widget list
 */
define(function(require, exports, module) {
    'use strict';

    var defaults = {
        list: []
    };

    module.exports = function(opts) {
        var self = this;
        var o = opts || {};

        var opt = {};
        opt = $.extend({}, defaults, o);

        opt.tag = typeof opt.tag === 'string' ? $(opt.tag) : opt.tag;

        if (!opt.list.toString()) {
            var widget = location.hash.replace(/^\#/, '');
            opt.list.push(widget);
        }
        var eventList = {};


        return {
            push : function(hash) {
                if (opt.list.length === 0 || hash !== opt.list[opt.list.length -1]) {
                    opt.list.push(hash);
                }
            },
            hasWidget: function(hash) {
                return (opt.list.join(',').indexOf(hash) >= 0);
            },
            isLast: function(has) {
                if (opt.list.length > 1) {
                    return opt.list[list.length -1 ] === hash;
                }
                return false;
            },
            pop : function() {
                opt.list.pop();
                var a = '';
                if (opt.list.length > 0) {
                   a =  opt.list[opt.list.length - 1];
                }
                return a;
            }
        };
    };
});

