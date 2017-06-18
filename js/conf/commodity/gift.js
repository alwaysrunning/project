define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');

    $('.ui-back').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        window.history.back();
    });
});
