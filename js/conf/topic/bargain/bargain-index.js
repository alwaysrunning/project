define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cookie = require("common/kit/io/cookie");
    var dialog = require('common/ui/dialog/dialog');
    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    var baseUrl = "http://api.cart.yunhou.com";

    require("common/base/template");

    var urlMap = {
        getGoods: baseUrl + "/wxbargain/get/goods",
        getAct: baseUrl + "/wxbargain/get"
    };

    var BargainIndex = {

        _init: function () {
            var _self = this;
            _self.$jActiveRule = $('#jActiveRule');
            _self.$timeStamp = $(".jTimeStamp ");
            _self.$ActPicImg = $(".jActPic");
            _self.$goodsContent = $(".jAcGoods");
            //判断是不是微信浏览器
            _self.actId = _self._getUrlParam("actId");
            //_self._initAct();
            if (_self._isWeixin()) {
                _self._initAct();
            } else {
                dialog.tips('不支持的浏览器！请切换到微信浏览器6.0以上版本');
            }
        },

        _resetData: function (callback) {
            var _self = this;
            io.jsonp(urlMap["getGoods"], {
                actId: _self.actId
            }, function (result) {
                var code = result._error ? result._error.code : "";
                if (code == 600) {
                    _self._login();
                } else {
                    _self.actData = result;
                    callback && callback();
                }
            }, function (e) {
                dialog.tips(e.msg);
            });
        },

        _login : function(){
            cookie('_bbgReferer', window.location.href, {
                path: '/',
                domain: 'yunhou.com',
                expires: 0.2
            });
            window.location.href = 'https://ssl.yunhou.com/bubugao-passport/oauth2/weixin?type=h5&bind=false';
        },

        _initAct: function () {
            var _self = this;
            _self.currentUrl = window.location.href;
            _self._resetData(function () {
                if(_self.actData){
                    _self.$ActPicImg.attr("src", _self.actData.headPic);
                }
                //判断是否是单件
                //_self._isOnly();
                //初始化时间显示
                _self._initActDate();
                //初始化商品
                _self._initGoods();
                //初始化广告图
                _self._initPoster();
                //绑定事件
                _self._bindEvents();
                //初始化微信接口
                _self._initWX();
            });
        },

        _isOnly : function(){
            var _self = this;
            if(_self.actData){
                var length = _self.actData.goodsList.length;
                if(length==1){
                    window.location.href =  "http://m.yunhou.com/bargain.html?actId="+_self.actId+ "&goodsId="+_self.actData.goodsList[0].goodsId;
                }
            }
        },

        _initActDate: function () {
            var _self = this;
            if(_self.actData){
                var strArr = [
                    "<span>" + _self.actData.startTime + "</span>",
                    "<span>&nbsp;至&nbsp;</span>",
                    "<span>" + _self.actData.endTime + "</span>"
                ].join("");
                _self.$timeStamp.empty().append($(strArr));
            }
        },
        _getLimit: function (goodsData) {
            var _self = this;
            var max = 0;
            var minprice = goodsData.goodsPrice;
            var ruleData = goodsData.awardRule;
            for (var i = 0; i < ruleData.length; i++) {
                if (ruleData[i].goodsPrice <= minprice) {
                    minprice = ruleData[i].goodsPrice;
                }
            }
            return {
                minPrice: minprice
            };
        },

        _transformGoodsdata : function(goodsList){
            var _self = this;
            for(var i = 0 ;i<goodsList.length;i++){
                    goodsList[i].goodsPrice  = _self._getLimit(goodsList[i]).minPrice;
            }
            return goodsList;
        },

        _initGoods : function(){
            var _self = this;
            var isJoin = false;
            if(_self.actData){
                var goodsArr = _self._transformGoodsdata(_self.actData.goodsList);
                console.log(goodsArr);
                for(var i = 0 ; i < goodsArr.length; i++ ){
                    var goodsData = goodsArr[i];
                    var $goodsItem =$(template.render('goodsTpl', goodsArr[i]));
                    $goodsItem.data("goodsData",goodsArr[i]);
                    $goodsItem.appendTo(_self.$goodsContent);
                    if(goodsArr[i].bargain){
                        isJoin = true;
                    }
                }
                _self.isJoin = isJoin;
                if(isJoin){
                    //如果已经参加过活动
                    var $goodsItems = _self.$goodsContent.find(".jgoodsItem");
                    for(var j = 0 ; j <$goodsItems.length;j++){
                        var $thisItem = $goodsItems.eq(j);
                        if(!$thisItem.data("goodsData").bargain){
                            $thisItem.addClass("disabled");
                        }
                    }
                }
            }
        },

        _initPoster : function(){
            var _self = this;
            if(_self.actData){
                var adType = _self.actData.adType;
                var adArr = _self.actData.adList;
                var $adContent = adType==2?$(".jPoster1"):$(".jPoster2");
                for(var i =0; i<adArr.length ;i++){
                    adArr[i].adPic = adArr[i].adPic.replace(/!s2/g,"");
                    adArr[i].adType =adType;
                    var $posterItem =$(template.render('posterItemTpl', adArr[i]));
                    $posterItem.appendTo($adContent);
                }
            }
        },

        _bindEvents: function () {
            //绑定相应按钮的事件
            var _self = this;
            //初始化活动规则
            var contentStr = _self.actData ? _self.actData.ruleDesc : "未初始化";
            var dialogContent = "<div class='ac-c' style='text-align: left'>"+contentStr+"</div>";
            _self.$jActiveRule.click(function () {
                dialog.forcedPop({
                    cnt: dialogContent,
                    btn: [{
                        value: '确定',
                        isHide: true,
                        callBack: function () {
                        }
                    }]
                });
            });

            //商品的点击事件

            _self.$goodsContent.on("click",".jgoodsItem",function(){
                var $this = $(this);
                var goodsData = $this.data("goodsData");

                if(!_self.isJoin || goodsData.bargain){
                    //没有参加过活动；
                    window.location.href =  "http://m.yunhou.com/bargain.html?actId="+_self.actId+ "&goodsId="+goodsData.goodsId;
                }else{
                    //参加过活动
                    dialog.tips("已经选择过其他商品!!");
                }
                //http://m.yunhou.com/html/topic/bargain/bargain.html?actId=1109&goodsId=9600000598
            });
        },

        _isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },


        _initWX: function () {
            var _self = this;
            io.jsonp("http://api.mall.yunhou.com/Pennyshare/getWeixinConfig", {
                    //url : window.location.href.split('?')[0] + "?uuid=" + _self.actData?_self.actData.uuid:""
                },
                function (result) {
                    if (result.error == 0) {
                        wx.config({
                            debug: false,
                            appId: result.data.appId,
                            timestamp: result.data.timestamp,
                            nonceStr: result.data.noncestr,
                            signature: result.data.signature,
                            jsApiList: ["hideAllNonBaseMenuItem"]
                        });
                        wx.ready(function () {
                            wx.hideAllNonBaseMenuItem();
                        });

                    } else {
                        dialog.tips(result.msg);
                    }
                },
                function (e) {
                    dialog.tips(e.msg);
                }
            );
        },

        _getUrlParam: function (paramStr) {
            var reg = new RegExp("(^|&)" + paramStr + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        }

    };

    BargainIndex._init();
});
