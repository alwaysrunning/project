/**
 * Menu for catalog
 *
 * @author	taotao
 * @module menu
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Box = require('common/kit/box/box');
    var Dialog = require('common/ui/dialog/dialog');

    var noop = function() {
    };

    /**
     *  Menu for catalogue
     *
     * @param	{string} arg1 An ID for catalogue
     * @param	{string} arg2 ajax url
     * @param	{Object} arg3 for ajax settings
     *
     */
    var Menu = function(parentId, url, opts) {
        var self = this;

        self.opt = $.extend({}, self.opt, opts);

        if ($(self.opt.menuHandle).length === 0) {
            $('body').append(self.opt.menuDOM);

            self.menuHandle   = $(self.opt.menuHandle);
            self.subHandle    = $(self.opt.subHandle);
            self.listHandle   = $(self.opt.listHandle);
            self.backHandle   = $(self.opt.backHandle);
            self.htmlClass    = self.opt.htmlClass;
            self.animateClass = self.menuHandle.attr(self.opt.animateData);

            delete self.opt.htmlClass;
            delete self.opt.menuDOM;
            delete self.opt.subHandle;
            delete self.opt.menuHandle;
            delete self.opt.backHandle;
            delete self.opt.animateData;
            delete self.opt.listHandle;

            //  绑定弹出层的一级菜单（二级分类）的点击事件
            self.listHandle.on('click', 'li', function() {
                var id = $(this).attr('data-id');

                $(this).siblings().removeClass('current');
                $(this).addClass('current');
                self.subHandle.html('');
                self.getNextLevelData('', id);
            });
            
            $('#_search-form').on('submit', function() {
                if ($('#jSearchKeyText').val().replace(/\s/g,"") == '') {
                    return false;
                }
            });
        }
    };


    Menu.prototype = {

        constructor : Menu,

        //  for cache the data
        cache : {},

        //  base handle
        subHandle  : '',
        menuHandle : '',
        listHandle : '',
        htmlClass  : '',
        backHandle : '',


        //  for cached animateClass
        animateClass: '',

        //  default setting
        //  can use for ajax
        opt: {
            menuHandle  : '#jMenu',
            listHandle  : '#jMenuP',
            subHandle   : '#jMenuC',
            backHandle  : '#jClose',
            url         : '/Category/get_category_data',
            animateData : 'data-animate',
            htmlClass   : '_menu-html',
            menuDOM     : [
                            '<div class="wrap-menu" id="jMenu" data-animate="wrap-menu-animate">',
                            '<header class="ui-header">',
                            '<a href="javascript: history.back(-1);" class="icon iconglobal ui-back">&#xe61c;</a>',
                            '<form id="_search-form" action="' + location.origin + location.pathname + '">',
                            '<div class="ui-header-searcher">',
                            '<i class="ui-search-icon iconglobal">&#xe604;</i>',
                            '<input class="_input-cnt" name="keyword" id="jSearchKeyText" type="text" placeholder="搜索店内商品" autocomplete="off">',
                            '<a href="javascript:;" class="ui-clear-input iconglobal" id="jClearInput">&#xe61b;</a>',
                            '</div>',
                            '<button type="submit" class="ui-submit-search">搜索</button>',
                            '</form>',
                            '<a href="javascript:;" class="icon iconfont ui-handle" id="jCategory">&#xe60a;</a>',
                            '</header>',
                            '<div class="mod-menu" id="jMenuP"><ul></ul></div><div class="mod-content" id="jMenuC"><ul></ul></div></div>'
                        ].join(''),
            success     : noop,
            error       : noop
        },

        /**
         * show or hide the menu
         * @param {String} default means show the menu
         */
        menuShow: function(t) {
             var self = this;
             //  绑定关闭事件
             window.onhashchange = function(){
                if(location.hash==""){
                    self.menuShowdeal('hide');
                }
            };

             var type = t || 'show';
             if (type === 'show') {
                    self.menuShowdeal();
                    location.hash = "sort";
             }
             else{
                 location.hash = "";
             }
        },
        menuShowdeal : function(t){
            var self = this;

            var type = t || 'show';
            if (type === 'show') {
                if (!self.menuHandle.hasClass(self.animateClass)) {
                    self.menuHandle.addClass(self.animateClass);
                    $('html').addClass(self.htmlClass);
                }
            } else {
                self.menuHandle.removeClass(self.animateClass);
                $('html').removeClass(self.htmlClass);
                self.listHandle.html('');
                self.subHandle.html('');
            }
        },


        /**
         * fill the menu DOM
         * @param	{json} json data, from ajax or cached data
         * @param	{number} 1 or 2
         *
         */
        fillMenu: function(data, _level) {
            var self = this;

            var level = _level || 1;
            var str = '';
            var t = (new Date()).getTime();

            if (level === 1) {
                str = '<ul>';
                for (var i = 0, len = data.length; i < len; i = i + 1) {
                    if (i===0) {
                        str += '<li class="current" data-id="' + data[i].catId + '">' + data[i].catName + '</li>';

                    } else {
                        str += '<li data-id="' + data[i].catId + '">' + data[i].catName + '</li>';

                    }
                }
                str += '</ul>';
                self.menuHandle.find(self.listHandle).html(str);
                self.menuShow();

            } else if (level === 2) {
                str = '<ul>';
                
                for (var j = 0, l = data.length; j < l; j = j + 1) {
                    str += '<li><a href="' + data[j].linkUrl + '&t=' + t + '">' + data[j].catName + '</a></li>';
                }
                str += '</ul>';
                self.menuHandle.find(self.subHandle).html(str);
                self.menuShow();
            }
        },

        /**
         *  get data by ajax
         *  @param	{string} parentId
         *  @param	{string} childId
         */
        getNextLevelData: function(parentId, childId) {
            var self = this;

            var level = 2;
            var id = childId;
            var prefix = 'c';
            if (arguments.length === 1) {
                level = 1;
                prefix = 'p';
                id = parentId;
            }

            //  opt of box.loading
            if (!self.opt.data) {
                self.opt.data = {
                    id: id
                };
            } else {
                self.opt.data.id = id;
            }
            self.opt.success = function(res) {
                self.fillMenu(res.data, level);
                if (level === 2) {
                    self.cache[prefix + id] = res.data;
                } else {
                    self.cache[prefix + id] = res.data;
                    self.getNextLevelData(id, res.data[0].catId);
                }
            };
            self.opt.error = function(res) {
                Dialog.tips(res.msg);
            };

            if (!!self.cache[prefix + id] && self.cache[prefix + id].length > 0) {
                self.fillMenu(self.cache[prefix + id], level);
                if (level === 1) {
                    self.getNextLevelData(id, self.cache[prefix + id][0].catId);
                }
            } else {
                Box.loading(self.opt);
            }
        },


        // getDataById: function(id) {
        //
        // }
    };

    module.exports = function(ctxArray, url, opts) {
        var opt = opts || {};
        opt.url = url || '';

        var catalogue = ctxArray || 'jClassify';
        var menuHdl = new Menu('', url, opt);

        $(catalogue).on('click', function() {
            var id = $(this).attr('data-id');
            menuHdl.getNextLevelData(id);
        });
    };
});