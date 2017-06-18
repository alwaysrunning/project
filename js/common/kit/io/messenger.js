/**
 * Messenger, a common cross-document communicate solution.
 *
 * @author biqing kwok
 * @version 2.0
 * @license release under MIT license
 *
 * Last modified by Allex Wang (allex.wxn@gmail.com)
 * Fix some performance issues.
 */
(function( root, name, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define( factory );
    } else {
        // Browser globals (root is window)
        root[name] = factory();
    }
}(this, 'Messenger', function() {
    'use strict';

    var win = window, document = win.document, navigator = win.navigator;

    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
    // !注意 消息前缀应使用字符串类型
    var prefix = "[PROJECT_NAME]", supportPostMessage = 'postMessage' in win, w3cEvent = 'addEventListener' in document;

    // Simple bindAll implements
    var slice = [].slice;
    var bindAll = function(o) {
        var funcs = slice.call(arguments, 1), l = funcs.length, n, f;
        while (l--) { n = funcs[l]; f = o[n]; o[n] = function() { return f.apply(o, arguments); }; }
        return o;
    };

    // Target 类, 消息对象
    function Target(target, name) {
        var errMsg = '';
        if (arguments.length < 2) {
            errMsg = 'target error - target and name are both requied';
        } else if (typeof target !== 'object') {
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name !== 'string') {
            errMsg = 'target error - target name must be string type';
        }
        if (errMsg) {
            throw new Error(errMsg);
        }
        this.name = name;
        this.target = target;
    }

    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    Target.prototype.send = supportPostMessage ? 
        // IE8+ 以及现代浏览器支持
        function(msg) {
            this.target.postMessage(prefix + msg, '*');
        } :
        // 兼容IE 6/7
        function(msg) {
            var targetFunc = navigator[prefix + this.name];
            if (typeof targetFunc === 'function') {
                targetFunc(prefix + msg, win);
            } else {
                throw new Error("target callback function is not defined");
            }
        };

    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    function Messenger(messengerName, projectName) {
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];

        prefix = projectName || prefix;
        if (typeof prefix !== 'string') {
            prefix = prefix.toString();
        }

        bindAll(this, ['handleMessage']);

        this.initListen();
    }

    var proto = Messenger.prototype;

    // 添加一个消息对象
    proto.addTarget = function(target, name) {
        var targetObj = new Target(target, name);
        this.targets[name] = targetObj;
    };

    /**
     * Handle the cross-iframe message sent by messenger.
     *
     * @method handleMessage
     */
    proto.handleMessage = function(message) {
        var self = this;
        message = (message || 0).data || '';
        message = message.slice(prefix.length); // 剥离消息前缀
        for ( var i = -1, l = self.listenFunc.length; ++i < l; ) {
            self.listenFunc[i](message);
        }
    };

    // 初始化消息监听
    proto.initListen = function() {
        var self = this, handleMessage = self.handleMessage;
        if (supportPostMessage) {
            if (w3cEvent) {
                win.addEventListener('message', handleMessage, false);
            } else {
                win.attachEvent('onmessage', handleMessage);
            }
        } else {
            // 兼容IE 6/7
            navigator[prefix + self.name] = handleMessage;
        }
    };

    // 监听消息
    proto.listen = function(callback) {
        this.listenFunc.push(callback);
    };

    // 注销监听
    proto.clear = function() {
        this.listenFunc = [];
    };

    // 广播消息
    proto.send = function(msg) {
        var targets = this.targets, target;
        for (target in targets) {
            if (targets.hasOwnProperty(target)) {
                targets[target].send(msg);
            }
        }
    };

    /**
     * Api for destroy the messenger instance.
     */
    proto.destroy = function() {
        if (supportPostMessage) {
            var handleMessage = this.handleMessage;
            if (w3cEvent) {
                win.removeEventListener('message', handleMessage);
            } else {
                win.detachEvent('onmessage', handleMessage);
            }
        } else {
            delete navigator[prefix + self.name];
        }
        this.clear();
    };

    return Messenger;
}));
