/**
 * @module common/kit/extra/ui
 */
define(function(require, exports, module) {
    var trim = $.trim;

    /**
     * Placeholder fixes
     */
    exports.placeholder = function($input, $label) {
        $input.each(function(i, v) {
            // 不为空就隐藏label;
            var _index = $input.index($(this));
            var isEmpty = trim($(this).val()).length === 0;
            !isEmpty && $label.eq(_index).hide();
        }).on('input propertychange', function() {
            // 渐隐渐出效果;
            var _index = $input.index($(this));
            var isEmpty = trim($(this).val()).length === 0;
            $label.eq(_index)[isEmpty ? 'fadeIn' : 'fadeOut']();
        });
    };

});
