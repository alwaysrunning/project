/**
 * CSS style utility for css effects enhancements
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery')
    , util = require('./util')
    , forEach = util.each
    , noop = util.noop
    , setImmediate = util.setImmediate
    , cssPrefix = getCssPrefix()
    , rPrefix = /\-v\-/g
    , styleEl = document.getElementsByTagName('head')[0].appendChild(createElement('style'))
    , styleSheet = styleEl.sheet || styleEl.styleSheet
    , bootCSS = {
        '.ui-animated': '-v-animation-fill-mode: both;',
        '.ui-animated.ui-speed-normal': '-v-animation-duration: 0.5s;',
        '.ui-animated.ui-speed-fast': '-v-animation-duration: 0.2s;',
        '.ui-animated.ui-speed-slow': '-v-animation-duration: 1s;'
      }
    , eAnimationEnd = {
        '-webkit-': 'webkitAnimationEnd',
        '-moz-': 'animationend',
        '-o-': 'OAnimationEnd',
        '-ms-': 'msAnimationEnd',
        '': 'animationend'
      }[cssPrefix]

  function createElement(tag) {
    return $('<' + tag + '/>')[0];
  }

  function addStyleRule(sheet, k, v) {
    sheet.insertRule ?
      sheet.insertRule(k + ' {' + v + '}', 0) :
      sheet.addRule(k, v, 1)
  }

  // Helper for CSS DOM vendor detection, eg. Webkit -> WebkitTransition
  function getVendorPrefix() {
    var body, i, style, transition, vendor, result = '';
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
    getVendorPrefix = function() { return result };
    return result;
  }

  // Helper for css style prefix detection, eg. -webkit-
  function getCssPrefix() {
    var vendor = getVendorPrefix();
    return vendor ? '-v-'.replace('v', vendor.toLowerCase()) : '';
  }

  function parseSpeed(n) {
    return typeof n == 'number' ? n : {
      fast: 200,
      normal: 500,
      slow: 1e3
    }[n] || 500
  }

  function effect(el, animate, speed, callback, sync) {
    var timer, classes
      , $el = $(el)
      , args = arguments
      , sync = typeof args[args.length - 1] === 'boolean' ? args[args.length - 1] : false
      , stopped = false;

    var handleAnimationEnd= function() {
      onAnimationEnd();
    }

    var onAnimationEnd = function(e) {
      if (stopped) return;
      stop(true);
    }

    var stop = function(jumpToEnd) {
      if (stopped) return;
      stopped = true;
      onAnimationEnd = noop;
      $el.off(eAnimationEnd, handleAnimationEnd);
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      $el.removeClass(classes)
      if (jumpToEnd) {
        callback()
      }
      $el = null;
    }

    if (typeof speed == 'function') {
      callback = speed
      speed = undefined
    }
    callback = callback || noop
    if (!cssPrefix) {
      setImmediate(function() { callback && callback() });
    } else {
      speed = speed || 'normal';
      animate = animate || 'shake';
      classes = [ 'ui-animated', 'ui-speed-' + speed, 'ui-ani-' + animate ].join(' ');
      $el.on(eAnimationEnd, handleAnimationEnd);
      timer = setTimeout(handleAnimationEnd, parseSpeed(speed) + 100);
      if (sync === true) setImmediate(function() {
        $el.addClass(classes);
      })
      else $el.addClass(classes);
    }

    return {
      stop: function() {
        stop.apply(null, arguments);
        return this;
      }
    }
  }

  // Setup global styles on bootstrap
  util.each(bootCSS, function(v, k) {
    if (v) {
      addStyleRule(styleSheet, k, v.replace(rPrefix, cssPrefix))
    }
  })

  /**
   * Play a CSS3 animate by css class naming `ui-xxx`
   *
   * => function(el, animate, speed, callback, sync);
   */
  exports.effect = effect;

  /**
   * Get CSS prefix by browser vendor detections.
   * Returns a valid vendor prefix: ['Moz', 'Webkit', 'Khtml', 'O', 'ms'].
   *
   * @return {String} Returns a empty string if false.
   */
  exports.getVendorPrefix = getVendorPrefix;

});

// vim: set fdm=marker ts=2 sw=2 sts=2 tw=85 et :
