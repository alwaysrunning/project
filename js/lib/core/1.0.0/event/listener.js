/**
 * A Listener provider for whitelist events based on EventEmitter
 * subscribe/unsubscribe.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 *
 * @example
 *
 * ```js
 *  var Listener = require('lib/core/1.0.0/event/listener')
 *
 *  // define a channel named 'test/fooChannel', with a whitelist events whitelist
 *  var channel = Listener.define('test/fooChannel', [
 *      'init',
 *      'enter',
 *      'exit' ]);
 *
 *  // subscribe
 *  channel.listen('init', function(data) {
 *      console.log(data)  // => {foo: foo data}
 *  });
 *
 *  // publish event
 *  channel.fire('init', {foo: 'foo data'});
 * ```
 */
define(function(require, exports, module) {
  'use strict';

  var util = require('../utils/util')
  var Emitter = require('./emitter')

  function findArrayValue(arr, v) {
    if (arr.indexOf) {
      return arr.indexOf(v) !== -1;
    } else {
      for (var i = -1, l = arr.length; ++i < l; ) {
        if (arr[i] === v) return true;
      }
      return false;
    }
  }

  // internal channel cache { k:v [ , ... ] }
  var $channelPool = {};

  var createListener = function(ns, events) {
    if (!ns) {
      throw Error('Defines listener failed. listener name cannot null')
    }

    var cacheObj = $channelPool[ns];
    if (cacheObj) {
      throw Error('Create listener with name \'' + ns + '\' failed. listener exists')
    }

    var _emitter = new Emitter()
      , _list = []
      , _pending = []
      , _ready = 0 // reay when initialized

      // Exports listener instance api
      , api = {
          init: function(events) {
            if (_ready) {
              throw Error('Initialize listener with name \'' + ns + '\' failed. listener alreay initialized')
            }
            _ready = 1;
            _list = events;
            // process pending queue
            var args;
            while (args = _pending.shift()) {
              if (findArrayValue(events, args[0])) {
                api.listen.apply(api, args);
              }
            }
            return api;
          },
          listen: function(type, fn, scope) {
            var args = [].slice.call(arguments);
            if (!_ready) {
              // add to pending if the listener not ready.
              _pending.push(args);
            } else {
              if (!findArrayValue(_list, type)) {
                throw Error('The event type \'' + type + '\' in [' + ns + '] ' +
                    'is unrecognized, check whitelist first');
              }
              _emitter.on.apply(_emitter, args);
            }
          },
          fire: function(type /* [, args ... ] */) {
            if (!_ready) {
              throw Error('Notify listener ignored, The listener not ready yet')
            }
            _emitter.emit.apply(_emitter, arguments);
          },
          destroy: function() {
            _emitter.removeAllListeners();
            _emitter = null;
            _list = _pending = api = null;
            delete $channelPool[ns];
          }
        };

    // Impl gerneric event APIs: un, once
    util.each(['once', 'un'], function(k) {
      api[k] = function() { return _emitter[k].apply(_emitter, arguments) }
    });

    // Alias #.on(type, ... )
    api.on = api.listen;

    if (events) {
      api.init(events);
    }

    // cache the listener instance as uniq
    $channelPool[ns] = api;

    return api;
  };

  var undefineListener = function(ns) {
    var o = ns && $channelPool[ns]
    if (o) {
      o.destroy();
      return true;
    }
    return false;
  };

  module.exports = {

    /**
     * Define a specific channel with channel name and events list.
     *
     * @param {String} ns The channel name to define.
     * @param {Array} events The events types as a whitelist for listening strictly.
     * @return {Object} Returns a listener instance with APIs based on {EventEmitter}
     */
    define: createListener,

    /**
     * Undefine a listener, used for destroy the specific channel
     * instance.
     *
     * @param {String} ns The unique listener name
     */
    undefine: undefineListener,

    /**
     * Provide a api for get the specific listener by a unique name.
     *
     * @param {String} ns The listener name to index.
     * @return {Object} Returns a listener instance with APIs based on {EventEmitter}
     */
    get: function(id) { return $channelPool[id] }

  }

});
