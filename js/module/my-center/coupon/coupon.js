define(function(require) {

    'use strict';
    
    var $ = require('jquery');

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
        var content = require('module/my-center/coupon/content');
        content.init(opts.tabContent, opts);
    }

    function loadHandler (opts) {
        loadTabContent(opts);
    }

    // 调整优惠券金额字体大小
    $('.jItemBox .cp-code').each(function() {
        var _cpvalue = $(this).find('span');
        var _cpvaluetxt = _cpvalue.text();
        if (_cpvaluetxt.length > 3) {
            _cpvalue.css('font-size', 3 / _cpvaluetxt.length * 1.70667 + 'rem');
        }
    });

});
