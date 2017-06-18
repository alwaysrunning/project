define(function(require) {

    'use strict';

    var $ = require('jquery'),
        Lazyload = require('common/widget/lazyload'),
        io = require('common/kit/io/request'),
        Delegator = require('lib/core/1.0.0/dom/delegator'),
        loadMore = require('module/my-center/lazy-more'),
        Dialog = require('common/ui/dialog/dialog'),

        toggle = function(e) {
            var checked,
                $btn = $(e.currentTarget),
                $box = $btn.closest('.jItemBox'),
                $ctn = $box.find('.jItemCtn');

            if ( $btn.hasClass('checked') ) { checked = true; }

            $btn.toggleClass('checked', !checked);
            toggleArrow( $btn.children(), checked);
            toggleAddon($ctn, checked);
         };

    function toggleArrow(arrow, status) {
        var iconChar = ['&#xe641;', '&#xe642;'];
        arrow.html(iconChar[status ? 0 : 1]);
    }

    function toggleAddon(addon, status) {
        addon[status ? 'hide' : 'show']();
    }

    return {
        init: function(element, opts) {
            this.setting = $.extend({}, opts || {});
            this.event(element);
            this.lazyMore(element);
        },
        event: function(element) {
            Delegator(element).on('click', 'toggle', function(e) {
                toggle(e);
            });
        },
        getTabUrl: function() {
            var tab = this.setting.tab;
            if (!tab.length) { tab = $(tab); }
            return tab.data('url');
        },
        lazyMore: function(element) {
            loadMore( $('.jScroll', element), this.getTabUrl() );
        }
    };
});
