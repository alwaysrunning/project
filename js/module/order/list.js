/**
 * @description 列表
 * @author licuiting 250602615@qq.com
 * @date 2015-02-12 20:20:06
 * @version $Id$
 */
define(function(require, exports, module) {
    'use strict';
    //import public lib
    var com = require('module/order/common');
    var list = {
        defaultSetting: {
            selector: ''
        },
        init: function() {
            $.extend(this, this.defaultSetting);
            this.event();
        },
        event: function() {
            // 其他优惠
            com.o.on('click', '.jOtherOffer', function() {
                    var $parent = $(this);
                    var $i = $(this).find('.arrow');
                    var $ctn = $parent.find('.jOtherOfferContent');
                    var isShow = $ctn.is(':visible');
                    $i.html(isShow ? '&#xe641;' : '&#xe642;');
                    $ctn[isShow ? 'hide' : 'show']();
                })
                //点击当前行跳转页面
                .on('click', '.jTableTr', function() {
                    var $a = $(this).find('.pro-img');
                    var href = $a.attr('href');
                    if (href && $.trim(href).length != 0) {
                        location.href = href;
                    }
                });
        }
    };
	list.init();
});
