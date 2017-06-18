define(function(require, exports, module) {

    'use strict';

    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream'),

        // tpl
        placeholderTpl = '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
        netErrorTpl = '网络错误，点击重试';

    module.exports = function (selector, url) {
        new LazyStream(selector, {
            page: 2,
            plUrl: url,
            paramFormater: function(n) {
                return {p: n};
            },
            errorText: netErrorTpl,
            loadingClass: 'loading',
            loadingText: placeholderTpl,
            dataFilter: function(data) {
                var html = data.data.html,
                    pattern = /\S/;

                // 调整优惠券金额字体大小
                var _htmlDOM = $(html);
                _htmlDOM.find('.jItemBox .cp-code').each(function() {
                    var _cpvalue = $(this).find('span');
                    var _cpvaluetxt = _cpvalue.text();
                    if (_cpvaluetxt.length > 3) {
                        _cpvalue.css('font-size', 3 / _cpvaluetxt.length * 1.70667 + 'rem');
                    }
                });

                return $('<div>').append(_htmlDOM).html();
            }
        });
    };

});
