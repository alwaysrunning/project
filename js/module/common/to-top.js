/**
 * to top
 * @author  liangyouyu
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');

    var Top =  function(opts) {
        var defaults = {
            btnStr : '<div class="mod-gotop" ><div class="iconfont">&#xe635;</div></div>',
        };
        var opt = $.extend({}, defaults, opts);

        var btnStr = opt.btnStr;

        var eScrollToTop = $(opt.btnStr);
        $('body').append(eScrollToTop);
        /* 返回顶部 - start */
        scrollToTop();
        function scrollToTop() {
            var top = $('body').scrollTop() || $('html').scrollTop() ;  //chromu use body;firefox use html
            if (top > $(window).height()) {
                eScrollToTop.show();
            } else {
                eScrollToTop.hide();
            }
        }

        $(document).scroll(function() {
            scrollToTop();
        });

        eScrollToTop.on('click',function() {
            $('html,body').scrollTop(0);
        });
    };

    module.exports = {
        init:Top
    }
});