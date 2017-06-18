/**
 * @author	taotao
 * @des     组合商品，tab切换
 * @date    2016-04-19
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');


    module.exports = {
        select: function(wrap, tab, cnt, active) {
            var w = $(wrap);
            var t = w.find(tab);
            // var c = w.find(cnt);

            t.on('click', function() {
                var item = $(this).closest('.group-goods');

                $('body').trigger('scroll');

                var st = item.find(tab);
                var sc = item.find(cnt);

                var idx = $(this).index();

                st.siblings().removeClass(active || 'current');
                st.eq(idx).addClass(active || 'current');

                sc.css({
                    display: 'none'
                });
                sc.eq(idx).css({
                    display: 'block'
                });

            });
        }
    };
});
