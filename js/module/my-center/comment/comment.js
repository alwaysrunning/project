define(function(require) {

    'use strict';

    var Tabs = require('module/my-center/tabs-load'),
        tabs = new Tabs('#tabs', {
            multiple: true,
            initialLoad: false,
            url: getUrl,
            init: loadTabContent,
            load: loadHandler
        });

    function getUrl(tab) {
        return tab.data('url');
    }

    function loadTabContent(opts) {
        var content = require('module/my-center/comment/content');
        content.init(opts.tabContent, opts);
    }

    function loadHandler (opts) {
        loadTabContent(opts);
    }

});
