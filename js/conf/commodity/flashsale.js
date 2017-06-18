/**
 *
 * @author	taotao
 * @date    2015-10-20
 *
 */
define(function(require) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var Dialog = require('common/ui/dialog/dialog');
    var cookie = require('common/kit/io/cookie');
    var countDown = require('common/ui/countdown/countdown');
    var util = require('lib/core/1.0.0/utils/util');
    var Delegator = require('lib/core/1.0.0/dom/delegator');


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
                    shareUrl = data.url;
                    shareBtnsWrap.attr('data-url', shareUrl);
                    shareMox.show();
                }, function(e){
                    Dialog.tips(e);
                });
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
        }
    });

    //  秒杀模块
    var flashSale = (function() {
        var $flashSale = new Delegator('[node-type="flash-sale"]');
        var $btnGroup = new Delegator('[node-type="btn-group"]');

        var flashSale = $('[node-type="flash-sale"]');
        var captcha = flashSale.find('[node-type="flash-sale-captcha"]'),
            button = $('[node-type="btn-group"]').find('[node-type="button"]'),
            input = flashSale.find('input[name="code"]');

        //  绑定事件
        $btnGroup.on('preload', function() {
            document.location.reload();
        });
        $btnGroup.on('flashSale', function() {
            show();
        });
        $btnGroup.on('end', function() {
            Dialog.tips('该商品已经抢完');
        });
        $flashSale.on('cancel', function() {
            hide();
        });
        $flashSale.on('updateCaptcha', function() {
            updateCaptcha();
        });

        $('#submitFlashsale').on('submit', function(e) {
            e.stopPropagation();
            e.preventDefault();
            submit();
        });


        //  获取验证码
        var updateCaptcha = function(success) {
            var guid = util.guid(),
                url = 'http://m.yunhou.com/item/ajaxGetSeckillCode';

            var data = {
                product_id: gProductId,
                active_id: gActiveId
            };

            io.get(url, data, function(data) {
                flashSale.find('input[name="code"]').val('');
                captcha.attr('src', data.data.url);
                success && success();

            }, function(e) {
                if(e.error === -100) {
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function() {
                        window.location.href = 'https://ssl.yunhou.com/passport/h5/login?returnUrl=' + encodeURIComponent(window.location.href);
                    });

                } else {
                    Dialog.tips(e.msg);
                }
            });
        };

        var preload = function() {
            button.addClass('button-disable');
            button.attr('action-type', 'preload');
            button.text('秒杀即将开始');
        };
        var start = function() {
            button.removeClass('button-disable');
            button.attr('action-type', 'flashSale');
            button.text('立即抢');
        };
        var end = function() {
            button.addClass('button-disable');
            button.attr('action-type', 'end');
            button.text('已抢完');
        };


        //  提交数据
        var submit = function() {
            var url = 'http://m.yunhou.com/item/ajaxCreateSeckillOrder',
                code = $('input[name="code"]').val(),
                sender = $('#submitFlashsale').find('[action-type="confirm"]'),
                addressId = $('[node-type="address"]').attr('data-address-id') || '';

            //  check code
            if (code.length === 0) {
                Dialog.tips('验证码不能为空');

            } else {

                var data = {
                    product_id : gProductId,
                    active_id  : gActiveId,
                    code       : code,
                    address_id : addressId
                };

                io.get(url, data, function(res) {
                    window.location.href = res.data.url;

                }, function(e) {
                    if (e.error == 1000) {
                        Dialog.tips(e.msg);
                        end();
                        hide();

                    } else {
                        updateCaptcha();
                        Dialog.tips(e.msg);

                    }
                }, sender);
            }
        };

        //  出现浮层
        var show = function() {
            var addressId = $('[node-type="address"]').attr('data-address-id') || '';

            //  判读用户是否登陆
            if (cookie('_nick') === null) {
                Dialog.tips('您还未登录，正在跳转登录页', function() {
                    window.location.href = 'https://ssl.yunhou.com/passport/h5/login?returnUrl=' + encodeURIComponent(window.location.href);
                });

                //  判断用户是否有地址
            } else if (addressId === '') {
                Dialog.tips('请完善地址信息');

                //  判断用户地址信息是否完整
            } else if ($('.item-global-address').length > 0) {
                Dialog.tips('请补全身份证信息');

            } else {
                $('html').addClass('_flashSales-capatha');

                // 隐藏回到顶部
                $('.jScroll2Top').addClass('back2top-hide');
                // 获取验证码
                updateCaptcha(function() {
                    flashSale.show();
                    // input.focus();
                });
            }
        };

        //  关闭浮层
        var hide = function() {
            //  还原回到顶部设置
            $('.jScroll2Top').removeClass('back2top-hide');
            flashSale.hide();
            $('html').removeClass('_flashSales-capatha');
        };
        return {
            preload : preload,
            start   : start,
            end     : end
        };
    })();

    var item = {
        init: function() {
            item.initialization();
            item.activity();
            item.iconcollection();
        },
        activity: function() {
            var hdl = $('[node-type="activity"]');
            var $countDown = $('.jCountTime');

            var startTime = hdl.attr('data-starttime') || '',
                endTime   = hdl.attr('data-endtime'),
                preTime   = hdl.attr('data-pretime');

            //  获取当前时间
            var timesvr = 'http://api.mall.yunhou.com/Time';

            io.jsonp(timesvr, {platform: 'js'}, function(ts) {
                ts = +ts;

                if (ts < preTime) {
                    setTimeout(function() {
                        //  这个最保险，直接调用preload不能很好的保证倒计时的准确
                        window.location.reload();
                    }, (preTime - ts));

                } else if (ts < startTime) {
                    preload(ts, startTime, endTime);

                } else if (ts < endTime) {
                    start(ts, endTime);

                } else {
                    end();
                }
            });

            // 活动还没开始
            function preload(currentTime, startTime, endTime) {
                flashSale.preload();
                hdl.find('label').text('距秒杀开始还剩');

                countDown({
                    container : $countDown,
                    currentTime : currentTime,
                    targetTime : startTime,
                    type : {'d':false,'h':true,'m':true,'s':true},
                    labelCtn: 'i',
                    isShowTimeText: true,
                    callback : function() {
                        // 活动开始
                        // 状态切换放到预热结束的回调里面。防止没有库存时按钮状态被更改
                        flashSale.start();
                        start(startTime, endTime);
                    }
                });
            }
            function start(currentTime, endTime) {
                hdl.find('label').text('距结束还剩');

                countDown({
                    container : $countDown,
                    currentTime : currentTime,
                    targetTime : endTime,
                    type : {
                        'd' : false,
                        'h' : true,
                        'm' : true,
                        's' : true,
                        'ms' : false
                    },
                    labelCtn: 'i',
                    isShowTimeText: true,
                    callback : function() {
                        // 活动结束
                        end();
                    }
                });
            }
            function end() {
                flashSale.end();
                hdl.find('label').text('秒杀已经结束');
                Dialog.tips('该秒杀活动已经结束', function() {
                    window.location.href = 'http://m.yunhou.com/item/' + gProductId + '.html';
                });
            }
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
            });
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
                if(e.error === -100){
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function() {
                        window.location.href = 'https://ssl.yunhou.com/passport/h5/login?returnUrl=' + encodeURIComponent(window.location.href) + '';
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
                if (e.error == -100) {
                    Dialog.tips('您还未登录，3秒后自动跳转登录页面', function(){
                        window.location.href= 'https://ssl.yunhou.com/passport/h5/login?returnUrl=' + encodeURIComponent(window.location.href)+"";
                    });
                } else {
                    Dialog.tips(e.msg);
                }
            }, $('#jCollectionIcon'));
        },
        add_cookie: function() {
            var _address = cookie("_address"),$addr = $('#jAddrPop'),arry;
            if (!_address) {
                io.jsonp('/item/ajaxGetCurrentRegion', {}, function(data) {
                    setAddr(data.address);
                });
            } else {
                setAddr(_address);
            }
            function setAddr(_address) {
                if(_address.indexOf(':') > 0){
                    arry = _address.split(':')[0].split('_');
                    _address = arry[0]+','+arry[1]+','+arry[2];
                }
                $addr.text(_address);
            }
        },
        create_mvq: function(data) {

            if (_RUNTIME && _RUNTIME !== 'pro') { //非生产环境不要发送推广
                return;
            }
            var _mvq_data = window._mvq_data || [];
            _mvq_data[4] = data.price;
            _mvq_data[8] = data.store ? 1 : 0;
            window._mvq = [];
            _mvq.push(['$setAccount', 'm-154924-0']);
            _mvq.push(['$setGeneral', 'goodsdetail', '', /*用户名*/ '', /*用户id*/ '']);
            _mvq.push(['$logConversion']);
            _mvq.push(['setPageUrl', 'http://m.yunhou.com/item/' + gProductId + '.html']);
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
            var promotionBox = $('#promotion');
            promotionBox.hide();

            //  地址回传
            $('[node-type="address"]').click(function(e) {
                e.stopPropagation();
                e.preventDefault();
                var url = $(this).attr('href');

                cookie('_bbgReferer', window.location.href, {
                    path: '/',
                    domain: 'yunhou.com'
                });
                window.location.href = url;
            });

            // 推广数据
            // TODO
            // item.create_mvq({
            //     price: priceBuy.text().replace("￥", "") * 1,
            //     store: data.data.product.store || 0
            // });
        }
    };
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
    if ($ItemDesc.html() === '') {
        $ItemDescWrap.hide();
    }

    //标签页切换
    var tabHandlers = $('#jItemTabHeader').find("a");
    var tabContents = $('#jItemTabWrap').children('.item-tab-content');
    tabHandlers.on('click', function() {
        var index = tabHandlers.index(this);
        tabHandlers.removeClass('active');
        $(this).addClass('active');
        tabContents.removeClass('active').eq(index).addClass('active');
    });

    $('#jViewDetail').on('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        tabHandlers.eq(1).trigger('click');
        window.scrollTo(0, 0);
    });


    //关闭模态框
    $('.jCloseModalBox').on('click', function() {
        $(this).closest('.modal-box-wrap').hide();
    });



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
});
