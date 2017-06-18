/**
 * Object maintain helper
 *
 * @module lang/object
 * @author Allex Wang(allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var __oprop__ = Object.prototype
      , _hasOwn = __oprop__.hasOwnProperty
      , _toString = __oprop__.toString

    exports.clone = function clone(item) {
        if (item === null || item === undefined) {
            return item;
        }
        if (item.nodeType && item.cloneNode) {
            return item.cloneNode(true);
        }
        var type = _toString.call(item);
        if (type === '[object Date]') {
            return new Date(item.getTime());
        }
        var i, j, k, copy, key;
        if (type === '[object Array]') {
            i = item.length;
            copy = [];
            while (i--) {
                copy[i] = clone(item[i]);
            }
        } else if (type === '[object Object]' && item.constructor === Object) {
            copy = {};
            for (key in item) {
                copy[key] = clone(item[key]);
            }
        }
        return copy || item;
    }

    // #object setter/getter {{{
    // refs: https://github.com/allex/lang-ext.git

    // a convenience function for parsing string namespaces and
    // automatically generating nested namespaces
    // refs: https://github.com/allex/lang-ext.git
    function exportPath(/*String*/ name, /*Object*/ value, /*Object?*/ context, /*Boolean?*/ overwrite) {
        var parts = name.split('.'), p = parts.pop(), obj = getProp(parts, true, context);
        if (obj && p) {
            if (!overwrite && value && typeof value === 'object' && obj[p] !== undefined) {
                obj = obj[p] || (obj[p] = {});
                for (p in value) {
                    if (_hasOwn.call(value, p)) {
                        obj[p] = value[p];
                    }
                }
            } else {
                obj[p] = value;
            }
            return value;
        }
    }

    // Retrive value from nested object by namespace name
    // refs: https://github.com/allex/lang-ext.git
    function getProp(/*Array*/ parts, /*Boolean*/ create, /*Object?*/ context) {
        var obj = context || global;
        for (var i = 0, p; obj && (p = parts[i]); i++) {
            obj = (p in obj ? obj[p] : (create ? obj[p] = {} : undefined));
        }
        return obj; // mixed
    }

    /**
     * Builds an object structure for the provided namespace path,
     * ensuring that names that already exist are not overwritten if
     * `overwrite` not provided. For example:
     * "a.b.c" -> a = {};a.b={};a.b.c={};
     *
     * @method set
     * @param {Object=} context The object to add the path to; Default is {@code global}.
     * @param {String} name Name of the object that this file defines.
     * @param {*=} value The object to expose at the end of the path.
     * @param {Boolean} overwrite True to force set the new value. Defaults to true
     */
    exports.set = function(o, ns, value, force) {
        exportPath(ns, value, o, force === undefined ? true : force)
    };

    /**
     * Get a property from a dot-separated string, such as "A.B.C".
     * Useful for longer api chains where you have to test each object in
     * the chain, or when you have an object reference in string format.
     *
     * @method get
     * @param {String} name Path to an property, in the form "A.B.C".
     * @param {Boolean} create Optional. Defaults to `false`. If `true`, Objects will
     *      be created at any point along the 'path' that is undefined.
     * @param {Object} context Optional. Object to use as root of path. Defaults to 'global'.
     */
    exports.get = function(/*String*/ name, /*Boolean?*/ create, /*Object?*/ context) {
        return getProp(name.split('.'), create, context || global);
    };

    /**
     * @method keys
     */
    exports.keys = Object.keys || function(o) {
      var arr = [];
      for (var k in o) {
        if (o.hasOwnProperty(k)) {
          arr.push(k)
        }
      }
      return arr;
    };

    // }}}
});
