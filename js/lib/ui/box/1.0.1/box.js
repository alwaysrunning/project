/**
 * Base message box for application extends.
 *
 * @module lib/ui/box/base
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var MessageBox = require('./messagebox');
    var util = require('../../../core/1.0.0/utils/util');
    var noop = function() {};
    var mix = util.mix;
    var extend = function(r, s) {
        var filter = function(from, to) {
            return to !== undefined && to !== null && to !== '' && !(typeof to === 'number' && isNaN(to))
        }
        return function(r, s) {
            return mix(r, s, true, true, filter);
        }
    }();
    var isNode = function(o) { return !!(o && o.nodeType && o.tagName) };
    var _guid = util.guid;
    var guid = function() { return _guid('__0x$') }

    var normalizeIBoxArgs = function(args) {
        var tmpl, options = args[1] || {};
        tmpl = args[0];
        if (tmpl) {
            // Build with customize template html structures.
            if (typeof tmpl === 'string') {
                options.html = tmpl;
            } else if (typeof tmpl === 'object') {
                options = tmpl;
            }
        }
        var className = options.skin;
        if (className) {
            options.className = className;
            delete options.skin;
        }
        return options;
    }

    var createLayer = function(tmpl, options) {
        var options = normalizeIBoxArgs([tmpl, options]);
        return new MessageBox(options);
    }

    var showBubble = function(text, options, sender) {
        // HANDLE: tips(options)
        if (typeof text === 'object') {
            sender = options;
            options = text;
            text = '';
        }
        // HANDLE: tips(text, sender)
        else if (isNode(options)) {
            sender = options;
            options = {};
        }
        // HANDLE: tips(text, 500)
        else if (typeof options === 'number') {
            options = { duration: options }
        }
        options = options || {}
        var d = createLayer(extend({
            id: guid(),
            content: text,
            className: 'ui-bubble',
            autofocus: false,
            autoRelease: true,
            close: false,
            xtype: 'none',
            align: 'top',
            duration: 2000,
            hideWithAni: 'fadeOut',
            showWithAni: 'fadeInUp'
        }, options));
        return options.hide ? d : d.show(sender);
    };

    /**
     * Basic message box exports.
     * @singleton
     */
    var Box = {

        /**
         * Factory method for create a generic layer instance. return a singleton
         * instance if `id` provided.
         *
         * @method create
         * @param {Object|String} options The options for dialog creates. as the
         *                      dialog template structures if a string value given.
         */
        create: createLayer,

        /**
         * Show dialog by a specified page url with a iframe loader.
         *
         * @param {String} url The page url to load.
         * @param {Object} options (Optional) sets the options for generic Box construct.
         * constructor.
         */
        loadUrl: function(url, options) {
            options = options || {}
            options.url = url;
            var box = createLayer(options);
            return box.show();
        },

        /**
         * Show a spinner layer for asyn process, defaults use modal overlayer.
         *
         * @param {String} text The loading text
         * @param {Object} options The mixin options to construct
         */
        loading: function(text, options) {
            options = options || {};
            var d = createLayer(extend({
                autofocus: true,
                autoRelease: true,
                id: guid(),
                modal: true,
                close: false,
                xtype: 'loading',
                content: text || ''
            }, options));
            return options.hide ? d : d.show();
        },
		/* fullScreen modify by:licuiting */
        fullScreen: function(html, options) {
            options = options || {};
            var tplBox = [
				'<div class="ui-full-screen">',
                html,
                '<div class="close icon-close" action-type="close"></div>',
				'</div>'
            ].join('');
            var opt = extend({
                className: '',
                showWithAni: 'fadeIn',
                hideWithAni: 'fadeOut'
            }, options);
            var layer = createLayer(tplBox, opt);
            return options.hide ? layer : layer.show();
        },
        /**
         * alert box
         *
         * @param {String} text The message text to show.
         * @param {Object|Function} options The dialog options, handler for the `OK`
         * button if given a function.
         */
        alert: function(text, options) {
            if (typeof options === 'function') {
                options = {
                    ok: { fn: options }
                }
            }
            options = extend({
                title: '提示',
                xtype: 'info',
                className: 'ui-box-alert',
                autofocus: true,
                id: guid(),
                modal: true,
                autoRelease: true,
                content: '<div>' + text + '</div>',
                ok: {
                    text: '确定',
                    fn: function() { }
                }
            }, options);
            return createLayer(options).show();
        },

        /**
         * Confirm
         *
         * @param {String} text confirm message text
         * @param {Function} ok The ok button callback function
         * @param {Function} cancel The cancel button callback function
         * @param {HTMLElement} sender A reference DOM element
         */
        confirm: function(text, ok, cancel, sender) {
            var options;
            // HANDLE: confirm(text, cb, sender)
            if (!sender && cancel && typeof cancel === 'object') {
                if (isNode(cancel)) {
                    sender = cancel;
                } else {
                    options = cancel;
                }
                cancel = ok;
            }
            // HANDLE: confirm(text, options [, ... ])
            if (typeof ok !== 'function') {
                options = ok;
                ok = noop;
            }
            if (typeof cancel !== 'function') {
                cancel = ok;
            }
            var callback = function(result) {
                if (result) {
                    ok(result);
                } else {
                    cancel(result);
                }
            }
            if (options) {
                sender = sender || options.sender;
            }
            var d = createLayer(extend({
                xtype: 'confirm',
                autofocus: true,
                id: guid(),
                modal: !sender,
                autoRelease: true,
                content: '<div>' + text + '</div>',
                close: false,
                ok: {
                    text: '确定',
                    fn: function() { callback(true) }
                },
                cancel: {
                    text: '取消',
                    fn: function() { callback(false) }
                }
            }, options));
            return d.show(sender);
        },

        /**
         * Show a bubble tips, optionally provide a icon by `xtype`, `autofocus` disabled
         * by the defaults.
         *
         * @param {String} text The tips text to show
         * @param {Object|Number} Options for bubble constructor. Handle as duration if a number value.
         *                        ----------
         *                        duration] {Number} - A millisecond number for bubble auto hide
         *                        delay {Number} - show the bubble with a specified millisecond delay
         *                        xtype {String} - icon types: 'info', 'warn', 'confirm', 'error', 'ok', 'loading'
         *                        iconHTML {String} - custom the icon with a plain html string
         *
         * @param {HTMLElement} sender A reference DOM element
         *
         * @example
         *
         * ```js
         *  var d = box.bubble('bubble text', { title: 'foo title', duration: 3000 }, $('#btn-test')[0]);
         * ```
         */
        bubble: showBubble

    };

    // Aliases
    Box.tips = Box.bubble;

    // Exports some shortcut api `ok`, `info`, `warn`, `error` for rich tips with auto hide in a
    // specific duration.
    util.each(['ok', 'info', 'warn', 'error'], function(type, i) {
        Box[type] = function(text, duration, sender) {
            var options = { xtype: type }
            // tips(text, sender)
            if (duration && duration.nodeType) {
                sender = duration;
                duration = undefined;
            } else if (typeof duration === 'number') {
                options.duration = duration
            } else {
                options = extend(options, duration)
            }
            return showBubble(text, options, sender)
        }
    });

    // Exports

    Box.get = MessageBox.get;

    // Exports api for customize default config globally
    Box.config = MessageBox.config;

    module.exports = Box;

});
