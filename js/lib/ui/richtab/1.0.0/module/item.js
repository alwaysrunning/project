
/**
 * item类的公用父类
 * */

define(function(require,exports,module){
    'use strict';
    var $ = require("jquery");
    var EventEmiter = require("lib/core/1.0.0/event/emitter");
    var utils = require("lib/core/1.0.0/utils/util");
    var Item = function(){
        this.$content = $("<div></div>");
    };
    utils.inherits(Item,EventEmiter);

    //获取容器的方法
    Item.prototype.getContent = function(){
        return this.$content;
    };

    module.exports =Item;

});