/**
 * @author	taotao
 * @desc    basic component
 * @daet    2016-03-09
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');
    var cookie = require('common/kit/io/cookie');
    var io = require('lib/core/1.0.0/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var share = require('common/widget/share');


    var shareMox = $('#jItemShareBox');
    var shareBtnsWrap = shareMox.find('.sharebuttonbox');
    var shareUrl = false;
    share.init({
        selector: '.sharebuttonbox'
    });
    $('#jBtnShare').on('click', function() {

        if (shareUrl === false) {
            if (cookie('_nick') === null) { // 未登录
                shareUrl = document.location.href;
                shareBtnsWrap.attr('data-url', shareUrl);
                shareMox.show();
            } else { // 已登录
                io.jsonp('http://api.mall.yunhou.com/Union/getShareUrl', {
                    product_id: gProductId
                }, function(data){
                    if (data.url) {
                        shareUrl = data.url;
                    } else {
                        shareUrl = document.location.href;
                    }
                    shareBtnsWrap.attr('data-url', shareUrl);
                    shareMox.show();
                }, function(e){
                    Dialog.tips(e);
                    shareUrl = document.location.href;
                    shareBtnsWrap.attr('data-url', shareUrl);
                    shareMox.show();
                }, this);
            }
        } else {
            shareMox.show();
        }
    });

    //关闭模态框
    $('.jCloseModalBox').on('click', function() {
        $(this).closest('.modal-box-wrap').hide();
    });
});
