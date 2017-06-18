define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');
    
//    require('pub/plugins/jquery.cookie');
//    var isLogin = $.cookie('_nick');
    var isLogin = true;
    if (!isLogin) {
        Dialog.alert({
            cnt: '请先登录。'
        });
        return;
    }

    // @Added by xiexuan at 2015-07-08 16:56
    var obtainCountUrl = 'http://api.mall.yunhou.com/Sweepstakesx/getSwee?callback=123';
    var obtainWinUrl = 'http://api.mall.yunhou.com/Sweepstakesx/index?callback=123';
    var obtainMyAwardsUrl = 'http://api.mall.yunhou.com/Sweepstakesx/getMy?callback=123';
    var obtainAwardsUrl = 'http://api.mall.yunhou.com/Sweepstakesx/getLogs';
    var isForApp = false;
    var fromPrizeToType = function(prize) {
        var prizeAndTypeMap = {
            1 : 7,
            2 : 6,
            3 : 5,
            4 : 4,
            5 : 3,
            6 : 2,
            7 : 1,
            8 : 0
        };
        var type = prizeAndTypeMap[prize];
        return type;
    }

    //滚动效果
    var isScrolling;
    var scrool=function(){
        var blo3=$(".blo3 .module"),$ul=blo3.find('ul');

        var tp = 0;
        function _async(){
            if(-tp>=parseInt($ul.height()/2)){
                tp = 0;
            }else{
                tp=tp-2;
            }
            $ul.css('top',tp);
        }

        var clone=$(".blo3 .module li").clone()
        $ul.append(clone)
        if(isScrolling){
            clearInterval(isScrolling)
        }
        isScrolling=setInterval(_async,150)
    };

    //抽奖信息
    var message=function(){
        var isGetlog;

        //获取抽奖信息
        if(!isGetlog&&(isGetlog=true)){
            io.jsonp(obtainAwardsUrl,{}, function(json) {
                var html="";
                $(json).each(function(k,v){
                    var str='<li>恭喜<%=u_name%>，抽中了<%=prizeName%></li>'.replace(/<%=(.+?)%>/g,function(m,p1){
                        return v[p1];
                    })
                    html+=str;
                });
                $(".blo3 .module ul").html(html);
                scrool();

            }, function(data) {
                Dialog.tips('网络错误，请重试！！');
            })

        }

    };
    message();

    //抽奖转动效果
    var donghua=function(type,callback){
        var isInit,isOnce3;
        var data={
            init:0,
            // 谢谢参与
            0:45 * 0.5 + Math.random()*30-15,
            // 5元无门槛优惠券
            1:45 * 1.5 + Math.random()*30-15,
            // 10元无门槛优惠券
            2:45 * 2.5 + Math.random()*30-15,
            // 免单
            3:45 * 3.5 + Math.random()*30-15,
            // 谢谢参与
            4:45 * 4.5 + Math.random()*30-15,
            // 10元无门槛优惠券
            5:45 * 5.5 + Math.random()*30-15,
            // 5元无门槛优惠券
            6:45 * 6.5 + Math.random()*30-15,
            // 价值3999海岛旅游
            7:45 * 7.5 + Math.random()*30-15
        }

        var async=function(){
            if(!isInit){
                isInit=true
                $("#zhuangp").animate({
                    rotate:0
                },0,function() {
                    async()
                });
                return;
            }
            if(!isOnce3){
                isOnce3=true;
                var reg=720+data[type];
                $("#zhuangp").animate({
                    rotate:""+reg+"deg"
                },reg*3,"swing",function(){
                    async()
                });
                return;
            }
            callback&&callback()
        }
        async()

    }

    //点击抽奖
    var choujiang=function(token){
        var isGetSwee;
        var count=0;
//        var token=token||"ff4b9600b719434983d3010b9a145d02";
        function _async(){
            //获取抽奖剩余次数
            if(!isGetSwee&&(isGetSwee=true)){
                io.jsonp(obtainCountUrl,{
                    token:token
                }, function(json) {
                    count=parseInt(json.count);
                    $("#chouj_num").text(count);
                    _async();
                }, function(data) {
                    Dialog.tips('网络错误，请重试！');
                });
                return;
            }
            var clicklock=false;
            $("#choujiang").on("click",function(e){
                if(!clicklock) {
                    clicklock = true;
                    if (count > 0) {

                        io.jsonp(obtainWinUrl, {
                            token: token
                        }, function (json) {
                            if (json._error) {
                                Dialog.tips(json.msg);
                                if (json._error.msg && json._error.msg.indexOf('活动已经结束') != -1) {
                                    $("#choujiang").remove();
                                }
                            } else {
                                // @Modified by xiexuan at 2015-07-08 18:17
                                var type = fromPrizeToType(json.prize);
                                donghua(type, function () {
                                    clicklock=false;
                                    if (json.is_prize) {
                                        Dialog.alert({
                                            cnt: json.msg
                                        });
                                        //更新中奖信息
                                        setTimeout(function () {
                                            getAppMy(token)
                                            message();
                                        }, 1000)
                                    } else {
                                        Dialog.alert(json.msg);
                                    }
                                    count = parseInt(json.count);
                                    $("#chouj_num").text(count);
                                })
                            }

                        }, function (data) {
                            Dialog.tips('网络错误，请重试！');
                        })

                    } else {
                        donghua(0, function () {
                            clicklock=false;
                        })
                        Dialog.alert('您已经不能抽奖了！');
                    }
                }

            })

        }
        _async();

    };

    //获取本人中奖情况
    var getAppMy=function(token){
        var isgetAppMy;

        //获取抽奖信息
        if(!isgetAppMy&&(isgetAppMy=true)){
            io.jsonp(obtainMyAwardsUrl,{
                token:token
            }, function(json) {
                if (json._error) {
                    Dialog.tips(json.msg);
                    $("#getAppMy").html('<li>您还没有中奖</li>');
                } else {
                    if ($.isArray(json.data) && json.data.length > 0) {
                        var html = "";
                        $(json.data).each(function (k, v) {
                            var str = '<li>恭喜您抽中 <%=title%></li>'.replace(/<%=(.+?)%>/g, function (m, p1) {
                                return v[p1];
                            })
                            html += str;
                        });
                        $("#getAppMy").html(html);
                    } else {
                        $("#getAppMy").html('<li>您还没有中奖</li>');
                    }
                }
            }, function(data) {
                Dialog.tips('网络错误，请重试！！');
            })

        }
    }

    // @Modified by xiexuan at 2015-07-08 18:37
    choujiang();
    getAppMy();
});

