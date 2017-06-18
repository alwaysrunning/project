define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Box = require('lib/ui/box/1.0.1/box');
    var io = require('common/kit/io/request');
    var wx = require('common/base/jweixin-1.0.0');
    var share = require('common/widget/share/1.0.0/share');
    var Dialog = require('common/ui/dialog/dialog');



    //  parse url to get parameter
    var parseUrl = function() {
        var search = window.location.search.replace(/^\?/, '');
        var res = {};

        if (search !== '') {
            var arr = search.split('&');
            for (var i = 0, len = arr.length; i < len; i = i + 1) {
                var item = arr[i].split('=');
                res[item[0]] = item[1];
            }
        }
        return res;
    };

    var isWeixin = function () {
        var ua = navigator.userAgent.toLowerCase();
        return /micromessenger/.test(ua);
    };


    //  popup share box
    var ShareBox = (function() {
        var diaClass ='_shareDia';

        var loadImg = function() {
            var imgArr = [
                'http://img2.bbgstatic.com/15180690c35_bc_ed87d9eb896d3f2f8b0b4d0019ae34ff_750x880.png',
                'http://img4.bbgstatic.com/1518069006c_bc_c67bab1e313784c1504d1cc3f864042f_352x112.png',
                'http://img4.bbgstatic.com/15180690a14_bc_6f989deaa2f47eb02e3c6d1e5c4a7f3b_144x153.png'
            ];
            for (var i = 0, len = imgArr.length; i < len; i = i + 1) {
                (function() {
                    var objImg = new Image();
                    objImg.src = imgArr[i];
                }());
            }
        };
        loadImg();

        var diaStr = [
            '<div class="' + diaClass + '">',
            '<img class="close" src="http://img3.bbgstatic.com/15180a4de1a_bc_c796db1aa33319a2ac2ce6068ea8cab5_64x64.png">',
            '<img class="main" src="http://img2.bbgstatic.com/15180690c35_bc_ed87d9eb896d3f2f8b0b4d0019ae34ff_750x880.png">',
            '<img class="button" src="http://img4.bbgstatic.com/1518069006c_bc_c67bab1e313784c1504d1cc3f864042f_352x112.png">',
            '<img class="ribbon" src="http://img4.bbgstatic.com/15180690a14_bc_6f989deaa2f47eb02e3c6d1e5c4a7f3b_144x153.png">',
            '</div>'
        ].join('');


        var shareBox = Box.create({
            autofocus: false,
            skin: '_share',
            modal: true,
            close: false,
            content: diaStr
        });

        var wxCfg = function(data) {
            var wxTitle = data.title || '云猴穿越时空，大礼为你而来',
                wxPic   = data.pic || '',
                wxDesc  = data.desc || wxTitle,
                wxUrl = data.url;

            io.jsonp('http://api.mall.yunhou.com/Pennyshare/getWeixinConfig', {}, function(data) {
                wx.config({
                    appId     : data.data.appId,
                    timestamp : data.data.timestamp,
                    nonceStr  : data.data.noncestr,
                    signature : data.data.signature,
                    jsApiList : ['onMenuShareTimeline', 'onMenuShareAppMessage']
                });
                wx.ready(function() {
                    wx.onMenuShareTimeline({
                        title  :  wxTitle,              // 分享标题
                        link   :  wxUrl,                // 分享链接
                        imgUrl :  wxPic                 // 分享图标
                    });
                    wx.onMenuShareAppMessage({
                        title  : wxTitle,               // 分享标题
                        desc   : wxDesc,                // 分享描述
                        link   : wxUrl,                 // 分享链接
                        imgUrl : wxPic                  // 分享图标
                    });
                });
            });
       };

        var open = function(data) {
            shareBox.show();

            var shareData = $.extend(true, {
                url: 'http://m.yunhou.com',
                pic: 'http://img0.bbgstatic.com/1511a09c57a_bc_a118500ec87df075d4364925f988445a_155x155.png',
                title: '云猴穿越时空，大礼为你而来',
                desc: '云猴穿越时空，大礼为你而来',
                summary: '云猴穿越时空，大礼为你而来'
            }, data);

            //  add close event
            $('.' + diaClass).on('click', '.close', function() {
                shareBox.hide();
            });

            if (isWeixin()) {
               $('.' + diaClass).addClass('_wx');
               wxCfg(shareData);

            } else {
                $('.' + diaClass).on('click', '.button', function() {
                    share({
                        data: shareData
                    });
                });
            }
        };

        return {
            open: open
        };
    })();


    var HongBaoUrl = 'http://api.mall.yunhou.com/Hongbao/createHongBao';
    var urlPara = parseUrl();
    var orderId = urlPara['tradeNo'] || '';

    if (orderId !== '') {
        io.jsonp(HongBaoUrl, {
            orderId: orderId

        }, function(data) {
            ShareBox.open(data.data);

        }, function(e) {
            //  不要提示，不然很奇怪
            // Dialog.tips(e.msg);
        });
		/* bpm 埋点 begin */
		window.BPM = window.BPM || [];
			BPM.push([ 'setGatherMore', { 
			"page_type": "paid", // 当前页面标识,请勿修改 
			"plat":"h5",//平台 
			"orderId":orderId
		}]);
		/* bpm 埋点 end */
		insertBPM();
    }

	function insertBPM(){
		(function(f,c,d,e,g,a,b){a=c.createElement(d);b=c.getElementsByTagName(d)[0];a.async=1;a.src=e;b.parentNode.insertBefore(a,b)
		})(window,document,"script","//"+(location.protocol=="http:"?"s1":"ssl")+".bbgstatic.com/tracer/bpm.js?v=1.0.5","bpm");
	}

});
