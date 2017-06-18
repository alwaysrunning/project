/**
 * @file detail.js
 * @synopsis 积分明细
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2016-09-05
 */

define(function(require) {
    'use strict';

    var $ = require('jquery');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');
    var detail = {
        init: function() {
            var self = this;
			self.lazyMore();
        },
        lazyMore: function() {
            new LazyStream('.jPage', {
				plUrl: 'http://m.yunhou.com/peach/getObtainRecord',
                /* 参数传递 */
                paramFormater: function(n) {
                    var data = {};
                    data.pageNo = n;
                    return data;
                },
                page: 1,
                errorText: '<div class="loading">网络错误，点击重试</div>',
                loadingClass: 'loading',
                loadingText: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
                load: function(el) {
				},
                noAnyMore: '<div class="loading">仅显示最近90天的记录</div>'
            });
        }
    };
    detail.init();
});
