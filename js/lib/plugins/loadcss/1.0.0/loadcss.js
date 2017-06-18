/*
 * CSS Loader - A ui plugin for load css use js
 *
 * @author	taotao
 *
 */

(function( root, name, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define( ['jquery'], factory );
    } else {
        // Browser globals (root is window)
        root[name] = factory(jQuery);
    }
}(this, 'LoadCss', function( $, undefined ) {
    'use strict';

    var LoadCss = function(require, i) {
        var _cssArray = [];
        if ( typeof i === 'string' ) {
            _cssArray.push(i);
        } else if (Array.isArray(i)) {
            _cssArray = i;
        } else {
            return false;
        }

        for (var idx = 0, len = _cssArray.length; idx < len; idx = idx + 1) {
            var _css = _cssArray[idx];
            if (_css) {
                var fn = require[require.toUrl ? 'toUrl' : 'resolve'];
                if (fn) {
                    _css = fn(_css);
                    _css = '<link rel="stylesheet" href="' + _css + '" />';
                    if ($('base')[0]) {
                        $('base').before(_css);
                    } else {
                        $('head').append(_css);
                    }
                }
            }
        }
    };

    return LoadCss;
}));
