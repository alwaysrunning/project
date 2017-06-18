require.config({
    baseUrl: '//wx.yunhou.com/project/js',
    paths: {
        'jquery': 'lib/zeptojs/1.1.5/zepto'
    },
    config: {
		'conf/pay/pay-list': {
			size: 'large'
		},
		'baz': {
			color: 'blue'
		}
	}
});

if (!Function.prototype.bind) {
    require(['lib/es5-shim/4.0.3/es5-shim']);
}

/*require(["module/group/share"], function(wxShare){
	wxShare.init();
});*/