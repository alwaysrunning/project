define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var dialog = require('common/ui/dialog/dialog');
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
    // var template = require('common/widget/template');

    var getPresent = {
        moduleId: '#jFillInfo',
        init: function() {
            this.o = $(this.moduleId);
            this.bindEvent();
        },
        validatePhone: function() {
            var $phone = $('#jPhone');

        },
        bindEvent: function() {
            var self = this;
            self.o.on('click', '#jFormBtn', function() {
                if (self.validatePhone()) {

                }

            })
        }
    }
    getPresent.init();

});
