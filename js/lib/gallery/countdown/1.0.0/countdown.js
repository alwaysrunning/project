/*
 * @description: 倒计时控件
 * @author:djune (2013-11-29)
 * @param：见代码options的注释
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var TaskDaemon = require('../../../core/1.0.0/utils/daemon');
    var DateTime = require('../../datetime/1.0.0/datetime');

    var noop = function() {};
    var floor = Math.floor;
    var now = DateTime.now;
    var getServerTime = DateTime.getServerTime;

    // 格式化指定的时分秒，如不足2位补0
    var formatZero = function(n) {
        var n = parseInt(n, 10);
        if (n > 0) {
            if (n <= 9) {
                n = "0" + n;
            }
            return String(n);
        } else {
            return "00";
        }
    };

    function Countdown(opt) {
        if (!(this instanceof Countdown)) {
            return new Countdown(opt);
        }
        this.defaultSetting = $.extend(this, this.defaultSetting, opt || {});
        this._pools = [];
        this.init();
    }

    Countdown.prototype = {
        defaultSetting : {
            // 当前时间
            currentTime : null,
            //自定义标签
            labelCtn : 'b',
            //是否展示成 <b>1</b><b>2</b><em>:</em><b>1</b><b>2</b>格式
            isShowArea : false,
            // 倒计时结束时间
            targetTime : null,
            //是否显示时间文本
            isShowTimeText : true,
            //时间文本
            timeText : ['天','时','分','秒','毫秒'],
            //文本标签
            textLabel : 'em',
            // 【d（天）：参数值如果是false表示不显示天数，如果是ture表示显示，如果是某个字符串，表示会给天数赋值一个class样式】
            // 【h（时）：没有false参数值，如果是ture表示显示，如果是某个字符串，表示会给天数赋值一个class样式】
            // 【m（分）：同上】
            // 【s（秒）：同上】
            // 【ms（毫秒）：参数值说明同d（天）】
            type : {
                'd' : false,
                'h' : true,
                'm' : true,
                's' : true,
                'ms' : false
            },
            // 倒计时结束回调函数
            callback : function() {
            },

            //  获取时间之后的回调
            afterGetTime: function() {

            },

            // 容器
            container : null
        },
        init: function() {
            var _self = this;
            var serverTime = +_self.defaultSetting.serverTime;
            var start = function(ts) {
                $(_self.container).each(function() {
                    _self.afterGetTime($(this), ts);
                    ts && $(this).attr('data-startTime', ts);
                    var threadsId = _self._countDown($(this));
                    _self._pools.push(threadsId);
                });
            };
            _self.showTimeText();
            if (serverTime) {
                start(serverTime);
            } else {
                getServerTime(function(ts){ start(ts) });
            }
        },
        showTimeText: function(){
            this.timeText = (!this.isShowTimeText)?['','','','','']:this.timeText;
        },
        //创建文本标签
        createTextLabel : function( index ){
            var self = this;
            var str = self.timeText[index];
            if(self.textLabel!='' && str!=''){
                str = '<'+ self.textLabel +'>' + self.timeText[index] + '</'+ self.textLabel +'>';
            }
            return str;
        },
        _countDown : function(_this) {
            var _self = this;
            var curObj = _this;

            // 结束时间;
            var _tgTime = curObj.attr('data-endTime');
            // 开始
            var _startTime = curObj.attr('data-startTime');
            var _currentTime = _self.currentTime;
            var _targetTime = _self.targetTime;

            // 目标时间参数
            _targetTime = +(_tgTime ? _tgTime : _targetTime);
            // 给当前时间一个默认值
            _currentTime = +(_startTime ? _startTime : _currentTime);

            if (!_currentTime || !_targetTime) {
                // ("currentTime和targetTime是必填参数!");
                return false;
            }

            // 绑定显示时间
            function _bindTime(day, hour, minite, second, msec) {
                var temp = '';
                var _i = 0;
                var ar = [hour, minite, second, msec];
                //
                if (_self.type.d) {
                    temp += _addTagB(day, _self.type.d)+ _self.createTextLabel(0);
                } else {
                    hour = formatZero(hour * 1 + (day * 24));
                }
                //
                for(var itm in _self.type) {
                    if (_self.type[itm] && itm!='d') {
                        _i++;
                        temp += _addTagB(ar[_i-1], _self.type[itm])+_self.createTextLabel(_i);
                    }
                }
                curObj.html(temp);
            }

            // 给指定的时分秒添加样式
            function _addTagB(n, _class) {
                var _t = '';
                var labelStr = '';
                //
                if (_class && _class.length > 0) {
                    _t = ' class="' + _class + '"';
                }
                //长度
                if(n.length>1 && _self.isShowArea){
                    for(var k=0;k<n.length;k++){
                        labelStr += '<'+ _self.labelCtn + _t + '><i></i>' + n.slice(k,k+1) + '</'+ _self.labelCtn +'>';
                    }
                }else{
                    labelStr = '<'+ _self.labelCtn + _t + '>' + n + '</'+ _self.labelCtn +'>';
                }

                return labelStr;
            }

            var msec = 9;
            var _beginTime = now();
            var threadsId = TaskDaemon.loop(_countDown, 1000);

            // 倒计时函数
            function _countDown() {
                _currentTime = _currentTime + 1000;
                _beginTime = _beginTime + 1000;

                var ts = now();
                if (_beginTime != ts) {
                    _currentTime = _currentTime + (ts - _beginTime);
                    _beginTime = ts;
                }

                var dur = (_targetTime - _currentTime) / 1000;
                var hDur = floor((dur / 3600));

                if (dur > 0) {
                    var second = formatZero(dur % 60);
                    var minite = floor((dur / 60)) > 0 ? formatZero(floor((dur / 60)) % 60) : "00";
                    var hour = floor((dur / 3600)) > 0 ? formatZero(_self.type.d?hDur % 24:hDur) : "00";
                    var day = floor((dur / 86400)) > 0 ? formatZero(floor((dur / 86400)) ) : "00";
                    _bindTime(day, hour, minite, second, msec);
                    if (msec == 0) {
                        msec = 9;
                    } else {
                        msec--;
                    }
                } else {
                    TaskDaemon.cancel(threadsId);
                    _bindTime("00", "00", "00", "00", "0");
                    // 倒计时结束调用回调函数
                    _self.callback( _this );
                }
            }

            return threadsId;
        },

        destroy: function() {
            $.each(this._pools, function(i, id) {
                TaskDaemon.cancel(id);
            });
            this._pools.length = 0;
        }
    };

    module.exports = Countdown;
});
