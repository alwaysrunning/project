/**
 * @file integral.js
 * @synopsis  桃子积分
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2016-09-08
 */

define(function(require) {
    'use strict';
    var $ = require('jquery');
    var Tab = require('common/ui/tab/1.0.0/tab');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');
    var pop = require('common/ui/pop-box/1.0.0/pop-box');
    var io = require('lib/core/1.0.0/io/request');
    var integral = {
        moduleId: 'jWrap',
        init: function() {
            var self = this;
            self.o = $('#' + self.moduleId);
            self._events();
            self._tab();
            //兑换优惠券
            self.lazyMore('.jPage', 'http://m.yunhou.com/peach/getChangeRuleList');
        },
        _events: function() {
            var self = this;
            $('#jHelp').on('click', function() {
				var msg = $(this).attr('data-msg');
                (msg!=undefined) && pop.alert(msg, false, '知道了');
            });
            self.o.on('click', '.jExchange', function() {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                var $this = $(this);
                $this.addClass('disabled');
                self._exchange($this);
            });
        },
        _exchange: function($this, callback) {
            io.jsonp('http://m.yunhou.com/peach/changeCoupon', {
                id: $this.attr('data-id')
            }, function(data) {
                if (data && data.data) {
                    if (data.data.msg && data.data.msg.length != 0) {
                        pop.alert(data.data.msg);
                    }
                    if (data.data.succeed) {
                        $this.removeClass('disabled');
						var _val = $this.attr('data-value');
                        var val = $.trim($('#jDetailBox').text());
						$('#jDetailBox').text(val-_val);
                    }
                } else {
                    $this.removeClass('disabled');
                }
                callback && callback();
            }, function(data) {
                if (data && data.msg && data.msg.length != 0) {
                    pop.alert(data.msg);
                }
                $this.removeClass('disabled');
            });
        },
        _tab: function() {
            var self = this;
            //选项卡切换
            var tb = new Tab('#jWrap', {
                tabs: '[role=tablist] a',
                hoverClass: 'hover'
            });
            tb.on('tabClick', function(e) {
                if (e.index == 1 && !e.$this.hasClass('jNotFirst')) {
                    //兑换记录
                    self.lazyMore('.jPage2', 'http://m.yunhou.com/peach/getChangeRecord', function() {
                        e.$this.addClass('jNotFirst');
                    });
                }
            });
            //
            var tb = new Tab('#jWrap', {
                tabs: '[role=tablistCoupon]',
                'ctns': '[role=tabpanelCoupon]',
                isToggle: true,
                hoverClass: 'hover'
            });
        },
        lazyMore: function(selector, url, load) {
            new LazyStream(selector, {
                plUrl: url,
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
                    load && load(el);
                },
                noAnyMore: '<div class="loading">sorry,已经没有下一页了..</div>'
            });
        }
    };
    integral.init();
});
