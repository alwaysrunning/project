/*
 *  到货通知
 *  @author	taotao
 *
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var cookie = require('common/kit/io/cookie');
    //  到货通知
    module.exports = function(productId, btn) {
        var gProductId = productId;
        var jBtn = btn || '#jCartAdd';


        $('body').on('click', jBtn, function() {
            if(!cookie("_nick")){
                Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                    window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
                });
                return;
            }
            gProductId = $(this).attr('data-id')||$(this).parent().attr('data-id')||gProductId;

            var html =   "<div class='arrival-notice-wrap jArrivalNotice'><div class='item-mask jItemMask'></div>"+
                "<div class='arrival-notice '>"+
                "<a href='javascript:;' class='close-arrival-notice jCloseArrivalNotice'><i class='iconglobal'>&#xe60f;</i></a>"+
                "<div class='title'>到货通知</div>"+
                "<div class='explain'><p>该商品暂时缺货，请留下您的邮箱地址或手机号码，当我们有现货供应时，我们会发邮件通知您<p></div>"+
                "<div class='dialog-input'><i class='iconglobal'>&#xe63f;</i><input type='text' id='jEmailTong' placeholder='邮箱地址'/></div>"+
                "<div class='dialog-input'><i class='iconglobal'>&#xe61d;</i><input type='text' id='jMobileTong' placeholder='手机号码'/></div>"+
                "<div class='dialog-button'><button class='jArrivalHide'>取消</button><button class='ben2 jArrivalNot' id='jDaoHuoHide'>确定</button></div>"+
                "</div></div>";
            $('body').append(html);

        });

        //绑定删除dom事件
        $('body').on('click', '.jArrivalHide,.jCloseArrivalNotice,.jItemMask', function() {
            $('.jItemMask').remove();
            $('.jArrivalNotice').remove();
        });

        //添加到货通知
        $('body').on('click', '.jArrivalNot', function() {
            var mobile = $('#jMobileTong').val(),
                email  = $('#jEmailTong').val(),
                e      = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

            if(!(e.test(email))){
                Dialog.tips('请输入有效邮箱');
            }
            else {
                // item.subscribe(mobile, email);
                var data = {
                    'callback': 'callback',
                    'product_id': gProductId,
                    'mobile': mobile,
                    'email': email
                };
                io.jsonp('http://m.yunhou.com/item/ajaxSubscribe', data, function(){
                    Dialog.tips('提交成功');
                    $('.jItemMask').remove();
                    $('.jArrivalNotice').remove();

                },function(e) {
                    if(e.error == -100){
                        Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                            window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
                        });
                    } else {
                        Dialog.tips(e.msg);
                    }
                });
            }
        });
    };
});
