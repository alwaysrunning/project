/**
 * checkbox
 */
define(function(require, exports, module) {
    'use strict';
    
    var chkAll = function($chkAll, $chk) {
		// 全选和取消全选
		//$chk = $chk.filter(':enabled');
		$chkAll.click(function(e) {
			$chk.prop('checked', $(this).prop('checked'));
			$chkAll.prop('checked', $(this).prop('checked'));
		});
		// 对全选chk的状态判断
		$chk.click(function(e) {
			$chkAll.prop('checked', $chk.length == $chk.filter(':checked').length);
		});
	}

    module.exports = {
        checkAll: chkAll
    }
        
});
