/**
 * 侧边栏工具条
 * @author   TW    2015-10-20
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require("jquery");
    var EventEmiter = require("lib/core/1.0.0/event/emitter");
    var utils = require("lib/core/1.0.0/utils/util");
    var build = require("lib/core/1.0.0/dom/build");

    //需要引入的子模块
    var RichTabs = require("./module/tabs");

    var RichTab = function () {
        this._init();
        this._addEvents();
    };
    utils.inherits(RichTab, EventEmiter);


    RichTab.prototype._init = function () {
        var _self = this;
        //初始化tabs模块
        _self.tabsInstance = new RichTabs();
        setTimeout(function(){
            _self._resetPosition();
        },0);
    };

    /**
     * 重新定位元素位置
     * */
    RichTab.prototype._resetPosition = function () {
        this.emit("resizeTab");
    };

    /**
     * 根据type值来获取tab面板和panel面板容器
     * */
    RichTab.prototype.getContentByType = function (type) {
        var _self = this;
        return {
            tab : _self.tabsInstance.tabsStorage[type].getContent(),
            panel : _self.tabsInstance.panelsInstance.panelStorage[type].getContent()
        };
    };

    /**
     * 根据type值来获取tab面板实例(不是dom容器，是js实例)
     * */
    RichTab.prototype.getTabInstanceByType = function (type) {
        return this.tabsInstance.tabsStorage[type];
    };

    /**
     * 获取注册的数量
     * */
    RichTab.prototype.getTotalCount = function(){
        return Object.keys(this.tabsInstance.tabsStorage).length;
    };

   /**
    * 根据type值来获取panel面板实例(不是dom容器，是js实例)
    * */
    RichTab.prototype.getPanelInstanceByType = function (type) {
        return this.tabsInstance.panelsInstance.panelStorage[type];
    };

    /**
     * 获取panel容器是否正在执行动画
     * */
    RichTab.prototype.isTransition = function(){
        var currentType = this.getCurrentType();
        if(!currentType || !this.getPanelInstanceByType(currentType).isTransition){
            return false;
        }else{
            return true;
        }
    };


    RichTab.prototype._addEvents = function () {
        var _self = this;
        //窗口的resize事件
        $(window).resize(function () {
            _self._resetPosition();
        });
    };


    //add方法中的opt默认参数
    var defaultOpt = {
        type: "",              //一个tab和一个panel共用一个type值来区分，type(String)
        firstShow: false,     //初始化加载的时候是否显示
        animate :"scale"  //默认scale
    };

    /**
     * 注册方法，向插件中注册一个业务代码，包括注册tab按钮和panel面板
     * @param   opt  配置参数的总和，包括了tabs的和panel 的 ，在子模块中会进一步分发
     * */
    RichTab.prototype.add = function (itemOpt) {
        var _self = this;
        itemOpt.manager = this;
        var opt = $.extend(true, {}, defaultOpt, itemOpt);
        _self.tabsInstance._add(opt);
        _self._resetPosition();
        return _self.tabsInstance.getInstance(itemOpt.type);
    };

    RichTab.prototype.getCurrentType = function(){
        return this.tabsInstance.getCurrentType();
    };


    RichTab.prototype.change = function(type,isFast){
        this.tabsInstance.change(type,isFast);
    };

    module.exports = RichTab;

});

/**
 * Panel
 * --------------------------实例方法------------------------------------
 * getContentByType
 * getTabInstanceByType
 * getTotalCount
 * getPanelInstanceByType
 * isTransition
 * --------------------------抛出的事件----------------------------------
 *  resizeTab 在整个插件初始化完成时或者窗口大小改变时会抛出  function($content){}   提供整个插件容器
 */

/**
 * Tab
 * ---------------------------向外抛出的事件----------------------------------------
 *   load 每次注册完成一个tab，会抛出一个加载完成的事件  function($tab,$panel){}
 *
 * ---------------------------每次点击$tab容器时，会抛出事件--------------------
 *   tabAction                       function($tab,type){}
 *
 * ---------------------------每次执行切换panel时，会抛出的事件-----------------
 *   beforeActivate              function($tab,$panel){}            下同
 *   actived
 *   beforeDeactivate
 *   deactivate
 */
