/*
 * Lazy Load - A ui plugin for lazy loading images, html etc,.
 *
 * Plugin is inspired by $.lazyload by Mika Tuupola
 * - (http://www.appelsiini.net/projects/lazyload).
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 *
 * @event
 *
 *  lazyItemReady - Fired for each lazy item origin resource loaded.
 *  reset - Fired when all of theses lazy element loaded. can do some things for destroy
 *  destroy - Fired when {#destroy} being called.
 *
 * @example
 *
 *  ```js
 *  var Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload');
 *
 *  var lazy = new Lazyload('.ui-lazy', {
 *    effect: 'fadeIn', // cumstomize jquery effect for holder appear, defaults to show
 *    dataAttribute: 'src', // <img data-src=""
 *    skipInvisible: true,  // skip load thoses elements invisible
 *    loadingClass: 'img-loading', // Sets a class for item before origin loaded
 *    placeholder: 'data:image/png;base64, ...', // should be a image url if typed with a image loader.
 *    ...
 *  });
 *
 *  // you can also trigger lazy manually by `#.update()`
 *  lazy.update();
 * ```
 */
(function( root, name, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define( ['jquery'], factory );
    } else {
        // Browser globals (root is window)
        root[name] = factory(root.jQuery || root.Zepto);
    }
}(this, 'Lazyload', function( $, undefined ) {
    'use strict';

    if (!$) {
        throw 'Error: jquery api not implements.'
    }

    // utils {{{
    var each = $.each

      // Go through the array, only saving the items
      // that pass the validator function
      , grep = function(list, fn) {
            if ((list instanceof Array) && list.filter) {
                return list.filter(fn)
            } else {
                var arr = []
                for (var i = -1, l = list.length; ++i < l; ) {
                    if (fn(list[i], i)) {
                        arr.push(list[i])
                    }
                }
                return arr;
            }
        }

      // Returns a function, that, as long as it continues to be invoked, will not
      // be triggered. The function will be called after it stops being called for
      // N milliseconds. If `immediate` is passed, trigger the function on the
      // leading edge, instead of the trailing.
      //
      // Add By Allex Wang for debounce resizing event
      //
      , debounce = function(func, wait, immediate, context) {
            var timeout
            return function() {
                var ctx = context || this, args = arguments
                var later = function() {
                    timeout = null
                    if (!immediate) func.apply(ctx, args)
                }
                var callNow = immediate && !timeout
                clearTimeout(timeout)
                timeout = setTimeout(later, wait)
                if (callNow) func.apply(ctx, args)
            }
        }

      // Provider a simple event mechanism based on jQuery events, support namespace to
      // prevent native events polluting.
      , setupEventProvider = function(scope, ns) {
          scope = scope || {};
          var $obj = $(scope);
          var slice = Array.prototype.slice;
          ns = ns || scope.name;
          $.each({'on': 'on', 'un': 'off', 'once': 'one', 'emit': 'trigger'}, function(k, v) {
              scope[k] = function(type) {
                  var args = slice.call(arguments, 0), fn = args[1];
                  if (ns && !~type.indexOf('.'))
                      args[0] = type + '.'  + ns;
                  if (typeof fn === 'function') {
                      if (k === 'on' || k === 'once')
                          // Normalize event handler args, stripping dom event object.
                          args[1] = fn.__ || (fn.__ = function(e) {
                              e.preventDefault();
                              return fn.apply(this, slice.call(arguments, 1))
                          });
                      else if (k === 'un')
                          args[1] = fn.__;
                  }
                  return $obj[v].apply($obj, args);
              };
          });
          return scope;
      }
    // }}}

    var win = window
      , $window = $(win)
      , Image = win.Image
      , isIOS5 = (/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)

      // status
      , LZ_STATUS = '__lazy_status__'
      , LZ_STATUS_PENDING = 0
      , LZ_STATUS_LOADING = 1
      , LZ_STATUS_LOADED  = 2

      // lazy initial filter
      , lazyFilter = function(el) { return el[LZ_STATUS] === undefined }

    // Internal loader manager
    var Loader = function() {
        var _loaders = {};
        var registerLoader = function(type, fn) {
            if (typeof fn === 'function') {
                _loaders[type] = fn;
            }
        };
        var getLoader = function(type) {
            return _loaders[type];
        };
        return {
            define: registerLoader,
            get: getLoader
        };
    }();

    /* Register build-in loader for lazyload */

    Loader.define('image', function(elem, src, settings, next) {
        if (!src) {
            next('error');
            return;
        }
        // Use native image loader for more efficient
        var img = new Image;
        var reset = function() {
            // dispose
            img.onload = img.onerror = null;
            img = src = elem = next = reset = undefined;
        };
        img.onload = function() {
            var $self = $(elem), method = settings.effect

            if (typeof $self[method] !== 'function') {
                method = 'show';
            }

            $self.hide();

            if ('IMG' === elem.nodeName.toUpperCase()) {
                $self.attr('src', src);
            } else {
                $self.css('background-image', 'url("' + src + '")');
            }

            $self[method](settings.effectSpeed);

            next(null, 'load');
            reset();
        };
        img.onerror = function(e) {
            next(e);
            reset();
        };
        img.src = src;
    });

    Loader.define('html', function(elem, src, settings, next) {
        next();
    });

    /** lazyload constructor */
    var Lazyload = function(elements, options) {
        options = options || {};

        elements = $(elements);

        var self = this;
        var settings = {
            type            : 'image',
            threshold       : 50,
            failureLimit    : 0,
            event           : 'scroll',
            effect          : 'show', // cumstomize jquery effect for holder appear, defaults to show
            container       : win,
            dataAttribute   : 'src',
            sourceMaker     : null, // function for produces a new source of the origin source, called as sourceMaker(src, elem)
            skipInvisible   : true,
            appear          : null, // callback for holder appear
            load            : null, // callback for holder load
            loadingClass    : '',   // Sets a class for item before origin loaded
            placeholder     : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC'
        };

        // implements generic custom event APIs
        setupEventProvider(self);

        var type = options.type || settings.type, loader = Loader.get(type);
        if (typeof loader !== 'function') {
            throw 'Error, cannot found the specific type loader (type: `' + type + '`)';
        }

        if (type === 'html') {
            settings.placeholder = ''; // cleanup html loader defaults placeholder
        }

        if (options) {
            $.extend(settings, options);
        }

        var container = settings.container
          , eventType = settings.event
          , bindScroll = 0 === eventType.indexOf('scroll')
          , $container = (!container || container === win) ? $window : $(container)

        var update = function(e) {// {{{
            var pendings = self._list;
            if (pendings.length > 0) {
                var counter = 0;
                each(pendings.slice(0), function(i, elem) {
                    var $this = $(elem);
                    if (settings.skipInvisible && !$this.is(':visible')) {
                        return;
                    }
                    if (abovethetop(elem, settings) ||
                        leftofbegin(elem, settings)) {
                            /* Nothing. */
                    } else if (!belowthefold(elem, settings) &&
                        !rightoffold(elem, settings)) {
                            $this.trigger('appear');
                            /* if we found an image we'll load, reset the counter */
                            counter = 0;
                    } else {
                        if (++counter > settings.failureLimit) { return false; }
                    }
                });
            } else {
                self.reset();
            }
        };// }}}

        var updateQueue = function() {
            /* Remove item from array so it is not looped next time. */
            self._list = grep(self._list, function(el) { return !el[LZ_STATUS]; });
        };

        // Load the lazy element
        var handleLoad = function() {// {{{
            var elem = this
              , $elem = $(elem)
              , source = $elem.attr('data-' + settings.dataAttribute) // origin resource url
              , sourceMaker = settings.sourceMaker
              , appearFn = settings.appear
              , loadingClass = settings.loadingClass
              , status = elem[LZ_STATUS]

            if (status === LZ_STATUS_PENDING) {
                // loading ...
                elem[LZ_STATUS] = LZ_STATUS_LOADING;
                if (loadingClass) {
                    $elem.addClass(loadingClass);
                }

                // Optionally rebuild the origin source
                if (sourceMaker) {
                    source = sourceMaker(source, elem);
                }
                if (appearFn) {
                    appearFn.apply(self, [elem, source]);
                }

                // Load the resource by the typical resource loader.
                loader.call(self, elem, source, settings, function(err, response) {
                    if (self._destroyed) {
                        return
                    }
                    if (loadingClass) {
                        $elem.removeClass(loadingClass);
                    }
                    if (!err) {
                        elem[LZ_STATUS] = LZ_STATUS_LOADED;
                        updateQueue();
                        self.emit('lazyItemReady', elem, source, response);
                        var loadFn = settings.load;
                        if (loadFn) {
                            loadFn.apply(self, [elem, source, response]);
                        }
                        elem = null;
                    } else {
                        // reset lazy status
                        setTimeout(function() {
                            elem[LZ_STATUS] = LZ_STATUS_PENDING;
                            self.emit('lazyItemError', elem, source, err);
                            elem = null;
                        }, 300)
                    }
                    $elem = null;
                });
            }
            else if (status === LZ_STATUS_LOADED) {
                updateQueue();
                self.emit('lazyItemReady', elem, source);
            }
        };// }}}

        var triggerAppear = function() {
            if (!this[LZ_STATUS]) { $(this).trigger('appear'); }
        };

        var addItem = function(elem) {
            var $elem = $(elem);

            // initial status
            elem[LZ_STATUS] = LZ_STATUS_PENDING;

            // init lazyload items initialize viewstate.
            var placeholder = settings.placeholder;
            if (placeholder) {
                if ($elem.is('img')) {
                    // If no src attribute given use data:uri.
                    var src = $elem.attr('src');
                    if (!src) {
                        $elem.attr('src', placeholder);
                    }
                } else {
                    // It's a empty placeholder
                    if (self._.type !== 'image' && !$elem.children()[0]) {
                        $elem.html(placeholder);
                    }
                }
            }

            /* When appear is triggered load original resource . */
            $elem.on('appear', handleLoad);

            /* When wanted event is triggered load original resource */
            /* by triggering appear.                                 */
            if (!bindScroll) {
                $elem.on(eventType, triggerAppear);
            }

            self._list.push(elem);
        };

        var addPending = function(list) {

            // Filter these items already lazy initialized.
            list = grep(list || [], lazyFilter);

            if (!list.length) return;

            each(list, function(i, elem) {
                addItem(elem)
            });

            if (self._inited) return;
            init(self);
        };

        // Initaialize lazyload with setup key components and events
        var init = function(self) {
            if (self._inited) return;

            var debounceUpdate = debounce(update, 30);

            self._inited = true;

            /* Fire one scroll event per scroll. Not one scroll event per image. */
            if (bindScroll) $container.on(eventType, debounceUpdate);

            /* Check if something appears when window is resized. */
            $window.on('resize', debounceUpdate);

            /* With IOS5 force loading resources when navigating with back button. */
            /* Non optimal workaround. */
            if (isIOS5) {
                var pageshowFn = function(e) {
                    if (e.originalEvent && e.originalEvent.persisted)
                        each(self._list, function(i, el) { $(el).trigger('appear'); });
                };
                $window.on('pageshow', pageshowFn);
                self.once('reset', function() {
                    $window.off('pageshow', pageshowFn);
                });
            }

            self.once('reset', function() {
                each(self._list, function(i, elem) { detachItem(elem) });
                if (bindScroll) $container.off(eventType, debounceUpdate);
                $window.off('resize', debounceUpdate);
            });

            /* Force initial check if resources should appear. */
            $(document).ready(update);
        };

        var detachItem = function(elem) {
            var $elem = $(elem);
            $elem.off('appear', handleLoad);
            if (!bindScroll) {
                $elem.off(eventType, triggerAppear);
            }
        };

        // Detach pendings elements when original loaded (both BOM data and event listeners).
        self.on('lazyItemReady', function(elem) { detachItem(elem) });

        self.once('destroy', function() {
            addPending = null;
            update = null;
            updateQueue = null;
            handleLoad = null;
            triggerAppear = null;
        });

        self._ = settings;
        self._list = [];

        self.add = function(selector) {
            var items = $(selector)
            if (items.length > 0) {
                addPending(items);
            }
        };
        self.update = update;

        addPending(elements);
    };

    Lazyload.prototype = {

        /**
         * @event lazyItemReady
         * Fired for each lazy item origin resource loaded.
         */

        /**
         * @event reset
         * Fired when all of theses lazy element loaded. can do some things for destroy
         */

        constructor: Lazyload,

        /**
         * Trigger the lazyload queue to load elements in viewport manually.
         * @void
         */
        update: function() {},

        /**
         * Look at the next item in the queue, This method is identical to next, but it
         * does not actually remove that object from the queue.
         * @return {MIXED} the next item in the queue.
         */
        peek: function() {
            var q = this._list, l = q.length;
            return l > 0 ? q[0] : undefined;
        },

        /**
         * Reset lazyload queue, useful for cleanup the penging elements.
         * @method reset
         */
        reset: function() {
            if (!this._inited) return this;
            this._inited = false;
            this.emit('reset');
            this._list.length = 0;
            return this;
        },

        /**
         * @method destroy
         */
        destroy: function() {
            if (!this._destroyed) {
                this._destroyed = true;
                this.reset().emit('destroy');
                this.un();
                this._ = null;
            }
        }
    };

    /**
     * Exports api method for register customize loader.
     *
     * @param {String} type The resource type for lazy load.
     * @param {Function} loader The resource loader function, make sure keep calling
     * the next callback.
     */
    Lazyload.define = function(type, fn) {
        return Loader.define(type, fn)
    };

    /* utils methods {{{ */

    /* Use as Lazyload.belowthefold(el, {threshold: 100, container: window}) */

    var belowthefold = function(el, settings) {
        var fold, container = settings.container;

        if (!container || container === win) {
            fold = (win.innerHeight ? win.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(container).offset().top + $(container).height();
        }

        return fold <= $(el).offset().top - settings.threshold;
    };

    var rightoffold = function(el, settings) {
        var fold, container = settings.container;

        if (!container || container === win) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(container).offset().left + $(container).width();
        }

        return fold <= $(el).offset().left - settings.threshold;
    };

    var abovethetop = function(el, settings) {
        var fold, container = settings.container;

        if (!container || container === win) {
            fold = $window.scrollTop();
        } else {
            fold = $(container).offset().top;
        }

        return fold >= $(el).offset().top + settings.threshold  + $(el).height();
    };

    var leftofbegin = function(el, settings) {
        var fold, container = settings.container;

        if (!container || container === win) {
            fold = $window.scrollLeft();
        } else {
            fold = $(container).offset().left;
        }

        return fold >= $(el).offset().left + settings.threshold + $(el).width();
    };

    var inviewport = function(el, settings) {
         return !rightoffold(el, settings) && !leftofbegin(el, settings) &&
                !belowthefold(el, settings) && !abovethetop(el, settings);
    };

    // }}}

    // Exports
    Lazyload.belowthefold = belowthefold;
    Lazyload.rightoffold = rightoffold;
    Lazyload.abovethetop = abovethetop;
    Lazyload.leftofbegin = leftofbegin;
    Lazyload.inviewport = inviewport;

    return Lazyload;
}));
