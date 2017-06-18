/**
 * Base popup layer for dialog extensions, inspired by artDialog.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var util = require('../../../core/1.0.0/utils/util');
    var css = require('../../../core/1.0.0/utils/css');
    var EventEmitter = require('../../../core/1.0.0/event/emitter');

    var global = window
      , document = global.document
      , $window = $(global)
      , $document = $(document)
      , documentElement = document.documentElement
      , rnotwhite = (/\S+/g)
      , isIE6 = !('minWidth' in documentElement.style)
      , LAYER_CLASS = 'ui-layer'

    // helper {{{

    var Math = global.Math, max = Math.max, ceil = Math.ceil
      , guid = util.guid
      , extend = util.extend
      , each = util.each
      , bind = function(fn, o) { return fn.bind ? fn.bind(o) : function() { return fn.apply(o, arguments) } }
      , setImmediate = util.setImmediate
      , parseInt = function(n) { return global.parseInt(n, 10) || 0 }
      , isNode = function(o) { return o && o.nodeType === 1 }

    // Detector for check css fixed feature supported (by Allex Wang)
    var isFixedSupported = function() {
        return isFixedSupported._ || (isFixedSupported._ = function() {
            var test  = document.createElement('div'),
                control = test.cloneNode(false),
                fake = false,
                root = document.body || (function () {
                    fake = true;
                    return documentElement.appendChild(document.createElement('body'));
                }());
            test.style.cssText = 'position:fixed;top:42px';
            root.appendChild(test);
            root.appendChild(control);
            var ret = test.offsetTop !== control.offsetTop;
            root.removeChild(test);
            root.removeChild(control);
            if (fake) {
                documentElement.removeChild(root);
            }
            test = control = null;
            return ret;
        }())
    },

    getScrollOffset = function() {
        return {
            x: $document.scrollLeft(),
            y: $document.scrollTop()
        }
    },

    getSize = function(el) {
        return {
            w: el.width(),
            h: el.height()
        }
    },

    getWinSize = function() {
        return getSize($window)
    },

    // Get target offset, the source object can be both DOM element and event object
    getOffset = function (src) {
        var isEl = isNode(src);
        var offset = isEl ? $(src).offset() : { left: src.pageX, top: src.pageY };

        src = isEl ? src : src.target;
        var ownerDocument = src.ownerDocument;

        if (ownerDocument === global.document) {
            return offset;
        }

        // {Element: Ifarme}
        var defaultView = ownerDocument.defaultView || ownerDocument.parentWindow
          , frameElement = defaultView.frameElement
          , scroll = getScrollOffset()
          , frame = $(frameElement).offset()

        return {
            left: offset.left + frame.left - scroll.x,
            top: offset.top + frame.top - scroll.y
        }
    },

    calculateOuterSize = function(elem, dimension) {
        if (elem.length) {
            var size = parseInt(elem.css(dimension)) || elem[0]['offset' + dimension.charAt(0).toUpperCase() + dimension.slice(1)];
            var sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
            each(sides[dimension], function(side, i) {
                size += parseInt(elem.css('margin-' + side), 10) || 0;
            });
            return size;
        } else {
            return 0;
        }
    },

    outerWidth = function(el) {
        return calculateOuterSize(el, 'width');
    },

    outerHeight = function(el) {
        return calculateOuterSize(el, 'height');
    },

    // Gets the DOM object that has the focus.
    getActiveElement = function () {
        try {// try: ie8~9, iframe #26
            var activeElement = document.activeElement
              , contentDocument = activeElement.contentDocument;
            return contentDocument && contentDocument.activeElement || activeElement;
        } catch (e) {}
    },

    // Normalize align data
    //
    // @return {Object} Align model
    // A align object with position configs:
    // ====
    // #.conf {Array} vertical and horizontal axis directions, e.g,
    //   'lt' => ['l', 't']
    //   'left top' => ['l', 't']
    //   'left right' => ['l']
    // #.auto {Boolean} Adjust the position to constrain to the viewport if
    //    necessary, Defaults to true
    //
    parseAlign = function(align) {
        align = align || '';

        var self = { auto: true };

        var lastChar = align.slice(-1);
        if (lastChar === '!') {
            self.auto = false
            align = align.slice(0, -1);
        }

        var align = align.length <= 2 ? align.split('') : align.replace(/^\s+|\s+$/g, '').split(' ').slice(0, 2)
           , axis = {}
           , dir
           , positions = {t: 't', b: 't', l: 'l', r: 'l'}

        // Normalize aligns and short it.
        for (var i = -1, l = align.length; ++i < l; ) {
            dir = align[i].charAt(0); // get first char => { left: l, right: r, top: t, bottom: b }
            if (!dir || axis[positions[dir]]) {
                align.splice(i, 1);
            } else {
                align[i] = dir;
                axis[positions[dir]] = 1; // avoid the same axis direction
            }
        }

        if (align.length === 2 && align[0] === align[1]) {
            align.pop()
        }

        self.align = align;

        return self;
    }

    // }}}

    function Popup (options) {
        var self = this;

        var defaults = {
            // Trigger focus when popup shown
            autofocus: true,

            // Use absolute: fixed for popup layout
            fixed: false,

            // Defaults to aligning the element's top-left corner to the target's bottom-left corner ("bl")
            // For details see #{.alignTo()}
            align: 'bl',

            // Base class name for container element
            className: '',

            // Enable disappear view when tap out of the dialog
            clickBlankToHide: false,

            // Optional set the popup layer host container (Defaults to body)
            appendTo: 'body',

            // Auto destroy popup instance (call #destroy when popup hidden)
            autoRelease: false,

            // Template html for popup constructor
            html: '',

            // Show layer with a overlayer
            modal: false,

            // Optional set animate type for **#show** and **#hide**
            showWithAni: 'bounceIn:fast',
            hideWithAni: 'bounceOut:fast'
        };

        self._ = options = extend(defaults, options);

        // Re-assign `fixed` if builtin css not supported.
        options.fixed = options.fixed ? isFixedSupported() : false;

        var $popup = $('<div class="' + LAYER_CLASS + '" id="' + (options.id || guid()) + '" />')
            .css({
                display: 'none',
                position: 'absolute',
                outline: 0
            })
            .attr('tabindex', '-1')
            .html(options.html);

        var $shadow = $('<div />');

        self._popup = $popup;
        self._mask = self._shadow = $shadow; // shadow for lock tabindex when modal mode

        self.node = $popup[0];
        self.mask = $shadow[0];

        self.on('render', function(options) {
            var className = options.className
              , $mask = self._mask
              , zIndex = options.zIndex
              , maskCss

            if (!$popup.html()) {
                $popup.html(options.html);
            }

            if (className) {
                $popup.addClass(className);
            }
            $popup.css('position', options.fixed ? 'fixed' : 'absolute');

            if (zIndex) {
                $popup.css('zIndex', zIndex);
            }

            // init modal with mask overlayer
            if (options.modal) {
                $popup.addClass(LAYER_CLASS + '-modal');

                maskCss = {
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    userSelect: 'none',
                    zIndex: zIndex || Popup.zIndex,
                    backgroundColor: '#000',
                    opacity: .3
                };
                if (!isFixedSupported()) {
                    extend(maskCss, {
                        position: 'absolute',
                        width: $window.width() + 'px',
                        height: $document.height() + 'px'
                    });
                }

                $mask.attr('tabIndex', 0).on('focus', bind(self.focus, self));

                // lock tab index
                self._shadow = $mask.clone(true);
                $mask.css(maskCss).addClass(LAYER_CLASS + '-mask');
            }
        });

        self.on('beforeShow', function(options) {
            var anchor = self.anchor, dir = self._dirClass;
            if (!anchor && dir) {
                $popup.removeClass(dir);
                delete self._dirClass;
            }
        });

        self.on('show', function(options) {
            self.resize();
            if (options.modal) {
                self._mask.insertBefore($popup).css('display', 'block');
                self._shadow.insertAfter($popup);
            }
            if (options.autofocus) self.focus();
        });

        self.on('hide', function(options) {
            self._mask.remove();
            self._shadow.remove();
            self.blur();
        });

        self.once('destroy', function() {
            $popup.off();
            $popup = null;
            self._mask.off();
            self._shadow.off();
        });

        if (!isIE6) {
            var resize = bind(self.resize, self);
            self.on('render', function() { $window.on('resize', resize) })
            self.on('destroy', function() { $window.off('resize', resize) })
        }

        self.destroyed = false;
        self.initialized = true;
    }

    util.inherits(Popup, EventEmitter, {

        /** @type {Boolean} */
        open: false,

        /** @type {Boolean} */
        destroyed: true,

        /**
         * @event render
         * Fires after the component markup is rendered.
         */

        /**
         * @event beforeShow
         */

        /**
         * @event show
         * Fires when the component is to be show.
         */

        /**
         * @event shown
         * Fires after dialog view shown also animation play to end.
         */

        /**
         * @event beforeHide
         */

        /**
         * @event hide
         */

        /**
         * @event hidden
         */

        /**
         * @event beforeremove
         * Fires before the component is {#destroy}ed.
         */

        /**
         * @event destroy
         * Fires after the component is {#destroy}ed.
         */

        /**
         * @event resize
         * Fires when the popup instance is resize by calling the {#resize} method.
         */

        /**
         * @event focus
         * Fires when the popup element is focused by calling the {#focus} method.
         */

        /**
         * @event blur
         * Fires when popup element loses focus either via the pointing device or by calling {#blur} method.
         */

        /**
         * Popup layer view DOM element.
         * @type {HTMLElement}
         */
        node: null,

        /**
         * Popup layer mask overlayer DOM element.
         * @type {HTMLElement}
         */
        mask: null,

        /** Event API methods */

        /**
         * add event listener
         * @param {String} type
         * @param {Function} fn
         * @method on
         */

        /**
         * remove event listener
         * @param {String} type
         * @param {Function} fn
         * @method un
         */

        /**
         * Override emit method to support event method in construct options.
         * @param {String} type
         * @method un
         */
        emit: function (type) {
            var types = ( type || '' ).match(rnotwhite) || [], t = types.length;
            while (t--) {
                var optEventFn = this['on' + types[t]];
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof optEventFn === 'function')
                    optEventFn.apply(this, args);
            }
            Popup.__super__.emit.apply(this, arguments);
        },

        /**
         * DOM grep api for select elements identified by attribute `node-type`,
         * e.g, `<div node-type="body"></div>`
         *
         * @return {jQuery} Returns a jquery DOM object.
         */
        $: function (type, strictReturn) {
            var nodeList = this._nodes || (this._nodes = {})
              , node = nodeList[type]
            if (!node || (strictReturn && node.length === 0)) {
                node = this._popup.find('[node-type="' + type + '"]');
                if (strictReturn && node.length > 0) {
                    nodeList[type] = node;
                }
            }
            return !strictReturn || node.length ? node : null;
        },

        /**
         * Show popup layer, optional set first args with a boolean value to turn
         * on/off modal modes.
         *
         * @param {HTMLElement|Event|Boolean} Set the relevant element to position refer.
         *          `trun` if need to show modal layer with mask overlayer
         * @param {Object} options (Optional) show with customize options overwriting
         *          the constructs settings. eg, { showWithAni: 'shake:fast' }
         */
        show: function (anchor, options) {
            var self = this
              , _ = self._
              , firstArg = anchor
              , firstType
              , anchorTarget = null
              , animate = self._anim

            if (animate) {
              animate.stop(true);
            }

            if (self.destroyed || _.showing || self.open) {
                return self;
            }

            options = extend({}, self._, options);

            if (firstArg !== undefined) {
                firstType = typeof firstArg;

                // HANDLE: #.show( [ true|false ] )
                // Check modal on-off
                if (firstType === 'boolean') {
                    // overwrite modal option
                    options.modal = firstArg;
                }
                else if (firstArg && firstType === 'object') {

                    // HANDLE: #.show( element [, options ] )
                    // Check the first arg is a Element or DOM event
                    if ( isNode(firstArg) || isNode(firstArg.target) ) {
                        anchorTarget = firstArg;
                    } else {
                        // HANDLE: #.show(options)
                        // Overwrite constructor options
                        extend(options, firstArg);
                    }
                }
            }

            var $popup = self._popup
              , showWithAni = options.showWithAni
              , onShow = function() { delete _.showing; self.emit('shown') }

            // Render popup layer if not ready yet.
            if (!self._ready) {
                self.emit('render', options);
                self._ready = true;
            }
            self.open = true;

            self.anchor = anchorTarget; // options.orig
            self._activeElement = getActiveElement();

            self.emit('beforeShow', options);

            // show popup
            $popup.appendTo(options.appendTo).css('display', 'block');

            self.emit('show', options);
            _.showing = true;

            if (showWithAni && showWithAni !== 'none') {
                var args = showWithAni.split(':');
                self._anim = css.effect(self.node, args[0], args[1], onShow);
            } else {
                onShow();
            }

            return self;
        },

        /**
         * Close layer, optional destroy current instance.
         *
         * @param {Boolean} destroy (Optional) set `TRUE` to destroy the layer after
         * popup disappeared.
         */
        hide: function (destroy) {
            var self = this
              , _ = self._
              , node = self.node
              , hideWithAni = _.hideWithAni
              , animate = self._anim, onHidden

            if (animate) {
              animate.stop(true);
            }

            if (self.destroyed || _.hidding || !self.open) {
                return self;
            }

            self.emit('beforeHide');
            _.hidding = true;

            onHidden = function() {
                if (_.hidding === true) {
                    node.parentNode.removeChild(node);
                    self._popup.hide();
                    delete _.hidding
                    self.open = false;
                    self.emit('hidden')
                    if (destroy || _.autoRelease) {
                        self.destroy();
                    }
                }
            }

            if (hideWithAni && hideWithAni !== 'none') {
                var args = hideWithAni.split(':');
                self._anim = css.effect(node, args[0], args[1], onHidden);
                self.emit('hide')
            } else {
                self.emit('hide');
                setImmediate(onHidden);
            }

            return self;
        },

        /**
         * Remove the popup DOM from document context, also destroy internal components.
         * @method destroy
         */
        destroy: function () {
            var self = this;

            if (self.destroyed) {
                return self;
            }

            self.emit('beforeremove');
            if (Popup.current === self) {
                Popup.current = null;
            }

            // remove components
            self._popup.off().remove();
            self._mask.off().remove();
            self._shadow.off().remove();
            self.emit('destroy');
            self.removeAllListeners();

            each(self, function(v, k) { delete self[k] });

            // fix some key properties in use by some apis when popup destroyed.
            self._ = {}
            self.destroyed = true;

            return self;
        },

        /**
         * Reset the popup element layout and reflow it position. this method also
         * triggers resize event.
         *
         * @method resize
         */
        resize: function () {
            var _ = this._;
            if (this.open && this._ready && !_.showing && !this._freezing) {
                var elem = this.anchor;
                if (elem) {
                    this.alignTo(elem);
                } else {
                    this.center();
                }
                this.emit('resize');
            }
            return this;
        },

        /**
         * Freeze the viewport. To disabled DOM reflow, for instance resize etc,.
         *
         * @protected
         * @param {Boolean} lock Set true to lock the resizing action
         */
        _freeze: function(v) {
            this._freezing = !!v
            return this;
        },

        /**
         * Causes the popup element to receive the focus and executes the code specified by
         * the focus event.
         *
         * @method focus
         */
        focus: function (e) {
            var options = this._;
            var node = this.node;
            var popup = this._popup;
            var current = Popup.current;
            var index = options.zIndex;

            if (current && current !== this) {
                current.blur(false);
            }

            if (!$.contains(node, getActiveElement())) {
                var el = popup.find('[autofocus]')[0];
                if (!options.focusing && el) {
                    options.focusing = true;
                } else {
                    el = node;
                }
                this._focus(el);
            }

            if (index === undefined) {
                index = options.zIndex = Popup.zIndex++;
                popup.css('zIndex', index);
                popup.addClass(LAYER_CLASS + '-focus');
            }

            Popup.current = this;

            this.emit('focus');

            return this;
        },

        /**
         * Causes the popup active element to lose focus and fires the blur event.
         *
         * @method blur
         */
        blur: function () {
            var options = this._
              , isBlur = arguments[0]
              , activeElement = this._activeElement

            if (!activeElement) {
                return this;
            }

            if (isBlur !== false) {
                this._focus(activeElement);
            }

            delete options.focusing;
            delete this._activeElement;
            this._popup.removeClass(LAYER_CLASS + '-focus');

            this.emit('blur');

            return this;
        },

        _focus: function (elem) {
            if (elem && this._.autofocus && !/^iframe$/i.test(elem.nodeName)) {
                // try ... cache for cross-iframe accessible error and invisible
                // elements. iframe will loss the focus in IE11
                try { elem.focus(); } catch (e) {}
            }
        },

        /**
         * Centers the Element in either the viewport, or another Element.
         *
         * @method center
         */
        center: function () {
            var popup = this._popup
              , fixed = this._.fixed
              , scroll = getScrollOffset()
              , view = getWinSize()
              , size = getSize(popup)
              , dx = fixed ? 0 : scroll.x
              , dy = fixed ? 0 : scroll.y
              , left = (view.w - size.w) / 2 + dx
              , top = (view.h - size.h) * (1 - 0.618) + dy // φ

            popup.css({
                left: max(parseInt(left), dx),
                top: max(parseInt(top), dy)
            })
            return this;
        },

        /**
         * Aligns this element with another element relative to the specified anchor
         * points.
         *
         * The position parameter is optional, also supports the "!" character. If
         * "!" is passed at the end of the position string, the element position is
         * locked. By the default, the element will attempt to align as specified,
         * but the position will be adjusted to constrain to the viewport if
         * necessary.
         *
         * Following are all of the supported anchor positions:
         *
         * Value  Description
         * -----  -----------------------------
         *  bl     The bottom left corner (default)
         *  b      The center of the bottom edge
         *  br     The bottom right corner
         *  tl     The top left corner
         *  t      The center of the top edge
         *  tr     The top right corner
         *  l      The center of the left edge
         *  r      The center of the right edge
         *
         * @method alignTo
         *
         * @param {HTMLElement} elem The element to align to.
         * @param {String} position (optional) The position to align to, defaults to "bl"
         */
        alignTo: function (elem, position) {
            var self = this
              , options = self._
              , $popup = self._popup
              , $refEl = elem.parentNode && $(elem)

            if (!$refEl) {
                return self;
            }

            // The hooks element invisible, position to center instead
            var o = $refEl.offset();
            if (o.left * o.top < 0) {
                return self.center();
            }

            position = position || options.align;

            var alignData = parseAlign(position)
              , align = alignData.align
              , restrictAlign = !alignData.auto

            if (!align || !align.length) {
                //>>excludeStart("debug", !pragmas.debug);
                console.warn('Popup align not valid. align to top instead.');
                //>>excludeEnd("debug")
                align = ['b'];
            }

            var lastClass = self._dirClass;
            if (lastClass) {
                $popup.removeClass(lastClass);
            }

            var fixed = options.fixed
              , view = getWinSize()
              , scroll = getScrollOffset()

              , popupWidth = outerWidth($popup)
              , popupHeight = outerHeight($popup)

              // related target viewport params
              , roffset = getOffset(elem)
              , rwidth = outerWidth($refEl)
              , rheight = outerHeight($refEl)
              , refX = roffset.left
              , refY = roffset.top

              , left =  fixed ? refX - scroll.x : refX
              , top = fixed ? refY - scroll.y : refY

              , minLeft = fixed ? 0 : scroll.x
              , minTop = fixed ? 0 : scroll.y
              , maxLeft = minLeft + view.w - popupWidth
              , maxTop = minTop + view.h - popupHeight

              , reverse = {t: 'b', b: 't', l: 'r', r: 'l'}
              , positions = {t: 'top', b: 'top', l: 'left', r: 'left'}

              , css = {}

            var temp = [{
                t: top - popupHeight,
                b: top + rheight,
                l: left - popupWidth,
                r: left + rwidth
            }, {
                t: top,
                b: top - popupHeight + rheight,
                l: left,
                r: left - popupWidth + rwidth
            }];

            var center = {
                l: left + ceil((rwidth - popupWidth) / 2),
                t: top + ceil((rheight - popupHeight) / 2)
            };
            var range = {
                left: [minLeft, maxLeft],
                top: [minTop, maxTop]
            };

            // Auto fit box edge, top|bottom, left|right
            if (!restrictAlign) {
                each(align, function (p, i) {
                    if (temp[i][p] > range[positions[p]][1]) {
                        p = align[i] = reverse[p];
                    }
                    if (temp[i][p] < range[positions[p]][0]) {
                        align[i] = reverse[p];
                    }
                });
            }

            var direction = align[0];

            // fix direction param
            if (!align[1]) {
                align[1] = positions[direction] === 'left' ? 't' : 'l';
                temp[1][align[1]] = center[align[1]];
            }

            // Recalculate the bubble position with offset spacing
            temp[0][direction] = temp[0][direction] + 10 * ('tl'.indexOf(direction) !== -1 ? -1 : 1);

            css[positions[align[0]]] = parseInt(temp[0][align[0]]);
            css[positions[align[1]]] = parseInt(temp[1][align[1]]);

            var dirClass = LAYER_CLASS + '-' + direction;
            $popup.css(css).addClass(dirClass);

            // Set hooks arrow position

            // cache dir classes
            self._dirClass = dirClass;

            var arrowEl = self.$('arrow', 1), inner = self.$('inner', 1)
            if (!arrowEl) {
                if (inner) {
                    arrowEl = $('<div node-type="arrow" class="ui-arrow"><i></i><b></b></div>').appendTo(inner);
                } else {
                    //>>excludeStart("debug", !pragmas.debug);
                    console.warn('Init popup hooks align failed, Both `arrow` and `inner` ' +
                            'section cannot found.');
                    //>>excludeEnd("debug")
                    return self;
                }
            }

            var isVertical = positions[direction] !== 'top'
              , arrowDir = ['v', 'h'][isVertical ^ 1] // get the arrow direction: vertical or horizontal
              , awidth = outerWidth(arrowEl)
              , aheight = outerHeight(arrowEl)
              , arrowLeft, arrowTop, arrowCss = {}
              , reversePos = isVertical ? 'left' : 'top'

            switch (arrowDir) {
            case 'h':
                arrowLeft = ceil(refX + (rwidth - awidth) / 2);
                arrowCss['left'] = arrowLeft;
                break;
            case 'v':
                arrowTop = ceil(refY + (rheight - aheight) / 2);
                arrowCss['top'] = arrowTop;
                break;
            }

            // use api `#.offset()` will fixing the offset of the offsetParent element and
            // current related target.
            arrowEl.offset(arrowCss).css(reversePos, '');

            return self;
        }

    });

    // Expose constructor with some usefule APIs
    Popup.zIndex = 1024;
    Popup.current = null;

    module.exports = Popup;
});
