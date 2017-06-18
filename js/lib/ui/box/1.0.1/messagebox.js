/**
 * Message box extensions based on dialog layer, integrates iframe loader and (x)bubble tips.
 *
 * @author Allex Wang(allex.wxn@gmail.com)
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var util = require('../../../core/1.0.0/utils/util');

    var Drag = require('./drag');
    var BaseDialog = require('./dialog');

    var each = util.each;
    var extend = util.extend;
    var clearTimeout = window.clearTimeout;

    var LOADING_ICO_URL = '//' + (window.location<'https'?'s3':'ssl') + '.bbgstatic.com/pub/img/loading/loading32x32.gif';

    // Pre-load x-box icons, load the font resources in case the icon class been
    // triggered.
    ;(function() {
        var tmp = $('<i class="ui-box-iconf" style="position:absolute;left:-999em;top:-999em;">x<img src="' + LOADING_ICO_URL + '"</i>').appendTo('body')
        setTimeout(function() { tmp.remove(); tmp = null }, 50)
    }())

    // xicon helper {{{
    var xIcons = {
        'info'   : '&#x69;',
        'warn'   : '&#x21;',
        'confirm': '&#x3f;',
        'ok'     : '&#x2714;',
        'error'  : '&#x2718;',
        'loading': '<img src="' + LOADING_ICO_URL + '" />'
    };

    var createIcon = function(t) {
        var ico = xIcons[t]
        return ico ? '<i node-type="icon" class="x-icon ui-box-iconf">' + ico + '</i>' : '';
    };

    var __idSeed = util.guid('__x') + '$';
    var getXId = function(t) { return __idSeed + t };

    var getXContent = function(html, options) {
        var xtype = options.xtype, icon = xtype && createIcon(xtype) || options.iconHTML, text;
        if (icon) {
            text = html ? '<div node-type="text" class="x-text">' + html + '</div>' : ''
            html = [
                '<div class="ui-box-x-wrap">',
                  icon,
                  text,
                '</div>'
            ].join('');
        }
        return html;
    };
    // }}}

    // iframe helper {{{
    var getIframeDoc = function (iframe) {
        // Returns `0` if cross accessable denied.
        var win = iframe.contentWindow
        if (win) {
            try {
                return win.document
            } catch (e) { return 0 }
        }
    }

    /**
     * Init iframe box
     * @private
     */
    var _initIframeBox = function(box) {
        var iframe

        box.once('init', function(options) {
            // cache some options need to apply after iframe loaded.
            var lazyOptions = {}
            each(['title', 'width', 'height', 'button'], function(k) {
                lazyOptions[k] = options[k];
                delete options[k];
            });

            // Iframe load
            box.once('load', function() {
                var options = box._;
                each(lazyOptions, function(v, k) {
                    if (!v) return;
                    if (k === 'title') {
                        // `auto` - retrieve title from iframe page
                        if (v === 'auto')
                            try {
                                v = iframe.contentWindow.document.title || '';
                            } catch (e) { v = '' }
                        v && box.title(v);
                    } else {
                        if (typeof box[k] === 'function') box[k](v);
                        else options[k] = v;
                    }
                })
            });
        })

        // Support iframe loader for dialog content.
        .once('render', function() {
            var options = box._;
            setTimeout(function() {
                iframe = _loadIframe(box, options.url);
                box.iframeNode = iframe;
            }, 30);
            var originalOptions = options.original;
            if (!(originalOptions instanceof Object)) {
                var un = function () { box.hide().destroy() };
                for (var i = 0; i < frames.length; i ++) {
                    try {
                        // Check dialog options hosted by iframe inner window object.
                        if (originalOptions instanceof frames[i].Object) {
                            // To prevent the execution of the object is forced to
                            // withdraw cause IE error: "Can not execute code released Script"
                            $(frames[i]).one('unload', un);
                            break;
                        }
                    } catch (e) {}
                }
            }
        })

        // destroy
        .once('beforeremove', function () {
            // Set about blank to destroy and remove iframe
            // MS releases a browser with such defects (memory leaks in the
            // Javascript interpreter)
            $(iframe).attr('src', 'about:blank').remove();
        }, false);
    };

    /**
     * Load iframe page
     * @private
     */
    var _loadIframe = function(box, url) {
        var options = box._
          , $content = box.$('content')
          , $iframe = $content.find('iframe')
          , iframe = $iframe && $iframe[0]
          , hanedleLoad = function(size) {
                box._freeze(true);
                if (size) {
                    if (!options.width) box.width(size.width);
                    if (!options.height) box.height(size.height);
                }
                box.emit('load');
                box._freeze(false).resize();
                hanedleLoad = null;
                $iframe.removeAttr('style');
                $iframe = iframe = null;
            }
          , onIframeLoad = function(fn) {
              if (!options.showing) fn()
              else box.once('shown', fn)
            }
        if (!$iframe.length) {
            var msie = /(msie) ([\w.]+)/.test(navigator.userAgent.toLowerCase());
            var tplIframe = '<iframe id="{id}-iframe" name="{id}-iframe" class="iframe" frameborder="0" hspace="0"' + (msie ? ' allowtransparency="true"' : '')
                              + ' scrolling="' + options.scrolling + '"'
                              + ' style="position:absolute;left:-9999em;top:-9999em;"'
                              + ' src="' + url + '"></iframe>';
            $iframe = $(tplIframe.replace(/{id}/g, options.id)).appendTo($content);
            iframe = $iframe[0];
            // Auto fit the iframe page width and height.
            if (options.autoSize) {
                $iframe.one('load', function() {
                    var doc = getIframeDoc(iframe)
                      , $tmp = doc && $(doc)
                      , width, height, size
                    if ($tmp) {
                        width = $tmp.width();
                        // Reset iframe width first to trigger reflow, then we can
                        // get real height value correctly
                        $iframe.width(width);
                        height = $tmp.height();
                        size = { width: width, height: height }
                    }
                    onIframeLoad(function() { hanedleLoad(size) })
                });
            } else {
                onIframeLoad(function() { hanedleLoad() })
            }
        }
        return iframe;
    };
    // }}}

    /** @constructor */
    var MessageBox = function(options) {
        var self = this;
        options = extend({}, options); // clone origin options

        // Adaptor the shortcut buttons: ok, cancel
        var button = options.button || (options.button = []);
        each(['cancel', 'ok'], function(k, i) {
            var tmp = options[k];
            if (tmp && typeof tmp === 'object') {
                tmp.id = k;
                button.push(tmp);
                delete options[k];
            }
        });

        // build layer with x-icon message tips
        var xtype = options.xtype;
        if (xtype) {
            options.id = options.id || getXId(xtype);
            options.content = getXContent(options.content, options);
            if (xtype !== 'none') {
                options.className = (options.className || '') + ' ui-box-x-' + xtype;
            }
        } else {
            var iframeUrl = options.url;
            if (iframeUrl) {
                var showClose = options.close !== false;

                // Extends some defaults for iframe box
                options = extend({
                    modal: true,
                    close: false, // hide close icon first
                    autoRelease: true, // destroy when closed
                    autoSize: true,
                    scrolling: 'auto'
                }, options);

                // build spinner for iframe loader
                var spinner = $(getXContent('Loading...', { xtype: 'loading' })).addClass('ui-box-x-loading');
                options.content = spinner;
                options.className = (options.className || '') + ' ui-box-iframe';
                self.once('load', function() {
                    // remove spinner
                    spinner.remove();
                    spinner = null;
                    if (showClose) {
                        self.$('close').show();
                    }
                });
                // auto destroy if a iframe loader
                self.on('hidden', function() { self.destroy(); })
                _initIframeBox(self);
            }
        }

        self = BaseDialog.call(self, options) || self;

        if (!self._ready) {
            // Install drag-drop plugin
            self.once('render', function() {
                var $title = self.$('title');
                if ($title.length && options.drag !== false) {
                    $title.css('cursor', 'move');
                    var drag = Drag.create(self.node, null, {
                        hook: $title,
                        onstart: function() {
                            if (!self.anchor) self.focus();
                        }
                    });
                }
            });
        }

        return self
    }

    // Internal option names
    var __OPT_SHOW_DELAY = '__showDelay', __OPT_HIDE_TIMER = '__hideTimer'

    util.inherits(MessageBox, BaseDialog, {

        /**
         * Show dialog and optional set a timer to delay close the dialog automatic.
         *
         * @param {HTMLElement} sender (Optional) set element for dialog show refs.
         * @param {Number} options (Optional) set a delay times for auto close the dialog layer
         */
        show: function(sender, options) {
            var self = this
              , _ = self._
              , args = [].slice.call(arguments)
              , options = extend({}, _, options)
              , duration = options.duration || 0
              , showDelay = options.delay || 0
              , reset = function() {
                    util.each([__OPT_SHOW_DELAY, __OPT_HIDE_TIMER], function(opt, t) { t = _[opt];
                        delete _[opt];
                        t && clearTimeout(t);
                    });
                }
              , show = function() {
                    // Optional create a timer for auto hide this layer
                    if (duration > 0) {
                        _[__OPT_HIDE_TIMER] = setTimeout(function() { reset(); self.hide(); }, duration);
                        self.once('hide', reset);
                    }
                    MessageBox.__super__.show.apply(self, args);
                }

            reset();

            // Optional show layer with delay features
            if (showDelay > 0) {
                _[__OPT_SHOW_DELAY] = setTimeout(show, showDelay);
            } else {
                show();
            }

            return self;
        },

        /** @overwrite */
        hide: function() {
            var self = this, _ = self._;
            _ && util.each([__OPT_SHOW_DELAY, __OPT_HIDE_TIMER], function(opt, t) { t = _[opt];
                delete _[opt];
                t && clearTimeout(t);
            });
            MessageBox.__super__.hide.apply(self, arguments);
            return self;
        }

    });

    // Extends config api
    MessageBox.config = BaseDialog.config;

    // overwrite with iframe retriever
    MessageBox.get = function (id) {
        if (!id) return;
        var pool = BaseDialog.get(), iframe, instance;
        // Retrieve dialog instance by iframe DOM.
        if (id && ( iframe = id.frameElement )) {
            for (var i in pool) {
                if (pool.hasOwnProperty(i)) {
                    instance = pool[i];
                    if (instance.iframeNode === iframe)
                        return instance;
                }
            }
        }
        return pool[id];
    };

    module.exports = MessageBox;
});
