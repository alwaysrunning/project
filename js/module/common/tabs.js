/**
 * Tabs
 * 页签基础组件
 * @date 2015-10-10
 * @author HouJian
 * -------------------------------------------
 * 主要接口
 * -------------------------------------------
 * 事件：
 *  switch              -- 页签切换事件
 *  load                -- 页签加载内容事件
 *  init                -- 页签组件默认初始化事件
 * -------------------------------------------
 * 方法：
 *  getTabList          -- 获取tab dom列表
 *  getTabByIndex       -- 获取tab
 *  getPanelByIndex     -- 获取页签容器
 * -------------------------------------------
 * 创建实例的配置项：
 *  tabSelector:        '.tab-item', //页签卡的选择器
 *  panelSelector:      '.tab-panel',//页签容器的选择器
 *  initialLoad:        true,//定义是否初始化加载页签容器的内容（渲染）
 *  triggerEvent:       'click',//页签卡的触发事件
 *  actionType:         'switch',//页签卡的事件绑定属性
 *  activeClass:        'active',//页签卡的激活class
 *  activeIndex:        null,//设置初始化时，激活页签卡索引
 *  multiple:           false //设置是否使用多个页签容器进行切换（单容器时，加载内容会重现渲染容器内容）
 */
define(function(require) {

    'use strict';

    var $ = require('jquery'),
        util = require('lib/core/1.0.0/utils/util'),
        EventEmiter = require('lib/core/1.0.0/event/emitter'),
        Delegator = require('lib/core/1.0.0/dom/delegator'),
        build = require('lib/core/1.0.0/dom/build'),
        // constant
        EVENTS = {
            switch: 'switch',
            load: 'load',
            init: 'init'
        },
        // configuration
        _default = {
            tabSelector: '.tab-item',
            panelSelector: '.tab-panel',
            initialLoad: true,
            triggerEvent: 'click',
            actionType: 'switch',
            activeClass: 'active',
            activeIndex: null,
            multiple: false
        },

        // template
        tabPanelTpl = '<div class=\"tab-panel\"></div>';

    // constructor
    function Tabs(element, opts) {
        this.initProps(element, opts);
        this.setup();
    }

    // 继承
    util.inherits(Tabs, EventEmiter, {
        initProps: function(element, opts) {
            this.setting = $.extend({}, _default, opts || {});
            this.$element = $(element);
            this.setNodes(this.$element[0]);
        },
        initPanel: function() {
            var tab,
                panel = this.$element.find(this.setting.panelSelector),
                panels = this.panels || (this.panels = {}),
                activeIndex = this.setting.activeIndex;

            if (panel.length > 0) {

                if (activeIndex === null) {
                    activeIndex = 0;
                }
                tab = $( this.getTabByIndex(activeIndex) );
                // 共用容器时，使用0下标
                panels[this.setting.multiple ? activeIndex : 0] = panel;
                this.setActiveIndex(activeIndex);
                this.emit(EVENTS.init, activeIndex, tab, panel);
            }
        },
        setup: function() {
            this.event();
            this.bindEvent();
            this.initPanel();
        },
        event: function() {
            var self = this,
                setting = this.setting,
                delegator = Delegator(this.$element);

            delegator.on(setting.triggerEvent, setting.actionType, function(e) {
                self.onClickTab(e);
            });

            this.delegator = delegator;
        },
        bindEvent: function() {},
        /**
         * 解析DOM node属性
         * @param {DOM object} element
         */
        setNodes: function(element) {
            this.nodes = build.parse(element );
            this.tabList = $(this.setting.tabSelector, this.nodes.tab);
        },
        setActiveTabClass: function(index) {
            var tab = $( this.getTabByIndex(index) ),
                activeClass = this.setting.activeClass;

            if ( !tab.hasClass(activeClass) ) {
                tab.addClass(activeClass);
            }
        },
        refresh: function() {},
        loadTab: function(index) {
            var tabEl, $el,
                tabList = this.getTabList(),
                currentTab = this.currentTab;

            index = +index || 0;
            tabEl = tabList[index];

            if (!tabEl) { throw 'The tab unavialbe with index: ' + index; }

            $el = $(tabEl);

            if (currentTab != null && index !== currentTab) {
                $(tabList[currentTab]).removeClass(this.setting.activeClass);
            }

            if (currentTab === index) { return; }

            this.togglePanel(index, currentTab, $el);
            currentTab = index;
            this.setState(index);
            this.currentTab = currentTab;
        },
        togglePanel: function(index, curIndex, tab) {
            var panel;

            tab.addClass(this.setting.activeClass);

            if (!this.setting.initialLoad && !this._initialLoaded) {
                this._initialLoaded = true;
                return;
            }

            if (this.setting.multiple) {

                panel = this.panels[index];

                if (typeof curIndex !== 'undefined' && curIndex !== index) {
                    this.panels[curIndex].hide();
                }

                if (typeof panel === 'undefined') {
                    panel = this.addPanel(index);
                    this.loadContent(index, tab);
                }

                panel.show();
            } else {
                this.loadContent(index, tab);
            }

        },
        addPanel: function(index) {
            var panel = $(tabPanelTpl);
            if (typeof index === 'undefined') {
                index = this.panels.length - 1;
            }
            $(this.nodes.content).append(panel);
            this.panels[index] = panel;
            return panel;
        },
        /**
         * [loadContent description]
         * @param  {[type]} index [description]
         * @param  {[type]} $el   [description]
         * @return {[type]}       [description]
         */
        loadContent: function(index, $el) {
            var panel = this.getPanelByIndex(index);
            this.emit( EVENTS.load, index, $el, panel);
        },
        setActiveIndex: function(index) {
            index = index + '';
            location.hash = index;
            this.renderActiveIndex();
        },
        getActiveIndex: function() {
            return this.getState() || 0;
        },
        setState: function(state) {
            this.currentState = state;
        },
        getState: function() {
            var hash = location.hash;
            while (hash.charAt(0) === '#') { hash = hash.substring(1); }
            return hash;
        },
        getTabList: function() {
            return this.tabList;
        },
        setTabContent: function(el) {
            return $(this.nodes.content).html(el).children();
        },
        getTabByIndex: function(index) {
            return this.getTabList()[index];
        },
        getPanelByIndex: function(index) {
            var panels = this.panels;
            if (panels) {
                return panels[index] || panels[0];
            }
        },
        /**
         * 渲染active index
         */
        renderActiveIndex: function() {
            var hash = this.getState();
            // 当前索引不等于hash记录，
            // hash存在或者不为空窜，
            // 加载tab
            if (this.currentState === hash) { return; }
            if (typeof hash !== 'undefined' || hash !== '') {
                this.currentState = hash;
                this.loadTab(hash);
            }
        },
        onClickTab: function(e) {
            var tab = e.currentTarget;
            this.emit(EVENTS.switch, e, tab);
            if ( e.isDefaultPrevented() ) {
                this.setActiveIndex( this.getTabList().index(tab) );
            }
        }
    });

    return Tabs;
});
