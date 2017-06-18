define(function (require, exports, module) {
    'use strict';

    require("common/base/template");
    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cookie = require("common/kit/io/cookie");
    var Lazyload = require('common/widget/lazyload');
    var dialog = require('common/ui/dialog/dialog');
    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');
    var baseUrl = "http://api.cart.yunhou.com";

    var urlMap = {
        getAct: baseUrl + "/wxbargain/award",
        buy: baseUrl + "/wxbargain/sale"
    };


    var BargainTake = {

        _init: function () {
            var _self = this;
            _self.$jActiveRule = $('#jActiveRule');
            _self.$timeStamp = $(".jTimeStamp ");
            _self.$ActPicImg = $(".jActPic");
            _self.uuid = _self._getUrlParam("uuid");
            _self.$poster = $(".jposter");
            _self.$infoContent = $(".jInfo");
            _self.$goodsContent = $(".jAcGoods");
            _self.$sub = $(".jbtnBox");
            _self._initAct();
        },

        _resetData: function (callback) {
            var _self = this;
            io.jsonp(urlMap["getAct"], {
                uuid: _self.uuid
            }, function (result) {
                if (result._error) {
                    //请求出错了
                    dialog.tips(result._error.msg);
                } else {
                    _self.actData = result;
                    callback && callback();
                }
            }, function (e) {
                dialog.tips(e.msg);
            });
        },

        _initAct: function () {
            var _self = this;
            _self._resetData(function () {
               // console.log(_self.actData);
                if (_self.actData) {
                    _self.$ActPicImg.attr("src", _self.actData.headPic);
                }
                //初始化tipMessage
                _self._initTipMessage();
                //初始化时间显示
                _self._initActDate();
                //初始化商品数据
                _self._initGoods();
                //初始化info
                _self._initForm();
                //初始化广告图
                _self._initPoster();
                //绑定事件
                _self._bindEvents();
            });
        },

        _initActDate: function () {
            var _self = this;
            if (_self.actData) {
                var strArr = [
                    "<span>" + _self.actData.startTime + "</span>",
                    "<span>&nbsp;至&nbsp;</span>",
                    "<span>" + _self.actData.endTime + "</span>"
                ].join("");
                _self.$timeStamp.empty().append($(strArr));
            }
        },

        _initTipMessage: function () {
            var _self = this;
            var awardWay = _self.actData.awardWay;
            var channels = _self.actData.channels;
            var channel = _self.actData.awardWayObj.channel;
            var tip = "已加入购物车，可在云猴网";
            if (channel && $.isArray(channel)) {
                for (var i = 0; i < channel.length; i++) {
                    tip += channels[channel[i]] + " ";
                }
            }
            tip += "进行支付";
            _self.tipMessage = {
                success: awardWay == 2 ? tip : "信息已经提交，请耐心等待客服联系领取奖品！",
                error: "网络异常，提交失败"
            }
        },

        _initGoods: function () {
            var _self = this;
            var $goodsItem = $(template.render('goodsItemTpl', _self.actData));
            $goodsItem.appendTo(_self.$goodsContent);
        },

        _initForm: function () {
            var _self = this;
            if (_self.actData) {
                var userInfoArr = _self.actData.awardWayObj.userInfos;
                var domStr = "";
                for (var i = 0; i < userInfoArr.length; i++) {
                    if (userInfoArr[i] == 1) {
                        domStr += '<input type="text"  data-type="phone" placeholder="手机号" />';
                    } else if (userInfoArr[i] == 2) {
                        domStr += '<input type="text"  data-type="name" placeholder="姓名" />';
                    } else if (userInfoArr[i] == 3) {
                        domStr += '<input type="text"  data-type="addr" placeholder="省市区" />';
                        domStr += '<input type="text"  data-type="addr" placeholder="详细地址" />';
                    }
                }
                var $goodsItem = $(domStr);
                //添加判断，
                var phone = _self.actData.phone;
                if (phone) {
                    $goodsItem.filter("input[data-type='phone']").val(phone).attr("readonly", true);
                }
                _self.$infoContent.append($goodsItem);
            }
        },

        _initPoster: function () {
            var _self = this;
            if (_self.actData) {
                _self.$poster.find("a").attr("href", _self.actData.awardWayObj.adUrl);
                _self.$poster.find("img").attr("src", _self.actData.awardWayObj.adPic.replace(/!s2/g, ""));
            }
        },

        _bindEvents: function () {
            //绑定相应按钮的事件
            var _self = this;
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

            _self.$infoContent.on("focusout", "input", function () {
                var $this = $(this);
                var thisVal = $.trim($this.val());
                if (thisVal.length != 0) {
                    $this.removeClass("error");
                }
            });
            _self.$sub.on("click", function () {
                var $phone = _self.$infoContent.find("input[data-type='phone']");
                var $name = _self.$infoContent.find("input[data-type='name']");
                var $addr = _self.$infoContent.find("input[data-type='addr']");
                if (!_self._formValidate($phone, $name, $addr)) {
                    return;
                }
                var subData = {
                    userInfo: {
                        "phone": $phone.length != 0 ? $.trim($phone.val()) : "",
                        "name": $name.length != 0 ? $.trim($name.val()) : "",
                        "addr": "",
                        awardWay: _self.actData.awardWay
                    },
                    uuid: _self.uuid
                };
                if ($addr.length !== 0) {
                    subData.userInfo.addr += $.trim($addr.eq(0).val()) + " ";
                    subData.userInfo.addr += $.trim($addr.eq(1).val());
                }
                subData.userInfo = JSON.stringify(subData.userInfo);
                io.jsonp(urlMap["buy"], subData, function (res) {
                    if (res._error) {
                        dialog.tips(res._error.msg || _self.tipMessage.error, function () {
                            window.location.href = "http://m.yunhou.com";
                        });
                    } else {
                        dialog.tips(_self.tipMessage.success, function () {
                            window.location.href = "http://m.yunhou.com/bargain.html?uuid=" + _self.uuid;
                        });
                    }
                }, function (e) {
                    dialog.tips(e.msg);
                });
            });
        },

        _formValidate: function ($phone, $name, $addr) {
            var _self = this;
            var passed = true;
            var validate = function (str) {
                return /^1\d{10}$/.test(str);
            };
            if ($phone.length != 0) {
                var thisVal = $.trim($phone.val());
                if (thisVal.length == 0) {
                    passed = false;
                    $phone.addClass("error");
                } else {
                    if (!validate(thisVal)) {
                        passed = false;
                        dialog.tips("手机号格式不正确");
                        $phone.addClass("error");
                        return false;
                    }
                }
            }
            if ($name.length != 0) {
                var thisVal = $.trim($name.val());
                if (thisVal.length == 0) {
                    passed = false;
                    $name.addClass("error");
                }
            }
            if ($addr.length != 0) {
                for (var i = 0; i < $addr.length; i++) {
                    var thisVal = $addr.eq(i).val();
                    if (thisVal.length == 0) {
                        passed = false;
                        $addr.eq(i).addClass("error");
                    }
                }
            }
            if (!passed) {
                dialog.tips("输入不能为空");
            }
            return passed;
        },

        _isWeixin: function () {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
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
        }
    };

    BargainTake._init();
});
