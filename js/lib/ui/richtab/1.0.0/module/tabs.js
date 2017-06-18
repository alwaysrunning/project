define(function (require, exports, module) {
    'use strict';
    var $ = require("jquery");
    var utils = require("lib/core/1.0.0/utils/util");
    var RichPanles = require("./panels");
    var TabItem = require("./tab-item");


    var RichTabs = function () {
        this.options = {};
        //建立tab类型与实例的映射关系；
        this.tabsStorage = {};
        //初始化面板实例
        this._initPanles();
        //标记当前的显示
        this.currentType = null;
    };

    RichTabs.prototype._initPanles = function () {
        var _self = this;
        _self.panelsInstance = new RichPanles();
    };

    RichTabs.prototype.getInstance = function (type) {
        return this.tabsStorage[type];
    };

    RichTabs.prototype._add = function (itemOpt) {
        //判断有没有注册过
        if (this.tabsStorage[itemOpt.type]) {
            throw new Error("已经注册过的类型 ");
        }
        //没有注册过
        itemOpt.tabInstance = this.tabsStorage[itemOpt.type] = new TabItem(itemOpt);
        //注册面板
        this.panelsInstance._add(itemOpt);
        this._initStatus(itemOpt);
        //抛出load 事件

        setTimeout(function () {
            itemOpt.tabInstance.emit("load", itemOpt.tabInstance.getContent(), itemOpt.panelInstance.getContent());
        }, 0);

    };

    RichTabs.prototype._initStatus = function (itemOpt) {
        //处理首次加载时的显示项
        var showFirst = itemOpt.firstShow;
        if (showFirst) {
            itemOpt.panelInstance.showFast();
            this.currentType = itemOpt.type;
        }
    };

    RichTabs.prototype.getCurrentType = function () {
        return this.currentType;
    };


    RichTabs.prototype.change = function (type, isFast) {
        if (!this.currentType || this.currentType != type) {
            this.panelsInstance.panelStorage[type][isFast ? "showFast" : "show"]();
            this.currentType && this.panelsInstance.panelStorage[this.currentType].hide();
            this.currentType = type;
        }
    };
    module.exports = RichTabs;
});
