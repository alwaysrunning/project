/**
 * A simple pagination.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */

(function( root, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define( ['jquery'], factory );
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(jQuery);
    }
}(this, function( $ ) {
    'use strict';

    var PAGINATION_DATA_KEY = 'pagination';

    var Pagination = function(element, options) {
        var $el = $(element);

        if ($el.data(PAGINATION_DATA_KEY)) {
            throw 'Please destroy the old pagination instance first.';
        }

        this.pager = $el;
        this.init(options);
    };

    Pagination.prototype = {

        constructor: Pagination,

        init: function(options) {
            var o = $.extend({
                totalCount: 1,
                pageSize: 1,
                pageCount: 0,
                displayedPages: 3,
                edges: 2,
                currentPage: 1, // start with 1
                hrefTextPrefix: '#p-',
                hrefTextSuffix: '',
                prevText: '上一页',
                nextText: '下一页',
                ellipseText: '&hellip;',
                className: '',
                labelMap: [],
                displayInfo: false, // Show the extra paging info with quick pagination, defaults to false.
                selectOnClick: true,
                async: false, // (Optional) a function that returns a deferred's promise object for async paging.
                onPage: function(pageNum, e) {
                    // Callback triggered when a page is clicked
                    // Page number is given as an optional parameter
                },
                onInit: function() {
                    // Callback triggered immediately after initialization
                }
            }, options || {});

            var self = this, pager = self.pager;

            // batch fix optional callbacks scope.
            $.each(o, function(i, n) {
                var f = o[n];
                if (typeof f === 'function') {
                    o[n] = function() { return f.apply(self, arguments); };
                }
            });

            o.pageCount = o.pageCount ? o.pageCount : Math.ceil(o.totalCount / o.pageSize) ? Math.ceil(o.totalCount / o.pageSize) : 1;
            o.currentPage = o.currentPage - 1;
            o.halfDisplayed = o.displayedPages / 2;

            pager.addClass([o.className, 'ui-pager'].join(' ')).data(PAGINATION_DATA_KEY, o);

            self._draw();
            self._initEvents();

            o.onInit();
        },

        _initEvents: function() {
            var self = this, pager = self.pager, o = self.data();

            var readPageFromInput = function() {
                var input = pager.find('.page-no'), v, pageNum;
                if (input.length) {
                    v = input.val();
                    pageNum = parseInt(v, 10);
                    if (!v || isNaN(pageNum)) {
                        input.val(o.currentPage + 1);
                        return false;
                    }
                    return pageNum;
                }
                return false;
            };

            var selectInputPage = function(e) {
                if (o.disabled) {
                    return;
                }
                var pageNum = readPageFromInput();
                if (pageNum > 0 && pageNum <= o.pageCount && pageNum - 1 !== o.currentPage) {
                    self._selectPage(pageNum - 1, e);
                }
            };

            // event delegates

            pager.delegate('.page-link', 'click', function(e) {
                e.preventDefault();
                var index = +$(this).data('page-index');
                if (!isNaN(index)) {
                    self._selectPage(index, e);
                }
            });

            if (o.displayInfo) {
                pager.delegate('.page-no', 'click', function(e) {
                    this.select();
                })
                .delegate('.page-no', 'keydown', function(e) {
                    if (e.keyCode === 13) { // Enter
                        selectInputPage();
                    }
                })
                .delegate('.page-info .ui-button', 'click', function(e) {
                    e.preventDefault();
                    selectInputPage();
                });
            }

            // destroy pagination
            pager.one('pagination.destroy', function() {
                pager
                    .undelegate('.page-link', 'click')
                    .undelegate('.page-no', 'click keydown')
                    .undelegate('.page-info .ui-button', 'click')
                    .removeData(PAGINATION_DATA_KEY);

                o = null;
                pager = null;
                self.pager = null;
            });
        },

        /**
         * Provide priviliged data getter/setter.
         *
         * @method data
         */
        data: function(k, v) {
            var d = this.pager.data(PAGINATION_DATA_KEY);
            if (k) {
                return v === undefined ? d[k] : (d[k] = v);
            } else {
                return d;
            }
        },

        /**
         * Common api for retrieve pagination meta data by a specific key.
         * eg. currentPage, pageCount, totalCount etc,.
         *
         * @param {String} key The meta data key name.
         */
        get: function(key) {
            var v = !key ? null : this.data(key);
            if (key && key === 'currentPage') { // fix `currentPage` start with 0
                return v + 1;
            }
            return v;
        },

        getCurrentPage: function() {
            return this.data().currentPage + 1;
        },

        selectPage: function(page) {
            return this._selectPage(page - 1);
        },

        prevPage: function() {
            var o = this.data();
            if (o.currentPage > 0) {
                this._selectPage(o.currentPage - 1);
            }
            return this;
        },

        nextPage: function() {
            var o = this.data();
            if (o.currentPage < o.pageCount - 1) {
                this._selectPage(o.currentPage + 1);
            }
            return this;
        },

        destroy: function() {
            this.pager.empty().trigger('pagination.destroy');
        },

        drawPage: function(page) {
            var o = this.data();
            o.currentPage = page - 1;
            this._draw();
            return this;
        },

        redraw: function() {
            this._draw();
        },

        disable: function() {
            var o = this.data();
            o.disabled = true;
            this._draw();
            return this;
        },

        enable: function() {
            var o = this.data();
            o.disabled = false;
            this._draw();
            return this;
        },

        setTotalCount: function(totalCount, silent) {
            var o = this.data();
            o.totalCount = totalCount;
            o.pageCount = this._getPages(o);
            if (!silent) {
                this._draw();
            }
        },

        setPageSize: function(pageSize) {
            var o = this.data();
            o.pageSize = pageSize;
            o.pageCount = this._getPages(o);
            this._selectPage(0);
            return this;
        },

        _wraper: function(create) {
            var pager = this.pager, ul = pager[0].tagName.toUpperCase() === 'UL' ? pager : pager.find('ul');
            if (!ul.length && create) {
                return $('<ul></ul>').appendTo(pager);
            }
            return ul;
        },

        _draw: function() {
            var o = this.data(),
                interval = this._getInterval(o),
                i,
                pager = this.pager;

            // cleanup first
            pager.empty();

            var $panel = this._wraper(true);

            if (o.disabled) {
                $panel.addClass('disabled');
            }

            // Generate Prev link
            if (o.prevText) {
                this._appendItem(o.currentPage - 1, {text: o.prevText, classes: 'prev'});
            }

            // Generate start edges
            if (interval.start > 0 && o.edges > 0) {
                var end = Math.min(o.edges, interval.start);
                for (i = 0; i < end; i++) {
                    this._appendItem(i);
                }
                if (o.edges < interval.start && (interval.start - o.edges != 1)) {
                    $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
                } else if (interval.start - o.edges == 1) {
                    this._appendItem(o.edges);
                }
            }

            // Generate interval links
            for (i = interval.start; i < interval.end; i++) {
                this._appendItem(i);
            }

            // Generate end edges
            if (interval.end < o.pageCount && o.edges > 0) {
                if (o.pageCount - o.edges > interval.end && (o.pageCount - o.edges - interval.end != 1)) {
                    $panel.append('<li class="disabled"><span class="ellipse">' + o.ellipseText + '</span></li>');
                } else if (o.pageCount - o.edges - interval.end == 1) {
                    this._appendItem(interval.end++);
                }
                var begin = Math.max(o.pageCount - o.edges, interval.end);
                for (i = begin; i < o.pageCount; i++) {
                    this._appendItem(i);
                }
            }

            // Generate Next link
            if (o.nextText) {
                this._appendItem(o.currentPage + 1, {text: o.nextText, classes: 'next'});
            }

            // Pager extra info
            if (o.displayInfo) {
                this._renderPI();
            }
        },

        _getPages: function(o) {
            var pageCount = Math.ceil(o.totalCount / o.pageSize);
            return pageCount || 1;
        },

        _getInterval: function(o) {
            return {
                start: Math.ceil(o.currentPage > o.halfDisplayed ? Math.max(Math.min(o.currentPage - o.halfDisplayed, (o.pageCount - o.displayedPages)), 0) : 0),
                end: Math.ceil(o.currentPage > o.halfDisplayed ? Math.min(o.currentPage + o.halfDisplayed, o.pageCount) : Math.min(o.displayedPages, o.pageCount))
            };
        },

        _appendItem: function(pageIndex, opts) {
            var self = this,
                pager = self.pager,
                options,
                $link,
                o = self.data(),
                $linkWrapper = $('<li></li>'),
                $ul = self._wraper();

            pageIndex = pageIndex < 0 ? 0 : (pageIndex < o.pageCount ? pageIndex : o.pageCount - 1);

            options = {
                text: pageIndex + 1,
                classes: ''
            };

            if (o.labelMap.length && o.labelMap[pageIndex]) {
                options.text = o.labelMap[pageIndex];
            }

            options = $.extend(options, opts || {});

            if (pageIndex === o.currentPage || o.disabled) {
                if (o.disabled) {
                    $linkWrapper.addClass('disabled');
                } else {
                    $linkWrapper.addClass('active');
                }
                $link = $('<span class="current">' + (options.text) + '</span>');
            } else {
                $link = $('<a href="' + o.hrefTextPrefix + (pageIndex + 1) + o.hrefTextSuffix + '" data-page-index="' + pageIndex + '" class="page-link">' + (options.text) + '</a>');
            }

            if (options.classes) {
                $link.addClass(options.classes);
            }

            $linkWrapper.append($link);
            $ul.append($linkWrapper);
        },

        _selectPage: function(pageIndex, e) {
            var self = this, o = self.data();

            var selectPage = function(pageIndex, e) {
                o.currentPage = pageIndex;
                if (o.selectOnClick) {
                    self._draw();
                }
                o.onPage(pageIndex + 1, e);
            };

            if (typeof o.async === 'function') {
                var deferred = o.async({pageSize: o.pageSize, currentPage: pageIndex + 1});
                if (deferred && deferred.then) {
                    if (o.lock) {
                        return self;
                    }
                    o.lock = 1;
                    return deferred.then(function(data) {
                        var totalCount = (data || 0).totalCount;
                        if (totalCount !== undefined) {
                            self.setTotalCount(totalCount, true);
                        }
                        selectPage(pageIndex, e);
                        return self;
                    }).always(function() {
                        o.lock = 0;
                        o = undefined;
                        selectPage = undefined;
                    });
                } else {
                    throw 'Error: Please make sure that the `async` returns is a Deferred\'s promise';
                }
            }

            selectPage(pageIndex);
            return self;
        },

        /**
         * Render page extra info with quick pagination fields.
         * @private
         */
        _renderPI: function() {
            var self = this,
                pager = self.pager,
                options,
                $link,
                o = self.data(),
                pageNum = o.currentPage + 1,
                pageCount = o.pageCount,
                sInfo,
                $infoWrapper = $('<li class="page-info"></li>'),
                $ul = self._wraper();

            pageNum = pageNum < 1 ? 1 : Math.min(pageNum, pageCount);

            sInfo = '共' + o.pageCount + '页，跳转到第<input type="text" class="page-no" autocomplete="off" value="' + pageNum + '">页<a class="ui-button" href="javascript:;">跳转</a>';

            if (o.disabled) {
                $infoWrapper.addClass('disabled');
            }

            $infoWrapper.html(sInfo);
            $ul.append($infoWrapper);
        }

    };

    return Pagination;
}));

// vim: set fdm=marker ts=4 sw=4 sts=4 tw=85 et :
