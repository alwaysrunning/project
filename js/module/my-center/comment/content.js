define(function(require) {

    'use strict';

    var $ = require('jquery'),
        loadMore = require('module/my-center/lazy-more'),
        Delegator = require('lib/core/1.0.0/dom/delegator');

    function morePros(e) {
        var $btn = $(e.currentTarget);
        $btn.prev().toggle();
        $btn.toggleClass('shown');
    }

    return {
        init: function(element, opts) {
            this.setting = $.extend({}, opts || {});
            this.event(element);
            this.lazyMore(element);
        },
        event: function(element) {
            Delegator(element).on('click', 'morePros', morePros);
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
