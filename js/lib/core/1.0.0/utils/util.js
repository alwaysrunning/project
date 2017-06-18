/**
 * Common util for lang utility extensions.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var global = new Function('return this')()
  var hasOwn = Object.prototype.hasOwnProperty

  // Internal helper functions {{{

  function isObject(arg) {
    return typeof arg === 'object' && arg !== null;
  }

  var isArray = Array.isArray || function(o) {
    return o && o instanceof Array;
  }

  function noop() {}

  function forEach(o, fn) {
    var l = o.length, i = -1
    while (++i < l) {
      fn(o[i], i)
    }
  }

  function forIn(o, fn) {
    for (var k in o) {
      if (hasOwn.call(o, k)) {
        fn(o[k], k, o);
      }
    }
  }

  function each(o, fn) {
    if (o && o.forEach) return o.forEach(fn)
    else {
      if (isArray(o)) forEach(o, fn)
      else forIn(o, fn)
    }
  }

  function arrayMap(array, fn) {
    var index = -1,
        length = array.length,
        result = Array(length);
    while (++index < length) {
      result[index] = fn(array[index], index, array);
    }
    return result;
  }

  function baseMap(obj, fn) {
    var result = [];
    each(obj, function(v, k, obj) {
      result.push(fn(v, k, obj));
    });
    return result;
  }

  // guid generator
  var guid = function() {
    var expando = (+new Date).toString(36), seed = -1
    return function(prefix) { return (prefix || '') + expando + ++seed }
  }()

  var _keys = Object.keys || function(o) {
    var arr = [];
    forIn(o, function(v, k) { arr.push(k) })
    return arr;
  }

  function extend(origin, add) {
    // Don't do anything if add isn't an object
    if (!add || !isObject(add)) return origin;

    var keys = _keys(add);
    var i = keys.length;
    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  }

  var inherits = typeof Object.create === 'function' ?
    // implementation from standard node.js 'util' module
    function inherits(ctor, superCtor) {
      ctor.__super__ = superCtor.prototype
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    } :
    // old school shim for old browsers
    function() {
      function TempCtor(child) {
        this.constructor = child
      }
      return function inherits(ctor, superCtor) {
        ctor.__super__ = superCtor.prototype
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor(ctor)
      }
    }()

  // Parse a query string into a hash.
  function parseQuery(queryString) {
    // Fails if a key exists twice (e.g., ?a=foo&a=bar would return {a:"bar"}
    if (queryString.charAt(0) === '?')
      queryString = queryString.substr(1);

    var rv = {};

    var pairs = queryString.split('&');
    for (var i = -1, l = pairs.length, pair; ++i < l; ) {
      pair = pairs[i].split('=');
      rv[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return rv;
  }

  // }}}

  // fix console utilities
  var console = global.console || (global.console = {})
  forEach(['log', 'error', 'trace', 'warn', 'info'], function(k) {
    console[k] || (console[k] = noop)
  })

  /**
   * Mixin combines two objects from right to left, overwriting the left-most
   * object, and returning the newly mixed object for use.  By default all
   * properties are applied, and a property that is already on the reciever will be overwritten.
   * can use for shallow copy eg: `extend({}, obj, ...)`
   *
   * @param {Object} r The object to receive the augmentation.
   * @param {Mixed} s The objects that supplies the properties to augment.
   *
   * @example
   *
   * ```js
   * var source = { foo: 1 };
   * var target = { bar: 2 };
   * extend(source, target); // => { foo: 1, bar: 2 }
   * ```
   */
  exports.extend = function(r, s) {
    var supplies = [].slice.call(arguments, 1), l = supplies.length, i = -1
    while (++i < l) {
      extend(r, supplies[i])
    }
    return r
  }

  /**
   * Inherit the prototype methods from one constructor into another.
   * sync from standard node.js 'util' module with `super_` api for superclass refs
   *
   * @method inherits
   *
   * @param {Function} ctor Constructor function which needs to inherit the
   *     prototype.
   * @param {Function} superCtor Constructor function to inherit prototype from.
   */
  exports.inherits = function(ctor, superCtor, prototype) {
    inherits(ctor, superCtor);
    // extend ctor prototype
    if (prototype) {
      extend(ctor.prototype, prototype);
    }
  }

  /**
   * Implements a specific constructor with a supplies implementation.
   *
   * @method impls
   *
   * @param {Function} ctor The target constructor to being implemented.
   * @param {Function|Object} impls The implementation object
   */
  exports.impls = function(ctor, impls) {
    impls = typeof impls === 'function' ? impls.prototype : impls
    exports.mix(ctor.prototype, impls)
    return ctor
  }

  /**
   * Parse a query string into a hash.
   *
   * This takes a url query string in the form 'name1=value&name2=value' and
   * converts it into an object of the form { name1: 'value', name2: 'value' }.
   * If a given name appears multiple times in the query string, only the
   * last value will appear in the result.
   *
   * Names and values are passed through decodeURIComponent before being added
   * to the result object.
   *
   * @method parseQuery
   *
   * @param {string} queryString The string to parse.  If it starts with a
   *     leading '?', the '?' will be ignored.
   */
  exports.parseQuery = parseQuery

  /**
   * @method parseParams
   * @alias parseQuery()
   *
   * @deprecated Use `parseQuery()` instead. will be removed in v1.0.1
   */
  exports.parseParams = parseQuery

  /**
   * forEach iterator enhancements with more performances.
   *
   * @method each
   * @param {Object|Array} object to iteration
   * @param {Function} fn
   */
  exports.each = each

  /**
   * Creates an array of values by running each element in `collection` through
   * `iteratee`. The `iteratee` is invoked with three
   * arguments; (value, index|key, collection).
   *
   * @method map
   */
  exports.map = function(o, predicate) {
    var func = isArray(o) ? arrayMap : baseMap
    return func(o, predicate)
  }

  /**
   * Iterates over elements of `collection`, returning an array of all elements
   * `predicate` returns truthy for. The predicate is invoked with three
   * arguments; (value, index|key, collection).
   *
   * @method filter
   */
  exports.filter = function(o, predicate) {
    var func, add, out = isArray(o) ?
      (func = forEach, add = function(i, v) { out.push(v) }, []) :
      (func = forIn, add = function(k, v) { out[k] = v }, {})
    func(o, function(v, i) {
      if (predicate(v, i)) {
        add(i, v)
      }
    })
    return out
  }

  /**
   * Mixin object from supplies to reciever, support deepth and force extends.
   *
   * @param {Object} r
   * @param {Object} s
   */
  exports.mix = function mix(r, s, deep, force, filter) {
    for (var k in s) if (s.hasOwnProperty(k)) {
      if (s[k] && r[k] && deep && typeof s[k] === 'object') {
        mix(r[k], s[k], deep, force, filter);
      } else {
        if (r[k] === undefined || force) {
          // Go through the target value, only apply the value that pass the
          // validator function
          if (!filter || filter(r[k], s[k])) {
            r[k] = s[k];
          }
        }
      }
    }
    return r;
  }

  /**
   * GUID generator.
   *
   * @method guid
   * @param {String} prefix (Optional) set the prefix for guid.
   * @return {String} Returns a unique id for current page context.
   */
  exports.guid = guid

  /**
   * A cross-browser setImmediate implementation.
   *
   * @method setImmediate
   * @param {Function} callback
   * @author Allex Wang
   */
  exports.setImmediate = function() {
    var document = global.document
      , _postMessage = global.postMessage
      , _setImmediate = global.setImmediate

    return _setImmediate ? _setImmediate : 'onreadystatechange' in document.createElement('script') ? function(callback) {
      function f() {
        el.onreadystatechange = null;
        el.parentNode.removeChild(el);
        callback()
      }
      var el = document.createElement('script');
      el.onreadystatechange = f;
      document.documentElement.appendChild(el)
    } : _postMessage ? function(callback) {
      function f(e) {
        if (e.data === key) {
          global.removeEventListener('message', f, true);
          callback()
        }
      }
      var key = guid();
      global.addEventListener('message', f, true);
      _postMessage(key, '*')
    } : function(f) {
      global.setTimeout(f, 0)
    }
  }()

  /**
   * noop function for async callback defaults
   *
   * @method noop
   */
  exports.noop = noop

  /*! Based on work by Simon Willison: http://gist.github.com/292562 */
  //
  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  exports.throttle = function(fn, ms) {
    ms = (ms) ? ms : 150
    if (ms === -1) {
      return function() { fn.apply(this, arguments) }
    }
    var last
    return function() {
      var ctime = +new Date
      if (!last || ctime - last > ms) {
        last = ctime
        fn.apply(this, arguments)
      }
    }
  }

  //
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  //
  // Add By Allex Wang for debounce resizing event
  //
  exports.debounce = function(func, wait, immediate, context) {
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

  // Mark that a method should not be used.
  // Returns a modified function which warns once by default.
  // If --no-deprecation is set, then it is a no-op.
  exports.deprecate = function(fn, msg) {
    if (global.noDeprecation === true) {
      return fn
    }
    var warned = false
    function deprecated() {
      if (!warned) {
        //>>excludeStart("debug", !pragmas.debug);
        try { throw new Error(msg); } catch (e) {
          for (var s = ((e.stack || e) + '').split('\n'), sb = [], i = -1, l = s.length; ++i < l; ) {
            if (!~s[i].indexOf('Object.deprecated')) sb.push(s[i]);
          }
          var meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\' };
          (0, eval)('console.warn("' + sb.join('\n').replace('Error:', 'Deprecate:').replace(/[\s\S]/g, function(a) { return meta[a] || a; }) + '")');
        }
        //>>excludeEnd("debug")
        warned = true
      }
      return fn.apply(this, arguments)
    }
    return deprecated
  }

})

// vim: set fdm=marker ts=2 sw=2 sts=2 tw=0 et :
