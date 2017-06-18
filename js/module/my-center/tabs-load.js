define(function(require, exports) {

    'use strict';

    var io = require('common/kit/io/request'),
        util = require('lib/core/1.0.0/utils/util'),
        // common
        Tabs = require('module/common/tabs'),
        // template
        // loading
        ldTpl = require('module/my-center/tpl/loading-tpl'),
        // net error
        netErrorTpl = [ '<div class=\"empty\">',
                            '<i class=\"icon iconfont\">&#xe620;</i>',
                            '<p class=\"emt-txt\">数据加载失败...</p>',
                            '<a href=\"#\" class=\"ui-button-white jNetError\">刷新试试</a>',
                        '</div>' ].join(''),
        // constant
        EVENTS = {
            switch: 'switch',
            load: 'load',
            init: 'init'
        },
        BBG = require('url'),
        LOGIN_URL = BBG.URL.Login.login,
        inherits = util.inherits;

    // helper

    function render(container, tpl) {
        container.html(tpl);
    }

    function TabsLoad(element, opts) {
        this.initProps(element, opts);
        this.setup();
    }

    inherits(TabsLoad, Tabs, {
        bindEvent: function() {
            this.on(EVENTS.load, function(index, tab, tabContent) {
                var callback = this.setting.load;

                if ( !$.isFunction(callback) ) {
                    callback = function() {};
                }

                this.loading = true;

                this.load({
                    index: index,
                    tab: tab,
                    tabContent: tabContent
                }, callback);
            });

            this.on(EVENTS.init, function(index, tab, tabContent) {
                var callback = this.setting.init;
                if ( $.isFunction(callback) ) {
                    callback({
                        index: index,
                        tab: tab,
                        tabContent: tabContent
                    });
                }
            });

            this.on(EVENTS.switch, function(e) {
                if (!this.loading) {
                    e.preventDefault();
                }
            });
        },
        load: function(opts, callback) {
            var req,
                tabs = this,
                tabContent = opts.tabContent,
                url = this.setting.url;

            if ( $.isFunction(url) ) {
                url = url(opts.tab);
            }

            if (this.setting.multiple) {
                tabContent.html(ldTpl);
            }

            function bindNetError() {
                tabContent.off('click', '.jNetError');
                tabContent.on('click', '.jNetError', function() {
                    tabs.load(opts, callback);
                });
            }

            function success(data) {
                var html;

                if (data.error === 0) {

                    data = data.data;

                    if ( data && (html = data.html) ) {
                        // render tab content
                        render(tabContent, html);
                        // call callback
                        callback(opts, data);
                    } else {
                        throw Error('数据不存在或者没有传入正确多html字符串!');
                    }

                    // 恢复可切换状态
                    tabs.loading = false;

                }
            }

            function error(data) {
                // session超时，
                // 返回登录页面，
                // 传入当前地址
                if (data.error === -100) {
                    location.href = LOGIN_URL + '?returnUrl=' + encodeURIComponent(location.href);
                }
                render(tabContent, netErrorTpl);
                bindNetError();
                tabs.loading = false;
            }

            req = io.jsonp(url, {}, success, error);
            // 请求出错处理
            req.on('error', error);
        }
    });

    return TabsLoad;

});
