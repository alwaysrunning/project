/**
 * Common sso-login privileged channel.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var Listener = require('../../../core/1.0.0/event/listener');

    // events whitelist
    var eventList = [
        'login',
        'logout',
        'timeout',
        'error'
    ];

    module.exports = Listener.define('ssologin', eventList);
});
