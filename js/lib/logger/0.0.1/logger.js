/**
 * 日志统计系统
 * @author jiangchaoyi(jiangchaoyi@yunhou.com)
 */
(function(root, factory) {
    var Logger = factory(root);
    if (typeof define === 'function' && define.amd) {
        define(function(){
            return Logger;
        });
    } else {
        // Browser globals(root is window)
        root.Logger = Logger;
    }
})(this, function(root) {
    // 重定义console对象,避免ie报错;
    root.console = (function() {
        if (root.console) {
            return root.console;
        } else {
            return {
                log: function() {}
            };
        }
    })();


    if (typeof JSON !== 'object') {
        JSON = {};
    }

    (function() {
        'use strict';

        function f(n) {
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        }

        function this_value() {
            return this.valueOf();
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function() {

                return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z' : null;
            };

            Boolean.prototype.toJSON = this_value;
            Number.prototype.toJSON = this_value;
            String.prototype.toJSON = this_value;
        }

        var cx,
            escapable,
            gap,
            indent,
            meta,
            rep;


        function quote(string) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }

        function str(key, holder) {

            // Produce a string from holder[key].

            var i, // The loop counter.
                k, // The member key.
                v, // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.

            if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.

            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':

                    // JSON numbers must be finite. Encode non-finite numbers as null.

                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':

                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.

                    return String(value);

                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.

                case 'object':

                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.

                    if (!value) {
                        return 'null';
                    }

                    // Make an array to hold the partial results of stringifying this object value.

                    gap += indent;
                    partial = [];

                    // Is the value an array?

                    if (Object.prototype.toString.apply(value) === '[object Array]') {

                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.

                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.

                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // If the replacer is an array, use it to select the members to be stringified.

                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (
                                        gap ? ': ' : ':'
                                    ) + v);
                                }
                            }
                        }
                    } else {

                        // Otherwise, iterate through all of the keys in the object.

                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (
                                        gap ? ': ' : ':'
                                    ) + v);
                                }
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.

                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.

        if (typeof JSON.stringify !== 'function') {
            escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            meta = { // table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };
            JSON.stringify = function(value, replacer, space) {

                // The stringify method takes a value and an optional replacer, and an optional
                // space parameter, and returns a JSON text. The replacer can be a function
                // that can replace values, or an array of strings that will select the keys.
                // A default replacer method can be provided. Use of the space parameter can
                // produce text that is more easily readable.

                var i;
                gap = '';
                indent = '';

                // If the space parameter is a number, make an indent string containing that
                // many spaces.

                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }

                    // If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === 'string') {
                    indent = space;
                }

                // If there is a replacer, it must be a function or an array.
                // Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                        typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }

                // Make a fake root object containing our value under the key of ''.
                // Return the result of stringifying the value.

                return str('', {
                    '': value
                });
            };
        }

    })();

    //工具类
    var tools = {
        //类似$.extend不支持浅复制
        extend: function() {
            var _extend = function me(dest, source) {
                for (var name in dest) {
                    if (dest.hasOwnProperty(name)) {
                        //当前属性是否为对象,如果为对象，则进行递归
                        if ((dest[name] instanceof Object) && (source[name] instanceof Object)) {
                            me(dest[name], source[name]);
                        }
                        //检测该属性是否存在
                        if (source.hasOwnProperty(name)) {
                            continue;
                        } else {
                            source[name] = dest[name];
                        }
                    }
                }
            }
            var _result = {},
                arr = arguments;
            //遍历属性，至后向前
            if (!arr.length) return {};
            for (var i = arr.length - 1; i >= 0; i--) {
                _extend(arr[i], _result);
            }
            arr[0] = _result;
            return _result;
        },
        getObjHash: function(obj) {
            var str = '';
            for (var i in obj) {
                var t = obj[i];
                if (t === null) {
                    continue;
                }
                t = encodeURIComponent(t);
                if (str === '') {
                    str = i + '=' + t;
                } else {
                    str += '&' + i + '=' + t;
                }
            }
            return str;
        },
        /** 
         * json对象转字符串形式
         */
        json2str: function(obj) {
            return JSON.stringify(obj);
        }
    };

    //定义log等级
    var LEVLES = {
        error: 4,
        warn: 3,
        info: 2,
        log: 1
    };

    //全局配置项目
    var defaultsConfig = {
        pid: 'fe_pc', //{string} 数据来源,前端目前只有这两种：fe_pc|fe_mb
        app: 'default', //{string} 内部项目的命名，项目自己定制，但是不能冲突
        level: 'error', //{string} 日志输出等级,error:只发送error日志；warn：发送error、warn日志；info:发送error、warn、info日志；log：发送error、warn、info、log日志
        debug: false, //{bool} 是否调试，true|false，false：发送到服务器，true:用console.log输出，请在支持console.log的环境调试否则报错
        devId: 0, //{string} 开发者id
        url: '//10.200.51.114/c.gif' //{string} 日志服务器地址
    };

    /**
     * 日志构造函数
     * @param opts {json} 配置参数，见defaultsConfig
     */
    function Logger(opts) {
        opts = tools.extend(defaultsConfig, opts);
        var level = opts.level;
        this.opts = opts;
        this.debug = opts.debug;
        this.url = opts.url;
        this.level = LEVLES[LEVLES.hasOwnProperty(level) ? level : 'error'];
        this.objParams = {
            pid: opts.pid || defaultsConfig.pid,
            app: opts.app || defaultsConfig.app
        };
        var devId = opts.devId || defaultsConfig.devId;
        if (devId) {
            this.objParams.devId = devId;
        }
    }

    /**
     * 生成唯一用户标示
     * @return {string} 16位的唯一用户标示
     */
    Logger.getUID = function() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid.toUpperCase();
    };

    Logger.prototype = {
        print: function(type, args) {
            var self = this;
            if (self.level > +LEVLES[type]) {
                return;
            }
            var objParams = self.objParams;
            objParams.type = type;
            if (args.length === 0) {
                return;
            }
            var data = {
                data: args[0] || '',
                opts: args[1] || ''
            };
            //如果第一个参数是Error对象，则默认提出其e.stack对象。
            if (args[0] instanceof Error) {
                data.data = args[0].stack || args[0].toString();
            }
            if (self.debug) {
                var fnLog = console[objParams.type] || console.log;
                //chrome apply第一个参数要是console http://stackoverflow.com/questions/8159233/typeerror-illegal-invocation-on-console-log-apply
                fnLog && fnLog.apply(console, args);
            } else {
                //如果是非debug模式，只传输第一个参数的内容到服务器
                objParams.data = tools.json2str(data);
                var str = tools.getObjHash(objParams);
                // Avoid block the runtime process
                setTimeout(function() {
                    var img = new Image();
                    img.src = self.url + '?' + str;
                }, 1);
            }
        },
        error: function() {
            this.print('error', arguments);
        },
        warn: function() {
            this.print('warn', arguments);
        },
        info: function() {
            this.print('info', arguments);
        },
        log: function() {
            this.print('log', arguments);
        }
    }

    return Logger;
});
