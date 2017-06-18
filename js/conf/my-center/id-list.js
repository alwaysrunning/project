/**
 * 个人中心 - 身份证信息列表页
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    var io = require('common/kit/io/request');
    var Lazyload = require('common/widget/lazyload');


    //页面需要的url
    var urls = {
        del: '//m.yunhou.com/member/idcard_del'
    };
    //空数据时候输出到页面上的dom
    var domStr = '<section class="my-center-none" >' +
        '<div class="bd"><i class="iconfont">&#xe61a;</i></div>' +
        '<div class="ft">您还没有添加身份证信息哦</div>' +
        '</section>';
    // 图片懒加载--start
    var imageLazyLoader = null;
    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
            imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
            effect: 'fadeIn',
            dataAttribute: 'url',
            load: function(self) {
                if ($(self).hasClass('img-error')) {
                    $(self).removeClass('img-error');
                }
            }
        });
        return imageLazyLoader;
    }

    resetImageLoader();
    // 图片懒加载--end


    // 按钮初始化
    var clickHandles = {
        deleteBtn: function(e) {
            e.preventDefault();
            var dlgTmpl = "确定要删除该身份证信息吗？";
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
                        var url = urls.del + '?id=' + $this.attr("data-id");
                        io.get(url, {}, function(e) {
                            console.log('resule: ', e.error);
                            console.log('message: ', e);
                            if (e.error == '0') {
                                var $dom = $this.parents(".id-item").remove();
                                Dialog.tips(e.msg || '删除成功');
                                console.log("删除成功");
                                if ($('.mod-id-list').children().length == 0) {
                                    console.log("无纪律处理");
                                    $('.mod-id-list').after(domStr);
                                }
                            } else {
                                Dialog.tips(e.msg || '删除失败，请稍后重试');
                            }
                        }, function(e) {
                            console.log('unexception error');
                            Dialog.tips(e.msg || '删除失败，请稍后重试');
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
            $(".mod-id-list").on("click", key, handle);
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

    var source = getUrlValue('source'),
        jHdBody = $('.jIdClick');
    if (source == 'order' || source == 'buy-now' || source == 'buy-at-once') {
        jHdBody.addClass('hd-hover');
        jHdBody.click(function() {
            var date = {
                cardId: $(this).attr('data-id'),
                buyType: $(this).attr('data-buy-type')
            }
            io.jsonp('/checkout/selectIdCard', date, function() {
                window.location.href = 'http://m.yunhou.com/html/order/' + source + '.html';
            }, function(e) {
                Dialog.tips(e.msg);
            })

        })
    }


});
