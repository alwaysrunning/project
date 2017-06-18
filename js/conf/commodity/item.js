define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cart = require('module/add-to-cart/addcart');
    var Dialog = require('common/ui/dialog/dialog');
    var cookie = require('common/kit/io/cookie');
    var CountDown = require('common/ui/countdown/countdown');
    var goodsNotice = require('module/add-to-cart/goods-notice');
    var Lazyload = require('common/widget/lazyload');

    // 评论页脚本
    require('conf/commodity/evaluation');

    // 图文详情页脚本
    require('conf/commodity/details');

    //商品分享
    var share = require('common/widget/share');
    var shareMox = $('#jItemShareBox');
    var shareBtnsWrap = shareMox.find('.sharebuttonbox');
    var shareUrl = false;
    share.init({
        selector: '.sharebuttonbox'
    });
    $('#jBtnShare').on('click', function(){

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

    //轮播
    var Slider = require('lib/ui/slider/3.0.4/slider');
    var slider = new Slider('#slides', {
        height: $(window).width()*0.8,
        lazyLoad: {
            attr: 'data-url',
            loadingClass: 'img-error'
        },
        play: {
            auto: false,
            interval: 4000,
            swap: true,
            pauseOnHover: true,
            restartDelay: 2500
        },
        callback:{
            start:function(index){
            },
            loaded : function(){
            }
        }
    });

    var linkageTab = require('common/ui/linkage-tab/linkage-tab');

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
            //selectedData:'湖南_长沙市_芙蓉区:43_430100000000_430102000000',
            // selectedUrl : 'http://www.yunhou.com/api/getUserRegion',
            // changeCallBackUrl : 'http://www.yunhou.com/api/setUserRegion',
            // url : 'http://www.yunhou.com/api/getRegion/jsonp/',
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

    //商品规格选择框
    var toggleSpecification = $('#jToggleSpecification');
    var itemSpecificationBox = $('#jItemSpecificationBox');
    var itemNumber = $('#jNumber');

    toggleSpecification.on('click', function(){
        $(this).toggleClass('active');
    });

    var item = {
        init: function() {

            item.initialization();

            var size = $('#jSize label'),
            color = $('#jColor label');
            //item.effect(color);
            item.add_cookie();
            item.Meiosis();
            item.iconcollection();
            cart.getcart();

        },
        time: function(currentTime,timeend,timeText) {
            var $jDomButtom = $('#jDomButtom'),$countDown = $('#jCountDown');
            if(!timeend){
                $jDomButtom.html("");
                return;
            }
            CountDown({
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
        //加一
        addend: function(num, tip) {
            $('.jAddend').click(function() {
                var text = parseInt(itemNumber.val());
                if(text >= num){
                    itemNumber.val(num > 0 ? num : 1);
                    Dialog.tips(tip);
                } else if (itemNumber.val() == '') {
                    itemNumber.val(1);
                } else {
                    itemNumber.val(text + 1);
                }
            });
        },
        //减一
        Meiosis: function() {
            $('.jMeiosis').click(function(){
                var text = parseInt(itemNumber.val());
                if (text <= 1) {
                    itemNumber.val(1);
                } else if(itemNumber.val() == ''){
                    itemNumber.val(1);
                } else {
                    itemNumber.val(text - 1);
                }
            })
        },
        keyup: function(num, tip) {
            itemNumber.on('input', function(){
                var value = itemNumber.val();
                if (value == '') {
                    itemNumber.val('');
                } else if(value == 0) {
                    itemNumber.val(1);
                } else if(!(/^\d+$/.test(value))) {
                    itemNumber.val(1);
                } else if(value > num) {
                    itemNumber.val(num);
                    Dialog.tips(tip);
                }
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
        //到货通知
        subscribe: function(m, email) {
            var data = {
                'callback': 'callback',
                'product_id': gProductId,
                'mobile': m,
                'email': email
            };
            io.jsonp('/item/ajaxSubscribe', data, function(){
                Dialog.tips('提交成功');
            },function(e) {
                e.msg && Dialog.tips(e.msg);
            })
        },
        //加入购物车
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
        create_py: function(data) {
            if (typeof _RUNTIME == 'undefined' || _RUNTIME !== 'pro') { //非生产环境不要发送推广
                return;
            }

            _py_data.price    = data.price;
            _py_data.discount = ((_py_data.price*100) / (_py_data.origPrice*100)).toFixed(2);
            _py_data.soldOut = data.store ? 0 : 1;

            window._py = window._py || [];

            _py.push(['a', 'kD..-Bh-GwCDmskkzOTQp2i6hX']);
            _py.push(['domain','stats.ipinyou.com']);
            _py.push(['pi',_py_data]);
            _py.push(['e','']);

            -function(d) {
                var f = '';
                var s = d.createElement('script'),
                    e = d.body.getElementsByTagName('script')[0]; e.parentNode.insertBefore(s, e),
                    f = 'https:' == location.protocol;
                s.src = (f ? 'https' : 'http') + '://'+(f?'fm.ipinyou.com':'fm.p0y.cn')+'/j/adv.js';
            }(document);
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
                if (data.data.hideNum == true) {
                    $('.jItemCountSelecter').hide();
                }
                var store = data.data.product.store || 0,  //库存
                max = data.data.product.max,  //最大购买数
                isFavorite = data.data.product.price, //是否已收藏，true已收藏 ，false未收藏,
                supportDelivery = data.data.product.supportDelivery;  //是否可配送

                if (data.data.product.store <= 0) {
                    $('.jItemCountSelecter').hide();
                }

                //  add by taotao   秒杀入口
                if (!!data.data.promotion && data.data.promotion.seckill) {
                    $('.item-location-bar').eq(0).before('<a href="' + data.data.promotion.seckill.url + '" data-bpm="' + data.data.promotion.bpm + '" class="port-ms">此商品正在进行秒杀活动，赶快去抢</a>');
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
                        priceBuy.addClass('show-price-tag').attr('data-text',data.data.promotion.price.text)
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

                    if(data.data.promotion.limit){
                        var pronum = data.data.promotion.limit.num;   //促销商品限购数量
                    }

                    //团购|预售
                    if(data.data.promotion.groupbuy){

                        //var joinNum = $('#jBoughtNum');
                        priceBox.addClass('price-tg');
                        priceBox.addClass('show-bought-num').append('<div class="item-bought-num"><em>' + (data.data.promotion.groupbuy.num || 0) + '</em>人已购买</div>');
                        if(data.data.promotion.groupbuy.type == 'prebuy'){
                            priceBuy.addClass('show-price-tag').attr('data-text','预售').addClass('p-pre');
                        } else if(data.data.promotion.groupbuy.type == 'groupbuy') {
                            priceBuy.addClass('show-price-tag').attr('data-text','团购').addClass('p-group');
                        }
                        //倒计时文案
                        if(data.data.promotion.price.limitTimeType == 'start'){
                            timeText = ['',' : ',' : ',' 后开始'];
                        }else{
                            timeText = ['',' : ',' : ',' 后结束'];
                        }

                    }

                    //添加倒计时
                    item.time(data.data.currentTime, timeend, timeText);
                    $('#jDomButtom').css('display','block');

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
                        'UMP_ACT_WECHAT_BARGAIN' : '&#xe62f;', // 微信砍价
                    };

                    if(data.data.promotion.list){
                        //营销活动
                        for(var i=0 ; i<data.data.promotion.list.length; i++){
                            if(data.data.promotion.list[i].type == 'gift'){
                                gift_html += '<div class="item-tag" data-type="gift"><div class="item-tag-badge"><i class="iconglobal">&#xe62e;</i>' +
                                    '<span>' + data.data.promotion.list[i].tag + '</span></div>' +
                                '<div class="item-tag-desc"><a href="'+data.data.promotion.list[i].url+'">' + data.data.promotion.list[i].ad + '</a></div></div>';
                            }else{
                                gift_html += '<div class="item-tag" data-type="' + data.data.promotion.list[i].type + '"><div class="item-tag-badge"><i class="iconglobal">' + (tagIcons[data.data.promotion.list[i].type] || '&#xe62e;') + '</i>' +
                                    '<span>' + data.data.promotion.list[i].tag + '</span></div>' +
                                '<div class="item-tag-desc">' + data.data.promotion.list[i].ad + '</div></div>';
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

                item.create_py({
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
    }
    item.init();

    // 商品广告语展开/收起
    var $ItemDescWrap = $('#jItemDescWrap');
    var $ItemDesc = $('#jItemDesc');
    if ($ItemDesc.height() > $ItemDescWrap.height()) {
        $ItemDescWrap.addClass('show-expand');
    }
    $('#jBtnToggleExp').on('click', function() {
        $ItemDescWrap.toggleClass('expanded');
    });
    if ($ItemDesc.html() == '') {
        $ItemDescWrap.hide();
    }

    //获取推荐商品
    $('#jViewDetail').attr('href', 'javascript:;').before([
        '<div class="mod-recommended-items-wrap" id="jRecommendItems">',
        '<h5 class="mod-title">看了又看</h5>',
        '<div class="recommended-items" id="jRcmdItemsScroller">',
        '<div class="recommended-items-inner" id="jRcmdItems">',
        '</div>',
        '</div>',
        '</div>'
    ].join(''));
    var rcmdItemsWrap = $('#jRecommendItems');
    var rcmdItems = $('#jRcmdItems');
    var rcmdItemsURL = '//m.yunhou.com/item/ajaxGetRecommend';
    io.jsonp(rcmdItemsURL, {
        'product_id' : gProductId
    }, function(data) {
        var _rcmdHTML = '<div class="rmcd-item-slider" id="jRcmdItemsSlider"><div class="rmcd-slide-item">';
        var _imgHeight = 0;
        if (data instanceof Array && data.length) {
            data.forEach(function(item, index) {
                _rcmdHTML += [
                    '<a href="' + item.url + '" class="recommended-item" data-bpm="8.1.1.' + (index * 1 + 1) + '.0.' + item.product_id + '">',
                    '<img class="jImg img-error" data-url="' + item.image + '" src="" alt="">',
                    '<h5 class="caption">' + item.title + '</h5>',
                    '<span class="price-pri">￥' + item.price + '</span>',
                    '<span class="price-mkt">' + ((item.mktprice * 1 > item.price * 1) ? '<em>￥' + item.mktprice + '</em>' : '&nbsp;&nbsp;&nbsp;') + '</span>',
                    '</a>',
                    ((index + 1) % 3 === 0) && (index < data.length - 1) ? '</div><div class="rmcd-slide-item">' : '',
                ].join('');
            });
            rcmdItems.html(_rcmdHTML + '</div></div>');
            rcmdItemsWrap.show();

            var rmcdSlider = new Slider('#jRcmdItemsSlider', {
                height: $('#jRcmdItemsSlider').find('.recommended-item').height() + $('#jViewDetail').height() / 1.5,
                lazyLoad: {
                    attr: 'data-url',
                    loadingClass: 'img-error'
                },
                play: {
                    auto: false,
                    interval: 4000,
                    swap: true,
                    pauseOnHover: true,
                    restartDelay: 2500,
                    pagination: false
                },
                callback:{
                    start:function(index){
                    },
                    loaded : function(){
                    }
                }
            });

            // 图片懒加载
            var _lazyLoader = new Lazyload('#jRcmdItems .jImg', {
                effect: 'fadeIn',
                dataAttribute: 'url',
                load : function(self){
                    var _self = $(self);
                    if(_self.hasClass('img-error')){
                        _self.removeClass('img-error');
                    }
                }
            });

            $('#jRcmdItemsScroller').on('scroll', function() {
                _lazyLoader.update();
            });
        }

    }).on('error', function() {
    });

    //购物车加时间戳
    $('.btn-cart').on('click', function() {
        this.href = this.href + '?t=' +  (new Date()) * 1;
    });

    //标签页切换
    var tabHandlers = $('#jItemTabHeader').find("a");
    var tabContents = $('#jItemTabWrap').children('.item-tab-content');
    tabHandlers.on('click', function() {
        var index = tabHandlers.index(this);
        tabHandlers.removeClass('active');
        $(this).addClass('active');
        tabContents.removeClass('active').eq(index).addClass('active');
    });

    $('#jViewDetail').on('click', function() {
        tabHandlers.eq(1).trigger('click');
        window.scrollTo(0, 0);
    });

    //关闭模态框
    $('.jCloseModalBox').on('click', function() {
        $(this).closest('.modal-box-wrap').hide();
    });
});
