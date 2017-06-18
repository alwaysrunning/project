/**
 * @author	taotao
 * @desc    basic component
 * @daet    2016-03-09
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');
    var linkageTab = require('common/ui/linkage-tab/linkage-tab');

    if ($('.jProvince').length > 0 ) {
        $('.jProvince').click(function() {
            //地址一
            linkageTab({
                //调用多级地址的对象
                linkageBox : $('#jProvince'),
                // 下拉列表隐藏域的id
                selectValInput : 'f1',
                // 只存选中的value值
                selectValId : 'f2',
                // area 存文本和id的隐藏域的id
                areaId : 'areaInfo2',
                degree : 3,
                // 存最后一个值的隐藏域的id
                lastValueId : 'f4',
                lastChangeCallBack : function(){
                    $('html').removeClass('freez-page');
                    location.reload();
                },
                onShow : function(){
                    $('html').addClass('freez-page');
                },
                onHide : function(){
                    $('html').removeClass('freez-page');
                }
            });
        });
    }
});

