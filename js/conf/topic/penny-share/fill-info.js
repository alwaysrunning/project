define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var dialog = require('common/ui/dialog/dialog');
    var template = require('common/widget/template');
    var com = require('conf/topic/penny-share/common');
    // var template = require('common/widget/template')
    var Lazyload = require('common/widget/lazyload');
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
                    $(self).removeClass('img-error').removeAttr('data-url');
                }
            }
        });
        return imageLazyLoader;
    }

    resetImageLoader();

    var getPresent = {
        moduleId: '#jFillInfo',
        init: function() {
            this.o = $(this.moduleId);
            this.getProItem();
        },
        getProItem: function() {
            var self = this;
            com.ajax(com.url.getPresent, {}, function(data) {
                $('#jProItemWrap').html(template.render('jProItemTmpl', data.data));
                resetImageLoader();
                self.bindEvent();
            }, function(data) {
                $('#jErrorBox').html('数据加载失败，请<a onclick="location.reload();" class="a-click">刷新</a>重试');
            });

        },
        validatePhone: function() {
            var $phone = $('#jPhone');
            var val = $.trim($phone.val());
            var reg = /^1[\d]{10}$/;
            return reg.test(val);
        },
        validateSecurityCode: function() {
            return ($.trim($('#jSecurityCode').val()).length != 0);
        },
        getSeCode: function() {
            var self = this;
            var valPhone = $.trim($('#jPhone').val());
            if (!self.validatePhone()) {
                dialog.tips('<div class="dialog-tips">请输入正确地手机号码!</div>');
            } else {
                com.ajax(com.url.getSecurityCode, {
                    mobile: valPhone
                }, function(data) {
                    self.getCountdown();
                });
            }
        },
        getCountdown: function() {
            var self = this;
            var startTime = 60;
            var $btn = $('#jGetSeCode');
            $btn.addClass('btn-disabled');
            var setI = setInterval(function() {
                startTime--;
                $btn.html('(' + startTime + 's)后获取');
                if (startTime == 0) {
                    clearInterval(setI);
                    $btn.html('获取验证码');
                    $btn.removeClass('btn-disabled');
                }
            }, 1000)
        },
        //获取地址栏参数
        getUrlParam: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        validateRepeatPhone: function() {
            var self = this;
            var mobile = $.trim($('#jPhone').val());
            var catpcha = $.trim($('#jSecurityCode').val());
            com.ajax(com.url.checkCatpcha, {
                mobile: mobile,
                catpcha: catpcha,
                productId:self.getUrlParam('productId')
            }, function(data) {
				location.href = com.getPageUrl();
            })

        },
        bindEvent: function() {
            var self = this;
            var val = $.trim($('#jPhone').val());
            self.o.on('click', '#jFormBtn', function() {
                    if (!self.validatePhone()) {
                        dialog.tips('<div class="dialog-tips">请输入正确地手机号码!</div>');
                    } else if (!self.validateSecurityCode()) {
                        dialog.tips('<div class="dialog-tips">手机验证码不能为空!</div>');
                    } else {
                        self.validateRepeatPhone(val);
                    }
                })
                .on('click', '#jGetSeCode', function() {
                    if (!$(this).hasClass('btn-disabled')) {
                        self.getSeCode();
                    }
                });
        }
    }
    getPresent.init();

});
