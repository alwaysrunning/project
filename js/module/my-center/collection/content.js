define(function(require) {

    'use strict';

    var $ = require('jquery'),
        Lazyload = require('common/widget/lazyload'),
        EventEmiter = require('lib/core/1.0.0/event/emitter'),
        io = require('common/kit/io/request'),
        Dialog = require('common/ui/dialog/dialog'),
        loadMore = require('module/my-center/lazy-more'),

        EVENTS = { LOAD: 'load' },
        content =  {
            init: function(element, opts) {
                this.setting = $.extend({}, opts || {});
                this.event(element);
                this.lazyMore(element);
            },
            event: function(element) {
                var self = this;

                element.on('click', '.jRome', function() {
                    self.remove( $(this) );
                });

                element.on('click', 'jEditShop', function() {
                    self.editShop( $(this) );
                });
            },
            removeItem: function(btn) {
                var item = btn.closest('.jCollection');
                if (item.length > 0) {
                    item.remove();
                }
            },
            remove: function(btn) {
                var self = this,
                    id = btn.attr('data-id'),
                    favoriteType = btn.attr('data-favoriteType'),
                    data = {
                        'id': id,
                        'favoriteType': favoriteType
                    };

                Dialog.confirm({
                    lock: true,
                    cnt: '确定要取消收藏吗？'
                }, function() {
                    io.get('/member/collection_cancle', data, function(res) {
                        if (res.error == 0) {
                            self.removeItem(btn);
                            Dialog.tips(res.msg);
                        }
                    }, function(e) {
                        Dialog.tips(e.msg);
                    });
                });
            },
            editShop: function(btn) {
                var s = $('.jRomeCent');

                if (s.css('display') == "none"){
                    s.css('display','block');
                    btn.text('取消编辑');
                } else {
                    s.css('display','none');
                    btn.text('编辑');
                }
            },
            getTabUrl: function() {
                var tab = this.setting.tab;
                if (!tab.length) { tab = $(tab); }
                return tab.data('url');
            },
            lazyMore: function(element) {
                loadMore( $('.jScroll', element), this.getTabUrl() );
            }
        };

    return $.extend( content, new EventEmiter() );

});
