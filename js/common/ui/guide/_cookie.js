/**
 * Cookies adaptor
 *
 * @deprecate Use lib/core/1.0.0/io/cookie instead.
 */
define(function(require, exports, module) {
    'use strict';
    var $ = window.jQuery || window.Zepto;
    var cookie = require('lib/core/1.0.0/io/cookie');
    if ($) {
        $.cookie = cookie;
    }
    module.exports = cookie;
});
