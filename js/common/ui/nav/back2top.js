/**
 * top banner search
 * @author	taotao
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var domString = [
        '<a class="back2top jScroll2Top">',
        '<i class="iconglobal">&#xe606;</i>',
        '</a>'
    ].join('');

    return function(opts) {
        var opt = $.extend({
            dom: domString,
            append: $('.page-view')
        }, opts);


        if (typeof opts !== 'undefined' && !!opts.append) {
            opt.append = typeof opts.append === 'string'? $(opts.append) : opts.append;
            delete opts.append;
        }

        opt.append.append(opt.dom);

        var update = function() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 1000) {
                if (!$('.jScroll2Top').hasClass('_shown')) {
                    $('.jScroll2Top').addClass('_shown').show(300);
                }

            } else if ($('.jScroll2Top').hasClass('_shown')) {
                $('.jScroll2Top').removeClass('_shown');
                $('.jScroll2Top').hide(300);
            }
        };

        $(window).on('scroll.scroll2top', update);

        update();

        $('.jScroll2Top').on('click', function(e) {
            e.preventDefault();
            window.scrollTo(0,0);
        });
    };
});
