/**
 * Cross-box with cross iframe dialog adaptor implements.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var g = window;
  var Box = extend({}, require('./box'));

  function extend(r, s) {
    for (var k in s) {
      if (s.hasOwnProperty(k)) r[k] = s[k];
    }
    return r;
  }

  var top = window.top
    , _ready = false
    , _callbacks = []
    , _topBox;

  function add(fn) {
    _callbacks.push(fn)
  }

  function done(box) {
    for (var i = -1, l = _callbacks.length; ++i < l; ) {
      _callbacks[i](box);
    }
  }

  function ready(fn) {
    if (_ready) {
      fn(_topBox || Box)
    } else {
      add(fn)
    }
  }

  if (g !== top) {
    try {
      top.require(['lib/ui/box/1.0.1/crossbox'], function(topBox) {
        extend(module.exports, topBox);
        _ready = true;
        _topBox = topBox;
        done(topBox);
      });
    } catch (e) {
      setTimeout(function() { console.warn('Initialize crossbox failed, use inner box instead.'); }, 1);
    }
  } else {
    _ready = true;
    _topBox = Box;
  }

  exports = module.exports = Box;
  exports.ready = ready;

});
