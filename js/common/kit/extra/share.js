/**
 * Baidu Share.
 */
define(function(require, exports, module) {
    'use strict';
    var loader = require('common/kit/io/loader');

    var initShare = function(config) {
        if (!config) {
            config = {
                bdText: window.title,
                bdDesc: window.title,
                bdUrl: window.location.href,
                bdPic: '',
                iconSize: '16'
            };
        }

        window._bd_share_config = {
            common : config,
            share : [{
                "bdSize" : config.iconSize
            }],
            /*slide : [{
                bdImg : 0,
                bdPos : "right",
                bdTop : 100
            }],
            image : [{
                viewType : 'list',
                viewPos : 'top',
                viewColor : 'black',
                viewSize : config.iconSize,
                viewList : ['sqq','tsina','renren','weixin']
            }]
            selectShare : [{
                "bdselectMiniList" : ['sqq','tsina','renren','weixin']
            }]*/
        };
        loader.script('http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date()/36e5));
    };

    var setShare = function (config) {
        var cfg = window._bd_share_config;
        
        cfg.common = config;
        if (config.iconSize) {
            cfg.share.bdSize = config.iconSize;
            cfg.image.viewSize = config.iconSize;
        }

        return cfg;
    }; 

    module.exports = {
        init: initShare,
        set: setShare
    };
});
