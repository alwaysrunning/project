
define(function(require,exports,module){
    'use strict';
    var $ = require("jquery");
    var Item = require("./item");
    var utils = require("lib/core/1.0.0/utils/util");
    var cssUtil = require("lib/core/1.0.0/utils/css");

    var PanelItem = function(itemOpt){
        this.options = itemOpt;
        this.isTransition = false;
        this._renderContent();

    };
    utils.inherits(PanelItem,Item);

    PanelItem.prototype._renderContent = function(){
        this.$content = $('<div node-type="panel-item" class="rich-panel-box box-hide" data-type="'+this.options.type+'"></div>');
    };


    PanelItem.prototype.show = function(){
        var _self = this;
        this.options.tabInstance.emit("beforeActivate",this.options.tabInstance.getContent(),this.$content);
        this.isTransition = true;
        cssUtil.effect(this.$content, this.options.animate+"In", "normal", function(){
            _self.options.tabInstance.emit("actived",_self.options.tabInstance.getContent(),_self.$content);
            _self.isTransition = false;
        });
    };

    PanelItem.prototype.showFast = function(){
        var _self = this;
        setTimeout(function(){
            _self.options.tabInstance.emit("beforeActivate",_self.options.tabInstance.getContent(),_self.$content);
            _self.isTransition = true;
        },0);
        cssUtil.effect(this.$content, this.options.animate+"In", "i", function(){
            _self.options.tabInstance.emit("actived",_self.options.tabInstance.getContent(),_self.$content);
            _self.isTransition = false;
        });
    };

    PanelItem.prototype.hide = function(){
        var _self = this;
        setTimeout(function(){
            _self.options.tabInstance.emit("beforeDeactivate",_self.options.tabInstance.getContent(),_self.$content);
        },0);

        cssUtil.effect(this.$content, this.options.animate+"Out", "normal", function(){
            _self.options.tabInstance.emit("deactivate",_self.options.tabInstance.getContent(),_self.$content);
        });
    };
    module.exports = PanelItem;
});
