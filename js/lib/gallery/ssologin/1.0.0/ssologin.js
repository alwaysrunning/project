/**
 * Common sso login module for yunhou.com authorization.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var Box = require('lib/ui/box/1.0.1/box');
    var Messenger = require('lib/core/1.0.0/io/messenger');
    var extend = function(r, s) { for (var k in s) if (s.hasOwnProperty(k)) r[k] = s[k]; return r };
    var ssoChannel = require('./channel');

    var ssoDomain = 'yunhou.com';
    var minLoginUrl = 'https://ssl.yunhou.com/passport/loginMini'; // 迷你登录

    var _loginBox;
    var loginBox = function(setting, successHandler, errHandler, closeHandler) {

        // shift arguments if setting argument was omitted
        if (typeof setting === 'function') {
            closeHandler = errHandler;
            errHandler = successHandler;
            successHandler = setting;
            setting = null;
        }

        if (_loginBox) {
            _loginBox.destroy();
        }

        setting = extend({
            url: minLoginUrl,
            width: 380,
            height: 440,
            fixed: true,
            scrolling: 'no',
            close: false
        }, setting);

        var domain = setting.domain || ssoDomain;
        try {
            document.domain = domain;
        } catch (e) {
            setTimeout(function() { console.warn(e); }, 1);
        }

        _loginBox = Box.loadUrl(setting.url, setting);


        if (closeHandler) {
            _loginBox.on('hide', function() { closeHandler() });
        }

        var crossChannel = new Messenger('channel/passport');

        //size
        crossChannel.on('resizeBox', function(e) {
            _loginBox.height(e.height);
        });

        // success
        crossChannel.on('loginCallback', function(response) {
            ssoChannel.fire('login', response);
            successHandler && successHandler(response);
            _loginBox.hide();
        });

        // login error
        crossChannel.on('loginErrorCallback', function(response) {
            ssoChannel.fire('error', response);
            errHandler && errHandler(response);
        });

        _loginBox.on('destroy', function(e) {
            _loginBox = null;
            crossChannel.destroy();
        });

        // hide
        crossChannel.on('loginHide', function(response) {
            _loginBox.hide();
        });

        return _loginBox;
    };
    module.exports = {

        /**
         * Show mini login modal dialog.
         *
         * @param {Object} options (Optional) customize the login dialog options, see <lib/box/1.0.1> for details options
         * @param {Function} successHandler (Optional) The success handler.
         * @param {Function} errHandler (Optional) The login error handler.
         * @param {Function} closeHandler (Optional) The close handler triggered when dialog closed.
         */
        showDialog: loginBox

    };
});
