/**
 * 列表页和店铺首页获取营销信息
 *
 * @author liangyouyu
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require("jquery");
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var agio = {};

    // 设置显示的价格 和 最大价格
    function setPriceAB(dataObj) {
        var id = dataObj.productId;
        var $dom = $('li[data-id="' + id + '"] [data-node-type=price], .jProduct[data-id="' + id + '"] [data-node-type=price]');
        //市场价格展示逻辑
        var priceStr = dataObj.price.Mprice, //营销价格
            priceSaleStr = $dom.attr("data-price-sale"), //促销价格
            priceMarketStr = $dom.attr("data-price-market"), //市场价格
            priceFloat = parseFloat(priceStr.replace(/,/g, '')),
            priceSaleFloat = parseFloat(priceSaleStr.replace(/,/g, '')),
            priceMarketFloat = parseFloat(priceMarketStr.replace(/,/g, '')),
            max = priceSaleFloat > priceMarketFloat ? priceSaleStr : priceMarketStr;

        if (priceStr && $.trim(priceStr.length != 0)) {
            $dom.find('[data-node-type=pri]').text('￥' + priceStr);
        }
        if (parseFloat(max.replace(/,/g, '')) > priceFloat) {
            $dom.find('[data-node-type=pri-del]').text('￥' + max);
        }

        agio[id] = ((max * 100 - priceStr * 100) / 100).toFixed(2);
    }

    //按钮逻辑
    function setBtnInfo(dataObj) {
        var id = dataObj.productId;
        var dataBpm = $('li[data-id="' + id + '"]  [data-buy-now]').attr('data-bpm');
        var str;
        if (dataObj.waitingType === 0 || dataObj.waitingType === 1) {
            if (dataObj.promotionType == 1) {
                str = '<a class="gd-buy-btn jBuyNow" data-id="' + id + '" data-bpm="' + dataBpm + '">' +
                '<span class="ui-button-yun" >抢购</span>' + '</a>';
            } else if (dataObj.promotionType == 2) {
                str = '<a class="gd-buy-btn jHref" data-id="' + id + '" data-bpm="' + dataBpm + '">' +
                '<span class="ui-button-yun" >参团</span>' + '</a>';
            } else if (dataObj.promotionType == 3) {
                str = '<a class="gd-buy-btn jHref" data-id="' + id + '" data-bpm="' + dataBpm + '">' +
                '<span class="ui-button-yun" >预定</span>' + '</a>';
            }
        } else if (dataObj.waitingType === 2) {//倒计时中，不能购买
            str = '<a class="gd-buy-btn disabled" href="javascript:;">' +
            '<span class="ui-button-yun">抢购</span></a>';
        }

        if (str) {
            $('li[data-id="' + id + '"]  [data-buy-now=y]').replaceWith(str);
        }
    }
    //设置营销标签 满减满赠送团购预售
    function setTagInfo(dataObj, el) {

        var buyType = null;
        var showTag = {
            mobile: false, //是否手机专享
            priceoff: false, //是否优惠
            priceoff2: false, //是否满减
            priceoff3: false, //是否折扣
            coupon: false, //是否送券
            gift: false, //是否满赠
            group: false, //是否团购
            presale: false, //是否预售
            baoyou: false //是否包邮
        };

        if (dataObj.promotionType == 2) {
            showTag.group = true;
        } else if (dataObj.promotionType == 3) {
            showTag.presale = true;
        } else {
            if (dataObj.downTag) {
                showTag.priceoff = true;
            }
            if (dataObj.productTag.indexOf('满减') >= 0) {
                showTag.priceoff2 = true;
            }
            if (dataObj.productTag.indexOf('折扣') >= 0) {
                showTag.priceoff3 = true;
            }
            if (dataObj.productTag.indexOf('满赠') >= 0) {
                showTag.gift = true;
            }
            if (dataObj.productTag.indexOf('送券') >= 0) {
                showTag.coupon = true;
            }
            if (dataObj.productTag.indexOf('包邮') >= 0) {
                showTag.baoyou = true;
            }

        }

        if (dataObj.showWapicon) {
            showTag.mobile = true;
        }

        var goodItem;

        if (el) {
            goodItem = $(el).find('[data-id="' + dataObj.productId + '"]');
            if (dataObj.showWapicon) {
                $(el).find('[data-id="' + dataObj.productId + '"] .jMbTip').removeClass('hidden').find('em').text(agio[dataObj.productId]);
            }
        } else {
            goodItem = $('[data-id="' + dataObj.productId + '"]');
            if (dataObj.showWapicon) {
                $('[data-id="' + dataObj.productId + '"] .jMbTip').removeClass('hidden').find('em').text(agio[dataObj.productId]);
            }
        }

        if (showTag.mobile) {
            goodItem.find('.jMbTip').removeClass('hidden').find('em').text(agio[dataObj.productId]);
        }
        if (showTag.priceoff) {
            goodItem.find('.jOffTip').removeClass('hidden');
        }
        if (showTag.priceoff2) {
            goodItem.find('.jOffTip2').removeClass('hidden');
        }
        if (showTag.priceoff3) {
            goodItem.find('.jOffTip3').removeClass('hidden');
        }
        if (showTag.coupon) {
            goodItem.find('.jCoupTip').removeClass('hidden');
        }
        if (showTag.gift) {
            goodItem.find('.jGiftTip').removeClass('hidden');
        }
        if (showTag.group) {
            goodItem.find('.jGrpTip').removeClass('hidden');
        }
        if (showTag.presale) {
            goodItem.find('.jPsTip').removeClass('hidden');
        }
        if (showTag.baoyou) {
            goodItem.find('.jBaoyou').removeClass('hidden');
        }

    }



    function productInfo() {
    }
    productInfo.prototype = {
        sync: function (opt) {
            io.get('/Promotion/productInfo', opt.data, function (data) {
                for (var i = 0; i < data.length; i++) {
                    setBtnInfo(data[i]);
                    setPriceAB(data[i]);
                    setTagInfo(data[i], opt.el);
                };
            }, function (e) {
                Dialog.tips(e.msg);
            });
        }
    };

    module.exports = new productInfo();
});
