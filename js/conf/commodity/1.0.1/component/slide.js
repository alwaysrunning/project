/**
 * @author	taotao
 * @desc    basic component
 * @daet    2016-03-09
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');
    var Slider = require('lib/ui/slider/3.0.4/slider');

    if ($('#slides img').length > 0) {
        new Slider('#slides', {
            height: $(window).width()*0.8,
            lazyLoad: {
                attr: 'data-url',
                loadingClass: 'img-error'
            },
            play: {
                auto: false,
                interval: 4000,
                swap: true,
                pauseOnHover: true,
                restartDelay: 2500
            }
        });
    }
});

