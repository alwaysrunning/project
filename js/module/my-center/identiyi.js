define(function(require, exports, module) {
    
    'use strict';

    var $ = require('jquery'),
        
        btn = $('#jIdBtn'),
        contentElem = $('.id-body');

    function bindEvents() {
        btn.on('click', function() {
            var _btn = $(this);
            toggle.call(_btn, !_btn.hasClass('checked'));
        });
    }
    
    function toggle(checked) {
        this.toggleClass('checked', checked);
        contentElem.toggleClass('active', checked);
    }

    ( function init() {
        bindEvents();
    }() );
});    