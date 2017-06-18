define(function(require, exports, module) {

    'use strict';

    var Tabs = require('module/my-center/tabs-load'),
        tabs = new Tabs('#tabs', {
            activeIndex: getHashIndex() || getIndex() || 0,
            initialLoad: true,
            url: getUrl,
            init: loadTabContent,
            load: loadHandler
        });

    function getUrl(tab) {
        return tab.data('url');
    }

    function setTabListNum(tablist, num) {
        tablist = tablist || tabs.getTabList();
        tablist.each( function(index, tab) {
            var countEl,
                key = 'num' + (index - 1).toString(),
                value = num[key];

            if (typeof value !== 'undefined' && value !== '') {

                countEl = $(tab).find('.count');

                if (countEl.length > 0 && countEl.text() != value) {
                    countEl.text(value);
                }

            }
        });
    }

    function loadTabContent(opts) {
        var tabContent = require('module/my-center/order/content');
        tabContent.destroy(opts.tabContent);
        tabContent.init(opts.tabContent, opts);
        tabContent.on('load', loadBridge);
    }

    function loadBridge(opts) {
        tabs.load(opts, loadHandler);
    }

    function loadHandler (opts, data) {
        setTabListNum(opts.tabList, data);
        loadTabContent(opts);
    }

    function getIndex() {
        var search = location.search;
        if ( search.indexOf('from=index') > 0 ) {
            return 1;
        }
    }

    function getHashIndex(){
        var hash = location.hash.substring(1);
        if(hash>0){
            return hash;
        }
    }
});
