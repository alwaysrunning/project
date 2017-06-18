define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');

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
            io.jsonp("http://api.mall.yunhou.com/Sweepstake/getLogs",{}, function(json) {
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
            //谢谢参与
            0:(Math.random()>0.5?65:245)+Math.random()*30-15,
            //明星签名CD
            1:20+Math.random()*30-15,
            //50元直邮无门槛优惠券
            2:110+Math.random()*30-15,
            //2元自营无门槛优惠券
            3:155+Math.random()*30-15,
            //明星演唱会门票
            4:200+Math.random()*30-15,
            //20元自营优惠券满200可用
            5:290+Math.random()*30-15,
            //云候全球购定制8gbU盘
            6:335+Math.random()*30-15
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
                isOnce3=true
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
                io.jsonp("http://api.mall.yunhou.com/Sweepstake/appGetSwee",{
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

                        io.jsonp("http://api.mall.yunhou.com/Sweepstake/appIndex", {
                            token: token
                        }, function (json) {
                            if (json._error) {
                                Dialog.tips(json._error.msg);
                            } else {
                                var type = json.type
                                donghua(type, function () {
                                    clicklock=false;
                                    if (json.is_prize) {
                                        Dialog.alert({
                                            cnt: "恭喜您" + "<br><br>" + json.msg
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
            io.jsonp("http://api.mall.yunhou.com/Sweepstake/getAppMy",{
                token:token
            }, function(json) {
                if (json._error) {
                    Dialog.tips(json._error.msg);
                    $("#getAppMy").html('<li>你还没有中奖</li>');
                } else {
                    if ($.isArray(json.data) && json.data.length > 0) {
                        var html = "";
                        $(json.data).each(function (k, v) {
                            var str = '<li><%=title%></li>'.replace(/<%=(.+?)%>/g, function (m, p1) {
                                return v[p1];
                            })
                            html += str;
                        });
                        $("#getAppMy").html(html);
                    } else {
                        $("#getAppMy").html('<li>你还没有中奖</li>');
                    }
                }
            }, function(data) {
                Dialog.tips('网络错误，请重试！！');
            })

        }
    }

    //是否调试模式
    BBGMobile.ready(function(bbg) {
        BBGMobile.readyUser(function (user) {
            //如果登录，就start
            if (user.token) {
                choujiang(user.token);
                getAppMy(user.token)
            }else{
                //如果没有，定时循环判断
//                $("#choujiang").on("click",function(){
//                    bbg.view.login(function(){
//                        isUserlogin()
//                    });
//                })
            }
        })
    })
    //定时循环判断是否登录
    function isUserlogin(){
        BBGMobile.readyUser(function (user) {
            if (user.token) {
//                $("#choujiang").off("click")
                choujiang(user.token);
                getAppMy(user.token)
            }else{
                setTimeout(isUserlogin,1000)
            }
        })
    }





});

