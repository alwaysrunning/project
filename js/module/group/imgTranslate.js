define(function (require, exports, module) {

    var $ = require('jquery');
    var domain = require("module/group/domain");
    var defaultUrl = domain['js']+'/s.gif';	//默认图片地址
    var defaultOpt = {
        targetContent: "",
        resourceContent: ""
    };

    var translator = {

        translat : function(opt){
            var self = this;
            var opt = $.extend({},defaultOpt,opt);
            var eGoodsIntro = $('<div>'+opt.resourceContent.val()+'</div>');
            var eImg = eGoodsIntro.find('img');
            var w = opt.targetContent.width();
            eImg.each(function() {
                var $this = $(this), src = $this.attr('src'), size = self.getSizeByUri(src);
                $this.attr('data-url', src);
                $this.removeClass('jImg');
                $this.attr('src', defaultUrl);
                // 防止编辑没有定义宽度，导致数据一次性加载
                if (size) {
                    $this.css({
                        width : w,
                        height : size.h * w / size.w
                    });
                }
                $this.addClass('jImg img-error');
            });
            opt.targetContent.html(eGoodsIntro);

        },

        getSizeByUri: function (picUri) {
            var size = {};
            var ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)\!([0-9]+)$/;
            var items = ptn.exec(picUri);
            if (items) {
                size.w = parseInt(items[1]);
                size.h = parseInt(items[2]);
                size.size = parseInt(items[4]);
            } else {
                ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)$/;
                items = ptn.exec(picUri);
                if (items) {
                    size.w = parseInt(items[1]);
                    size.h = parseInt(items[2]);
                    size.size = size.w;
                } else {
                    size = null;
                }
            }
            return size;
        }
    };

    module.exports = translator;


});