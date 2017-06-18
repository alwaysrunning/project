define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');

    /**
     * 滚动插件 v.0.0.1
     *
     * ```js
     *var scrollLayer = new scrollLayer('#jScrollBottom', {
     *    direction: 'y', 
     *    offset: 0, 
     *    fromBottom: 200, 
     *    fromTop: 100, 
     *    obstructionSize: 0, 
     *    onAfterShow: function($ele, next) {
     *        $ele.addClass('hover');
     *        next();
     *    }, //{function} 显示回调
     *    onBeforeHide: function($ele, next) {
     *        setTimeout(function() {
     *            next();
     *        }, 100);
     *        $ele.removeClass('hover');
     *
     *   },
     *   goTop: {
     *       ele: '.jGoTop',
     *       callback: function() {
     *          alert('我到顶了');
     *       }
     *   }
     *});
     *```
     * @param {string|jqueryElement} ele 需要支持选择器
     * @param {[json]} opts 配置参数，详情见default注释
     * @author jiangchaoyi update 2015.07.03
     * 
     */
    function ScrollLayer(ele, opts) {
        var defaults = {
            direction: 'x', //方向 {string} 'x'|'y'
            offset: 0, //{number} number 位移，如果direction：x offset 的相对位置是document的中轴线，如果direction：y 相对位置是position：fixed时距离bottom的位置
            fromBottom: 0, //{number} 悬浮导航超过底部XX位置就需要定位悬浮
            fromTop: 0, //{number} 悬浮导航超过顶部多少就需要显示，例如80，表示当前window.scrollTop = 80就立马显示出来
            obstructionSize: 0, //{number} 障碍物宽度/高度
            onAfterShow: null, //{function} 显示回调 function($ele,next){next()} 如果需要自定义回调函数，必须执行next()方法
            onBeforeHide: null, //{function} 隐藏回调 调用方法同上
            goTop: {
                ele: null, //{string} 返回顶部的元素选择器
                callback: null //{function} 返回顶部回调
            }
        };

        if (ele === undefined) {
            throw new Error('param ele is required');
        }

        var $ele = $(ele);
        if ($ele.length === 0) {
            throw new Error('param ele is not find');
        }


        var obstructionSize = opts.obstructionSize,
            opts = $.extend(true, defaults, opts),
            $window = $(window),
            $doc = $(document),
            docHeight = $doc.height(),
            winHeight = $window.height(),
            winWidth = $window.width(),
            eleOuterHeight = $ele.outerHeight(),
            eleOuterWidth = $ele.outerWidth(),
            scrollTop = 0,
            isShow = true,
            offset = opts.offset,
            eleBottom = 0,
            tEleBottom = 0,
            temp,
            eleLeft = 0;

        $ele.css({
            position: 'fixed'
        });

        //初始化
        function init() {
            resize();
            reset(true);
            regEvent();
        }

        function resize() {
            winHeight = $window.height();
            winWidth = $window.width();
            isShow = true;
            switch (opts.direction) {
                case 'y':
                    eleBottom = offset + opts.obstructionSize;
                    eleLeft = (winWidth - eleOuterWidth) / 2;
                    if (eleOuterHeight + offset + opts.obstructionSize > winHeight || eleOuterWidth > winWidth) {
                        isShow = false;
                        hide();
                    }
                    break;
                case 'x':
                    eleBottom = (winHeight - eleOuterHeight) / 2;
                    eleLeft = winWidth / 2 + offset;
                    if (offset < 0) {
                        eleLeft = eleLeft - eleOuterWidth;
                    }
                    if (eleOuterHeight > winHeight || (winWidth / 2 + opts.offset + eleOuterWidth + opts.obstructionSize) >= winWidth) {
                        isShow = false;
                        hide();
                    }
                    break;
            }
        }

        function debounce(func, wait, immediate, context) {
            var timeout;
            return function() {
                var ctx = context || this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(ctx, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(ctx, args);
            };
        };

        //注册事件
        function regEvent() {
            $window.resize(function(event) {
                resize();
                reset();
            });
            $window.scroll(debounce(function() {
                reset();
            }));
            //返回顶部
            if (opts.goTop && opts.goTop.ele) {
                $ele.on('click', opts.goTop.ele, function() {
                    $window.scrollTop(0);
                    opts.goTop.callback && opts.goTop.callback($ele);
                })
            }
        }


        //重新定位
        function reset(isFirst) {
            scrollTop = $window.scrollTop();
            //网页内容动态添加
            docHeight = $doc.height();

            temp = scrollTop + winHeight - (docHeight - opts.fromBottom) - eleBottom;
            //超过底部需要随底滚动
            if (temp > 0) {
                tEleBottom = scrollTop + winHeight - (docHeight - opts.fromBottom);
            } else {
                tEleBottom = eleBottom;
            }

            //如果第一次家长不需要动画缓冲
            if (isFirst) {
                $ele.css({
                    left: eleLeft,
                    bottom: tEleBottom
                });
            } else {
                $ele.stop().animate({
                    left: eleLeft,
                    bottom: tEleBottom
                });
            }

            //浮动导航offsetTop超过指定fromTop就自动显示
            if (scrollTop >= opts.fromTop && isShow) {
                show();
            } else {
                hide();
            }
        }

        //隐藏
        function hide() {
            if ($ele.is(':hidden')) {
                return;
            }
            if (opts.onBeforeHide) {
                opts.onBeforeHide($ele, function() {
                    $ele.hide();
                });
            } else {
                $ele.hide();
            }
        }

        //显示
        function show() {
            if (!$ele.is(':hidden')) {
                return;
            }
            if (opts.onAfterShow) {
                opts.onAfterShow($ele, function() {
                    $ele.show();
                });
            } else {
                $ele.show();
            }
        }

        init();

        return this;
    }

    module.exports = ScrollLayer;
    // return ScrollLayer;
})