define(function(require, exports, module) {
    'use strict'
    var $ = require('jquery');
    // Check is a valid ID card no.
    function isIdCodeValid(code) {
        var pass = true;
        var city = {11: 1, 12: 1, 13: 1, 14: 1, 15: 1, 21: 1, 22: 1, 23: 1, 31: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 41: 1, 42: 1, 43: 1, 44: 1, 45: 1, 46: 1, 50: 1, 51: 1, 52: 1, 53: 1, 54: 1, 61: 1, 62: 1, 63: 1, 64: 1, 65: 1, 71: 1, 81: 1, 82: 1, 91: 1};
        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
            // 身份证号格式错误
            pass = false;
        } else if (!city[code.substr(0, 2)]) {
            // 地址编码错误
            pass = false;
        } else {
            // 18位身份证需要验证最后一位校验位
            if (code.length == 18) {
                code = code.split('');
                // ∑(ai×Wi)(mod 11)
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; // 校验位
                var sum = 0, ai = 0, wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if (parity[sum % 11] != code[17]) {
                    // 校验位错误
                    pass = false;
                }
            }
        }
        return pass;
    }

    var rTel = /^(\d{3,4}-?)?\d{7,9}$/,
        rMobile = /^1[0-9]{10}$/;

    var pattens = [
        {
            name: 'mobile',
            text: '请正确输入手机号码',
            func: function(v, elem) {
                return  rMobile.test(v);
            }
        },
        {
            name: 'phone',
            text: '请正确输入电话号码',
            func: function(v, elem) {
               // both mobile and normal telephone
               return rTel.test(v) || rMobile.test(v);
            }
        },
        {
            name: 'isIdCardNo',
            text: '请正确输入身份证号码',
            func: function(v, elem) {
                return isIdCodeValid(v);
            }
        },
        {
            name: 'isNoneMalformed',
            text: '请不要输入特殊字符',
            func: function(v, elem) {
                return !/[`~!@#$^&*()=|{}'":;,.<>/?！￥…（）—|【】‘；：“”。，、？%+ 　\\]/.test(v);
            }
        }
    ];
    var Validator = {};
    // Extends some usefull validate methods.
    $.each(pattens, function(i, o) {
         Validator[o.name]={
            func:o.func,
            text:o.text
        }
    });

    module.exports = Validator;
});
