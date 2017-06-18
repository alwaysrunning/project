/**
 * @file countdown.js
 * @synopsis  自定义样式
 * @author licuiting, 250602615@qq.com
 * @version 1.0.1
 * @date 2016-07-25
 * @js
    require(['countdown/1.0.1/countdown'], function(CountDown)
    {
        var countDown = new CountDown('.jCountTime',
        {
            pattern: 'dd:hh:mm:ss'
        });
		//倒计时结束
        countDown.on('end', function($el)
        {
            alert(11);
        });
    });
	
  @html : dd:hh:mm:ss:ms
  <div data-start-time="1432526400000" data-end-time="1464148800000" class="count-down jCountTime">
	<span node-type="dd0" class="dd0" data-txt="3">3</span>
	<span node-type="dd1" class="dd1" data-txt="6">6</span>
	<span node-type="dd2" class="dd2" data-txt="5">5</span>
	<span node-type="hh0" class="hh0" data-txt="2">2</span>
	<span node-type="hh1" class="hh1" data-txt="3">3</span>
	<span node-type="mm0" class="mm0" data-txt="3">3</span>
	<span node-type="mm1" class="mm1" data-txt="3">3</span>
	<span node-type="ss0" class="ss0" data-txt="1">1</span>
	<span node-type="ss1" class="ss1" data-txt="4">4</span>
	<span node-type="ss0" class="ms0" data-txt="1">1</span>
	<span node-type="ms" class="ms" data-txt="1">1</span>
  </div>
  
   2.d:h:m:s:ms
  <div data-start-time="1432526400000" data-end-time="1464148800000" class="count-down jCountTime">
	<span node-type="d" class="d" data-txt="3">3</span>
	<span node-type="h" class="h" data-txt="2">2</span>
	<span node-type="m" class="m" data-txt="3">3</span>
	<span node-type="s" class="s" data-txt="4">4</span>
	<span node-type="ms" class="ms" data-txt="1">1</span>
  </div>
 */

