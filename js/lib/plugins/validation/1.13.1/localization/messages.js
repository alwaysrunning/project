define(function(require, exports, module) {
    var validator = require('../validate');
    var format = validator.format;
    module.exports = {
        setLang: function(la) {
            var l = ( la || 'zh-CN' );

            switch (l) {
            case 'zh-CN':
                $.extend(validator.messages, {
                    required: "必须填写",
                    remote: "请修正此栏位",
                    phone: "请输入正确的数字",
                    mobile: "请输入正确的数字",
                    email: "请输入有效的电子邮件",
                    url: "请输入有效的网址",
                    date: "请输入有效的日期",
                    dateISO: "请输入有效的日期 (YYYY-MM-DD)",
                    number: "请输入正确的数字",
                    digits: "只可输入数字",
                    creditcard: "请输入有效的信用卡号码",
                    equalTo: "你的输入不相同",
                    extension: "请输入有效的后缀",
                    maxlength: format("最多 {0} 个字"),
                    minlength: format("最少 {0} 个字"),
                    rangelength: format("请输入长度为 {0} 至 {1} 之间的字串"),
                    range: format("请输入 {0} 至 {1} 之间的数值"),
                    max: format("请输入不大于 {0} 的数值"),
                    min: format("请输入不小于 {0} 的数值"),
                    custom: true
                });
                break;
            case 'zh-TW':
                $.extend(validator.messages, {
                    required: "本欄目必填",
                    remote: "请修正此栏位",
                    phone: "请鍵入合法的數字",
                    mobile: "请鍵入合法的數字",
                    email: "请输入有效的电子邮件",
                    url: "請鍵入合法的網路鏈接",
                    date: "请输入有效的日期",
                    dateISO: "请输入有效的日期 (YYYY-MM-DD)",
                    number: "请输入正确的数字",
                    digits: "只可输入数字",
                    creditcard: "请输入有效的信用卡号码",
                    equalTo: "你的输入不相同",
                    extension: "请输入有效的后缀",
                    maxlength: format("最多 {0} 个字"),
                    minlength: format("最少 {0} 个字"),
                    rangelength: format("请输入长度为 {0} 至 {1} 之間的字串"),
                    range: format("请输入 {0} 至 {1} 之间的数值"),
                    max: format("请输入不大于 {0} 的数值"),
                    min: format("请输入不小于 {0} 的数值"),
                    custom: true
                });
                break;
            case 'en-US':
                $.extend(validator.messages,  {
                    required: "Required",
                    remote: "Please amend the blank",
                    phone: "Please insert valid numbers",
                    mobile: "Please insert valid numbers",
                    email: "Please enter a correct Email address",
                    url: "Please enter the valid URL",
                    date: "Please enter a valid date",
                    dateISO: "Please enter a valid date (YYYY-MM-DD)",
                    number: "Please enter a correct number",
                    digits: "Numbers only",
                    creditcard: "Please enter a valid  card number",
                    equalTo: "Please enter the same content as above",
                    extension: "Please enter a correct suffix",
                    maxlength: format("maximum {0} character"),
                    minlength: format("at least {0} character"),
                    rangelength: format("Please enter the character between {0} to {1} "),
                    range: format("Please  enter the number between {0} to {1} "),
                    max: format("Please enter a number less than {0} "),
                    min:  format("Please enther a number not less than {0} "),
                    custom: true
                });
                break;
            }
        }
    };
});


