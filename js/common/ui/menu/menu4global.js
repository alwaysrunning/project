/**
 * Menu for catalog
 *
 * @author	taotao
 * @module menu
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Pagelet = require('lib/core/1.0.0/io/pagelet');

    //  default setting
    //  can use for ajax
    var defaultOpts = {
        selector    : '',
        menuHandle  : '#jMenuCata',
        listHandle  : '#jMenuP',
        subHandle   : '#jMenuC',
        animateData : 'data-animate',
        htmlClass   : '_global_cata',
        widgetName  : 'globalCategory'
    };




    /**
     *  Menu for catalogue
     *
     * @param	{Object} for ajax settings
     *
     */
    var Menu = function(opts) {
        var self = this;

        var hdl = defaultOpts.menuHandle;
        if (!!opts && !!opts.menuHandle) {
            hdl = opts.menuHandle;
        }

        if ($(hdl).length === 0) {
            self.getDomSync($(hdl), self.init, self, opts);

        } else {
            self.init(self, opts);
        }
    };


    Menu.prototype = {

        constructor : Menu,

        idx: 0,

        init: function(hdl, opts) {
            var self = hdl;

            self.opt = $.extend({}, defaultOpts, opts);

            self.opt.animateClass = $(self.opt.menuHandle).attr(self.opt.animateData);

            self.cataEvent();
        },

        /**
         * get dom sync
         *
         */

        getDomSync: function(hdl, success, ctx, opt) {
            //  也许是个坑，这个ID要是不对了，记得去找队长
            io.jsonp('http://api.mall.yunhou.com/Widgets/lazy/6092/1', {}, function(data) {
                var str = '<div class="wrap-menu-cata" id="jMenuCata" data-animate="wrap-menu-animate">' + data + '</div>';
                $('body').append(str);
                success && success(ctx, opt);
            });
        },

        /**
         * show or hide the menu
         * @param {String} default means show the menu
         */
        menuShow: function(t) {
            var self = this;

            var type = t || 'show';
            if (type === 'show') {
                self.load(self.idx);
            }
            self.menuShowdeal(t);
        },
        menuShowdeal: function(t) {
            var self = this;
            var type = t || 'show';
            var widgets = $('html').attr('data-widgets') || '';

            if (type === 'show') {
                if (!$(self.opt.menuHandle).hasClass(self.opt.animateClass)) {
                    $(self.opt.menuHandle).addClass(self.opt.animateClass);
                    $('html').addClass(self.opt.htmlClass);
                    $('html').attr('data-widgets', (widgets + ' ' + self.opt.widgetName).replace(/^\ /, ''));
                }

            } else {

                $(self.opt.menuHandle).removeClass(self.opt.animateClass);
                $('html').removeClass(self.opt.htmlClass);

                var re = new RegExp(self.opt.widgetName + '$');
                $('html').attr('data-widgets', widgets.replace(re, ''));
            }
        },
        toggle: function() {
            var self = this;

            var widgets = $('html').attr('data-widgets') || '';

            //  the widget has shown, hide it.
            if (widgets.indexOf(self.opt.widgetName) > -1) {
                window.history.go(-1);
                self.menuShow('hide');

            //  the widget hasn't shown, show it.
            } else {
                if (window.location.hash !== '#' + self.opt.widgetName) {
                    setTimeout(function() {
                        window.location.hash = self.opt.widgetName;
                    }, 400);
                }
                self.menuShow('show');
            }
        },

        cataEvent: function() {
            var self = this;
            $(self.opt.menuHandle).find(self.opt.listHandle).on('click', 'li', function() {
                var idx = $(this).index();
                $(this).siblings().removeClass('current');
                $(this).addClass('current');

                self.load(idx);
            });

            $(window).on('hashchange.' + self.opt.widgetName, function() {
                if (window.location.hash === '#' + self.opt.widgetName) {
                    self.menuShow('show');

                } else {
                    self.menuShow('hide');
                }
            });

            $(self.opt.subHandle).on('click', 'a', function(e) {
                e.preventDefault();
                history.back();
                var url = $(this).attr('href');
                setTimeout(function() {
                    window.location.href = url;
                }, 0);
            });
        },
        load: function(idx) {
            var self = this;

            self.idx = idx;

            var item = $(self.opt.menuHandle).find(self.opt.subHandle).find('.mod-content-item');
            var subEle = item.eq(idx);

            item.hide();
            subEle.show();

            var url          = subEle.attr('data-pl-url'),
                cache        = !!subEle.attr('data-pl-cache'),
                rev          = subEle.attr('data-pl-rev'),
                loadingClass = 'pl-loading';

            Pagelet.view(subEle, {
                url: url,
                rev: rev,
                cache: cache,
                loadingClass: loadingClass
            });
        }
    };

    module.exports = function(opts) {
        return new Menu(opts);
    };
});
