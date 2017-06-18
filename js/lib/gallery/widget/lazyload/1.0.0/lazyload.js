/**
 * Lazyload with image source rewriter enhancement, based on
 * <lib/plugins/lazyload/1.9.3>
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var util = require('../../../../core/1.0.0/utils/util');
    var Lazyload = require('../../../../plugins/lazyload/1.9.3/lazyload');
    var rebuildImageURL = require('../../../utils/1.0.0/image').rebuildImageURL;

    // The default dpr of image size adapted.
    var DEFAULT_IMAGE_DPR = 2;
    var LOADER_TYPE_IMG = 'image';
    var $window = $(window);

    var imageSourceMaker = function(src, elem) {
        return rebuildImageURL(src, DEFAULT_IMAGE_DPR); // original dpr: 2
    };

    function LazyloadExt(selector, options) {
        options = $.extend(true, {
            threshold: ~~($window.height() / 3), // Defaults to preload images threshold by 1/3 of viewport
            optimizeImage: false // Image DPI optimize disabled by default
        }, options);
        var type = options.type || LOADER_TYPE_IMG; // defaults to image
        if ( options.optimizeImage && (type === LOADER_TYPE_IMG) ) {
            // Optional setup sourceMaker for rebuild image source by current device dpr.
            options.sourceMaker = imageSourceMaker;
        }
        Lazyload.apply(this, [selector, options]);
    }

    util.inherits(LazyloadExt, Lazyload);

    /**
     * Provides a static helper method for load some images with lazy-load features.
     *
     * @param {String} selector The elements selector with image needs to load.
     */
    LazyloadExt.load = function(selector, options) {
        options = options || 0;

        var dataAttr = options.dataAttribute || 'url'
          , originAttr = 'data-' + dataAttr
          , loadingClass = options.loadingClass || 'img-error'
          , $list = $(selector).filter('[' + originAttr + ']')

        if (!$list.length) {
            return;
        }

        var o = new Lazyload($list, $.extend(true, {
            threshold: ~~($window.height() / 3), // Defaults to preload images threshold by 1/3 of viewport
            dataAttribute: dataAttr, // the image original placed in dataset, eg. `data-xxx`
            loadingClass: loadingClass,
            placeholder: '//s1.bbgstatic.com/s.gif'
        }, options));

        o.on('reset', function() {
            o.destroy();
            o = null;
            $list.removeAttr(originAttr).removeClass(loadingClass)
            $list = null;
        });

        o.on('lazyItemReady', function(el) {
            el.removeAttribute(originAttr);
            if (!o.peek()) o.reset();
        });

        o.update();

        return o;
    };

    module.exports = LazyloadExt;
});