define(function(require, exports, module) {
    'use strict';
    //import public lib
    var $ = require('jquery');
    var Emitter = require('lib/core/1.0.0/event/emitter');
    var io = require('lib/core/1.0.0/io/request');
    var DateTime = require('lib/gallery/datetime/1.0.0/datetime');
    var getServerTime = DateTime.getServerTime;

    //默认设置
    var defaultSetting = {
        url: '', //获取服务器时间
        pattern: 'dd:hh:mm:ss' //日期模式 1.dd:hh:mm:ss:ms (日期打散显示); 2.d:h:m:s:ms(合并显示)
    };
    //自定义事件
    var CALL_BACK_EVENTS = ['start','end'];

    function _CountDown(selector, opt) {
        var self = this;
        this.opt = {};
        this.selector = selector;
        $.extend(this.opt, opt);
    }
    _CountDown.prototype = {
        init: function(startTime, endTime, pattern) {
            var self = this;
            self._o = $(self.selector);
            getServerTime(function(data) {
				var isStart = !(data < startTime); 
                self._startTime = data || startTime;
                self._endTime = endTime;
                self._pattern = pattern;
                self._createTime(isStart);
            });
        },
        // 格式化指定的时分秒，如不足2位补0
        _formatZero: function(n) {
            var n = parseInt(n, 10);
            if (n > 0) {
                if (n <= 9) {
                    n = "0" + n;
                }
                return String(n);
            } else {
                return "00";
            }
        },
        //判断类型
        _hasType: function(type) {
            return (this._pattern.indexOf(type + ':') > -1) || (this._pattern.indexOf(':' + type) > -1);
        },
        _addTagB: function(type, n) {
            var self = this;
            var labelStr = '';
            var flag = (type.length > 1);
            //长度
            if (n.length > 1) {
                for (var k = 0; k < n.length; k++) {
                    labelStr += n.slice(k, k + 1);
                    flag && self._appendToBox(type + k, n.slice(k, k + 1));
                }
            } else {
                labelStr = n;
                flag && self._appendToBox(type, n);
            }
            if (flag) {
                return false;
            } else {
                return labelStr;
            }
        },
        _appendToBox: function(type, html) {
            if (!html || html.length == 0) {
                return false;
            }
            var self = this;
            var _type = type.slice(0, 1);
            var $node = self._o.find('[node-type=' + type + ']');
            if ($node && $node.length > 0) {
                self['_$' + _type] = $node;
            } else {
                self._o.append('<span node-type="' + type + '" class="' + type + '"></span>');
                self['_$' + _type] = self._o.find('[node-type=' + type + ']');
            }
            var $type = self['_$' + _type];
            //缓存数据
            if ($type.attr('data-txt') == undefined || $type.attr('data-txt') != html && !$type.is(':hidden')) {
                $type.attr('data-txt', html);
                $type.html(html);
            }
        },
        // 绑定显示时间
        _bindTime: function(day, hour, minite, second, msec) {
            var self = this;
            var temp = '';
            var _i = 0;
            var ar = [hour, minite, second, msec];
            var pattern = self._pattern.split(':');
            //
            if (self._hasType('d')) {
                self._appendToBox(pattern[0], self._addTagB(pattern[0], day));
            } else {
                // ar[0] = self._formatZero(hour * 1 + (day * 24));
                ar[0] = self._formatZero(hour * 1);
            }
            for (var i = 0; i < pattern.length; i++) {
                //排除天
                if (pattern[i] != 'd' && pattern[i] != 'dd') {
                    _i++;
                    self._appendToBox(pattern[i], self._addTagB(pattern[i], ar[_i - 1]));
                }
            }
        },
        _createTime: function(isStart) {
            var self = this;
            var msec = 9;
            var _beginTime = new Date().getTime();
            var initTime = setInterval(_loop, 100);
            // 倒计时函数
            function _loop() {
                self._startTime = self._startTime + 100;
                _beginTime = _beginTime + 100;
                if (_beginTime != new Date().getTime()) {
                    self._startTime = self._startTime + (new Date().getTime() - _beginTime);
                    _beginTime = new Date().getTime();
                }

                var dur = (self._endTime - self._startTime) / 1000;
                if (dur > 0 && isStart) {
                    var second = self._formatZero(dur % 60);
                    var minite = Math.floor((dur / 60)) > 0 ? self._formatZero(Math.floor((dur / 60)) % 60) : "00";
                    var hour = Math.floor((dur / 3600)) > 0 ? self._formatZero(Math.floor((dur / 3600)) % 24) : "00";
                    var day = Math.floor((dur / 86400)) > 0 ? self._formatZero(Math.floor((dur / 86400))) : "00";

                    self._bindTime(day, hour, minite, second, msec);
                    if (msec == 0) {
                        msec = 9;
                    } else {
                        msec--;
                    }
                } else {
                    self._bindTime("00", "00", "00", "00", "0");
                    // 倒计时结束调用回调函数
                    self.emit('end', self.selector);
                    clearInterval(initTime);
                }
            }
        }
    }
    Emitter.applyTo(_CountDown);

    //转换时间
    function toTime(timeStr) {
        if (timeStr && timeStr.indexOf('-') > -1) {
            return (new Date(timeStr.replace(/-/gm, "/"))).getTime();
        } else {
            return timeStr;
        }
    }

    function CountDown(selector, opt) {
        var self = this;
        if (typeof selector != 'string') {
            throw 'lack of selector';
            return false;
        }
        $.extend(defaultSetting, opt);
        //
        $(selector).each(function() {
            var startTime = $(this).attr('data-start-time') || defaultSetting.startTime;
            startTime = toTime(startTime);
            var endTime = $(this).attr('data-end-time') || defaultSetting.endTime;
            endTime = toTime(endTime);
            var pattern = $(this).attr('data-pattern') || defaultSetting.pattern;
            if (startTime == null || endTime == null) {
                return false;
            }
            var cDown = new _CountDown(this, defaultSetting);
            cDown.init(parseInt(startTime), parseInt(endTime), pattern);
            //注册事件
            $.each(CALL_BACK_EVENTS, function(index, v) {
                cDown.on(v, function() {
                    self.emit(v);
                });
            });
        });
    }
    Emitter.applyTo(CountDown);
    module.exports = CountDown;
});
