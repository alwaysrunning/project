/**
 * @file tariff.js
 * @synopsis  税费
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2016-03-13
 */
define(function(require, exports, module) {
    var com = require('module/cart/common');
    var eCart = com.o;
    var tariff = {
        init: function() {
            this._setArrowPos('.jTariffPrice', '.jTariffArrow');
        },
        _setArrowPos: function(boxSelector, arrowSelector) {
            $.each($(boxSelector), function(i, v) {
                var $this = $(this);
                var $parent = $this.closest('.jWarehouse');
                var $arrow = $parent.find(arrowSelector);
                $arrow.show().css({
                    'margin-left': ($this.width() / 2) + 'px',
                    'left': $this.offset().left + 'px'
                });
            })
        },
        _events: function() {
            com.o.on('click', '.jTariffBox', function() {
                var ar = ['&#xe60c;', '&#xe60b;'];
                var $parent = $(this).closest('.jItem');
                var $arrow = $(this).find('.jArrowBox');
                var isDown = $(this).hasClass('arrow-down');
                var $ctn = $parent.find('.jTariffCtn');
                $arrow.html(ar[isDown ? '0' : '1']);
                $ctn[isDown ? 'hide' : 'show']();
                $(this)[isDown ? 'removeClass' : 'addClass']('arrow-down');
            });
            com.o.on('click', '.jTariffCtnBox', function() {
                $(this).closest('.jItem').find('.jTariffBox').click();
            });
        }
    }
    module.exports = tariff;
});
