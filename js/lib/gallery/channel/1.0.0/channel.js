/**
 * Global channel manager for application-level channel register and
 * subscribes/unsubscribe.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 *
 * @example
 *
 * ```js
 *
 *  var Channel = require('lib/gallery/channel/1.0.0/channel');
 *
 *  // Defines the specific channel events blacklist first.
 *  // ===
 *
 *  var testChannel = Channel.define('test', [ 'init', 'enter', 'exit' ]);
 *
 *  // Notify channel event
 *  // ===
 *
 *  setTimeout(function() { // use [setTimeout] to simulate a async invokes
 *      testChannel.fire('init', { foo: 123 });
 *  }, 1000);
 *
 *
 *  // Subscribe channel event (2 ways)
 *  // ===
 *
 *  // #1: subscribe by a shortcut api `subscribe`:
 *  Channel.subscribe( 'test/init', function(e) {
 *      console.log(e); // => { foo: 123 }
 *  });
 *
 *  // #2: alternative subscribe with a standard listen:
 *  var testChannel = Channel.get('test');
 *
 *  testChannel.listen( 'init', function(e) {
 *      console.log(e); // => { foo: 123 }
 *  });
 * ```
 */
define(function(require, exports, module) {
    'use strict';

    var Listener = require('../../../core/1.0.0/event/listener');

    var _channels = {}
    var getChannel = function(id) {
        return _channels[id] || (_channels[id] = Listener.define(id));
    }

    module.exports = {

        /**
         * Define events whitelist for a specific channel
         *
         * @method define
         * @param {String} name The channel uniq name
         * @param {Array} eventList The channel event white list for listening-in.
         */
        define: function(name, eventList) {
            var channel = getChannel(name);
            channel.init(eventList);
            return channel;
        },

        /**
         * Subscribe a specific channel with listener handler, channel subscribe will
         * be rejected if the specific channel event not defined.
         *
         * @path {String} path The xpath with channel name and event name. eg: TestChannel/init
         */
        subscribe: function(channel, fn) {
            var firstSlash = channel.indexOf('/'), channelName, eventName;
            if (firstSlash !== -1) {
                channelName = channel.substring(0, firstSlash);
                eventName = channel.substring(firstSlash + 1);
            }
            if (!channelName || !eventName) {
                throw Error('Subscribe channel failed, channel name "' + channel + '" invalid')
            }
            getChannel(channelName).listen(eventName, fn);
            return this;
        },

        /**
         * Get channel by channel uniq name
         *
         * @method get
         * @param {String} name The channel uniq name
         */
        get: getChannel

    }
});
