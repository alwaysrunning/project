/**
 * SlidesJS 3.0.4 - A common slides ui component.
 *
 * SlidesJS is an open source project, contribute at GitHub:
 * https://github.com/nathansearles/Slides
 *
 * Fix for zeptojs and some optimizes by Allex Wang (allex.wxn@gmail.com)
 *
 * Events: [ 'slide', 'loadSlide', 'destroy' ]
 */
define(['jquery'], function(jQuery) {
  'use strict';

  return (function($, window, document, undefined) {

    if (typeof $.data !== 'function') {
      $.data = function(el, k, v) { return $(el).data(k, v); };
    }

    var setTimeout = window.setTimeout, clearTimeout = window.clearTimeout;

    var supportTouch = typeof TouchEvent !== 'undefined';
    var supportTransition = getVendorPropertyName('transition');
    var supportTransforms = getVendorPropertyName('transform');
    var supportTransforms3d = getVendorPropertyName('perspective');

    function getVendorPrefix() {
      if (getVendorPrefix.result !== undefined) {
          return getVendorPrefix.result;
      }
      var body, i, style, transition, vendor, result = false;
      body = document.body || document.documentElement;
      style = body.style;
      transition = 'Transition';
      vendor = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'];
      i = 0;
      while (i < vendor.length) {
        if (style[vendor[i] + transition] !== undefined) {
          result = vendor[i];
          break;
        }
        i++;
      }
      return (getVendorPrefix.result = result);
    }

    // Helper function to get the proper vendor property name.
    // (`transition` => `WebkitTransition`)
    function getVendorPropertyName(prop) {
      var testEl = document.body || document.documentElement;
      // Handle unprefixed versions (FF16+, for example)
      if (prop in testEl.style) return prop;
      var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);
      return getVendorPrefix() + prop_;
    }

    //
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    //
    // Add By Allex Wang for debounce resizing event
    //
    var debounce = function(func, wait, immediate, context) {
        var timeout;
        return function() {
            var ctx = context || this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(ctx, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(ctx, args);
        };
    };

    /**
     * A simple function for CSS3 Transition.
     *
     * @param {HTMLElement} el The targe html element to transition.
     * @param {Object} obj Transition styles to sets.
     * @param {Function} callback The callback to be called when transition end.
     * @param {Boolean} reset Reset the styles when transition end, Defaults to true.
     *
     * Usage:
     *
     * ```js
     *  css3Transition(el, {
     *    transform: {x: 10, y: 0, z: 0},
     *    duration: '3ms',
     *  }, function(e) {
     *    console.log('Transition end.');
     *  });
     * ```
     *
     * @author Allex Wang (allex.wxn@gmail.com)
     */
    var css3Transition = function() {
      'use strict';

      var rDashAlpha = /[-_]\D/g
        , fCamelCase = function($0) { return $0.charAt(1).toUpperCase(); }
        , camelize = function(s) { return s.replace(rDashAlpha, fCamelCase); }
        , reserveNames = {duration: 1, delay: 1, timingFunction: 1}

      var cssHooks = {
        transform: supportTransforms3d ? function(o) {
          if (typeof o === 'string') return o;
          o.x = o.x || 0;
          o.y = o.y || 0;
          o.z = o.z || 0;
          return 'translate3d(' + o.x + 'px, ' + o.y + 'px, ' + o.z + 'px)';
        } : function(o) {
          if (typeof o === 'string') return o;
          o.x = o.x || 0;
          o.y = o.y || 0;
          return 'translate(' + o.x + 'px, ' + o.y + 'px)';
        }
      };

      return function(el, styles, callback, reset) {
        el = $(el);
        reset = reset === undefined ? true : reset;
        if (typeof callback === 'boolean') {
            reset = callback;
            callback = null;
        }
        var style = el[0].style, styleNames = [], names = {};
        var fix = function(k) {
          k = camelize(k);
          if (reserveNames[k]) {
            k = 'transition' + k.charAt(0).toUpperCase() + k.substr(1);
          }
          return getVendorPropertyName(k);
        };
        var set = function(k, v) {
            if (cssHooks[k]) {
              v = cssHooks[k](v);
            }
            k = fix(k);
            style[k] = v;
            styleNames.push(k);
        };
        // Attach transitionend listener when provided callback or sets style as a temporary
        if (callback || reset) {
          var events = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd';
          el.on(events, function f(e) {
            el.off(events, f);
            var l = styleNames.length;
            callback && callback(e);
            // reset styles
            if (reset)
              while (l--) style[styleNames[l]] = '';
          });
        }
        for (var k in styles) {
          if (styles.hasOwnProperty(k)) {
            names[k] = 1;
            set(k, styles[k]);
          }
        }
        // sets defaults timing-function if not provided.
        var timing = 'timing-function';
        if (names['duration'] && !names[timing]) {
          set(timing, 'ease-in-out');
        }
      };
    }();

    // Provider a simple event mechanism based on jQuery events, support namespace to
    // prevent native events polluting.
    var setupEventProvider = function(scope, ns) {
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
            if (k === 'on')
              // Normalize event handler args, stripping dom event object.
              args[1] = fn.__ || (fn.__ = function(e) { return fn.apply(this, slice.call(arguments, 1)) });
            else if (k === 'un')
              args[1] = fn.__;
          }
          return $obj[v].apply($obj, args);
        };
      });
      return scope;
    };

    var defaults, pluginName = 'slider';

    defaults = {
      width: 940,
      height: 528,
      autoScale: false,
      start: 0,
      cls: {
        item: 'ui-slider-slide',
        active: 'ui-slider-i-on'
      },
      lazyLoad: {
        enable: true,
        attr: 'data-src',
        loadingClass: 'ui-slider-img-loading'
      },
      navigation: {
        arrows: true,
        toggleOnHover: false,
        effect: 'slide',
        nextArrow: '<a href="#" class="ui-slider-navigation ui-slider-next" title="Next">Next</a>',
        prevArrow: '<a href="#" class="ui-slider-navigation ui-slider-prev" title="Previous">Previous</a>'
      },
      pagination: {
        active: true,
        effect: 'slide'
      },
      play: {
        active: false,
        effect: 'slide',
        interval: 5000,
        auto: false,
        swap: true,
        pauseOnHover: true,
        restartDelay: 2500
      },
      effect: {
        slide: {
          speed: 500
        },
        fade: {
          speed: 300,
          crossfade: true
        }
      },
      callback: {
        loaded: function() {},
        start: function() {},
        complete: function() {}
      }
    };

    function Plugin(element, options) {
      this.element = $(element);
      this.options = $.extend(true, {}, defaults, options);
      this.data = $.data(this);
      this._defaults = defaults;
      this._control = null;
      this._slides = [];
      this.init();
    }

    $.extend(Plugin.prototype, {

    init: function() {
      var prevArrow, nextArrow, pagination, playButton, stopButton,
        self = this,
        $element = self.element,
        options = self.options,
        data = self.data,
        totalCount;

      data.animating = false;
      data.total = totalCount = $element.children().not('.ui-slider-navigation', $element).length;
      data.current = options.start;
      if (supportTouch) {
        options.effect.slide.speed = options.effect.slide.speed / 2;
      }

      // Support custom event by Allex
      setupEventProvider(self, 'slide');

      $element.css({ overflow: 'hidden' }).addClass('ui-slider');
      $element.children().not('.ui-slider-navigation', $element).wrapAll('<div class="ui-slider-container">', $element).parent().css({
        overflow: 'hidden',
        position: 'relative'
      });

      $('.ui-slider-container', $element).wrapInner('<div class="ui-slider-control">', $element);

      var control = self._control = $('.ui-slider-control', $element);
      var slides = self._slides = control.children();

      control.css({ position: 'relative', left: 0 });
      slides.addClass(options.cls.item)
        .css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 0,
          display: 'none',
          webkitBackfaceVisibility: 'hidden'
        })
        // indexes
        .each(function(i, slide) {
          $(slide).attr('data-slide-idx', i);
        });

      $element.show();

      self.update();
      if (options.lazyLoad.enable) {
        self.lazyLoad().on('slide', function(cursor, slide) {
          self.lazyLoad();
        });
      }

      if (supportTouch) {
        self._setuptouch();
        control
          .on('touchstart', function(e) { self._touchstart(e); })
          .on('touchmove', function(e) { self._touchmove(e); })
          .on('touchend', function(e) { self._touchend(e); })
      }

      // Initial navigation arrows
      var navOpts = options.navigation;
      if (navOpts.arrows) {
        prevArrow = $element.find('.ui-slider-prev');
        nextArrow = $element.find('.ui-slider-next');
        if (!prevArrow.length)
          prevArrow = $(navOpts.prevArrow).appendTo($element);
        if (!nextArrow.length)
          nextArrow = $(navOpts.nextArrow).appendTo($element);
      }
      prevArrow.click(function(e) {
        e.preventDefault();
        self.prev();
      });
      nextArrow.click(function(e) {
        e.preventDefault();
        self.next();
      });
      if (navOpts.toggleOnHover) {
        var nextArrowWidth = nextArrow.show().width()
          , prevArrowWidth = prevArrow.show().width()
          , toggleArrows = function(showOrHide, animate) {
            var v = +!!showOrHide,
                nextObj = {right: -1 * !v * nextArrowWidth, opacity: v},
                prevObj = {left: -1 * !v * prevArrowWidth, opacity: v};
            if (animate) {
              nextArrow.animate(nextObj, 200);
              prevArrow.animate(prevObj, 200);
            } else {
              nextArrow.css(nextObj);
              prevArrow.css(prevObj);
            }
          };
        // hide first
        toggleArrows(false);
        // toggle navigation arrows
        $element
          .on('mouseenter', function(e) { toggleArrows(true, true) })
          .on('mouseleave', function(e) { toggleArrows(false, true) })
      }

      if (options.play.active) {
        playButton = $('<a href="#" class="ui-slider-navigation ui-slider-play" title="Play">Play</a>').appendTo($element);
        stopButton = $('<a href="#" class="ui-slider-navigation ui-slider-stop" title="Stop" style="display:' + (options.play.swap ? 'none' : '') + '">Stop</a>').appendTo($element);
        playButton.click(function(e) { e.preventDefault(); self.play(true); });
        stopButton.click(function(e) { e.preventDefault(); self.stop(true); });
      }

      if (totalCount > 1 && options.pagination.active) {
        pagination = $('<ul class="ui-slider-pagination" />')
          .appendTo($element)
          .on('click', '[data-slide-idx]', function(e) {
            // delegate the pagination items click event
            e.preventDefault();
            self.go(+$(e.currentTarget).attr('data-slide-idx'));
          });
        var i = -1;
        while (++i < totalCount) {
          $('<li class="ui-slider-pagination-item"><a href="#" data-slide-idx="' + i + '">' + (i + 1) + '</a></li>').appendTo(pagination);
        }
      }

      // Fix the cursor confusion while transition animating by Allex
      var handleResize = debounce(function() {
        if (data.animating) return handleResize();
        self.update();
      }, 100);
      $(window).on('resize', handleResize);

      self.once('destroy', function() {
        $(window).off('resize', handleResize);
      });

      self._setActive();

      var autoPlay = options.play.auto;
      if (autoPlay)
        self.play();

      self.on('slide', function(cursor, slide) {
        var next = cursor.next;
        options.callback.complete(next, slides[next]);
        if (autoPlay)
          self.play();
      });

      options.callback.loaded(options.start);
    },

    /**
     * Lazyload the slide images, also pre-load nearby slides around. The relevant
     * options can be customized by `options.lazyLoad`.
     *
     * @method lazyLoad
     */
    lazyLoad: function() {
      var self = this,
          options = self.options.lazyLoad,
          slides = self._slides,
          lazyAttr = options.attr || 'data-src',
          loadingClass = options.loadingClass;

      function loadImages(el) {
        var items = $(el).find('[' + lazyAttr + ']').get();
        // Add the slide to pool in case is a single image.
        items.unshift(el);

        $(items).each(function(i, item) {
          var tag = item.tagName.toLowerCase(),
              $el = $(item),
              src = $el.attr(lazyAttr),
              loader = new Image;

          if (!src || item.src === src)
            return;

          loader.onload = function() {
            loader = loader.onload = null;
            $el  
              .animate({ opacity: 0 }, 100, function() {
                if (tag === 'img') {
                  $el.attr('src', src)
                } else {
                  $el.css('background-image', 'url(' + src + ')');
                }
                $el.animate({ opacity: 1 }, 200, function() {
                  $el
                    .removeAttr(lazyAttr)
                    .removeClass(loadingClass);
                 });
              });
          };

          loader.src = src;
        });

        self.emit('loadSlide', el);
      }

      // Preload the nearby slides.
      $.each(self._cursor(), function(k, v) {
        loadImages(slides[v]);
      });

      return self;
    },

    _setActive: function(number) {
      var $element, current;
      $element = this.element;
      current = number > -1 ? number : this.data.current;
      $('.active', $element).removeClass('active');
      $($('.ui-slider-pagination li', $element)[current]).find('a').addClass('active');
    },

    update: function() {
      var $element = this.element,
          options = this.options,
          current = this.data.current,
          control = this._control,
          width, height;
      if (this.data.animating) return;
      this._slides.each(function(i, el) {
        if (i === current)
          $(el).css({ display: 'block', zIndex: 1 }).addClass(options.cls.active);
        else
          $(el).css({ display: 'none', left: 0, zIndex: 0 })
      });
      width = $element.width() || options.width;
      height = $element.height() || options.height;
      if (options.autoScale) {
          height = (options.height / options.width) * width;
      }
      options.width = width;
      options.height = height;
      control.css({
        width: width + 'px',
        height: height + 'px',
        lineHeight: height + 'px'
      });
      $('.ui-slider-container', $element).css({ width: width + 'px', height: height + 'px' });
      return this;
    },

    next: function(effect) {
      this.data.direction = 'next';
      return this._transition(effect);
    },

    prev: function(effect) {
      this.data.direction = 'prev';
      return this._transition(effect);
    },

    _transition: function(num, effect, cb) {
      if (!this.data.animating) {
        this.stop();
        if (typeof num !== 'number') {
          cb = effect;
          effect = num;
          num = -1;
        }
        if (typeof effect === 'function') {
          cb = effect;
          effect = '';
        }
        effect = effect || this.options.navigation.effect;
        if (effect === 'fade') {
          this._fade(num, cb);
        } else {
          this._slide(num, cb);
        }
      }
      return this;
    },

    go: function(number) {
      var total = this.data.total;
      if (number > total - 1) {
        number = total - 1;
      } else if (number < 0) {
        number = 0;
      }
      return this._transition(number);
    },

    _cursor: function(pos) {
      var data = this.data, current = pos || data.current, total = data.total,
        first = 0,
        last = total - 1,
        next = current + 1,
        prev = current - 1;
      if (prev < 0) {
        prev = last;
      }
      if (next > last) {
        next = 0;
      }
      return {current: current, prev: prev, next: next};
    },

    _setuptouch: function() {
      var width = this.options.width,
        slides = this._slides,
        pn = this._cursor(),
        prev = pn.prev,
        next = pn.next;
      if (next !== prev) {
        $(slides[next]).css({ display: 'block', left: width });
        $(slides[prev]).css({ display: 'block', left: -1 * width });
      } else {
        $(slides[next]).css({ display: 'block' });
      }
    },

    _touchstart: function(e) {
      this.stop();
      var touches, data = this.data, pageX, pageY;
      touches = (e.originalEvent || e).touches[0];
      this._setuptouch();
      pageX = touches.pageX;
      pageY = touches.pageY;
      touches = data.touches = {
        startX: pageX,
        startY: pageY,
        scroll: null,
        time: +new Date
      };
      touches.start = touches.current = pageX;
      e.stopPropagation();
    },

    _touchend: function(e) {
      var duration,
        self = this,
        options = self.options,
        data = self.data,
        control = this._control,
        touches = data.touches,
        slideSize = options.width,
        diffTime, diff, diffAbs, direction

      e.stopPropagation();

      if (touches.scroll)
        return;

      // Difference
      diffTime = +new Date - touches.time;
      diff = touches.current - touches.start;
      diffAbs = Math.abs(diff);

      if ( data.total > 1 && (diffAbs > slideSize * .4 || diffAbs > slideSize * .1 && diffTime < 300) ) {
        direction = diff < 0 ? 'next' : 'prev';
        data.direction = direction;
        self._slide();
      } else {
        css3Transition(control, { transform: {x: 0, y: 0}, duration: options.effect.slide.speed * 0.85 + 'ms' });
      }
    },

    _touchmove: function(e) {
      var data = this.data,
        isH = true,
        touches = (e.originalEvent || e).touches[0],
        _touches = data.touches,
        pageX = touches.pageX,
        pageY = touches.pageY,
        isScrolling = _touches.scroll

      // check for scrolling
      if (isScrolling === null && isH) {
        isScrolling = !!(isScrolling || Math.abs(pageY - _touches.startY) > Math.abs(pageX - _touches.startX));
      }
      if (isScrolling === null && !isH) {
        isScrolling = !!(isScrolling || Math.abs(pageY - _touches.startY) < Math.abs(pageX - _touches.startX));
      }

      e.stopPropagation();

      _touches.current = pageX;
      _touches.scroll = isScrolling;

      if (data.animating || isScrolling)
        return;

      e.preventDefault();
      css3Transition(this._control, {
        'timing-function': 'linear',
        transform: {x: pageX - _touches.startX, y: 0}
      }, false);
    },

    play: function(next) {
      var self = this,
        options = self.options,
        data = self.data,
        $element = self.element,
        interval = options.play.interval;

      if (data.total > 1 && !data.playInterval) {
        if (next) {
          data.direction = 'next';
          self._transition();
        }

        data.playInterval = setTimeout(function loop() {
          data.direction = 'next';
          data.playInterval = null;
          self._transition(function() {
            if (!data.stoped) {
              data.playInterval = setTimeout(loop, interval)
            }
          });
        }, interval);

        if (options.play.pauseOnHover) {
          if (data._restartTimer) {
            clearTimeout(data._restartTimer)
            data._restartTimer = null;
          }
          $('.ui-slider-container', $element).off()
            .on('mouseenter', function(e) {
              if (data.stoped && !data._restartTimer) return;
              self.stop();
            })
            .on('mouseleave', function(e) {
              if ($.contains(self.element[0], e.toElement)) return;
              var restartDelay = options.play.restartDelay, timer;
              if (restartDelay) {
                if (timer = data._restartTimer) {
                  clearTimeout(timer);
                }
                data._restartTimer = setTimeout(function() { self.play(true); }, restartDelay);
              } else {
                self.play();
              }
            });
        }
        data.stoped = false;

        $('.ui-slider-play', $element).addClass('ui-slider-playing');
        if (options.play.swap) {
          $('.ui-slider-play', $element).hide();
          $('.ui-slider-stop', $element).show();
        }
      }

      return self;
    },

    stop: function(clicked) {
      var $element = this.element, data = this.data;
      if (data._restartTimer) {
        clearTimeout(data._restartTimer)
        data._restartTimer = null;
      }
      if (data.playInterval) {
        clearTimeout(data.playInterval);
        data.playInterval = null;
      }
      data.stoped = true;
      $('.ui-slider-play', $element).removeClass('ui-slider-playing');
      if (this.options.play.swap) {
        $('.ui-slider-stop', $element).hide();
        $('.ui-slider-play', $element).show();
      }
      return this;
    },

    _slide: function(number, cb) {
      var currentSlide, direction, next, value,
        self = this,
        data = self.data,
        options = self.options,
        $element = self.element,
        control = self._control,
        slides = self._slides,
        callback = options.callback;

      if (typeof number === 'function') {
        cb = number;
        number = -1;
      }

      if (!data.animating && number !== data.current) {
        data.animating = true;
        currentSlide = data.current;

        if (typeof number === 'number' && number > -1) {
          value = number > currentSlide ? 1 : -1;
          next = number;
        } else {
          value = data.direction === 'next' ? 1 : -1;
          next = currentSlide + value;
        }
        direction = options.width * (-1 * value);
        if (next === -1) {
          next = data.total - 1;
        }
        if (next === data.total) {
          next = 0;
        }

        this._setActive(next);

        if (number > -1) {
          slides.each(function(i, el) {
            if (i !== currentSlide)
              $(el).css({ display: 'none', left: 0, zIndex: 0 });
          })
        }

        $(slides[next]).css({ display: 'block', left: value * options.width, zIndex: 1 });
        callback.start(next, slides[next]);

        var onSlideDone = function() {
          var activeClass = options.cls.active;
          $(slides[next]).css({ left: 0 }).addClass(activeClass);
          $(slides[currentSlide]).css({ display: 'none', left: 0, zIndex: 0 }).removeClass(activeClass);
          data.stoped = false;
          data.current = next;
          data.animating = false;
          if (cb) cb();
          self.emit('slide', [self._cursor(), slides[next]]);
        }

        var speed = options.effect.slide.speed;
        if (supportTransition) {
          css3Transition(control, { transform: {x: direction, y: 0}, duration: speed + 'ms' }, function(e) {
            slides.each(function(i, el) {
              if (i !== next)
                $(el).css({ display: 'none', left: 0, zIndex: 0 })
            })
            onSlideDone();
            if (supportTouch) {
              self._setuptouch();
            }
          });
        }
        else {
          control.stop().animate({ left: direction }, speed, function() {
            control.css({ left: 0 });
            onSlideDone();
          });
        }
      }
    },

    _fade: function(number, cb) {
      var currentSlide, next, value,
        self = this,
        options = self.options,
        data = self.data,
        slides = self._slides,
        callback = options.callback;

      if (!data.animating && number !== data.current) {
        data.animating = true;
        currentSlide = data.current;
        if (typeof number === 'number' && number > -1) {
          value = number > currentSlide ? 1 : -1;
          next = number;
        } else {
          value = data.direction === 'next' ? 1 : -1;
          next = currentSlide + value;
        }
        if (next === -1) {
          next = data.total - 1;
        }
        if (next === data.total) {
          next = 0;
        }

        this._setActive(next);

        $(slides[next]).css({ display: 'none', left: 0, zIndex: 1 });
        callback.start(next, slides[next]);

        var onSlideDone = function() {
          var activeClass = options.cls.active;
          $(slides[next]).addClass(activeClass);
          $(slides[currentSlide]).removeClass(activeClass);
          data.stoped = false;
          data.current = next;
          data.animating = false;
          if (cb) cb();
          self.emit('slide', [self._cursor(), slides[next]]);
        }

        var speed = options.effect.fade.speed;
        if (options.effect.fade.crossfade) {
          $(slides[currentSlide]).stop().fadeOut(speed);
          $(slides[next]).stop().fadeIn(speed, function() {
            $(slides[next]).css({ zIndex: 0 });
            onSlideDone();
          });
        } else {
          $(slides[currentSlide]).stop().fadeOut(speed, function() {
            $(slides[next]).stop().fadeIn(speed, function() {
              $(slides[next]).css({ zIndex: 1 });
            });
            onSlideDone();
          });
        }
      }
    },

    destroy: function() {
      var element = this.element;
      $('.ui-slider-container', element).off();
      this.stop(true);
      this._control.off();
      this.emit('destroy');
    }

    });

    // Exports as a jquery plugin
    $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          return $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        }
      });
    };

    return Plugin;

  })(jQuery, window, document);

});
//  vim: set fdm=marker ts=2 sw=2 sts=2 tw=85 et :
