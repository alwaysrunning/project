/**
 * Page context management. Helper for global config data apis access etc,.
 *
 * @author Allex Wang
 */
define(function(require, exports, module) {
  'use strict';

  var object = require('../../../core/1.0.0/lang/object');
  var $global = ( typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this) ) || {};

  // Global page config host object (name as '$PAGE_DATA')
  var $cfg = $global['$PAGE_DATA'] || {};

  function getConf(k, defval, context) {
    context = context || $cfg;
    var v = context[k];
    if (v === undefined) {
      v = object.get(k, false, context);
    }
    // Returns defaults if undefined
    return v === undefined ? defval : v;
  }

  function setConf(k, v, context) {
    object.set(context || $cfg, k, v);
  }

  /**
   * Retrieve value from host settings by a specific json path, The path can be a
   * namespace split wih dot(.)
   *
   * @param {String} path
   */
  exports.getConf = getConf;

  /**
   * Set global context config value.
   *
   * @method setConf
   * @param {String} key The config key name to set
   * @param {*} value
   */
  exports.setConf = setConf;

  /**
   * Resolves `to` to an absolute url. resolve `from` with global paths additionally.
   *
   *  @example
   *
   * ```
   *  context.resolveUrl('api.mall', '/foo/path/get?ac=doit')
   *  // => returns
   *  'http://api.mall.abc.com/foo/path/get?ac=doit'
   * ```
   */
  exports.resolveUrl = function(from, to) {
    if (to && to.charAt(0) !== '/') to = '/' + to;
    return (from ? getConf(from, from, $cfg.paths) : '') + (to || '');
  };

});
