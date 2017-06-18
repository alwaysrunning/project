/**
 * jQuery validation extends for application implements.
 * - http://jqueryvalidation.org/validate
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict'

    var $ = require('jquery');
    var Validator = require('./validate');

    var rMultiDash = /[A-Z]/g;
    var hyphenate = function(s) {
        return s.replace(rMultiDash, function($0) { return '-' + $0.toLowerCase(); });
    };

    var isEmptyObject = $.isEmptyObject;

    // parse form element validate messages.
    var parseMessages = function(form) {
        var elements = $(form).find( 'input, select, textarea' )
                              .not( ':submit, :reset, :image, [disabled], [readonly]' );

        var messages = {};
        elements.each(function(i, elem) {
            var id = elem.ie || elem.name, data = $(elem).data(), obj = {}, p, k;
            for (p in data) {
                if ( data.hasOwnProperty(p) && (k = hyphenate(p)) ) {
                    if (k.indexOf('validate-') === 0 && data[p]) {
                        obj[k.substring(9)] = data[p];
                    }
                }
            }
            if (!isEmptyObject(obj)) {
                messages[id] = obj;
            }
        });

        return messages;
    };

    /**
     * Installation validator for the specified form. `$().validate()` has been
     * deprecated.
     *
     * @param {FormElement} selector 
     * @param {Object} options The settings for validator.
     *                         See also <http://jqueryvalidation.org/validate#validate(-[options-]-)returns:-validator>.
     *
     * @return {Object} Returns the validator instance. return the singleton instance
     *                  if install duplicated.
     */
    Validator.validate = function(selector, options) {

        var $form = $(selector), dForm;
        if (!$form.is('form')) {
            $form = $form.find('form');
        }

        // if nothing is selected, return nothing; can't chain anyway
        if ( !$form.length ) {
            if ( options && options.debug && window.console ) {
                console.warn( 'Nothing selected, can\'t validate, returning nothing.' );
            }
            return;
        }

        dForm = $form[0];

        // check if a validator for this form was already created
        var validator = $( dForm ).data( 'validator' );
        if ( validator ) {
            return validator;
        }

        // Add novalidate tag if HTML5.
        $form.attr( 'novalidate', 'novalidate' );

        // Parse validate messages according to DOM structs.
        options.messages = $.extend(true, parseMessages(dForm), options.messages);

        validator = new Validator( options, dForm );
        $( dForm ).data( 'validator', validator );

        if ( validator.settings.onsubmit ) {

            $form.validateDelegate( ':submit', 'click', function( event ) {
                if ( validator.settings.submitHandler ) {
                    validator.submitButton = event.target;
                }
                // allow suppressing validation by adding a cancel class to the submit button
                if ( $( event.target ).hasClass( 'cancel' ) ) {
                    validator.cancelSubmit = true;
                }

                // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                if ( $( event.target ).attr( 'formnovalidate' ) !== undefined ) {
                    validator.cancelSubmit = true;
                }
            });

            // validate the form on submit
            $form.submit( function( event ) {
                if ( validator.settings.debug ) {
                    // prevent form submit to be able to see console output
                    event.preventDefault();
                }
                function handle() {
                    var hidden;
                    if ( validator.settings.submitHandler ) {
                        if ( validator.submitButton ) {
                            // insert a hidden input as a replacement for the missing submit button
                            hidden = $( '<input type="hidden" />' )
                                .attr( 'name', validator.submitButton.name )
                                .val( $( validator.submitButton ).val() )
                                .appendTo( validator.currentForm );
                        }
                        validator.settings.submitHandler.call( validator, validator.currentForm, event );
                        if ( validator.submitButton ) {
                            // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                            hidden.remove();
                        }
                        return false;
                    }
                    return true;
                }

                // prevent submit for invalid forms or custom submit handlers
                if ( validator.cancelSubmit ) {
                    validator.cancelSubmit = false;
                    return handle();
                }
                if ( validator.form() ) {
                    if ( validator.pendingRequest ) {
                        validator.formSubmitted = true;
                        return false;
                    }
                    return handle();
                } else {
                    validator.focusInvalid();
                    return false;
                }
            });
        }

        return validator;
    };

    module.exports = Validator;
});
