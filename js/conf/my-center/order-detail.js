/**
 * 个人中心 - 订单详情
 * add: Liangyouyu
 * date: 2015/1/29
 */
define(function(require, exports, module) {
    'use strict';

    var modSlt = '.mod-order';
    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');
    var Lazyload = require('common/widget/lazyload');
    
    // 图片懒加载--start
    var imageLazyLoader = null;
    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url'
        });
        return imageLazyLoader;
    }

    resetImageLoader();
    // 图片懒加载--end

    var lazyMore = function(){
        new Lazyload('.jScroll .jPage', {
            type: 'html',
            placeholder: '<div class="loading"><img src="http://s1.bbgstatic.com/gshop/images/public/load.gif" class="load-gif" />正在加载，请稍后...</div>',
            load: function(el) {
                var page = $(el).attr('data-page');
                if(!$(el).hasClass('load')) {
                    io.jsonp(window.location.href,{"p":page}, function(res) {
                        var html = unescape(res.data);
                        if(html) {
                            $(el).html(html).addClass('load');
                            $(el).after('<div class="jPage" data-page="'+(Number(page)+1)+'"></div>');
                            resetImageLoader();
                            lazyMore();

                        } else {
                            $(el).remove();
                        }
                    }, function(data){
                        $(el).find('.loading').html('网络错误，点击重试').attr('id','jNetError');
                    });
                }
            }
        });
    }
    lazyMore();

    //列表加载网络出错，重试
    $('body').on('click','#jNetError',function(){
        lazyMore();
    })




    var dlgTmpl = [
    '<div class="cancel-cnt">',
    '<div class="ui-item">',
    '<label class="ui-label">取消原因:</label>',
    '<div class="inner-ctrls">',
    '<select id="jCancelReason">',
    '<option value="">请选择取消原因</option>',
    '<option value="不想买了">不想买了</option>',
    '<option value="商品价格高">商品价格高</option>',
    '<option value="支付不成功">支付不成功</option>',
    '<option value="送货时间太长">送货时间太长</option>',
    '<option value="商品缺货">商品缺货</option>',
    '<option value="地址/发票填写有误">地址/发票填写有误</option>',
    '<option value="需添加或删除商品">需添加或删除商品</option>',
    '<option value="需修改优惠券信息">需修改优惠券信息</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="ui-item">',
    '<label class="ui-label">其它原因:</label>',
    '<div class="inner-ctrls">',
    '<textarea id="jOtherReason"></textarea>',
    '<p class="hint">请填写取消原因(4-250字符)</p>',
    '</div>',
    '</div>',
    '</div>'
    ].join('');

        // 图片懒加载--start
    var imageLazyLoader = null;
    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url'
        });
        return imageLazyLoader;
    }

    resetImageLoader();
    // 图片懒加载--end

    var clickHandles = {
        morePros: function() {
            var $this = $(this);
            var $dom = $this.prev().toggle();
            $this.toggleClass("shown");
            resetImageLoader();
        },
        logisDt: function () {
            var self = $(this);
            self.next().toggle();
            self.find('b').toggleClass('shown');
        },
        cancelBtn:function(){
            var orderId = $(this).parent().attr('order-id');
            require('common/base/dialog');

            $('document.body').dialog({
                time: 0,
                lock: true,
                cnt: dlgTmpl,
                btn: [
                    {
                        value: '取消',
                        isHide: true,
                        callBack: function () {}
                    },
                    {
                        value: '确定',
                        isHide: true,
                        callBack: function () {
                            var sV = $('#jCancelReason').val(),
                                sOV = $('#jOtherReason').val();
                            
                            if (!sV && !sOV) {
                                if (!sV) {
                                    Dialog.tips('请选择取消原因');
                                }else {
                                    Dialog.tips('清填写取消原因');
                                }
                            }
                            
                            io.jsonp($('#cancel-url').val(), {
                                orderId: orderId,
                                reason: sV || sOV
                            }, function (e) {
                                window.location.reload();
                            },
                            function(e) {
                                Dialog.tips(e.msg);
                            }, this);
                         }
                    }
                ]
            });

        },
        deleteBtn:function(e){
            var orderId = $(this).parent().attr('order-id');
            $('document.body').dialog({
                time: 0,
                lock: true,
                cnt: "确定要删除此订单吗？",
                btn: [
                    {
                        value: '取消',
                        isHide: true,
                        callBack: function () {}
                    },
                    {
                        value: '确定',
                        isHide: true,
                        callBack: function () {
                            io.jsonp(
                                $('#delete-url').val(),
                                {
                                    orderId: orderId
                                },
                                function() {
                                    window.location.href = $('#after-del-url').val();
                                },
                                function (e) {
                                    Dialog.tips(e.msg);
                                }
                            );
                        }
                    }
                ]
            });
        },
        payBtn:function(){
        },
        receiptBtn:function(){
            var orderId = $(this).parent().attr('order-id');
            $('document.body').dialog({
                time: 0,
                lock: true,
                cnt: "是否确认收货？",
                btn: [
                    {
                        value: '取消',
                        isHide: true,
                        callBack: function () {}
                    },
                    {
                        value: '确定',
                        isHide: true,
                        callBack: function () {
                            io.jsonp(
                                $('#receive-url').val(),
                                {
                                    orderId: orderId
                                },
                                function() {
                                    window.location.reload();
                                },
                                function (e) {
                                    Dialog.tips(e.msg);
                                }
                            );
                        }
                    }
                ]
            });
        },
        buyAgainBtn:function(){
        },
        pointBtn:function(){
        }
    }
    for(var k in clickHandles){
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(modSlt).on("click",key,handle);
        }
    }

});
