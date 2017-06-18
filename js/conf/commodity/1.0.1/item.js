/**
 * @author	taotao
 * @des     product item page
 * @date    2016-03-09
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('lib/core/1.0.0/io/request');
    var cookie = require('lib/core/1.0.0/io/cookie');
    var countDown = require('lib/gallery/countdown/1.0.0/countdown');


    var cart = require('module/add-to-cart/addcart');
    var Dialog = require('common/ui/dialog/dialog');
    var goodsNotice = require('module/add-to-cart/goods-notice');

    var Channel = require('lib/gallery/channel/1.0.0/channel');
    var panelChannel = Channel.define('panel', ['change']);



    /**
     *  basic page component
     *  0.  sns share settting
     *  1.  slider
     *  2.  address select if product is not global pattern
     *  3.  product description
     *  4.  shop name and customer service
     *  5.  recommended product
     *  7.  add to cart panel
     *  7.1 tab images adbout product detail description
     *  7.2 tab review of the product
     *  8   back2top
     */

    require('./component/share');
    require('./component/slide');
    require('./component/address');
    require('./component/description');

    require('./component/recommended');
    require('./component/details');
    require('./component/review');
    require('common/ui/nav/back2top')();


    //  tariff tips toggle show
    $('[node-type="tariff"]').click(function() {

        var lname = $(this).attr('data-animate');
        if ($(this).hasClass(lname)) {
            $(this).removeClass(lname);
        } else {
            $(this).addClass(lname);
        }

        var tips = $(this).siblings('.info-tips');
        var cname = tips.attr('data-animate');

        if (tips.hasClass(cname)) {
            tips.removeClass(cname);
        } else {
            tips.addClass(cname);
        }
    });






    //  promote informatioin



    //商品规格选择框
    var toggleSpecification = $('#jToggleSpecification');
    // var itemSpecificationBox = $('#jItemSpecificationBox');
    var itemNumber = $('#jNumber');

    toggleSpecification.on('click', function(){
        $(this).toggleClass('active');
    });

    var item = {
        init: function() {

            item.initialization();
            item.add_cookie();
            item.Meiosis();
            item.iconcollection();
            cart.getcart();
        },
        time: function(currentTime, timeend, timeText) {
            var $jDomButtom = $('#jDomButtom'),$countDown = $('#jCountDown');
            if(!timeend){
                $jDomButtom.html("");
                return;
            }
            countDown({
                container : $countDown,
                currentTime : currentTime,
                targetTime : timeend,
                type : {'d':false,'h':true,'m':true,'s':true},
                labelCtn: 'i',
                timeText : timeText,
                isShowTimeText: true,
                callback : function() {
                    $jDomButtom.html("<label>活动已结束</label>");
                    window.location.reload();
                }
            });
        },
        //  加一
        addend: function(num, tip) {
            $('.jAddend').click(function() {
                var text = parseInt(itemNumber.val());
                if(text >= num) {
                    itemNumber.val(num > 0 ? num : 1);
                    Dialog.tips(tip);
                    panelChannel.fire('change', {number: num > 0 ? num : 1});

                } else if (itemNumber.val() === '') {
                    itemNumber.val(1);

                    panelChannel.fire('change', {number: 1});

                } else {
                    itemNumber.val(text + 1);

                    panelChannel.fire('change', {number: text + 1});
                }
            });
        },
        //  减一
        Meiosis: function() {
            $('.jMeiosis').click(function(){
                var text = parseInt(itemNumber.val());
                if (text <= 1) {
                    itemNumber.val(1);

                    panelChannel.fire('change', {number: 1});

                } else if(itemNumber.val() === ''){
                    itemNumber.val(1);

                    panelChannel.fire('change', {number: 1});

                } else {
                    itemNumber.val(text - 1);
                    panelChannel.fire('change', {number: text - 1});
                }
            });
        },
        keyup: function(num, tip) {
            itemNumber.on('input', function(){
                var value = itemNumber.val();
                var number = value;

                if (value == '') {
                    itemNumber.val('');
                    number = 0;

                } else if(value == 0) {
                    itemNumber.val(1);
                    number = 1;

                } else if(!(/^\d+$/.test(value))) {
                    itemNumber.val(1);
                    number = 1;

                } else if(value > num) {
                    itemNumber.val(num);
                    Dialog.tips(tip);

                    number = num;
                }
                panelChannel.fire('change', {number: number});
            });
        },
        //收藏
        iconcollection: function() {
            var coll = $('#jCollectionIcon');
            coll.click(function() {
                if(coll.hasClass('active')) {
                    item.uncollection('http://m.yunhou.com/member/collection_cancle');
                } else {
                    item.collection('http://m.yunhou.com/member/collection_add');
                }
            })
        },
        //取消收藏ajax
        uncollection: function(url) {
            var data = {
                'callback': 'callback',
                'id': gProductId,
                'favoriteType': '1'
            };
            io.jsonp(url, data, function(){
                $('#jCollectionIcon').removeClass('active');
                Dialog.tips('取消收藏成功');
            },function(e){
                if(e.error == -100){
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                        window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
                    });
                } else {
                    Dialog.tips(e.msg);
                }
            },$('#jCollectionIcon'));
        },
        //收藏ajax
        collection: function(url) {
            var data = {
                'callback': 'callback',
                'id': gProductId,
                'favoriteType': '1'
            };
            io.jsonp(url, data, function(){
                $('#jCollectionIcon').addClass('active');
                Dialog.tips('收藏成功');
            },function(e){
                if(e.error == -100){
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                        window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
                    });
                } else {
                    Dialog.tips(e.msg);
                }
            }, $('#jCollectionIcon'));
        },
        add_cookie: function() {
            var _address = cookie("_address"),$addr = $('#jAddrPop'),arry;
            if (!_address) {
                io.jsonp('/item/ajaxGetCurrentRegion', {}, function(data){
                    setAddr(data.address);
                });
            } else {
                setAddr(_address);
            }
            function setAddr(_address){
                if(_address.indexOf(':') > 0){
                    arry = _address.split(':')[0].split('_');
                    _address = arry[0]+','+arry[1]+','+arry[2];
                }
                $addr.text(_address);
            }

        },
        //  加入购物车
        cart: function() {

            var needLogin;
            needLogin = typeof arguments[0] !== 'undefined' ? true : false;

            $('#jCartAdd').click(function() {

                var _this = $(this);
                var num = itemNumber.val();
                if(num == ''){
                    num = 1;
                }
                if (needLogin && cookie('_nick') === null) {
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                        window.location.href="https://ssl.yunhou.com/passport/h5/login?returnUrl="+encodeURIComponent(window.location.href);
                    });
                } else {
                    cart.addcart(gProductId, num, _this);
                }

            });
        },
        buyNow: function() {
            $('#jCartAdd').on('click', function(){
                var _this = $(this);
                var num = itemNumber.val();
                if(num == ''){
                    num = 1;
                }
                cart.buyNow(gProductId, num, _this);
            });
        },
        create_mvq: function(data) {

            if (typeof _RUNTIME == 'undefined' || _RUNTIME !== 'pro') { //非生产环境不要发送推广
                return;
            }

            var _mvq = window._mvq || [];
            window._mvq = _mvq;

            _mvq_data[5] = data.price;
            _mvq_data[9] = data.store ? 1 : 0;


            _mvq.push(['$setAccount', 'm-154924-0']);
            _mvq.push(['$setGeneral', 'goodsdetail', '', /*用户名*/ '', /*用户id*/ '']);
            _mvq.push(['$logConversion']);
            //_mvq.push(['setPageUrl', 'http://m.yunhou.com/item/' + gProductId + '.html']);
            _mvq.push(_mvq_data);
            _mvq.push(['$addPricing', /*价格描述*/ '']);
            _mvq.push(['$logData']);

            var mvl = document.createElement('script');
            mvl.type = 'text/javascript'; mvl.async = true;
            mvl.src = ('https:' == document.location.protocol ? 'https://static-ssl.mediav.com/mvl.js' : 'http://static.mediav.com/mvl.js');
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(mvl, s);

        },

        //页面初始化
        initialization: function() {
            var promotionBox = $('#promotion'),
                priceBox = $('#jPriceBox'),
                priceBuy = $('#jPrice'),
                propBuy = $('#jProPrice');
            var item_data = {
                'product_id': gProductId,
                'callback': 'callback'
            };
            promotionBox.hide();
            io.jsonp('http://m.yunhou.com/item/ajaxGetData', item_data, function(data){
                if (data.data.hideNum === true || data.data.hideNum === 'true') {
                    $('.jItemCountSelecter').hide();
                    $('.jItemCounter').closest('.fieldset').hide();
                }
                var store = data.data.product.store || 0,  //库存
                    max = data.data.product.max;  //最大购买数
                    // isFavorite = data.data.product.price, //是否已收藏，true已收藏 ，false未收藏,
                    // supportDelivery = data.data.product.supportDelivery;  //是否可配送

                if (data.data.product.store <= 0) {
                    $('.jItemCountSelecter').hide();
                }

                //  add by taotao   秒杀入口
                if (!!data.data.promotion && data.data.promotion.seckill) {
                    $('[node-type="port-ms"]').eq(0).html('<a href="' + data.data.promotion.seckill.url + '" data-bpm="' + data.data.promotion.bpm + '" class="port-ms">此商品正在进行秒杀活动，赶快去抢</a>');
                }

                if (data.data.product.price) {
                    var price = data.data.product.price; //销售价
                } else {
                    var price = priceBuy.text().replace("￥", "");
                }


                if (data.data.promotion) {

                    var timest = '',timeText = ['',' : ',' : ',' 后结束'];

                    if (data.data.promotion.price) {
                        var promotion_price = data.data.promotion.price.price;   //促销价（如果存在则显示促销价，反之显示销售价）
                        var timeend = data.data.promotion.price.limitTimeEnd;

                        //有活动时价格
                        priceBuy.addClass('show-price-tag').attr('data-text',data.data.promotion.price.text);
                        priceBuy.text('￥'+promotion_price+'');

                        //当市场价不存在则用销售价替换
                        if (propBuy.text() === '') {
                            propBuy.text('￥' + price + '');
                        }
                        //促销倒计时开始

                    } else {
                        promotion_price = price;
                        //有活动时没价格
                        priceBuy.text('￥' + promotion_price + '');
                        if ($('#jProPrice').text().replace('￥','') * 1 <= price){
                            $('#jProPrice').text('');
                        }
                    }

                    if(data.data.promotion.limit) {
                        var pronum = data.data.promotion.limit.num;   //促销商品限购数量
                    }

                    //团购|预售
                    if(data.data.promotion.groupbuy) {

                        //  临时修复方案，如果已经抢完。已经抢完的按钮应该是不能点击了
                        //  由于点击加 减按钮会判断按钮是否能点击，导致这个按钮状态会出现冲突
                        //  直接屏蔽按钮点击
                        if (data.data.button && data.data.button.text === '已抢完') {
                            $('#jCartAdd').addClass('disabled').text('已抢完').attr('id', '');
                        }

                        //var joinNum = $('#jBoughtNum');
                        priceBox.addClass('price-tg');
                        priceBox.find('.item-price-origin').wrap('<div class="item-price-origin-wrap"></div>');
                        priceBox.addClass('show-bought-num').find('.item-price-origin-wrap').append('<div class="item-bought-num">已售出<em>' + (data.data.promotion.groupbuy.num || 0) + '</em>件</div>');


                        if(data.data.promotion.groupbuy.type == 'prebuy'){
                            priceBuy.addClass('show-price-tag').attr('data-text','预售价').addClass('p-pre');
                        } else if(data.data.promotion.groupbuy.type == 'groupbuy') {
                            priceBuy.addClass('show-price-tag').attr('data-text','团购价').addClass('p-group');
                        }

                        //倒计时文案
                        if(data.data.promotion.price.limitTimeType == 'start'){
                            if(data.data.promotion.groupbuy.type === 'prebuy') {
                                priceBox.find('.item-timmer>div').before('距预售开始还有');
                            } else if(data.data.promotion.groupbuy.type === 'groupbuy') {
                                priceBox.find('.item-timmer>div').before('距团购开始还有');
                            }
                            timeText = ['',' : ',' : ',''];

                        } else {
                            if(data.data.promotion.groupbuy.type === 'prebuy') {
                                priceBox.find('.item-timmer>div').before('距活动结束还剩');
                            } else if(data.data.promotion.groupbuy.type === 'groupbuy') {
                                priceBox.find('.item-timmer>div').before('距团购结束还剩');
                            }
                            timeText = ['',' : ',' : ',''];
                        }
                    }

                    //添加倒计时
                    item.time(data.data.currentTime, timeend, timeText);
                    io.jsonp('http://api.mall.yunhou.com/Time', {}, function(rstTime){
                        var startTime = new Date(rstTime);
                        var endTime = new Date(timeend);
                        var intervalTime = 48*60*60*1000;
                        if(endTime - startTime < intervalTime){
                            $('#jDomButtom').css('display','block');
                        }
                    });

                    var gift_html ='';
                    var tagIcons = {
                        'mobileOnly'             : '&#xe61d;', // 手机专享
                        'UMP_ORDER_COUPON'       : '&#xe63d;', // 送优惠券
                        'gift'                   : '&#xe62e;', // 满赠
                        'UMP_ORDER_MLJ'          : '&#xe656;', // 满减
                        'UMP_ORDER_ZK'           : '&#xe645;', // 折扣
                        'UMP_GOODS_XSCX'         : '&#xe640;', // 限时促销
                        'UMP_GOODS_XSQG'         : '&#xe640;', // 限时抢购
                        'UMP_ORDER_VIP_ZK'       : '&#xe645;', // VIP折扣
                        'UMP_PLAT_BANK'          : '&#xe645;', // 银行优惠
                        'UMP_ACT_RED_PACKAGE'    : '&#xe63f;', // 红包
                        'UMP_GOODS_GROUPBUY'     : '&#xe605;', // 团购
                        'UMP_ORDER_FREESHIPPING' : '&#xe63b;', // 包邮
                        'UMP_ACT_WECHAT_BARGAIN' : '&#xe62f;'  // 微信砍价
                    };

                    if(data.data.promotion.list) {
                        //营销活动
                        for (var i=0 ; i<data.data.promotion.list.length; i++) {

                            if(data.data.promotion.list[i].type == 'gift' && !data.data.promotion.list[i].umpId) {
                                gift_html += '<div class="item-tag" data-type="gift"><div class="item-tag-badge"><i class="iconglobal">&#xe62e;</i>' +
                                             '<span>' + data.data.promotion.list[i].tag + '</span></div>' +
                                             '<div class="item-tag-desc"><a href="'+data.data.promotion.list[i].url+'">' + data.data.promotion.list[i].ad + '</a></div></div>';

                            } else {
                                gift_html += '<div class="item-tag" data-type="' + data.data.promotion.list[i].type + '"><div class="item-tag-badge"><i class="iconglobal">' + (tagIcons[data.data.promotion.list[i].type] || '&#xe62e;') + '</i>' +
                                             '<span>' + data.data.promotion.list[i].tag + '</span></div>';

                                //  存在这个id，跳转聚合列表页
                                if (!!data.data.promotion.list[i].umpId) {
                                    gift_html += '<div class="item-tag-desc">' +
                                                 '<a href="http://m.yunhou.com/search/index?showPage=promotionsets&umpId=' + data.data.promotion.list[i].umpId + '">' +
                                                 data.data.promotion.list[i].ad +
                                                 '</a>' + '</div></div>';

                                } else {
                                    gift_html += '<div class="item-tag-desc">' + data.data.promotion.list[i].ad + '</div></div>';
                                }
                            }
                        }
                    }

                    if (gift_html) {
                        promotionBox.append(gift_html).css('display','block');
                    } else {
                        promotionBox.hide().css('display','none');
                    }

                    //有促销时最大购买量
                    var limit_tip;

                    if(pronum > store || !data.data.promotion.limit){
                        //$('#jItemMaxCount').text(max);
                        item.addend(max, '库存有限,此商品最多只能购买' + max + '件');
                        item.keyup(max, '库存有限,此商品最多只能购买' + max + '件');
                    } else {
                        //$('#jItemMaxCount').text(pronum);
                        if (data.data.promotion.limit && data.data.promotion.limit.tips) {
                            limit_tip = data.data.promotion.limit.tips;
                        } else {
                            limit_tip = '库存有限,此商品最多只能购买' + pronum + '件';
                        }
                        item.addend(pronum, limit_tip);
                        item.keyup(pronum, limit_tip);
                    }
                } else {
                    //没活动时价格
                    //$('#jItemMaxCount').text(max);
                    priceBuy.text('￥'+price+'');
                    //propBuy.text('');
                    if ($('#jProPrice').text().replace('￥','') * 1 <= price){
                        $('#jProPrice').text('');
                    }
                    limit_tip = '库存有限,此商品最多只能购买' + max + '件';
                    item.addend(max, limit_tip);
                    item.keyup(max, limit_tip);
                }

                //  关税
                if (data.data.product.warehouseAddress) {
                    $('.mod-tariff .location[data-info="location"]').html(data.data.product.warehouseAddress + '发货');
                }
                if (data.data.product.tax && data.data.product.tax.msg) {
                    $('.mod-tariff .info-tips .txt').html(data.data.product.tax.msg);
                }

                panelChannel.listen('change', function(e) {
                    var tax = data.data.product.tax || '';
                    var amount = e.number;
                    var tipsHdl = $('.info-tips[data-tips="itemCounter"]');
                    var flag1 = 0,
                        flag2 = 0;
                    var price = $('#jPrice').text().replace('￥','') * 1;

                    // 当taxesType=1，保税类商品 {
                    //     当（数量*单价）> freeDutyAmount时，{
                    //         关税 = 关税税率 *（数量*单价）
                    //     } else {
                    //         关税 = 0
                    //     }
                    //     税费总额 = 关税 + （数量*单价）*（exciseRate/100 * exciseDiscount + vatRate/100 * vatDiscount）
                    // }
                    //
                    // 当taxesType=2，直邮类商品{
                    //     税费总额 = ppatRate/100 * （数量*单价）
                    // }
                    //
                    // 计算出税费总额后，当税费总额>freeTaxAmount {
                    //     提示“税费XXXX，起超过免征范围，结算将收取税费。”
                    // }
                    if (tax && tax.taxesType) {
                        var gs = 0, gsFee = 0;

                        if (tax.taxesType == 1) {
                            if (price*1*amount > tax.freeDutyAmount*1) {
                                gs = (price*1*amount*tax.dutyRate)/100;
                            }
                            gsFee = gs + amount*price*1 * (tax.exciseRate/100 * tax.exciseDiscount + tax.vatRate/100 * tax.vatDiscount);

                        } else if (tax.taxesType == 2) {
                            gsFee = (tax.ppatRate * amount * price)/100;

                            if (gsFee > tax.freeTaxAmount) {
                                flag1 = 1;
                                tipsHdl.find('.txt').html('税费¥' + gsFee.toFixed(2) + '，已超过免征范围，结算将收取税费');
                                tipsHdl.addClass(tipsHdl.attr('data-animate'));

                            } else {
                                flag1 = 0;
                            }
                        }
                    }

                    // 订单最大限额判断方法
                    // 当有maxOrderAmount（订单最大限额）字段且大于0时，{
                    //     当（数量*单价）> maxOrderAmount 时，{
                    //         按钮置灰，且提示“抱歉，您已超过海关规定限额maxOrderAmount元，请分次购买。”
                    //     }
                    // }
                    if (tax && tax.maxOrderAmount && tax.maxOrderAmount *100 > 0) {
                        //  如果单个商品价格大于maxOrderAmount, 仍然可以加入购物车
                        if (price*100*amount > tax.maxOrderAmount*100 && $('#jNumber').val() > 1) {
                            flag2 = 1;
                            tipsHdl.find('.txt').html('抱歉，您已超过海关规定限额¥' + tax.maxOrderAmount + '，请分次购买。');
                            tipsHdl.addClass(tipsHdl.attr('data-animate'));
                            $('#jCartAdd').addClass('disabled');

                        } else {
                            flag2 = 0;
                            $('#jCartAdd').removeClass('disabled');
                        }
                    }

                    if (flag1 + flag2 === 0) {
                        tipsHdl.removeClass(tipsHdl.attr('data-animate'));
                    }
                });
                //  trigger at once
                panelChannel.fire('change', {number: $('#jNumber').val()});


                var shareBtnsWrap = $('#jItemShareBox .sharebuttonbox');
                shareBtnsWrap.attr('data-text', shareBtnsWrap.attr('data-text').replace('$price', priceBuy.text()));

                //库存
                (store <= 0) ? $('#jStock').text('缺货') : $('#jStock').text('有货');

                //收藏
                var isfavorite = data.data.product.isFavorite;
                if(isfavorite == true){
                    $('#jCollectionIcon').addClass('active');
                }

                //评论数
                $('#jCommentNum').text('('+data.data.product.commentNum+')');

                //按钮状态
                var btntype = data.data.button.state; //按钮状态
                var btntext = data.data.button.text;   //按钮文本
                var btnclick = data.data.button.click;  //按钮事件

                //修改按钮文本
                $('#jCartAdd').text(btntext);

                if (data.data.button.bpm) {
                    $('#jCartAdd').attr('data-bpm', data.data.button.bpm);
                }

                //即将开始的预售商品不显示购买人数
                if (data.data.promotion && data.data.promotion.groupbuy && (data.data.promotion.groupbuy.type === "prebuy" || data.data.promotion.groupbuy.type === 'groupbuy')) {
                    if (data.data.promotion.price && data.data.promotion.price.limitTimeEnd && data.data.promotion.price.limitTimeType == 'start') {
                        if ((data.data.promotion.price.limitTimeEnd - data.data.currentTime)/1000/3600 <= 24) {
                            priceBox.removeClass('show-bought-num');
                        }
                    }
                }
                //btntext.indexOf('即将开始') >= 0 && priceBox.removeClass('show-bought-num');
                if (btnclick == 'disable') {  //不可点
                    // $('.jItemCountSelecter').hide();
                    $('#jCartAdd').addClass('disabled');
                } else if(btnclick == 'storeNotice') {   //到货通知
                    goodsNotice(gProductId);
                } else if(btnclick == 'addCart') {//添加购物车
                    item.cart();
                } else if(btnclick == 'direct') {//立即购买 | 立即参团 | 立即预定
                    item.buyNow();
                } else if(btnclick == 'loginAddCart') {//未登陆
                    item.cart(true);
                } else if(btnclick == 'buy') {
                    item.cart();
                }

                if (pronum == 0) {
                    itemNumber.prop('readonly', true);
                }

                // 推广数据
                item.create_mvq({
                    price: priceBuy.text().replace("￥", "") * 1,
                    store: data.data.product.store || 0
                });

                // 终极价格显示逻辑
                if ($('#jProPrice').text().replace('￥','') * 1 <= $('#jPrice').text().replace('￥','') * 1){
                    $('#jProPrice').hide();
                }

            },function(e) {
                e.msg && Dialog.tips(e.msg);
            });
        }
    };
    item.init();



    //购物车加时间戳
    $('.btn-cart').on('click', function() {
        this.href = this.href + '?t=' +  (new Date()) * 1;
    });

    //标签页切换
    var pushLength = 0;
    var tabHandlers = $('#jItemTabHeader>a');
    var tabContents = $('#jItemTabWrap>.item-tab-content');

    var showTab = function(index, back) {
        tabHandlers.removeClass('active').eq(index).addClass('active');
        tabContents.removeClass('active').eq(index).addClass('active');

        if (index === 0) {
            if (pushLength !== 0 && !back) {
                history.back();
                pushLength = 0;
            }

        } else {
            if (pushLength === 0) {
                history.pushState({
                    'component':  index
                }, '', window.location.href);
                pushLength = pushLength + 1;
            }
        }
    };

    tabHandlers.on('click', function() {
        showTab(tabHandlers.index(this));
    });

    $('#jViewDetail').on('click', function() {
        window.scroll(0, 0);
        showTab(1);
    });

    $(window).on('popstate', function(e) {
        if (pushLength !== 0 ) {
            pushLength = 0;
            showTab(0, true);
        }
    });
});
