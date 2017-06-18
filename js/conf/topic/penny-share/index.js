define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var dialog = require('common/ui/dialog/dialog');
    var template = require('common/widget/template');
    var com = require('conf/topic/penny-share/common');
    var sc = require('conf/topic/penny-share/iscroll');
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
                if ($(self).hasClass('jImg')) {
                    $(self).removeClass('jImg').removeAttr('data-url');
                }
            }
        });
        return imageLazyLoader;
    }

    var pennyIndex = {
        moduleSelector: '#jPenny',
        isOut: true, //status of mouse
        init: function() {
            var self = this;
            self.o = $(self.moduleSelector);
			self.getNickname();
            self.setBtnStatus();
            self.getRecordPrize();
            self.bindEvent();
        },
		getNickname : function(){
			  var name = com.getUrlParam('name');
			  if(name !=null && name !=undefined){
					$('#jUserName')[com.isWeixin()?'show':'hide']().find('#jUserNameBox').html(name);	
			  }
		},
        bindEvent: function() {
            var self = this;
            self.o.on('click', '#jRules', function() {
                    self.showRules();
                })
                .on('click', '#jAddBtn', function() {
                    if (!$(this).hasClass('disabled-btn')) {
                        location.href = com.getPageUrl();
                    } else {
                        var msg = $(this).attr('data-msg');
                        if (msg && $.trim(msg).length != 0) {
                            dialog.tips('<div class="dialog-tips">' + msg + '</div></div>');
                        }
                    }
                })
        },
        setBtnStatus: function() {
            com.ajax(com.url.getQualification, {}, function(data) {
                var flag = data.data.qualification;
                var msg = data.data.msg;
                msg = msg ? msg : '';
                $('#jAddBtn')[flag ? 'removeClass' : 'addClass']('disabled-btn').attr({
                    'data-msg': msg
                });
            }, function(data) {
                if (data.data.url && $.trim(data.data.url).length != 0) {
                    location.href = data.data.url;
                }
            })
        },
        getRecordPrize: function() {
            var self = this;
            if (com.isWeixin()) {
                if (self.isOut) {
                    com.ajax(com.url.getRecord, {}, function(data) {
                        $('#jRecordBox').html(template.render('jRecordPrizeTmpl', {
                            records: data.data.list
                        }));
                        //
                        resetImageLoader();
                        var myScroll = new IScroll('#jRecordBd');
                        myScroll.on('scrollEnd', function() {
                            resetImageLoader();
                        });
                        //touchstart
                        $('#jRecordBd').on('touchstart', function() {
                            self.isOut = false;
                            clearTimeout(self.st1);
                            clearTimeout(self.st2);
                        });
                        //touchend
                        $('#jRecordBd').on('touchend', function() {
                            self.st2 = setTimeout(function() {
                                self.isOut = true;
                                self.getRecordPrize();
                            }, 5000);
                        });
                        //5 second
                        self.st1 = setTimeout(function() {
                            self.getRecordPrize();
                        }, 5000);
                    });
                }
            }
        },

        showRules: function() {
            var self = this;
            dialog.forcedPop({
                cnt: template.render('jRulesTmpl', {}),
                lock: true
            });
            self.removeCloseBtn();
        },
        removeCloseBtn: function() {
            $('.jCloseBtn').click(function() {
                var $parent = $(this).closest('#_dialog');
                $parent.next('#_dialog_mask').remove();
                $parent.remove();
            });
        }
    }
    pennyIndex.init();
});
