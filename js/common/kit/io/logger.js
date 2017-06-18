define(function (require, exports, module) {
    var log = require("lib/logger/0.0.1/logger");

    module.exports = new log({
        pid   : 'fe_mb',        // {string} 数据来源,前端目前只有这两种：fe_pc|fe_mb
        app   : 'gshop',        // {string} 内部项目的命名，项目自己定制，但是不能冲突
        level : 'error',         // {string} 日志输出等级,error: 只发送error日志；warn：发送error、warn日志；info : 发送error、warn、info日志；log：发送error、warn、info、log日志
        debug : false,          // {bool} 是否调试，true|false，false：发送到服务器，true : 用console.log输出，请在支持console.log的环境调试否则报错
        devId : 'taotao',       // {string} 开发者id，0：默认，表示无开发者信息
        url   : '//analysis.yunhou.com/sleuth/c.gif' //{string} 日志服务器地址
    });

});


