/**
 * [description]
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module) {               'use strict';    var $ [description]
 * @return {[type]}         [description]
 */
define(function(require, exports, module) {

    'use strict';

    var $ = require('jquery'),
        // lib
        Lazyload = require('common/widget/lazyload'),
        Delegator = require('lib/core/1.0.0/dom/delegator'),
        EventEmiter = require('lib/core/1.0.0/event/emitter'),
        // common
        Dialog = require('common/ui/dialog/dialog'),
        io = require('common/kit/io/request'),
        // module
        // countDown = require('module/my-center/count-down'),
        countDown = require('common/ui/countdown/countdown'),
        loadMore = require('module/my-center/lazy-more'),
        dgTpl = require('module/my-center/tpl/dialog-tpl');

        require('common/base/dialog');

    var INPUT_URL = ['cancel-url', 'delete-url', 'receive-url', 'time-out-cancel-url'],
        CLICK_HANDLER = ['morePros', 'cancel', 'view', 'delete', 'pay', 'receipt', 'buyAgain', 'comment'],
        EVENTS = { LOAD: 'load' },

        tabContent = {
            init: function(element, opts) {
                this.initProps(opts);
                this.event(element);
                this.lazyMore();
                this.countDown();
            },
            initProps: function(opts) {
                this.setting = $.extend({}, opts || {});
                this.url = this.getInterface(INPUT_URL);
            },
            destroy: function(element) {
                var delegator = this.delegator;
                this.un(EVENTS.LOAD);
                if (delegator) {
                    delegator.destroy();
                }
                element.off();
            },
            event: function(element) {
                var self = this,
                    len = CLICK_HANDLER.length,
                    method,
                    delegator = Delegator(element);

                function proxy(delegator, method) {
                    delegator.on('click', method, function(e) {
                        self[method](e);
                    });
                }

                while (len --) {
                    method = CLICK_HANDLER[len];
                    proxy(delegator, method);
                }

                this.delegator = delegator;
            },
            getInterface: function(inputs) {
                var key,
                    url = {},
                    len = inputs.length;

                while (len --) {
                    key = inputs[len];
                    url[key] = $('#' + key).val();
                }
                return url;
            },
            resetImageLoader: function() {
                var imageLazyLoader = this.imageLazyLoader;

                // Please make sure destroy it firts if not null
                if (imageLazyLoader) {
                    imageLazyLoader.destroy();
                }

                imageLazyLoader = new Lazyload('img.jImg', {
                    effect: 'fadeIn',
                    dataAttribute: 'url'
                });

                this.imageLazyLoader = imageLazyLoader;
                return imageLazyLoader;
            },
            getTabUrl: function() {
                return this.setting.tab.data('url');
            },
            lazyMore: function() {
                loadMore( '.jScroll', this.getTabUrl() );
            },
            cancelOrder: function(orderId, cancelReason) {
                var self = this;
                if (cancelReason) {
                    io.jsonp(self.url['time-out-cancel-url'], {
                        orderId: orderId,
                        reason: cancelReason
                    }, function() {
                        //需要传参数
                        setTimeout(function() {
                            self.emit(EVENTS.LOAD, self.setting);
                        }, 2000);

                    }, function(e) {
                        Dialog.tips(e.msg);
                    }, this);
                } else {
                    $('document.body').dialog({
                        time: 0,
                        lock: true,
                        cnt: dgTpl,
                        btn: [
                            {
                                value: '取消',
                                isHide: true,
                                callBack: function () {}
                            },
                            {
                                value: '确定',
                                isHide: true,
                                callBack: function () {
                                    var sV = $('#jCancelReason').val(),
                                        sOV = $('#jOtherReason').val();

                                    if ( '' == (sV + sOV) ) {

                                        if ('' == sV) {
                                            Dialog.tips('请选择取消原因');
                                        } else {
                                            Dialog.tips('清填写取消原因');
                                        }

                                        return;
                                    }

                                    io.jsonp( self.url['cancel-url'], {
                                            orderId: orderId,
                                            reason: sV || sOV
                                        },
                                        function () {
                                            self.emit(EVENTS.LOAD, self.setting);
                                        },
                                        function(e) {
                                            Dialog.tips(e.msg);
                                        }, this );
                                 }
                            }
                        ]
                    });
                }
            },
            //倒计时
            countDown: function() {
                var self = this;
                countDown({
                    targetTime: $("[node-type=countDown] .query-time").attr('data-endTime'),
                    timeText : ['',':',':','',''],
                    container : '[node-type=countDown] .query-time',
                    isShowTimeText : true,
                    isShowArea : true,
                    type : {
                        'd' : false,
                        'h' : true,
                        'm' : true,
                        's' : true,
                        'ms' : false
                    },
                    callback : function(dom) {
                        if (dom) {
                            var oid = dom.attr('order-id');
                            if (oid) {
                                self.cancelOrder(oid, '系统自动取消', 1);
                            }
                        }
                    }
                });
            },
            morePros: function(e) {
                var $btn = $(e.currentTarget),
                    $dom = $btn.prev().toggle();
                // this.resetImageLoader();
                $btn.toggleClass("shown");
            },
            getOrderId: function(elem) {
                return elem.parent().attr('order-id');
            },
            cancel: function(e) {
                var orderId = this.getOrderId( $(e.target) );
                this.cancelOrder(orderId);
            },
            view: function() {},
            removeItem: function(btn) {
                var item = btn.closest('.order-item');
                if (item.length > 0) {
                    item.remove();
                }
            },
            delete: function(e) {
                var self = this,
                    btn = $(e.currentTarget),
                    orderId = this.getOrderId(btn);

                $('document.body').dialog({
                    time: 0,
                    lock: true,
                    cnt: "确定要删除此订单吗？",
                    btn: [
                        {
                            value: '取消',
                            isHide: true,
                            callBack: function () {}
                        },
                        {
                            value: '确定',
                            isHide: true,
                            callBack: function () {
                                io.jsonp(
                                    $('#delete-url').val(),
                                    { orderId: orderId },
                                    function(res) {
                                        if (res.error == 0) {
                                            self.removeItem(btn);
                                        }
                                        // self.emit(EVENTS.LOAD, self.setting);
                                    },
                                    function(e) {
                                        Dialog.tips(e.msg);
                                    }
                                );
                            }
                        }
                    ]
                });
            },
            pay: function() {},
            receipt: function(e) {
                var self = this,
                    orderId = this.getOrderId( $(e.target) );

                $('document.body').dialog({
                    time: 0,
                    lock: true,
                    cnt: "是否确认收货？",
                    btn: [ {
                            value: '取消',
                            isHide: true,
                            callBack: function () {}
                        },
                        {
                            value: '确定',
                            isHide: true,
                            callBack: function () {
                                io.jsonp(
                                    $('#receive-url').val(),
                                    { orderId: orderId },
                                    function() {
                                        self.emit(EVENTS.LOAD, self.setting);
                                    },
                                    function (e) {
                                        Dialog.tips(e.msg);
                                    }
                                );
                            }
                        }]
                });
            },
            buyAgain: function() {},
            comment: function() {}
    };

    return $.extend( tabContent, new EventEmiter() );

});
