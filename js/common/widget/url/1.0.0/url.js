define(function(require, exports, module) {
    'use strict';
    
    var $ = require('jquery');
    var StringUtil = require('common/widget/string/1.0.0/string');
    
    var URLUtil = {
        getCurrentURL   : function() {
            return window.location.href;
        },
        encodeString : function(string) {
            var encodedString = encodeURIComponent(string);
            return encodedString;
        },
        appendParameterMap  : function(newOption) {
            var resultOption = $.extend({
                'sourceURL' : undefined,
                'parameterMap' : undefined,
                'neededEncoded' : true
            }, newOption);
            
            var sourceURL = resultOption.sourceURL;
            var resultURL = sourceURL;
            
            if (sourceURL.indexOf('?') == -1) {
                resultURL += '?';
            } else if (sourceURL.indexOf('=') != -1 
                    && !StringUtil.endsWith(sourceURL, '&')) {
                resultURL += '&';
            }
            
            var parameterKeyValues = [];
            $.each(resultOption.parameterMap, function(key, value) {
                var resultValue;
                if (value) {
                    if (resultOption.neededEncoded) {
                        resultValue = URLUtil.encodeString(value);
                    } else {
                        resultValue = value;
                    }
                } else {
                    resultValue = '';
                }
                
                var parameterKeyValue = key + '=' + resultValue;
                parameterKeyValues.push(parameterKeyValue);
            });
            
            if (parameterKeyValues.length > 0) {
                resultURL += parameterKeyValues.join('&');
                return resultURL;
            } else {
                return sourceURL;
            }
        },
        getParameterMap : function(href) {
            var parametersString = URLUtil.getParametersString(href);
            var parameterMap = {};
            if (parametersString) {
                $.each(parametersString.split('&'), function(){
                    var parameterString = this;
                    var parameterKeyValue = parameterString.split('=');
                    var parameterKey = parameterKeyValue[0];
                    var parameterValue = parameterKeyValue[1];
                    if (!parameterMap[parameterKey]) {
                        parameterMap[parameterKey] = [];
                    }
                    parameterMap[parameterKey].push(parameterValue);
                });
            }
            return parameterMap;
        },
        getParameters   : function(parameterKey) {
            var parameterMap = URLUtil.getParameterMap();
            var parameters = parameterMap[parameterKey];
            return parameters;
        },
        getParametersString : function(href) {
            var parametersString = href && href.split('?')[1] || window.location.search.substr(1);
            parametersString = StringUtil.trim(parametersString);
            return parametersString;
        },
        getParameter : function(parameterKey) {
            var parameters = URLUtil.getParameters(parameterKey);
            if (parameters) {
                return parameters[0];
            }
        },
        replaceParameter    : function(parameterKey, parameterValue) {
            var currentURL = URLUtil.getCurrentURL();
            var currentURLHeader = currentURL.replace(/\?.*/g, '');
            
            var parameterMap = URLUtil.getParameterMap();
            parameterMap[parameterKey] = parameterValue;
            
            var newURL = URLUtil.appendParameterMap({
                'sourceURL' : currentURLHeader,
                'parameterMap' : parameterMap,
                'neededEncoded' : false
            });
            return newURL;
        }
    };
    
    return URLUtil;
});
