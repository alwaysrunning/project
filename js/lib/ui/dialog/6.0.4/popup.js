/**
 * Abstract popup layer, inspired by artDialog.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function (require) {
    'use strict';

    var $ = require('jquery');
    var util = require('../../../core/1.0.0/utils/util');
    var EventEmiter = require('../../../core/1.0.0/event/emitter');

    var document = window.document;

    var _isIE6 = !('minWidth' in document.documentElement.style);
    var _isFixed = !_isIE6;

    function Popup () {
        this._popup = $('<div />')
            .css({
                display: 'none',
                position: 'absolute',
                outline: 0
            })
            .attr('tabindex', '-1')
            .html(this.innerHTML)
            .appendTo('body');

        this._backdrop = this._mask = $('<div />')
            .css({
                opacity: .7,
                background: '#000'
            });

        this.node = this._popup[0];
        this.backdrop = this._backdrop[0];

        this.destroyed = false;
    }

    util.inherits(Popup, EventEmiter);

    $.extend(Popup.prototype, {

        /**
         * 初始化完毕事件，在 show() 执行
         * @event show
         */

        /**
         * 关闭事件，在 close() 执行
         * @event close
         */

        /**
         * 销毁前事件，在 remove() 前执行
         * @event beforeremove
         */

        /**
         * 销毁事件，在 remove() 执行
         * @event remove
         */

        /**
         * 重置事件，在 reset() 执行
         * @event reset
         */

        /**
         * 焦点事件，在 foucs() 执行
         * @event focus
         */

        /**
         * 失焦事件，在 blur() 执行
         * @event blur
         */

        /** 浮层 DOM 素节点[*] */
        node: null,

        /** 遮罩 DOM 节点[*] */
        backdrop: null,

        /** 是否开启固定定位[*] */
        fixed: false,

        /** 判断对话框是否删除[*] */
        destroyed: true,

        /** 判断对话框是否显示 */
        open: false,

        /** close 返回值 */
        returnValue: '',

        /** 是否自动聚焦 */
        autofocus: true,

        /** 对齐方式[*] */
        align: 'bottom left',

        /** 内部的 HTML 字符串 */
        innerHTML: '',

        /** CSS 类名 */
        className: 'ui-popup',

        /**
         * 显示浮层
         * @param {HTMLElement, Event} 指定位置（可选）
         */
        show: function (anchor) {
            if (this.destroyed) {
                return this;
            }

            this.emit('beforeShow');

            var self = this;
            var popup = this._popup;
            var backdrop = this._backdrop;

            this._activeElement = this._getActive();

            this.open = true;
            this.follow = anchor || this.follow;

            // 初始化 show 方法
            if (!this._ready) {
                popup
                    .addClass(this.className)
                    .attr('role', this.modal ? 'alertdialog' : 'dialog')
                    .css('position', this.fixed ? 'fixed' : 'absolute');

                if (this.zIndex) {
                    popup.css('zIndex', this.zIndex);
                }

                if (!_isIE6) {
                    $(window).on('resize', $.proxy(this.reset, this));
                }

                // 模态浮层的遮罩
                if (this.modal) {
                    var backdropCss = {
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        userSelect: 'none',
                        zIndex: this.zIndex || Popup.zIndex
                    };

                    popup.addClass(this.className + '-modal');

                    if (!_isFixed) {
                        $.extend(backdropCss, {
                            position: 'absolute',
                            width: $(window).width() + 'px',
                            height: $(document).height() + 'px'
                        });
                    }

                    backdrop
                        .css(backdropCss)
                        .attr({tabindex: '0'})
                        .on('focus', $.proxy(this.focus, this));

                    // 锁定 tab 的焦点操作
                    this._mask = backdrop
                        .clone(true)
                        .attr('style', '')
                        .insertAfter(popup);

                    backdrop
                        .addClass(this.className + '-backdrop')
                        .insertBefore(popup);

                    this._ready = true;
                }

                if (!popup.html()) {
                    popup.html(this.innerHTML);
                }
            }

            popup
                .addClass(this.className + '-show')
                .show();

            backdrop.show();

            this.reset().focus();
            this.emit('show');

            return this;
        },

        /** 显示模态浮层。参数参见 show() */
        showModal: function () {
            this.modal = true;
            return this.show.apply(this, arguments);
        },

        /** 关闭浮层 */
        close: function (result) {
            if (!this.destroyed && this.open) {
                if (result !== undefined) {
                    this.returnValue = result;
                }
                this._popup.hide().removeClass(this.className + '-show');
                this._backdrop.hide();
                this.open = false;
                this.blur();
                this.emit('close');
            }
            return this;
        },

        /** 销毁浮层 */
        remove: function () {
            if (this.destroyed) {
                return this;
            }

            this.emit('beforeremove');

            if (Popup.current === this) {
                Popup.current = null;
            }

            // 从 DOM 中移除节点
            this._popup.remove();
            this._backdrop.remove();
            this._mask.remove();

            if (!_isIE6) {
                $(window).off('resize', this.reset);
            }

            this.emit('remove');

            for (var i in this) {
                delete this[i];
            }

            return this;
        },

        /** 重置位置 */
        reset: function () {
            var elem = this.follow;
            if (elem) {
                this._follow(elem);
            } else {
                this._center();
            }

            this.emit('reset');
            return this;
        },

        /** 让浮层获取焦点 */
        focus: function (e) {
            var node = this.node;
            var popup = this._popup;
            var current = Popup.current;
            var index = this.zIndex;

            if (current && current !== this) {
                current.blur(false);
            }

            // 检查焦点是否在浮层里面
            if (!$.contains(node, this._getActive())) {
                var autofocus = popup.find('[autofocus]')[0];
                if (!this._autofocus && autofocus) {
                    this._autofocus = true;
                } else {
                    autofocus = node;
                }
                this._focus(autofocus);
            }

            if (index === undefined) {
                index = this.zIndex = Popup.zIndex++;
                popup.css('zIndex', index);
                popup.addClass(this.className + '-focus');
            }

            Popup.current = this;

            this.emit('focus');

            return this;
        },

        /** 让浮层失去焦点。将焦点退还给之前的元素，照顾视力障碍用户 */
        blur: function () {
            var activeElement = this._activeElement;
            var isBlur = arguments[0];

            if (isBlur !== false) {
                this._focus(activeElement);
            }

            this._autofocus = false;
            this._popup.removeClass(this.className + '-focus');
            this.emit('blur');

            return this;
        },

        /** Event API methods */

        /**
         * 添加事件
         * @param {String} 事件类型
         * @param {Function} 监听函数
         * @method on
         */

        /**
         * 删除事件
         * @param {String} 事件类型
         * @param {Function} 监听函数
         * @method un
         */

        /**
         * 派发事件
         * @param {String} 事件类型
         * @param {Function} 监听函数
         * @method un
         */
        emit: function (type) {
            var args = Array.prototype.slice.call(arguments, 1);
            var optEventFn = this['on' + type];
            if (typeof optEventFn === 'function') {
                optEventFn.apply(this, args);
            }
            EventEmiter.prototype.emit.apply(this, arguments);
        },

        // 对元素安全聚焦
        _focus: function (elem) {
            // try ... cache 防止 iframe 跨域无权限报错, IE 不可见元素报错
            try {
                // ie11 bug: iframe 页面点击会跳到顶部
                if (this.autofocus && !/^iframe$/i.test(elem.nodeName)) {
                    elem.focus();
                }
            } catch (e) {}
        },

        // 获取当前焦点的元素
        _getActive: function () {
            try {// try: ie8~9, iframe #26
                var activeElement = document.activeElement;
                var contentDocument = activeElement.contentDocument;
                var elem = contentDocument && contentDocument.activeElement || activeElement;
                return elem;
            } catch (e) {}
        },

        // 居中浮层
        _center: function () {
            var popup = this._popup;
            var $window = $(window);
            var $document = $(document);
            var fixed = this.fixed;
            var dl = fixed ? 0 : $document.scrollLeft();
            var dt = fixed ? 0 : $document.scrollTop();
            var ww = $window.width();
            var wh = $window.height();
            var ow = popup.width();
            var oh = popup.height();
            var left = (ww - ow) / 2 + dl;
            var top = (wh - oh) * 382 / 1000 + dt;// 黄金比例
            var style = popup[0].style;

            style.left = Math.max(parseInt(left), dl) + 'px';
            style.top = Math.max(parseInt(top), dt) + 'px';
        },

        // 指定位置 @param {HTMLElement, Event} anchor
        _follow: function (anchor) {
            var $elem = anchor.parentNode && $(anchor);
            var popup = this._popup;

            if (this._followSkin) {
                popup.removeClass(this._followSkin);
            }

            // 隐藏元素不可用
            if ($elem) {
                var o = $elem.offset();
                if (o.left * o.top < 0) {
                    return this._center();
                }
            }

            var self = this;
            var fixed = this.fixed;

            var $window = $(window);
            var $document = $(document);
            var winWidth = $window.width();
            var winHeight = $window.height();
            var docLeft =  $document.scrollLeft();
            var docTop = $document.scrollTop();

            var popupWidth = popup.width();
            var popupHeight = popup.height();
            var width = $elem ? $elem.outerWidth() : 0;
            var height = $elem ? $elem.outerHeight() : 0;
            var offset = this._offset(anchor);
            var x = offset.left;
            var y = offset.top;
            var left =  fixed ? x - docLeft : x;
            var top = fixed ? y - docTop : y;

            var minLeft = fixed ? 0 : docLeft;
            var minTop = fixed ? 0 : docTop;
            var maxLeft = minLeft + winWidth - popupWidth;
            var maxTop = minTop + winHeight - popupHeight;

            var css = {};
            var align = this.align.split(' ');
            var className = this.className + '-';
            var reverse = {top: 'bottom', bottom: 'top', left: 'right', right: 'left'};
            var name = {top: 'top', bottom: 'top', left: 'left', right: 'left'};

            var temp = [{
                top: top - popupHeight,
                bottom: top + height,
                left: left - popupWidth,
                right: left + width
            }, {
                top: top,
                bottom: top - popupHeight + height,
                left: left,
                right: left - popupWidth + width
            }];

            var center = {
                left: left + width / 2 - popupWidth / 2,
                top: top + height / 2 - popupHeight / 2
            };

            var range = {
                left: [minLeft, maxLeft],
                top: [minTop, maxTop]
            };

            // 超出可视区域重新适应位置
            $.each(align, function (i, val) {

                // 超出右或下边界：使用左或者上边对齐
                if (temp[i][val] > range[name[val]][1]) {
                    val = align[i] = reverse[val];
                }

                // 超出左或右边界：使用右或者下边对齐
                if (temp[i][val] < range[name[val]][0]) {
                    align[i] = reverse[val];
                }

            });

            // 一个参数的情况
            if (!align[1]) {
                name[align[1]] = name[align[0]] === 'left' ? 'top' : 'left';
                temp[1][align[1]] = center[name[align[1]]];
            }

            // 添加follow的css, 为了给css使用
            className += align.join('-') + ' '+ this.className+ '-follow';

            self._followSkin = className;

            if ($elem) {
                popup.addClass(className);
            }

            css[name[align[0]]] = parseInt(temp[0][align[0]]);
            css[name[align[1]]] = parseInt(temp[1][align[1]]);

            popup.css(css);
        },

        // 获取元素相对于页面的位置（包括iframe内的元素）
        // 暂时不支持两层以上的 iframe 套嵌
        _offset: function (anchor) {
            var isNode = anchor.parentNode;
            var offset = isNode ? $(anchor).offset() : {
                left: anchor.pageX,
                top: anchor.pageY
            };

            anchor = isNode ? anchor : anchor.target;
            var ownerDocument = anchor.ownerDocument;
            var defaultView = ownerDocument.defaultView || ownerDocument.parentWindow;

            if (defaultView == window) {// IE <= 8 只能使用两个等于号
                return offset;
            }

            // {Element: Ifarme}
            var frameElement = defaultView.frameElement;
            var $ownerDocument = $(ownerDocument);
            var docLeft = $ownerDocument.scrollLeft();
            var docTop = $ownerDocument.scrollTop();
            var frameOffset = $(frameElement).offset();
            var frameLeft = frameOffset.left;
            var frameTop = frameOffset.top;

            return {
                left: offset.left + frameLeft - docLeft,
                top: offset.top + frameTop - docTop
            };
        }

    });

    /** 当前叠加高度 */
    Popup.zIndex = 1024;

    /** 顶层浮层的实例 */
    Popup.current = null;

    return Popup;
});
