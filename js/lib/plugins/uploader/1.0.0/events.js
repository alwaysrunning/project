/**
 * Generic Event-Emitter abstruct.
 *
 * @module lib/plugins/uploader/events
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var slice = [].slice;
  var Emitter = function() {}
  require('../../../core/1.0.0/event/emitter').applyTo(Emitter);

  // Fix emitter type for listeners.
  var _emit = Emitter.prototype.emit;
  Emitter.prototype.emit = function(type) {
    var args = slice.call(arguments, 1), eventObj = args[0]
    if (eventObj && !eventObj.type) {
      eventObj.type = type
    }
    return _emit.apply(this, [type].concat(args))
  }

  module.exports = Emitter;
});
