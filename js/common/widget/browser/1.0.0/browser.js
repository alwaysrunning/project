define(function(require, exports, module) {
    'use strict';
    
    var URLUtil = require('common/widget/url/1.0.0/url')
    
    var BrowserUtil = {
        isAndroid : function() {
            var agent = navigator.userAgent.toLowerCase();
            var isAndroid = (agent.match(/android/i) == "android");
            return isAndroid;
        },
        isApp : function() {
            if (window.AndroidJavascriptBridge) {
                return true;
            }
            
            var isIOS = (navigator.userAgent.indexOf('iOSGlobal') > -1);
            if (isIOS) {
                return true;
            }
            
            var clientArg = URLUtil.getParameter('client');
            if (clientArg == 'app') {
                return true;
            }
            
            return false;
        },
        isWeixin : function() {
            var navigator = window.navigator;
            var userAgent = navigator.userAgent;
            userAgent = userAgent.toLowerCase();
            if (userAgent.match(/micromessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
    };
    
    return BrowserUtil;
});
