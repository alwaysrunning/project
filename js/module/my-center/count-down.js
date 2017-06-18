/**
 * 倒计时效果
 * @author Liang Youyu (2015、1、29)
 * ps:仅支持24小时之内的倒计时，格式 hh:mm:ss
 * <html>12:30:03</html>
 */
define(function(require, exports, module) {
    'use strict';
    var timeEndTest = function(dataArray){
        for(var j = 0;j<dataArray.length;j++){
            if(dataArray[j] !=undefined&& parseInt(dataArray[j-1])>0){
                return false;
            }
        }
        return true;
    }
    // 处理高位减1
    var dealCountDown = function(dataArray){
        dataArray[dataArray.length-1] = "59"
        for(var k = dataArray.length-2 ; k>=0 ;k--){
            if(dataArray[k]!=undefined && parseInt(dataArray[k]) > 0){
                dataArray[k] = dataArray[k]-1;
                break;
            }
            else if(parseInt(dataArray[k]) == 0)
            {
                dataArray[k] = 59;
            }
        }
        return dataArray;
    }
    var timeStepRun = function($dom,dataArray,callback){
        var overFlg = false;
        var i = dataArray.length - 1;
        // 当前位>1
        if(parseInt(dataArray[i]) > 1){
            dataArray[i] = dataArray[i]-1;
        }
        // 当前位为1 倒计时后变为0 有可能结束倒计时
        else if( parseInt(dataArray[i]) > 0){
            dataArray[i] = 0;
            // 倒计时结束
            if(timeEndTest(dataArray)){
                overFlg = true;
            }
        }
        // 当前位为0 倒计时后变为59 有可能结束倒计时
        else{
            // 倒计时结束检查
            if(timeEndTest(dataArray)){
                overFlg = true;
            }
            else
            {
                dataArray = dealCountDown(dataArray);
            }
        }

        if(overFlg){
            callback?callback():null;
        }
        else
        {
            var domString = [];
            for(var y =0 ; y< dataArray.length;y++){
                if(parseInt(dataArray[y])<10){
                    domString.push("0" + parseInt(dataArray[y]).toString());
                }
                else
                {
                    domString.push(dataArray[y]);
                }
            }
            $dom.children("span").text(domString.join(":"));
            setTimeout(function(){
                timeStepRun($dom,dataArray,callback);
            },1000);
        }
    }
    // 倒计时处理函数 已经执行过的dom会加上 node-init属性，倒计时结束后调用callback
    exports.init = function(dom,callback){
        var $dom = $(dom);
        if($dom.attr("node-init")){
            return;
        }
        else
        {
            $dom.attr("node-init","1");
            var string = $dom.children("span").text().trim();
            var dataArray = string.split(":");
            if(dataArray.length>1){
                 setTimeout(function(){
                    timeStepRun($dom,dataArray,callback);
                },500);
            }
        }
    }
});