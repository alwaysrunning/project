define( function(require) {
    'use strict';

    var $ = require('jquery'),
        io = require('common/kit/io/request'),
        dialog = require('common/ui/dialog/dialog'),
        // follow selector for input
        selector = '.jFollow',
        areaSelector = '.jFollowArea',
        //constant
        URL = '//m.yunhou.com/Checkout/saveMemo',
        BUY_TYPE = 'normal',
        ESCAPEMAP = {
            "<": "&#60;",
            ">": "&#62;",
            '"': "&#34;",
            "'": "&#39;",
            "&": "&#38;"
        };

    function escapeFn(s) {
        return ESCAPEMAP[s];
    }

    function escapeHTML(content) {
        return content.replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
    }

    function getDate(elems) {
        var data;

        if (elems.length) {
            data = {
                shopId: [],
                buyType: BUY_TYPE,
                memo: []
            };

            $.each(elems, function(i, item) {

                var shopId,
                    value = item.value || '',
                    shopIdElem = $(item).closest('.mod-list').children('.hd');

                if (shopIdElem && shopIdElem.length) {
                    shopId = shopIdElem.attr('data-shopId');
                }

                data.memo.push( escapeHTML(value) );
                data.shopId.push(shopId);
            });

            return data;
        }

    }

    function getElement() {
        var elem = $(areaSelector);
        if (elem.length > 0 ) { return elem; }
    }

    function active() {
        $(selector).focus();
    }

    function formatter(data) {
        data.shopId = data.shopId.join(',');
        return data;
    }

    function error(data) {
        var code = data.error.toString() ;
        if (code === '500') {
            dialog.tips(data.msg);
        }
    }

    return {
        init: function() {
            this.bindEvent();
        },
        bindEvent: function() {
            var elem = getElement();
            if ( typeof elem !== 'undefined') {
                elem.on('tap', active);
                this.enable = true;
            }
        },
        getEanble: function() {
            return this.enable;
        },
        submit: function(callback) {
            var data = getDate( $(selector) );
            if (data) {
                data = formatter(data);
                io.jsonp(URL, data, callback, error);
            }
        }
    };

} );
