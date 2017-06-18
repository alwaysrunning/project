/**
 * 全球购首页秒杀模块
 * 实现功能：
 *  倒计时显示
 *  抢购库存判断
 *  营销价格查询
 *
 * @author	taotao
 * @date    2015-10-09
 *
 */
define(function (require) {
    'use strict';

    var io = require('common/kit/io/request');
    var DateTime = require('lib/gallery/datetime/1.0.0/datetime');
    var countDown = require('common/ui/countdown/countdown');
    var cart = require('module/add-to-cart/addcart');


    var hdlGroup = $('[node-type="product-ms"]');


    //  商品倒计时初始化
    //  当倒计时百分比低于7%时，倒计时进度条不在缩小，因为太小就不好看了

    var countdown = (function() {
        var preload = function(item) {
            var endTime = item.find('.jCountTime').attr('data-sTime');
            item.find('.gd-count-down-txt').text('即将开始');
            item.find('.gd-count-down').attr('countdown-state', 'preload');


            countDown({
                targetTime     : endTime,
                timeText       : [':', ':', ':', '', ''],
                container      : item.find('[data-product-info="count-down"]'),
                isShowTimeText : true,
                type : {
                    'd' : false,
                    'h' : true,
                    'm' : true,
                    's' : true,
                    'ms' : false
                },
                callback: function() {
                    start(item);
                }
            });
        };

        var start = function(item) {
            var endTime = item.find('.jCountTime').attr('data-eTime');

            item.find('.gd-count-down-txt').text('剩余时间');
            item.find('.gd-count-down').attr('countdown-state', 'start');

            countDown({
                targetTime     : endTime,
                timeText       : [':', ':', ':', '', ''],
                container      : item.find('[data-product-info="count-down"]'),
                isShowTimeText : true,
                type : {
                    'd' : false,
                    'h' : true,
                    'm' : true,
                    's' : true,
                    'ms' : false
                },
                callback: function() {
                    end(item);
                }
            });
        };

        var end = function(item) {
            item.find('.gd-count-down-txt').text('剩余时间');
            item.find('.gd-count-down').attr('countdown-state', 'end');
            item.find('.jCountTime').html('<b>00:00:00</b>');
        };

        return {
            preload : preload,
            start   : start,
            end     : end
        };
    })();



    DateTime.getServerTime(function(ts) {
        ts = +ts;

        hdlGroup.each(function() {
            var startTime = $(this).find('.jCountTime').attr('data-sTime'),
                endTime   = $(this).find('.jCountTime').attr('data-eTime');

            if (ts < startTime) {
                countdown.preload($(this));

            } else if (ts < endTime){
                countdown.start($(this));

            } else {
                countdown.end($(this));
            }
        });
    });


    //  添加操作按钮事件
    //  存在立即购买和加入购物车两个操作
    hdlGroup.on('click', '[action-type]', function() {
        var _this = $(this);
        var id = _this.parents('[node-type="product-ms"]').attr('data-id');
        var actionType = $(this).attr('action-type') || '';

        if (actionType === 'add2cart') {
            cart.addcart(id, '1', _this);

        } else if (actionType === 'buyNow') {
            cart.buyNow(id, '1', _this);

        } else if (actionType === 'flashSale') {
            var url = $(this).attr('data-url') || 'www.yunhou.com';
            window.location.href = url;
        }
    });


    //  查询相关库存
    //  判断库存手机抢购库存, 库存为0，清除点击事件
    var msProductIdData = {
        ids     : '',
        channel : '3'
    };
    hdlGroup.each(function() {
        var id = $(this).data('id') || '';
        msProductIdData.ids += ',' +  id;
    });
    msProductIdData.ids = msProductIdData.ids.replace(/^,/, '');

    io.jsonp('http://api.mall.yunhou.com/product/batchsnapupstore', msProductIdData, function(res) {
        for (var i = 0, len = res.length; i < len; i = i + 1) {
            if (res[i].store < 1) {
                var item = hdlGroup.filter('[data-id="' + res[i].productId + '"]');

                //  添加已经抢完tag
                item.addClass('item-sold-out');

                //  通过将action-type删除来实现按钮功能删除
                item.find('[action-type]').attr('action-type', '');
            }
        }
    });

});

