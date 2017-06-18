define(function (require, exports, module) {
    'use strict';
    var $ = require("jquery");

    var PanelItem = require("./panel-item");

    var RichPanels = function (opt) {
        this.options = opt;
        this.panelStorage = {};
    };

    RichPanels.prototype._add = function (itemOpt) {
        var _self = this;
        var panelItemInstance = new PanelItem(itemOpt);
        _self.panelStorage[itemOpt.type] = panelItemInstance;
        itemOpt.panelInstance = panelItemInstance;
    };

    module.exports = RichPanels;

});
