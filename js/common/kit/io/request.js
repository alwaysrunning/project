/**
 * Http request utility interface, ajax(), post(), get(), jsonp().
 *
 * @module common/kit/io/request
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var logger = require('./logger');
    var box = require('../../ui/dialog/dialog');

    // Overrides the build-in locker style handler by Allex
    io.on('request', function(request, sender) {
        sender = sender && $(sender);
        if (sender) {
            var lockerClass = 'ui-button-disabled';
            sender.addClass(lockerClass).prop('disabled', true);
            request.once('end', function() {
                sender.removeClass(lockerClass).prop('disabled', false);
                sender = null;
            });
        }
    }, null, true);

    // Global errors track and intercepte.
    io.on('error', function(err, res) {
        // track error to tracert endpoint
        logger.error(err);
        if (+err.code === 1) {
            // box.tips('网络错误，请稍后再试');
            return false;
        }
    });

    module.exports = io;
});
