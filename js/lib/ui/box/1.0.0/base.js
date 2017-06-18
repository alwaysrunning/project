/**
 * Base message box for application extends.
 *
 * @module lib/ui/box/base
 */
define(function(require, exports, module) {
    'use strict';

    var noop = function() {};
    var slice = Array.prototype.slice;

    var extend = function(r, s) {
        for (var k in s) {
            if (s.hasOwnProperty(k)) r[k] = s[k];
        }
        return r;
    };

    var isArray = Array.isArray || function(o) {
        return o && o instanceof Array;
    };

    var BaseBox= require('../../dialog/6.0.2/dialog-plus');
    var __proto__ = require('../../dialog/6.0.2/popup').prototype;

    var createLayer = function(options) {
        if (typeof options === 'string') {
            options = { content: options };
        }
        var button = options.button;
        // transform k/v object to array list
        if (typeof button === 'object' && !isArray(button)) {
            options.button = [];
            for (var k in button)
                if (button.hasOwnProperty(k))
                    options.button.push(extend({id: k}, button[k]));
        }
        return BaseBox(options);
    };

    /**
     * Override `show`, support show modal by the first arg with a bool value
     * #.show(true [, ...]).
     */
    var baseShow = __proto__.show;
    __proto__.show = function() {
        var args = slice.call(arguments, 0);
        if (typeof args[0] === 'boolean') {
            this.modal = args[0];
            args.shift();
        }
        return baseShow.apply(this, args);
    };

    /**
     * Implement `hide` to supports quick close with destroy.
     */
    __proto__.hide = function(destroy) {
        return destroy ? this.remove() : this.close();
    };

    /**
     * Implement api method `destroy`, alias remove.
     */
    __proto__.destroy = function() {
        this.remove();
    };


    // Defaut duration for auto close box.
    var boxDelay = 2000;

    /**
     * Basic message box.
     */
    var Box = {

        /**
         * Factory method for create a generic layer instance.
         *
         * @method create
         * @param {Object|String} options The options for dialog creates. as the dialog
         *                        content if a string provided.
         */
        create: createLayer,

        /**
         * alert box
         *
         * @param {String} content The message to alert
         * @param {Function} callback The handler for the `OK` button clicked.
         */
        alert: function(content, callback) {
            callback = callback || noop;
            var d = createLayer({
                title: '提示',
                width: '300',
                content: '<p class="pop-tips">' + content + '</p>',
                okValue: '确定',
                ok: function() { callback(); }
            });
            return d.show(true);
        },

        /**
         * 确认
         *
         * @param {String} content 内容
         * @param {Function} okFn 确定回调函数
         * @param {Function} cancelFn 取消回调函数
         * @param {HTMLElement} sender 按钮，只支持原生dom节点
         */
        confirm: function(content, okFn, cancelFn, sender) {
            if (typeof okFn !== 'function') {
                throw 'Illegal argument, the callback cannot be null.'
            }
            if (typeof cancelFn !== 'function') {
                cancelFn = okFn;
            }
            var callback = function(result) {
                if (result) {
                    okFn(result);
                } else {
                    cancelFn(result);
                }
            };
            var d = createLayer({
                'id': '_dialogConfirm',
                'type': 'question',
                'content': content,
                'align': 'top right',
                'okValue': '确定',
                'cancelValue': '取消',
                'ok': function() { callback(true); },
                'cancel': function() { callback(false); }
            });
            return d.show(true, sender);
        },

        /**
         * 错误
         *
         * @param {String} content 内容
         * @param {HTMLElement} sender 按钮，只支持原生dom节点
         * @param {int} time 自动关闭时间，单位毫秒, 默认: 2000
         */
        error: function(content, sender, time) {
            return createLayer({
                'id': '_dialogError',
                'type': 'error',
                'align': 'top',
                'content': content
            }).time(sender, time || boxDelay);
        },

        /**
         * 警告
         *
         * @param {String} content 内容
         * @param {HTMLElement} sender 按钮，只支持原生dom节点
         * @param {int} time 自动关闭时间，单位毫秒,默认:2000
         */
        warn: function(content, sender, time) {
            return createLayer({
                'id': '_dialogWarning',
                'type': 'warn',
                'align': 'top',
                'content': content
            }).time(sender, time || boxDelay);
        },

        /**
         * 正确
         *
         * @param {String} content 内容
         * @param {HTMLElement} sender 按钮，只支持原生dom节点
         * @param {int} time 自动关闭时间，单位毫秒,默认:2000
         */
        ok: function(content, sender, time) {
            return createLayer({
                'id': '_dialogOk',
                'type': 'ok',
                'align': 'top',
                'content': content
            }).time(sender, time || boxDelay);
        },

        /**
         * 普通提示
         *
         * @param {String} content 内容
         * @param {HTMLElement} sender 按钮，只支持原生dom节点
         * @param {int} time 自动关闭时间，单位毫秒,默认:2000
         */
        tips: function(content, sender, time) {
            return createLayer({
                'id': '_dialogTips',
                'type': 'tips',
                'align': 'top',
                'content': content
            }).time(sender, time || boxDelay);
        },

        /**
         * Show a spinner layer for asyn process, defaults use modal mode.
         *
         * @param {String} text The loading text
         * @param {Object} options
         */
        loading: function(text, options) {
            options = options || {};
            var isModal = options.isModal;
            var d = createLayer({
                'id': '_dialogForLoading',
                'type': 'loading-text',
                'content': text
            });
            return d.show(isModal === undefined ? true : !!isModal);
        }

    };

    // Exports
    module.exports = Box;
});
