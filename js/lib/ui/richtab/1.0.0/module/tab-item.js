define(function (require, exports, module) {
    'use strict';
    var $ = require("jquery");
    var Item = require("./item");
    var utils = require("lib/core/1.0.0/utils/util");


    var TabItem = function (itemOpt) {
        this.options = itemOpt;
        this.$content = $('<div  node-type="tab-item" class="rich-tab-box ui-animated" data-type="'+this.options.type+'"></div>');
        this._addEvents();

    };
    utils.inherits(TabItem,Item);

    TabItem.prototype._addEvents = function () {
        var _self = this;
        //绑定事件
        this.$content.on("click",function(){
            _self.emit("tabAction",_self.$content,_self.options.type);
        });
    };

    module.exports = TabItem;
});
/**
 * ---------------------------向外抛出的事件----------------------------------------
 *
 *
 * */
