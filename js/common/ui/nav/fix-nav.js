define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var cart = require('module/add-to-cart/addcart');

    var domString = [
        '<div class="fixedNav _jFixedNav">',
        '<ul>',
        '<li>',
        '<a href="http://m.yunhou.com/member/">',
        '<i class="iconglobal">&#xe607;</i>',
        '</a>',
        '</li>',
        '<li>',
        '<a href="http://m.yunhou.com/html/cart/cart.html">',
        '<i class="iconglobal">&#xe605;</i>',
        '<div class="cart-number" id="jGetSimple"></div>',
        '</a>',
        '</li>',
        '</ul>',
        '</div>'
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
        cart.getcart({
            ctx: '#jGetSimple'
        });
    };
});
