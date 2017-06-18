/**
 * Created by hema on 16/3/3.
 */

define(function(require,exports,module){
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Lazyload = require('lib/gallery/widget/lazyload/1.0.0/lazyload');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');
    var hasClick = false;
    var addCart = require("module/add-to-cart/addcart");

    /**
     * 回到顶部
     * */
    require('common/ui/nav/back2top')();

    /**
     * 图片懒加载
     * */
    var _lazyLoader = new Lazyload('.jImg', {
        effect: 'fadeIn',
        dataAttribute: 'url',
        load : function(self){
            var _self = $(self);
            if(_self.hasClass('img-error')){
                _self.removeClass('img-error');
            }
        }
    });


    var lazyMore = new LazyStream('.jPage', {
        plUrl: '/fightgroups/mygroups/',
        paramFormater: function(n) {
            var data = {};
            data.pageNo = n;
            data.isAjax = '1';
            data.groupsType = $('input[name=group-type]').val();
            return data;
        },
        page:2,
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
        load: function(el) {
            Lazyload.load($(el).find('.jImg'));
        }
    });

    //立即支付
    $(".open-group").on("click",".jPay",function(){
        if(!hasClick){
            hasClick =true;
            var $this = $(this);
            var onlyApp = $this.attr("data-onlyApp");
            if(onlyApp==1){
                window.location.href = "http://m.yunhou.com/fightgroups/guide";
                hasClick =false;
            }else{
                addCart.buyNow($this.attr("data-productId"),1,$this);
                setTimeout(function(){
                    hasClick =false;
                },5000);
            }
        }
    });
});
