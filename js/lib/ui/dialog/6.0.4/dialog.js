/**
 * artDialog
 * Date: 2014-11-09
 * https://github.com/aui/artDialog
 * (c) 2009-2014 TangBin, http://www.planeArt.cn
 *
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://www.gnu.org/licenses/lgpl-2.1.html
 */
define(function (require) {
    'use strict';

    var $ = require('jquery');
    var Popup = require('./popup');
    var util = require('../../../core/1.0.0/utils/util');

    var defaults = require('./config');
    var css = defaults.cssUri;

    // css loader: RequireJS & SeaJS
    if (css) {
        var fn = require[require.toUrl ? 'toUrl' : 'resolve'];
        if (fn) {
            css = fn(css);
            css = '<link rel="stylesheet" href="' + css + '" />';
            var lastLink = $('link, base').last();
            if (lastLink.length) {
                lastLink.before(css);
            } else {
                $('head').append(css);
            }
        }
    }

    var document = window.document;
    var _count = 0;
    var _expando = +new Date();
    var _isIE6 = !('minWidth' in document.documentElement.style);
    var _isMobile = 'createTouch' in document && !('onmousemove' in document)
        || /(iPhone|iPad|iPod)/i.test(navigator.userAgent);
    var _isFixed = !_isIE6 && !_isMobile;

    var artDialog = function (options, ok, cancel) {
        var originalOptions = options = options || {};

        if (typeof options === 'string' || options.nodeType === 1) {
            options = {content: options, fixed: !_isMobile};
        }

        options = $.extend(true, {}, artDialog.defaults, options);
        options.original = originalOptions;

        var id = options.id = options.id || _expando + _count;
        var api = artDialog.get(id);

        // 如果存在同名的对话框对象，则直接返回
        if (api) {
            return api.focus();
        }

        // 目前主流移动设备对fixed支持不好，禁用此特性
        if (!_isFixed) {
            options.fixed = false;
        }

        // 快捷关闭支持：点击对话框外快速关闭对话框
        if (options.quickClose) {
            options.modal = true;
            options.backdropOpacity = 0;
        }

        // 按钮组
        if (!$.isArray(options.button)) {
            options.button = [];
        }

        // 取消按钮
        if (cancel !== undefined) {
            options.cancel = cancel;
        }
        if (options.cancel) {
            options.button.push({
                id: 'cancel',
                value: options.cancelValue,
                callback: options.cancel,
                display: options.cancelDisplay
            });
        }

        // 确定按钮
        if (ok !== undefined) {
            options.ok = ok;
        }
        if (options.ok) {
            options.button.push({
                id: 'ok',
                value: options.okValue,
                callback: options.ok,
                autofocus: true
            });
        }

        return artDialog.list[id] = new artDialog.create(options);
    };

    util.inherits(artDialog, Popup);

    artDialog.create = function (options, /* @internal */ initialize) {
        var self = this;

        if (initialize === undefined) {
            self.destroyed = false;
            self.once('beforeShow', function() {
                artDialog.create.call(self, options, 1);
            });
            return self;
        }

        Popup.call(self, options);

        var $popup = $(self.node).html(options.innerHTML);
        var $backdrop = $(self.backdrop);

        self.options = options;
        self._popup = $popup;
        self._nodeList = {};

        self.$('header').hide();
        self.$('footer').hide();

        self.emit('initOption');

        $.each(options, function (name, value) {
            if (typeof self[name] === 'function') {
                self[name](value);
            } else {
                self[name] = value;
            }
        });

        // 更新 zIndex 全局配置
        if (options.zIndex) {
            Popup.zIndex = options.zIndex;
        }

        // 设置 ARIA 信息
        $popup.attr({
            'aria-labelledby': self.$('title')
                .attr('id', 'title:' + self.id).attr('id'),
            'aria-describedby': self.$('content')
                .attr('id', 'content:' + self.id).attr('id')
        });

        // 关闭按钮
        self.$('close')
            .css('display', self.cancel === false ? 'none' : '')
            .attr('title', self.cancelValue)
            .on('click', function (e) {
                self._action('cancel');
                e.preventDefault();
            });

        // 添加视觉参数
        self.$('dialog').addClass(self.skin);
        self.$('body').css('padding', self.padding);

        // 点击任意空白处关闭对话框
        if (options.quickClose) {
            $backdrop.on('onmousedown' in document ? 'mousedown' : 'click', function () {
                self._action('cancel');
                return false; // 阻止抢夺焦点
            });
        }

        // 遮罩设置
        self.on('show', function () {
            $backdrop.css({
                opacity: 0,
                background: options.backdropBackground
            }).animate(
                {opacity: options.backdropOpacity}
            , 150);
        });

        // ESC 快捷键关闭对话框
        var handleESC = function (e) {
            var target = e.target;
            var nodeName = target.nodeName;
            var rinput = /^input|textarea$/i;
            var isTop = Popup.current === self;
            var keyCode = e.keyCode;

            // 避免输入状态中 ESC 误操作关闭
            if (!isTop || rinput.test(nodeName) && target.type !== 'button') {
                return;
            }

            if (keyCode === 27) {
                self._action('cancel');
            }
        };

        $(document).on('keydown', handleESC);
        self.on('remove', function () {
            $(document).off('keydown', handleESC);
            delete artDialog.list[self.id];
        });

        _count++;
        artDialog.oncreate(self);
    };

    var prototype = artDialog.prototype;
    artDialog.create.prototype = prototype;

    $.extend(prototype, {
        /**
         * 设置内容
         * @param {String, HTMLElement} 内容
         */
        content: function (html) {
            var $content = this.$('content');

            // HTMLElement
            if (html && html.nodeType) {
                if ($.contains(document, html)) {
                    this.on('beforeremove', function () {
                        $('body').append(html.hide());
                    });
                }
                html = $(html);
                $content.empty().append(html.show());
            // String
            } else {
                $content.html(html);
            }

            return this.reset();
        },

        /**
         * 设置标题
         * @param {String} 标题内容
         */
        title: function (text) {
            this.$('title').text(text);
            this.$('header')[text ? 'show' : 'hide']();
            return this;
        },

        /** 设置宽度 */
        width: function (value) {
            this.$('content').css('width', value);
            return this.reset();
        },

        /** 设置高度 */
        height: function (value) {
            this.$('content').css('height', value);
            return this.reset();
        },

        /**
         * 设置按钮组
         * @param {Array, String}
         * Options: value, callback, autofocus, disabled
         */
        button: function (args) {
            args = args || [];
            var self = this, html = '', number = 0;

            this._actions = {};
            if (typeof args === 'string') {
                html = args;
                number ++;
            } else {
                $.each(args, function (i, val) {
                    var id = val.id = val.id || val.value, style = '';
                    self._actions[id] = val.callback;

                    if (val.display === false) {
                        style = ' style="display:none"';
                    } else {
                        number++;
                    }

                    html +=
                        '<button type="button" i-id="' + id + '"'
                        + style
                        + (val.disabled ? ' disabled' : '')
                        + (val.autofocus ? ' autofocus class="ui-dialog-autofocus"' : '')
                        + '>'
                        +   val.value
                        + '</button>';

                    self.$('button').on('click', '[i-id="' + id + '"]', function (e) {
                        var $this = $(this);
                        if (!$this.attr('disabled')) {// IE BUG
                            self._action(id);
                        }
                        e.preventDefault();
                    });
                });
            }

            this.$('button').html(html);
            this.$('footer')[number ? 'show' : 'hide']();

            return this;
        },

        statusbar: function (html) {
            this.$('statusbar').html(html)[html ? 'show' : 'hide']();
            return this;
        },

        // Internal node finder
        $: function (type) {
            var nodeList = this._nodeList;
            return nodeList[type] || (nodeList[type] = this._popup.find('[i="' + type + '"]'));
        },

        // 触发按钮回调函数
        _action: function (id) {
            var fn = this._actions[id];
            return typeof fn !== 'function' || fn.call(this) !== false ?
                this.close().remove() : this;
        }

    });

    artDialog.oncreate = $.noop;

    /** 获取最顶层的对话框API */
    artDialog.getCurrent = function () {
        return Popup.current;
    };

    /**
     * 根据 ID 获取某对话框 API
     * @param {String} 对话框 ID
     * @return {Object} 对话框 API (实例)
     */
    artDialog.get = function (id) {
        return id === undefined ? artDialog.list : artDialog.list[id];
    };

    artDialog.list = {};

    /**
     * 默认配置
     */
    artDialog.defaults = defaults;

    return artDialog;
});
