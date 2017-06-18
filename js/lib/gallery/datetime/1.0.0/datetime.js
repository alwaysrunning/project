/**
 * Datetime utilities 
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var io = require('../../../core/1.0.0/io/request');
    var context = require('../../context/1.0.0/context')

    var now = Date.now || function() { return +new Date };

    function getNTP() {
        return context.getConf('env.ntp', 'http://api.mall.yunhou.com/Time');
    }

    // Retrieve server timestamp, cached time diff for perfs by Allex
    var getServerTime = function() {
        var _syncing;
        var _diffTime = null;
        var _pending = [];
        var syncServer = function(url, fn) {
            // cache for sync threads
            _pending.push(fn);
            if (_syncing) {
                return;
            }
            _syncing = true;
            io.jsonp(url, {platform: 'js'}, function(ts) {
                ts = +ts;
                if (!ts) {
                    ts = now(); // use client time instead if not valid.
                }
                _diffTime = ts - now();
                _syncing = undefined;
                var fn;
                while (fn = _pending.shift()) fn(ts);
            });
        };
        return function(timesvr, callback) {
            if (typeof timesvr === 'function') {
                callback = timesvr;
                timesvr = '';
            }
            callback = callback || noop;
            if (_diffTime !== null) {
                return callback(now() + _diffTime);
            }
            timesvr = timesvr || getNTP();
            syncServer(timesvr, callback);
        };
    }();

    module.exports = {
        /**
         * Get current unix timestamp
         *
         * @return {Integer} the timestamp int number
         */
        now: now,

        /**
         * Get current time synchronized with backend server.
         *
         * @praram {Funtion} the callback function, with timestamp parameter
         *
         * @example
         *
         * ```
         *  #.getServerTime(function(ts) {
         *      console.log(ts); // unix timetamp
         *  });
         * ```
         */
        getServerTime: getServerTime
    }

});
