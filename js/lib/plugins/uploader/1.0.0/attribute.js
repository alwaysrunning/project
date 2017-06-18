/**
 * Simple attribute management interface implements.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function() {
  'use strict';

  var Attributes = {
    _attrs: null,
    get: function(k) { return (this._attrs || 0)[k]; },
    set: function(k, v) { (this._attrs || (this._attrs = {}))[k] = v; },
    removeAttrs: function() {
      var o = this._attrs
      for (var k in o)
        if (o.hasOwnProperty(k)) delete o[k]
      this._attrs = {}
    }
  };

  return Attributes;
});
