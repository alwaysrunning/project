/**
 * Lazyload with image source rewriter enhancement, based on
 * <lib/plugins/lazyload/1.9.3>
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 * @deprecate Use lib/gallery/widget/lazyload/1.0.0/lazyload instead.
 */
define(function(require, exports, module) {
    'use strict';
    var Lazyload = require('lib/gallery/widget/lazyload/1.0.0/lazyload')
    module.exports = function(selector, options) {
        options = options || {}
        options.optimizeImage = true; // Defaults to enable image DPI optimization
        return new Lazyload(selector, options);
    };
});
