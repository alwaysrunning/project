/**
 * 个人中心 - 地址列表页
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');
    var Lazyload = require('common/widget/lazyload');


    // 页面所需url
    var urls = {
        def: '//m.yunhou.com/member/address_set_def',
        del: '//m.yunhou.com/member/address_del'
    }
    //空数据时候输出到页面上的dom
    var domStr = '<section class="my-center-none" >' +
        '<div class="bd"><i class="iconfont">&#xe601;</i></div>' +
        '<div class="ft">您还没有添加收货地址</div>' +
        '</section>';
    // 按钮初始化
    var clickHandles = {
        defaultBtn: function(e) {
            e.preventDefault();
            var $this = $(this);
            var sender = this;
            var url = urls.def + '?addrId=' + $this.attr("data-id");
            io.get(url, {}, function(e) {
                if (e.error == '0') {
                    $this.parents(".mod-address-list").children(".default").removeClass("default");
                    var $dom = $this.parents(".address-item").toggleClass("default");
                    Dialog.tips(e.msg || '设置默认地址成功');
                    if (source == 'order' || source == 'buy-now' || source == 'buy-at-once') {
                        var date = {
                            addrId: $this.attr('data-id'),
                            buyType: ''
                        }
                        io.jsonp('/checkout/selectAddr', date, function() {
                            window.location.href = 'http://m.yunhou.com/html/order/' + source + '.html';
                        }, function(e) {
                            Dialog.tips(e.msg);
                        })
                    }
                } else {
                    Dialog.tips(e.msg || '设置默认地址失败，请稍后重试');
                }

            }, function(e) {
                Dialog.tips(e.msg || '设置默认地址失败，请稍后重试');
            }, sender);
            // Dialog.tips('设置默认地址失败');
        },
        deleteBtn: function(e) {
            e.preventDefault();
            var dlgTmpl = "确定要删除该收货地址吗？";
            var $this = $(this);
            var sender = this;
            $('document.body').dialog({
                time: 0,
                lock: true,
                cnt: dlgTmpl,
                btn: [{
                    value: '取消',
                    isHide: true,
                    callBack: function() {}
                }, {
                    value: '确定',
                    isHide: true,
                    callBack: function() {
                        var url = urls.del + '?addrId=' + $this.attr("data-id");
                        io.get(url, {}, function(e) {
                            if (e.error == '0') {
                                Dialog.tips(e.msg || '删除地址成功');
                                window.location.reload();
                            } else {
                                Dialog.tips(e.msg || '删除地址失败，请稍后重试');
                            }
                        }, function(e) {
                            Dialog.tips(e.msg || '删除地址失败，请稍后重试');
                        }, sender);
                    }
                }]
            });
        }
    }
    for (var k in clickHandles) {
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-address-list").on("click", key, handle);
        }
    }

    //获取url参数值
    var getUrlValue = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }

    //跳转到结算页
    var jBody = $('.jAddressClick'),
        source = getUrlValue('source');
    if (source == 'order' || source == 'buy-now' || source == 'buy-at-once') {
        jBody.addClass('bd-hover');
        jBody.on('click', function() {
            var date = {
                addrId: $(this).attr('data-id'),
                buyType: $(this).attr('data-buy-type')
            }
            io.jsonp('/checkout/selectAddr', date, function() {
                window.location.href = 'http://m.yunhou.com/html/order/' + source + '.html';
            }, function(e) {
                Dialog.tips(e.msg);
            })

        })
    }
});
