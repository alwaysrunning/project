/**
 * Dialog for message box construct
 *
 * NOTE:
 *
 * This module will load it's style by self. you can overwrite it by customize
 * `className` option.
 *
 * Please make sure [css plging](https://github.com/guybedford/require-css) installed.
 * like: `require(['css!./mycssFile']);`
 *
 * @author Allex Wang(allex.wxn@gmail.com)
 */
define(function (require, exportsr, module) {
    'use strict';

    // load base styles,
    require('css!./css/dialog.css');

    var $ = require('jquery');
    var util = require('../../../core/1.0.0/utils/util');
    var Delegator = require('../../../core/1.0.0/dom/delegator');
    var Popup = require('./popup');

    var extend = util.extend;
    var guid = util.guid;
    var each = util.each;

    var document = window.document;

    var defaults = {
        // base zIndex
        zIndex: 1024,
        title: '',
        // show close button
        close: true,
        // hide on click blank
        clickBlankToHide: false,
        // content html
        content: '<span class="ui-box-loading">Loading..</span>',
        // Customize dialog ui by special a css class
        className: '',
        // styles
        width: '',
        height: '',
        button: null,
        // Default class for function buttons
        buttonClass: 'ui-box-btn',
        buttonClassLight: 'autofocus',
        // Popup template html structures, with `node-type` as component key.
        html:
            '<div node-type="inner" class="ui-box">'
            +  '<a node-type="close" action-type="close" class="ui-box-iconf ui-box-close">x</a>'
            +  '<div node-type="header" class="ui-box-hd">'
            +    '<div node-type="title" class="ui-box-title"></div>'
            +  '</div>'
            +  '<div node-type="body" class="ui-box-bd"><div node-type="content" class="ui-box-content"></div></div>'
            +  '<div node-type="footer" class="ui-box-ft">'
            +    '<div node-type="button" class="ui-box-func"></div>'
            +  '</div>'
            +'</div>'
    };

    // cache all dialog instance
    var _instancePool = {};

    var Dialog = function (options) {

        var originalOptions = options || (options = {});
        var id = options.id || (options.id || guid())

        // Returns the previous instance instead.
        var self = Dialog.get(id) || this;

        if (typeof options === 'string' || options.nodeType === 1) {
            options = {content: options};
        }

        options = extend({}, defaults, options);
        options.original = originalOptions;

        // Normalize buttons settings to array list
        var tmp, button = options.button || (options.button = [])
        if (!$.isArray(tmp = button)) {
            tmp = [];
            // transform k/v object to array list
            if (button && typeof button === 'object') {
                each(button, function(o, k) { o.id = k; tmp.push(o); });
            }
            button = options.button = tmp
        }
        if (button.length > 0) {
            var hasFocus = false;
            each(button, function(o, i) {
                var id = o.id || guid();
                if (o.autofocus) hasFocus = true;
                // Merge special button settings, like ok, cancel
                if (options[id]) extend(o, options[id]);
                o.index = i;
            });
            if (!hasFocus) button[button.length - 1].autofocus = true;
        }

        self.emit('init', options);

        if (!self.initialized) {
            self.init(options);
        } else {
            self.options(options).focus();
        }

        _instancePool[id] = self;

        // Returns the previous instance instead.
        return self;
    };

    util.inherits(Dialog, Popup, {

        /** internal constructor */
        init: function (options) {
            var self = this;

            Popup.call(self, options);

            // Provide a proxy function for action result filters,
            // to be called after each action handle triggered.
            var handleDelegate = function(e) {
                var isClosePrevented = e.actionValue === false || e.isDefaultPrevented()
                if (!isClosePrevented) {
                    self.hide();
                }
            }

            // Instantiation dialog delegator for action event handles.
            self._delegator = new Delegator( self.node, { context: self,
                                                          onDelegate: handleDelegate } );

            self
              // Add generic close action event handler
              .delegate('close', function(e) { self.hide() })
              .once('render', function() { self.initComponents() })
              .on('destroy', function() {
                  delete _instancePool[options.id];
                  self._delegator.destroy();
              })
        },

        options: function(options) {
            var self = this, options = extend(self._, options);

            // Apply options with internal setter apis by whitelist
            self._freeze(true);
            each([ 'title', 'content', 'width', 'height', 'action', 'button' ], function (k, v) {
                v = options[k]
                // call option setter additionally
                if (v != null && typeof self[k] === 'function') self[k](v);
            });
            self._freeze(false).resize();

            if (options.zIndex) {
                Popup.zIndex = options.zIndex;
            }

            return self;
        },

        /** Initialize dialog components */
        initComponents: function () {
            var self = this, options = self._;

            self.$('header').hide();
            self.$('footer').hide();

            self.options();

            // hide close button additionally
            if (!options.close) {
                self.$('close').css('display', 'none');
            }

            // Proxy click event on bank to hide dialog
            if (options.clickBlankToHide) {
                $(self.mask).on('onmousedown' in document ? 'mousedown' : 'click', function () {
                    self.hide();
                    return false; // prevents capture focus
                });
            }

            // handles ESC
            var handleESC = function (e) {
                var target = e.target;
                var nodeName = target.nodeName;
                var rinput = /^input|textarea$/i;
                var isTop = Popup.current === self;
                var keyCode = e.keyCode;

                if (!isTop || rinput.test(nodeName) && target.type !== 'button') {
                    return;
                }
                if (keyCode === 27) {
                    self.hide();
                }
            };
            $(document).on('keydown', handleESC);

            self.on('destroy', function () {
                $(document).off('keydown', handleESC);
            });
        },

        /**
         * Register a action event hanedle to the dialog delegator.
         *
         * @param {String} type (Optional) Set the event name to proxy, defaults to click event
         * @param {String} action The action name to identify, should sync with DOM
         *                  attribute `action-type`, eg `<span action-type="goBack">back</span>`
         * @param {Function} fn A function to hanedle when action triggered..
         */
        delegate: function(type, action, fn) {
            var o = this._delegator;
            o.on.apply(o, arguments);
            return this;
        },

        /**
         * Undelegate the specific action handler.
         *
         * @param {String} type (Optional) Set the event name to proxy, defaults to click event
         * @param {String} action The action name to unbind.
         * @param {Function} fn The action haneler to unbind.
         */
        undelegate: function(type, action, fn) {
            var o = this._delegator;
            o.un.apply(o, arguments);
            return this;
        },

        /**
         * Set dialog body content.
         *
         * @param {String, HTMLElement} html string
         */
        content: function (html) {
            var $content = this.$('content');

            // HTMLElement
            if (html && html.nodeType) {
                if ($.contains(document, html)) {
                    this.on('beforeremove', function () {
                        $('body').append(html.hide());
                    });
                }
                html = $(html);
                $content.empty().append(html.show());
            // String
            } else {
                $content.html(html);
            }

            return this.resize();
        },

        title: function (s) {
            this.$('title').html(s);
            this.$('header')[s ? 'show' : 'hide']();
            return this;
        },

        width: function (value) {
            if (value !== '') {
                this.$('content').css('width', value);
                this.resize();
            }
            return this;
        },

        height: function (value) {
            if (value !== '') {
                this.$('content').css('height', value);
                this.resize();
            }
            return this;
        },

        /**
         * Setup dialog buttons.
         *
         * @param {Array|String} button The button options {text, fn, autofocus, disabled}
         */
        button: function (args) {
            args = args || [];
            var self = this, _ = self._
              , html = '', n = 0
              , buttonCls = _.buttonClass

            if (typeof args === 'string') {
                html = args;
                n++;
            } else {
                each(args, function (conf, i) {
                    var id = conf.id
                      , fn = conf.fn || conf.callback
                      , visible = conf.display !== false
                      , userClass = conf.className || buttonCls // use customize button class instead
                      , classNames = [userClass]
                    if (conf.autofocus) {
                        classNames.push(_.buttonClassLight);
                    }
                    if (typeof fn === 'function') {
                        // Register action event handle to delegator
                        self.delegate(id, fn);
                    }
                    if (visible) n++;
                    html +=
                      '<button type="button" action-type="' + id + '"'
                        + (!visible ? ' style="display:none"' : '')
                        + (' class="' + classNames.join(' ') + '"')
                        + (conf.disabled ? ' disabled' : '')
                        + '>' + (conf.text || conf.value) + '</button>';
                });
            }

            self.$('button').html(html);
            self.$('footer')[n ? 'show' : 'hide']();
            self.resize();

            return self;
        },

        /**
         * Register actions events with k/v mapping, The action name should be in
         * html attribute named with `action-type="***"`.
         *
         * @param {Object} The actions object.
         * @example
         *
         * ```html
         *  <div>
         *    <div class="content"> .... </div>
         *    <div class="close" action-type="close">x</div>
         *    <div class="btn-ok" action-type="ok">OK</div>
         *    <div class="btn-cancel" action-type="cancel">Cancel</div>
         *  </div>
         * ```
         *
         * ```js
         *  var actions = {
         *    ok: function(e) {
         *      console.log('ok');
         *    },
         *    cancel: function(e) {
         *      console.log('cancel');
         *    }
         *  }
         *
         *  var box = new Dialog(html, { action: actions });
         * ```
         */
        action: function(conf) {
            var self = this;
            each(conf, function(fn, k) {
                self.delegate(k, fn);
            });
            return self;
        }

    });

    /**
     * An API for get current active dialog instance.
     *
     * @method getCurrent
     * @static
     */
    Dialog.getCurrent = function () {
        return Popup.current;
    };

    /**
     * An API for get a specific dialog instance by id.
     *
     * @param {String} dialog instance id
     * @return {Object} dialog instance, Returns all instances if id is not provided.
     */
    Dialog.get = function (id) {
        return id === undefined ? _instancePool : _instancePool[id];
    };

    /**
     * An API for extends the dialog constructor default settings.
     */
    Dialog.config = function(settings) {
        if (settings) {
            extend(defaults, settings);
        }
    };

    /* Exports */
    module.exports = Dialog;

});
// vim: set fdm=marker ts=4 sw=4 sts=4 tw=85 et :
