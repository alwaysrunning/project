define(function(require, exports, module) {
    'use strict';
    
    var StringUtil = {
        trim : function(string) {
            return (string ? string.replace(/(^\s*)|(\s*$)/g, '') : string);
        },
        endsWith   : function(sourceString, queryString) {
            var pattern = new RegExp(queryString + "$", "g");
            return pattern.test(sourceString);
        },
        isBlank : function(string) {
            var trimedString = StringUtil.trim(string);
            if (!trimedString) {
                return true;
            } else if (trimedString == '') {
                return true;
            } else {
                return false;
            }
        },
        getFirstMatchedStringByRegexp : function(sourceString, regexpString) {
            var regexp = new RegExp(regexpString);
            var matchedStrings = sourceString.match(regexp);
            if (matchedStrings && matchedStrings.length > 0) {
                var firstMatchedString = matchedStrings[0];
                return firstMatchedString;
            } else {
                return null;
            }
        }
    };
    
    return StringUtil;
});
