BBGMobile = {
    Config:{
        funObjList:new Object()
    },
    User : {
        userid : null,
        token : null,
        system : null,
        ver : null
    },
    ready : function(callback) {
        BBGMobile.exe(callback);
    },
    readyUser : function(callback) {

        BBGMobile.exe(function(bbg) {
            bbg.Config.ready(callback);
        });
    },
    exe : function(callback) {// 鎵ц

        if (BBGMobile.isIOS()) {
            BBGMobile.IOS.ready(function() {
                callback.call(this, BBGMobile.IOS);
            });
        } else if (BBGMobile.isAndroid()) {
            BBGMobile.ANDROID.ready(function() {
                callback.call(this, BBGMobile.ANDROID);
            });
        }
    },
    Util:{
        getRandomKey:function(){
            return new Date().getTime()+"_"+(Math.random()*1000+1);
        }
    },
    isIOS : function() {
        if (/ipad|iphone|mac|iOS/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    },
    isAndroid : function() {
        if (/android/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    },
    IOS : {
        openCustomURLinIFrame : function(src) {

            var rootElm = document.documentElement;
            var newFrameElm = document.createElement("IFRAME");
            newFrameElm.setAttribute("src", src);
            newFrameElm.setAttribute("style","display:none;");
            rootElm.appendChild(newFrameElm);
            // remove the frame now
            // newFrameElm.parentNode.removeChild(newFrameElm);
        },
        calliOSFunction : function(functionName, args, successCallback, errorCallback) {
            var url = "BBGAPP://";
            var callInfo = {};
            callInfo.functionname = functionName;
            if (successCallback) {
                callInfo.success = successCallback;
            }
            if (errorCallback) {
                callInfo.error = errorCallback;
            }
            if (args) {
                callInfo.args = args;
            }
            url += JSON.stringify(callInfo);
            BBGMobile.IOS.openCustomURLinIFrame(url);
        },
        ready : function(callback) {

            callback.call(this, BBGMobile.IOS);
        },
        Config : {
            ready : function(callback) {
                var callbackName="";
                var callbackMethodKey="";
                if(typeof callback=='string'){
                    callbackName=callback;
                }

                if((typeof callback=='function')){
                    callbackMethodKey = BBGMobile.Util.getRandomKey();

                    BBGMobile.Config.funObjList[callbackMethodKey]=callback;
                }
                var data = {
                    "funName" : "BBGMobile.IOS.Config.init",
                    "callbackMethod" : callbackName,
                    "callbackMethodKey":callbackMethodKey
                };
                BBGMobile.IOS.calliOSFunction("ready", data);
            },
            init : function(info) {
                info = JSON.parse(info);
                BBGMobile.User.userid = info.userid;
                BBGMobile.User.token = info.token;
                BBGMobile.User.system = info.system;
                var method = info.callbackMethod;
                var callbackMethodKey = info.callbackMethodKey;
                if(callbackMethodKey){
                    var funMethod= BBGMobile.Config.funObjList[callbackMethodKey];
                    funMethod.call(this,BBGMobile.User);
                    BBGMobile.Config.funObjList[callbackMethodKey]=undefined;
                }else{
                    var funMethod = method + "(BBGMobile.User)";
                    eval(funMethod);
                }
            }
        },
        Trade : {
            webPaySuccess : function(orderid, totalAmount, quantity, payType, other) {
                var data = {
                    "orderid" : orderid,
                    "totalAmount" : totalAmount,
                    "quantity" : quantity,
                    "payType" : payType,
                    "other" : other
                };
                BBGMobile.IOS.calliOSFunction("webPaySuccess", data);
            }
        },
        Goods : {
            productIndex : function(prdouctid, shopid) {
                if (!shopid) {
                    shopid = "1";
                }
                var data = {
                    "prdouctid" : prdouctid,
                    "shopid" : shopid
                };
                BBGMobile.IOS.calliOSFunction("goodsProductIndex", data);
            },
            tgIndex : function(prdouctid, shopid) {
                if (!shopid) {
                    shopid = "1";
                }
                var data = {
                    "prdouctid" : prdouctid,
                    "shopid" : shopid
                };
                BBGMobile.IOS.calliOSFunction("goodsTgIndex", data);
            }
        },
        system:{
            setTitle:function(title){
                var data={
                    title:encodeURI(title)
                };
                BBGMobile.IOS.calliOSFunction("xTitle", data);
            }
        },
        user:{

        },
        view:{
            login:function(callback){
                var data={
                    "funName" : ""
                };
                if(callback){
                    var callbackName="";
                    var callbackMethodKey="";
                    if((typeof callback=='function')){
                        callbackMethodKey = BBGMobile.Util.getRandomKey();
                        BBGMobile.Config.funObjList[callbackMethodKey]=callback;
                    }
                    data = {
                        "funName" : "BBGMobile.IOS.Config.init",
                        "callbackMethod" : callbackName,
                        "callbackMethodKey":callbackMethodKey
                    };

                }
                BBGMobile.IOS.calliOSFunction("vLogin", data);
            },
            item:function(prdouctid){
                if(!prdouctid){
                    return ;
                }
                var data = {
                    prdouctid:prdouctid
                };
                BBGMobile.IOS.calliOSFunction("vItem", data);
            },
            comment:function(goodsid){
                if(!goodsid){
                    return ;
                }
                var data = {
                    goodsid:goodsid
                };
                BBGMobile.IOS.calliOSFunction("vComment", data);
            },
            plike:function(goodsid){
                if(!goodsid){
                    return ;
                }
                var data = {
                    goodsid:goodsid
                };
                BBGMobile.IOS.calliOSFunction("vPLike", data);
            }
        }
    },
    ANDROID : {
        ready : function(callback) {
            if (window.AndroidJavascriptBridge) {
                callback.call(this, BBGMobile.ANDROID);
            }
        },
        Config : {
            ready : function(callback) {
                var callbackName="";
                var callbackMethodKey="";
                if(typeof callback=='string'){
                    callbackName=callback;
                }
                if((typeof callback=='function')){
                    callbackMethodKey = BBGMobile.Util.getRandomKey();
                    BBGMobile.Config.funObjList[callbackMethodKey]=callback;
                }
                if (AndroidJavascriptBridge && AndroidJavascriptBridge.ready) {
                  if(typeof callback=='string'){
                      AndroidJavascriptBridge.ready("BBGMobile.ANDROID.Config.init",callbackName);
                   }else{
                      AndroidJavascriptBridge.ready("BBGMobile.ANDROID.Config.init", callbackName,callbackMethodKey);
                   }
                }
            },
            init : function(info) {

                info = JSON.parse(info);
                BBGMobile.User.userid = info.userid;
                BBGMobile.User.token = info.token;
                BBGMobile.User.system = info.system;
                var method = info.callbackMethod;
                var callbackMethodKey = info.callbackMethodKey;
                if(callbackMethodKey){
                    var funMethod= BBGMobile.Config.funObjList[callbackMethodKey];
                    funMethod.call(this,BBGMobile.User);
                    BBGMobile.Config.funObjList[callbackMethodKey]=undefined;
                }else{
                    var funMethod = method + "(BBGMobile.User)";
                    eval(funMethod);
                }
            }
        },
        view:{
            login:function(callback){
                var callbackName="";
                var callbackMethodKey="";
                if(callback){
                    if((typeof callback=='function')){
                        callbackMethodKey = BBGMobile.Util.getRandomKey();
                        BBGMobile.Config.funObjList[callbackMethodKey]=callback;
                    }
                }
                AndroidJavascriptBridge.vLogin("BBGMobile.ANDROID.Config.init", callbackName,callbackMethodKey);
            },
            item:function(prdouctid){
                if(!prdouctid){
                    return ;
                }
                AndroidJavascriptBridge.vItem(prdouctid);
            },
            comment:function(goodsid){
                if(!goodsid){
                    return ;
                }
                AndroidJavascriptBridge.vComment(goodsid);
            },
            plike:function(goodsid){
                if(!goodsid){
                    return ;
                }
                AndroidJavascriptBridge.vPLike(goodsid);
            }
        },
        Trade : {
            webPaySuccess : function(orderid, totalAmount, quantity, payType, other) {
                AndroidJavascriptBridge.webPaySuccess(orderid, totalAmount, quantity, payType, other);
            }
        },
        Goods : {
            productIndex : function(prdouctid, shopid) {
                if (!shopid) {
                    shopid = "1";
                }
                AndroidJavascriptBridge.goodsProductIndex(prdouctid, shopid);
            },
            tgIndex : function(prdouctid) {
                if (!shopid) {
                    shopid = "1";
                }
                AndroidJavascriptBridge.goodsTgIndex(prdouctid);

            }
        }
    }
};

