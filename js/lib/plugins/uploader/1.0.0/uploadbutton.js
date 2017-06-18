/**
 * File uploader button wrapper component.
 *
 * @module lib/plugins/uploader/uploadbutton
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery');

  var fileseed = 0;
  var UploadButton = function(el, opts) {

    if (typeof el === 'object' && el.length > 0) el = el[0];

    if (!el) {
      throw Error('Setup upload button failed. target element not valid');
    }

    opts = $.extend({
      name: '__uploadfile_' + (++fileseed),
      accept: '',
      multiple: false,
      className: 'ui-button-upload',
      onChange: function() {}
    }, opts);

    var btn = $(el), filectl, btnClass = opts.className
    if ('INPUT' === el.nodeName.toUpperCase() && btn.attr('type') === 'file') {
      filectl = btn;
      btn = btn.wrap('<span class="' + btnClass + '"></span>');
    } else {
      filectl = $('<input type="file" />');
      btn.append(filectl).addClass(btnClass);
    }

    filectl.addClass('upload-file-ctl');

    // Make button suitable container for input
    btn.css({
      position: 'relative',
      overflow: 'hidden',
      // Make sure browse button is in the right side in Internet Explorer
      direction: 'ltr'
    });

    this.options = opts;

    this._el = btn;
    this._filectl = filectl;

    this._initFileCtl();
  };

  $.extend(UploadButton.prototype, {

    /**
     * Initialize the upload file control staffs.
     * @private
     */
    _initFileCtl: function() {
      var opts = this.options, filectl = this._filectl, el = this._el;

      $.each(['name', 'multiple', 'accept'], function(i, p) {
        if (opts.hasOwnProperty(p)) { filectl.prop(p, opts[p]); }
      });

      // IE and Opera, unfortunately have 2 tab stops on file input
      // which is unacceptable in our case, disable keyboard access
      if (window.attachEvent) {
        filectl.attr('tabIndex', '-1');
      }

      filectl.css({
        position: 'absolute',
        // in Opera only 'browse' button is clickable and it is located at
        // the right side of the input
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        fontFamily: 'Arial',
        // 4 persons reported this, the max values that worked for them were 243, 236, 236, 118
        fontSize: '118px',
        margin: 0,
        padding: 0,
        cursor: 'pointer',
        opacity: 0
      });

      filectl.on('change', opts.onChange);
    },

    reset: function() {
      var handleChange = this.options.onChange
        , input = this._filectl
        , clone = $(input[0].cloneNode(false));
      input.off('change', handleChange);
      input.replaceWith(clone);
      this._filectl = clone;
      this._initFileCtl();
    },

    /**
     * Interface method implements for destroy the component.
     */
    destroy: function() {
      this._filectl.off();
      this._filectl = null;
      this.el = null;
    }

  });

  return UploadButton;
});

/* vim: set fdm=marker et ff=unix et sw=2 ts=2 sts=2 tw=100: */
