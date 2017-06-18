/**
 * Created by hema on 16/3/3.
 */

define(function(require,exports,module){
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Lazyload = require('lib/gallery/widget/lazyload/1.0.0/lazyload');
    var LazyStream = require('lib/plugins/lazystream/1.0.0/lazystream');
    var domain = require("module/group/domain");
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
        plUrl: '/fightgroups/fightlist',
        paramFormater: function(n) {
            var data = {};
            data.pageNo = n;
            data.isAjax = '1';
            return data;
        },
        page:2,
        errorText: '<div class="loading">网络错误，点击重试</div>',
        loadingClass: 'loading',
        loadingText: '<div class="loading"><img src="'+domain['js']+'/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
        load: function(el) {
            Lazyload.load($(el).find('.jImg'));
        }
    });
});
