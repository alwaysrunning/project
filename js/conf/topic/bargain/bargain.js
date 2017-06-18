define(function (require, exports, module) {
    'use strict';

    //pub source 
    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cookie = require("common/kit/io/cookie");
    var dialog = require('common/ui/dialog/dialog');
    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');
    require("./iscroll-probe");

    var baseUrl = "http://api.cart.yunhou.com";
    var pollingTime = 30000;  //轮询间隔；


    var urlMap = {
        createAct: baseUrl + "/wxbargain/create/actId",
        getAct: baseUrl + "/wxbargain/get",
        getMember: baseUrl + "/wxbargain/get/part",
        bargain: baseUrl + "/wxbargain/bargain",
        successShare: baseUrl + "/wxbargain/save/retweet",
        buy: baseUrl + "/wxbargain/sale"
    };


    var Bargain = {
        _init: function () {
            var _self = this;
            _self.pageSize = 6;
            _self.$AnimateMask = $(".jAnimate");
            _self.$jActiveRule = $('#jActiveRule');
            _self.$btnBox = $(".btn-box");
            _self.$timeStamp = $(".jTimeStamp ");
            _self.$goodsPicImg = $(".jGoodsPic");
            _self.$goodsDesc = $(".jGoodsDesc");
            _self.$ActPicImg = $(".jActPic");
            _self.$Nodes = $(".jNodes");
            _self.$startPri = _self.$Nodes.find(".start-node .rule-pic");
            _self.$progressNode = $(".jProgress-node");
            _self.$memberList = $(".jmemberList");
            // _self.$moreBtn = $(".jMoreBtn");
            _self.$listCount = $(".jListCount");
            _self.$okBtn = $(".jOk");
            _self.$BText = $(".jBtext span");
            _self.$Guide = $(".jGuide");   //引导分享容器

            //_self._initAct();
            //判断是不是微信浏览器
            if (_self._isWeixin()) {
                _self.currentUrl = window.location.href;
                _self._initAct();
            } else {
                dialog.tips('不支持的浏览器！请切换到微信浏览器6.0以上版本');
            }
        },

        _resetData: function (callback) {
            var _self = this;
            _self.isCreateAct = _self._isCreate();
            var urlStr, param;
            if (_self.isCreateAct) {
                //自己创建，
                urlStr = urlMap.createAct;
                param = {
                    actId: _self._getUrlParam("actId"),
                    goodsId: _self._getUrlParam("goodsId")
                };
            } else {
                //帮人砍价
                urlStr = urlMap.getAct;
                param = {
                    uuid: _self._getUrlParam("uuid")
                };
            }

            io.jsonp(urlStr, param, function (result) {
                var code = result._error ? result._error.code : "";
                if (code == 600) {
                    _self._login();
                } else {
                   // console.log(result);
                    _self.actData = result;
                    callback && callback();
                }
            }, function (e) {
                dialog.tips(e.msg);
            });
        },

        _login: function () {
            cookie('_bbgReferer', window.location.href, {
                path: '/',
                domain: 'yunhou.com',
                expires: 0.2
            });
            window.location.href = 'https://ssl.yunhou.com/bubugao-passport/oauth2/weixin?type=h5&bind=false';
        },

        _reset: function () {
            var _self = this;
            //初始化成员列表滚动条
            _self._initScroll();
            //初始化时间显示
            _self._initActDate();
            //初始化商品显示
            _self._initGoods();
            //初始化砍价人员列表
            _self._initMemberList();
            //绑定事件
            _self._bindEvents();
            //定时刷新,轮询
            //_self._polling();
            //初始化商品规则
            _self._initRule();
            //根据页面功能初始化按钮显示
            _self._initBtnStatus();
            //初始化微信接口
            _self._initWX();
        },

        _refresh: function () {
            var _self = this;
            //初始化商品规则
            _self._initRule();
            //初始化砍价人员列表
            _self._initMemberList();
            //根据页面功能初始化按钮显示
            _self._initBtnStatus();

        },

        _isCreate: function () {
            var _self = this;
            var uuId = _self._getUrlParam("uuid");
            if (!uuId) {
                return true;
            } else {
                return false;
            }
        },

        _getUrlParam: function (paramStr) {
            var reg = new RegExp("(^|&)" + paramStr + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },

        _initAct: function () {
            var _self = this;
            _self._resetData(function () {
                _self._reset();
            });
        },

        _isOutTime: function (str) {
            str = str.replace(/-/g, "/");
            var date = (new Date(str)).getTime();
            var currentData = (new Date()).getTime();
            return date > currentData ? false : true;
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
                            jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo","showAllNonBaseMenuItem"]
                        });
                        wx.ready(function () {
                            var urlStr = "http://m.yunhou.com/bargain.html?uuid=" + _self.actData.uuid;
                            var ms = {
                                title: _self.actData.shareTitle, // 分享标题
                                desc: _self.actData.shareContent, // 分享描述
                                link: urlStr, // 分享链接
                                imgUrl: "http:"+_self.actData.sharePic, // 分享图标
                                success: function (res) {
                                    //可能需要做事情
                                    io.jsonp(urlMap.successShare, {
                                        uuid: _self.actData.uuid
                                    }, function (result) {

                                    }, function (e) {
                                        dialog.tips(e.msg);
                                    });
                                }
                            };
                            wx.showAllNonBaseMenuItem();
                            wx.onMenuShareTimeline(ms);
                            wx.onMenuShareAppMessage(ms);
                            wx.onMenuShareQQ(ms);
                            wx.onMenuShareWeibo(ms)
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

        _initScroll: function () {
            var _self = this;
            var $ul = _self.$memberList.find("ul");
            _self.$scrollUp = $ul.find(".jup");
            _self.$scrollDown = $ul.find(".jdown");
            _self.myScroll = new IScroll('.jmemberList', {
                probeType: 2,
                mouseWheel: true,
                startY: -60,
                bindToWrapper: true,
                useTransition: false,
                click: false

            });
            _self.myScroll.on("scroll", function () {
                if ($ul.height() - _self.$memberList.height() + this.y <= -40) {
                    if (this.member_isScrolling && !this.member_isLoading) {
                        this.member_isLoading = true;
                        if (!_self.$scrollDown.hasClass("disabled")) {
                            _self.$scrollDown.addClass("show-loading");
                        }
                    }
                }
                if (this.y > 40) {
                    if (this.member_isScrolling && !this.member_isLoading) {
                        this.member_isLoading = true;
                        if (!_self.$scrollUp.hasClass("disabled")) {
                            _self.$scrollUp.addClass("show-loading");
                        }
                    }
                }
            });

            _self.myScroll.on("scrollStart", function () {
                this.member_isScrolling = true;
            });

            _self.myScroll.on("scrollEnd", function () {
                this.member_isScrolling = false;
                this.member_isLoading = false;
                if (!_self.$scrollUp.hasClass("disabled") && _self.$scrollUp.hasClass("show-loading")) {
                    _self._scrollData("down");
                    return;
                }
                if (!_self.$scrollDown.hasClass("disabled") && _self.$scrollDown.hasClass("show-loading")) {
                    _self._scrollData("up");
                    return;
                }
                //if (this.y == 0) {
                //    var $lis = _self.$memberList.find("ul .list-item");
                //    _self.myScroll.scrollToElement($lis[0], 500, null, null);
                //} else if (this.y == this.maxScrollY) {
                //    _self.myScroll.scrollTo(0, this.maxScrollY + _self.$scrollDown.height(), 500, null);
                //}
            });
        },

        _initActDate: function () {
            var _self = this;
            var strArr = [
                "<span>" + _self.actData.startTime + "</span>",
                "<span>&nbsp;至&nbsp;</span>",
                "<span>" + _self.actData.endTime + "</span>"
            ].join("");
            _self.$timeStamp.empty().append($(strArr));
        },

        _initGoods: function () {
            var _self = this;
            _self.$goodsPicImg.attr("src", _self.actData.goodsPic);
            _self.$goodsDesc.html(_self.actData.goodsDesc);
            _self.$ActPicImg.attr("src", _self.actData.headPic);
        },

        _initRule: function () {
            var _self = this;
            _self.$startPri.text(_self.actData.goodsPrice + "元");
            _self.$Nodes.find(".item-node").remove();
            var ruleData = _self.actData.awardRule;
            var limit = _self._getLimit(ruleData);
            var $indexCont = $("<div></div>");
            for (var i = 0; i < ruleData.length; i++) {
                var ArrStr = [
                    '<div class="rule-node item-node" style="width: ' + (ruleData[i].limit / limit.maxLimit) * 100 + '%"><div>',
                    '<span class="rule-pic">' + ruleData[i].goodsPrice + '元</span><br/>',
                    '<span class="stock-tips">剩' + ruleData[i].surGoodsCount + '件</span></div></div>'
                ].join("");
                $indexCont.append($(ArrStr));
            }
            _self.$Nodes.append($($indexCont.html()));
            //初始化进度条
            _self._initProgress(limit.minPrice);
        },

        _getLimit: function (ruleData) {
            var _self = this;
            var max = 0;
            var minprice = _self.actData.goodsPrice;
            for (var i = 0; i < ruleData.length; i++) {
                if (ruleData[i].limit >= max) {
                    max = ruleData[i].limit;
                }
                if (ruleData[i].goodsPrice <= minprice) {
                    minprice = ruleData[i].goodsPrice;
                }
            }
            return {
                maxLimit: max,
                minPrice: minprice
            };
        },

        _initProgress: function (minPrice) {
            var _self = this;
            var maxPrice = _self.actData.goodsPrice;
            var bargainPrice = _self.actData.bargainPrice;
            var percent = bargainPrice / (maxPrice - minPrice);
            _self.$progressNode.css({
                width: (percent >= 1 ? 1 : percent <= 0.05 ? 0.05 : percent) * 100 + "%"
            });
            _self.$progressNode.find(".tips span").text(bargainPrice);
        },

        _initBtnStatus: function () {
            var _self = this;
            var ruleData = _self.actData.awardRule;
            var limit = _self._getLimit(ruleData);
            //start   after-start  other  during  late  end other-join
            //private boolean bargainAready;// 是否已经砍价
            //private boolean saleAready;// 是否已经出售
            //private boolean selfActivity;// 是否为自己活动
            _self.$btnBox.removeClass("start after-start other during late end other-join"); //清除所有的关联样式
            if (_self._isOutTime(_self.actData.endTime)) {
                //活动结束
                _self.$btnBox.addClass("end");
                return;
            }else if (_self.actData.selfActivity) {
                //自己砍价
                if (_self.actData.saleAready) {
                    //已经销售
                    _self.$btnBox.addClass("late");
                    if(_self.actData.awardWay == 1){
                        _self.$btnBox.find(".late-box .btn-r").removeClass("disabled").find(".btn-txt").text("前往购买 >>");
                    }
                    return;
                }

                if (!_self.actData.bargainAready) {
                    //自己还没有出手
                    if(_self.actData.bargainPrice >= _self.actData.awardRule[0].limit){
                        //如果已经可以出手
                        _self.$btnBox.addClass("during");
                    }else{
                        //还没有出手
                        _self.$btnBox.addClass("start");
                    }
                } else {
                    //大于第一个点的价格，可以出手
                    if (_self.actData.bargainPrice >= _self.actData.awardRule[0].limit) {
                        _self.$btnBox.addClass("during");
                    } else {
                        _self.$btnBox.addClass("after-start");
                    }
                }
                return;
            } else if (!_self.actData.selfActivity) {
                if (_self.actData.saleAready) {
                    //已经销售
                    _self.$btnBox.addClass("other-join");
                    return;
                }
                //帮别人砍价
                if (!_self.actData.bargainAready && limit.minPrice + _self.actData.bargainPrice < _self.actData.goodsPrice) {
                    //还没出手
                    _self.$btnBox.addClass("other");
                } else {
                    //已经出手
                    _self.$btnBox.addClass("other-join");
                }
            }
        },

        _getTipMessage: function () {

            var _self = this;
            var channels = _self.actData.channels;
            var channel = _self.actData.awardWayObj.channel;
            var tip = "已加入购物车，可在云猴网";
            if (channel && $.isArray(channel)) {
                for (var i = 0; i < channel.length; i++) {
                    tip += channels[channel[i]] + " ";
                }
            }
            tip += "进行支付";
            return tip;
        },

        _bindEvents: function () {
            //绑定相应按钮的事件
            var _self = this;
            var hasClick = false;

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

            //start
            _self.$btnBox.on("click", ".start-box .btn-r ,.other-box .btn-l", function () {
                _self._toggleAnimateRes(false);
                //砍价页面显示
                io.jsonp(urlMap.bargain, {
                    uuid: _self.actData.uuid
                }, function (result) {
                    _self.$BText.text(result.result);
                    _self._toggleAnimate(true);
                    setTimeout(function () {
                        _self._toggleAnimateRes(true);
                    }, 1500);
                }, function (e) {
                    dialog.tips(e.msg);
                    _self._toggleAnimate(false);
                    _self._toggleAnimateRes(false);
                });
            });//开始砍砍砍
            //after-start

            _self.$btnBox.on("click", ".other-box .btn-r", function () {
                window.location.href = "http://m.yunhou.com/bargain-index.html?actId=" + _self.actData.actId;
            }); //我也要参与

            // during        砍价到一阶段
            _self.$btnBox.on("click", ".during-box .btn-l", function () {
                //立即出手
                if(hasClick){
                    return ;
                }
                hasClick = true;

                if (_self.actData.awardWay == 1 || _self.actData.awardWay == 2) {

                    //选择h5支付方式
                    io.jsonp(urlMap.buy, {
                        uuid: _self.actData.uuid,
                        userInfo:JSON.stringify({
                            awardWay: _self.actData.awardWay
                        })
                    }, function (result) {
                        //购买成功的提示
                        hasClick = false;
                        if(_self.actData.awardWay == 1){
                            dialog.tips("成功出手！！", function () {
                                window.location.href = "http://m.yunhou.com/item/" + _self.actData.goodsId + ".html";
                            });
                        }else{
                            //领奖方式为2的时候，给出提示
                            dialog.tips(_self._getTipMessage());
                        }
                        _self._resetData(function () {
                            _self._refresh();
                        });
                    }, function (e) {
                        hasClick = false;
                        dialog.tips(e.msg);
                    });
                } else {
                    hasClick = false;
                    window.location.href = "http://m.yunhou.com/bargain-take.html?uuid=" + _self.actData.uuid;
                }
            });

            _self.$btnBox.on("click", ".during-box .btn-r ,.after-start-box .btn-r", function () {
                //请好友帮忙砍价
                _self._toggleGuide(true);
            });

            _self.$btnBox.on("click", ".late-box .btn-r", function () {
                //请好友帮忙砍价
                if(_self.actData.awardWay == 1){
                    window.location.href = "http://m.yunhou.com/item/" + _self.actData.goodsId + ".html";
                }
            });

            _self.$okBtn.on("click", function (e) {
                e.stopPropagation();
                _self._toggleAnimate(false);
                _self._toggleAnimateRes(false);
                //刷新数据
                _self._resetData(function () {
                    _self._refresh();
                });
            });

            _self.$Guide.on("click", function (e) {
                e.stopPropagation();
                _self._toggleGuide(false);
            });

        },

        _initMemberList: function () {
            var _self = this;
            var param = {
                uuid: _self.actData.uuid,
                sinceId: "",  //查最新的
                maxId: "",   //查历史
                pageSize: _self.pageSize
            };
            _self._getMember(param, "up", function (result) {
                //清空滚动条容器中的所有成员dom对象
                var $lis = _self.$memberList.find("ul .list-item");
                if ($lis.length != 0) {
                    $lis.remove();
                }
                //重置滚动状态容器的状态
                _self._resetScroll(result);
            });
        },

        _scrollData: function (scrollType) {
            var _self = this;
            var $lis = _self.$memberList.find("ul .list-item");
            var $this = scrollType == "up" ? _self.$scrollDown : _self.$scrollUp;
            var param = {
                uuid: _self.actData.uuid,
                sinceId: scrollType == "down" ? $lis.eq(0).attr("data-id") : "",  //查最新的
                maxId: scrollType == "up" ? $lis.eq($lis.length - 1).attr("data-id") : "",   //查历史
                pageSize: _self.pageSize
            };
            _self._getMember(param, scrollType, function (result) {
                $this.removeClass("show-loading");
                if (result.list.length == 0) {
                    $this.find("span").text("没有更多数据了");
                    _self.member_isLoading = true;
                    setTimeout(function () {
                        _self.member_isLoading = false;
                        $this.addClass("disabled");
                        _self.myScroll.refresh();
                        //当没有数据的时候滚动条的复位逻辑
                        if (scrollType == "down" && _self.myScroll.y == 0) {
                            _self.myScroll.scrollToElement($lis[0], 500, null, null);
                        } else {
                            if (_self.myScroll.maxScrollY == _self.myScroll.y) {
                                _self.myScroll.scrollTo(0, _self.myScroll.maxScrollY + $this.height(), 500, null);
                            }
                        }
                    }, 2500);
                }
            }, function (msg) {
                $this.removeClass("show-loading");
                $this.find("span").text(msg);
                _self.member_isLoading = true;
                setTimeout(function () {
                    _self.member_isLoading = false;
                    $this.find("span").text("");
                    if (scrollType == "down") {
                        _self.myScroll.scrollToElement($lis[0], 500, null, null);
                    } else {
                        _self.myScroll.scrollTo(0, _self.myScroll.maxScrollY + $this.height(), 500, null);
                    }
                }, 2500);
            });
        },

        _getMember: function (param, scrollType, callback, errorCallback) {
            var _self = this;
            io.jsonp(urlMap.getMember, param, function (result) {
                //重置滚动条状态
                if (callback) {
                    callback(result);
                }
                //数据对象添加到滚动容器中去
                _self._addMember(result, scrollType);
            }, function (e) {
                if (errorCallback) {
                    errorCallback(e.msg)
                } else {
                    dialog.tips(e.msg);
                }

            });
        },

        _resetScroll: function (result) {
            var _self = this;
            var total = result.total;
            if (total <= _self.pageSize) {
                //隐藏
                _self.$scrollUp.addClass("disabled");
                _self.$scrollDown.addClass("disabled");
            } else {
                //显示
                _self.$scrollUp.removeClass("disabled");
                _self.$scrollDown.removeClass("disabled");
            }
        },

        _addMember: function (memberData, scrollType) {
            var _self = this;
            //更新显示总数
            _self.$listCount.text(memberData.totalCount);
            if (memberData.list && memberData.list.length != 0) {
                //添加数据
                var $members = _self._getMemberItem(memberData.list);
                if (scrollType == "up") {
                    _self.$scrollDown.before($members);
                } else {
                    _self.$scrollUp.after($members);
                }
                _self.myScroll.refresh();
            }
        },

        _getMemberItem: function (memberList) {
            var $cont = $("<div></div>");
            for (var i = 0; i < memberList.length; i++) {
                var headUrl = memberList[i].headImg?memberList[i].headImg+"!s2" :'//s1.bbgstatic.com/gshop/images/topic/bargain/undefined.png';
                var itemStr = [
                    '<div class="list-item" data-id="' + memberList[i].id + '"><div class="head-pic"><div class="pic-out">',
                    '<img src="' +headUrl + '"/>',
                    '</div></div><div class="m-c">',
                    '<span class="help-name">' + memberList[i].weChatName + '</span>',
                    '<span>&nbsp;帮忙砍掉了',
                    '<span class="help-val">' + memberList[i].bargainPrice + '</span>元',
                    '</span></div></div>'
                ].join("");
                $cont.append($(itemStr));
            }
            return $cont.find(".list-item");
        },

        _toggleAnimate: function (flag) {
            var _self = this;
            _self.$AnimateMask[flag ? "addClass" : "removeClass"]("showBargain");
        },

        _toggleAnimateRes: function (flag) {
            var _self = this;
            _self.$AnimateMask[flag ? "addClass" : "removeClass"]("showRes");
        },

        _polling: function () {
            //定时刷新
            var _self = this;
            var timer = function () {
                //更新显示成员列表
                var $lists = _self.$memberList.find("ul .list-item");
                _self._getMember({
                    uuid: _self.actData.uuid,
                    sinceId: $lists.length == 0 ? "" : $lists.eq(0).attr("data-id"),  //查最新的
                    maxId: "",   //查历史
                    pageSize: _self.pageSize
                }, "down", function () {
                    var $lis = _self.$memberList.find("ul .list-item");
                    _self.myScroll.scrollToElement($lis[0], 500, null, null);
                });
                setTimeout(timer, pollingTime);
            };
            setTimeout(timer, pollingTime);
        },

        _Timer: null,

        _toggleGuide: function (flag) {
            var _self = this;
            _self.$Guide[flag ? "addClass" : "removeClass"]("show-guide");
            if (flag) {
                clearTimeout(_self._Timer);
                _self._Timer = setTimeout(function () {
                    if (_self.$Guide.hasClass("show-guide")) {
                        _self._toggleGuide(false);
                    }
                }, 3000);
            }
        }
    };

    Bargain._init();
});
