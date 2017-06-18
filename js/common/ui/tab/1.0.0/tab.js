/**
 * @file tab.js
 * @synopsis tab
 * @author licuiting, 250602615@qq.com
 * @version 1.0
 * @date 2015-08-04
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var defaultSetting = {
        'tabs': '[role=tablist] li',
        'ctns': '[role=tabpanel]',
        'hoverClass': 'active',
        isToggle: false //同一个tab是否切换显示,隐藏功能;
    };
    //自定义事件
    var CALL_BACK_EVENTS = ['tabClick'];

    function _Tab(selector, opt) {
        var self = this;
        this.opt = {};
        this.selector = selector;
        $.extend(this.opt, opt);
    };
    _Tab.prototype = {
        constructor: _Tab,
        init: function() {
            var self = this;
            self.o = $(self.selector);
            //
            self._events();
        },
        toggle: function(index) {
            var self = this,
                $thisTab = self.$tabs.eq(index),
                isShow = $thisTab.hasClass('hover');
            self.$tabs.removeClass(self.opt.hoverClass);
            $thisTab[(self.opt.isToggle && isShow) ? 'removeClass' : 'addClass'](self.opt.hoverClass);
            self.$ctns.hide().eq(index)[(self.opt.isToggle && isShow) ? 'hide' : 'show']();
        },
        _events: function() {
            var self = this;
            self.o.on('click', self.opt.tabs, function() {
				self.$tabs = self.o.find(self.opt.tabs);
				self.$ctns = self.o.find(self.opt.ctns);
                var $this = $(this);
                var index = self.$tabs.index($this);
                self.toggle(index);
                self.emit(CALL_BACK_EVENTS[0], {
                    $this: $this,
                    index: index
                });
            });
        }
    }
    Emitter.applyTo(_Tab);

    function Tab(selector, opt) {
        var self = this;
        if (typeof selector != 'string') {
            throw 'lack of selector';
            return false;
        }
        $.extend(defaultSetting, opt);
        //
        $(selector).each(function() {
            var tab = new _Tab(this, defaultSetting);
            tab.init();
            //注册事件
            $.each(CALL_BACK_EVENTS, function(index, v) {
                tab.on(v, function(e) {
                    self.emit(v, e);
                });
            });
        });
    }
    Emitter.applyTo(Tab);
    module.exports = Tab;
});
