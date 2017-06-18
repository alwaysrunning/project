/**
 * Generic template interface. for some common helper method extensions.
 *
 * @author Allex Wang
 */
define(function(require) {
    'use strict';

    var template = require('lib/template/3.0/template');

    // format datetime
    template.helper('dateFormat', function(timestamp) {
        return new Date(timestamp * 1).format();
    });

    return template;
});
