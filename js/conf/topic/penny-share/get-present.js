define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var com = require('conf/topic/penny-share/common');
    var dialog = require('common/ui/dialog/dialog');
    var template = require('common/widget/template');
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
        moduleId: '#jGetPresent',
        init: function() {
            this.o = $(this.moduleId);
            this.setBtnTxt();
            this.getShareBtnStatus();
            this.bindEvent();
            this.createShare();
        },
        createShare: function() {
			 var val = $('#jIndexUrl').val();
			 var urlStr = (val.indexOf('?')>-1)?'&':'?';
            com.ajax(com.url.getJoined, {}, function(data) {
                if ($('#jSharePop').length == 0) {
                    $('body').append(template.render('jSharePopTmpl', {
                        num: data.data.num
                    }));
					$('#jIndexUrl').val(val + urlStr + 'name='+encodeURIComponent(data.data.nickName));
                }
                $('#jSharePop').click(function() {
                    $('#jSharePop').hide();
                });
            });
        },
        setBtnTxt: function() {
            var txt = com.isWeixin() ? '选好了&nbsp;&nbsp;分享并领取' : '选好了';
            $('#jBtnShare').html(txt);
        },
        confirmBox: function() {
            var ar = ['<div class="confirm"><em class="close jCloseBtn"></em>您还没有选择礼物哦!</div>'];
            dialog.confirm({
                cnt: ar.join(''),
                lock: true,
                btn: [{
                    value: '去选礼物',
                    isHide: true,
                    callBack: function() {}
                }, {
                    value: '随机选一个',
                    isHide: true,
                    callBack: function() {}
                }]
            }); // close pop
            $('.jCloseBtn').click(function() {
                var $parent = $(this).closest('#_dialog');
                $parent.next('#_dialog_mask').remove();
                $parent.remove();
            });
        },
        getShareBtnStatus: function() {
            var isSelected = ($('.pro-hover').length != 0);
            $('#jBtnShare')[isSelected ? 'removeClass' : 'addClass']('btn-share-disabled');
        },
        goToNext: function() {
            var self = this;
            var pid = $('.jModPro.pro-hover').attr('data-productid');
            com.ajax(com.url.redeemGift, {
                productId: pid
            }, function(data) {
                location.href = com.getPageUrl() + '?productId=' + pid;
            });
        },
        bindEvent: function() {
            var self = this;
            self.o.on('click', '#jBtnShare', function() {
                    if ($(this).hasClass('btn-share-disabled')) {
                        // self.confirmBox();
                    } else {
                        if (com.isWeixin()) {
						com.getWeixinConfig();
                            $('#jSharePop').show();
                            com.wx.ready(function() {
                                com.afterWeixinShare(function() {
                                    self.goToNext();
                                }, function() {
									$('#jSharePop').hide();
								})
                            });
                        } else {
                            self.goToNext();
                        }
                    }
                })
                .on('click', '.jModPro', function() {
                    $('.jModPro').removeClass('pro-hover');
                    $(this).addClass('pro-hover');
                    self.getShareBtnStatus();
                })
                .on('click', '.jProMask', function() {
                    $(this).closest('.jModPro').toggleClass('pro-hover');
                    self.getShareBtnStatus();
                })
        }
    }
    getPresent.init();

});
