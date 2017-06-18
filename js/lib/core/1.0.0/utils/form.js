/**
 * Form utilities for serialize/desrialize.
 *
 * GistID: fe0b2b4c1ffeacfe16a5
 * GistURL: https://gist.github.com/fe0b2b4c1ffeacfe16a5
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 *
 * TODO: [jQuery.form#ajaxSubmit](https://github.com/malsup/form)
 *
 * Usage:
 *
 * ```js
 *  var formUtil = require('lib/core/1.0.0/utils/form');
 *  var formData = formUtil.serializeForm( $('input, textarea, select', '#moduleId') );
 *  // => {"floor_class":"2321","floor_num":"5","floor_skus":["72","73"]}
 * ```
 */
define(function(require, exports, module) {
  'use strict';

  var $ = require('jquery')
    , document = window.document
    , trim = $.trim
    , supportPlaceholder = 'placeholder' in $C('input')
    , keyBreaker = '[]'
    , rFormField = /INPUT|TEXTAREA|SELECT/

  function $C(tag) {
    return document.createElement(tag)
  }

  function isNumber(v) {
    if (typeof v === 'number') return true;
    if (typeof v !== 'string') return false;
    return isNaN(parseFloat(v));
  }

  function isValue(o, failBlank) {
    var t = typeof o;
    switch (t) {
      case 'number':
        return isFinite(o);
      case 'null': // fallthru
      case 'undefined':
        return false;
      default:
        return t && (failBlank ? o !== '' : true);
    }
  }

  function decodeEntities(str) {
    var d = decodeEntities.d || (decodeEntities.d = $C('i'));
    d.innerHTML = str;
    return d.innerText || d.textContent;
  }

  // cleanup array to strip blank elements from array
  function cleanup(arr) {
    var l = arr.length, t;
    while (l--) {
      t = arr[l];
      if (!isValue(t)) arr.splice(l, 1);
    }
    return arr;
  }

  var setFormData = function(selector, params, clear) {
    $(selector).find('[name]').each(function(i, input) { // Find all the inputs
      var name = $(input).attr('name'), v = params[name];

      if (name.indexOf('[') > -1) { // if name is object, e.g. user[name], userData[address][street], update value to read this correctly
        var names = name.replace(/\]/g, '').split('['),
            i = 0,
            n = null;
        v = params;
        for (; n = names[i++];)
          if (v[n]) v = v[n];
          else {
            v = undefined;
            break;
          }
      }

      if (!isValue(v)) {
        if (clear !== true) return; // if clear == true and no value = clear field, otherwise - leave it as it was
        v = ''; // if no value - clear field
      }

      if (typeof v === 'string' && v.indexOf('&') > -1) {
        v = decodeEntities(v); // decode html special chars (entities)
      }

      v = String(v)

      if (input.type === 'radio') input.checked = input.value === v;
      else if (input.type === 'checkbox') input.checked = v;
      else {
        if (supportPlaceholder) input.value = v; // normal browser
        else {
          // manually handle placeholders for specIEl browser
          var el = $(input);
          if (input.value !== v && v !== '') el.data('changed', true);
          if (v === '') el.data('changed', false).val(el.attr('placeholder'));
          else input.value = v;
        }
      }
    });
  }

  var serializeForm = function(selector, options) {
    var data = {}
      , convert = false
      , els = $(selector).get()
      , dForm = els[0]

    if (!dForm) return data;

    if (dForm.nodeName === 'FORM') {
      els = dForm.elements;
    }

    if (typeof options === 'boolean') {
      convert = options;
      options = {};
    } else {
      options = options || {}
      convert = options.convert;
      convert = convert === undefined ? false : convert;
    }

    if (options.semantic) {
      els = dForm.getElementsByTagName('*')
    }

    if (!els.length) return data;

    $.each(els, function(i, el) {
      var type = el.type && el.type.toLowerCase();

      if ((type === 'submit') || !el.name || el.disabled)
        return; // if we are submit or disabled - ignore

      var $el = $(el), key = el.name, v = rFormField.test(el.tagName) ? $el.val() : ($el.attr('value') || '');

      if (el.type === 'radio' && !el.checked) return; // return only "checked" radio value
      if (el.type === 'checkbox') v = el.checked; // convert chekbox to [true | false]
      if ($el.data('changed') !== true && v === $el.attr('placeholder')) v = ''; // clear placeholder valus for IEs

      if (convert) {
        if (isNumber(v)) {
          var tv = parseFloat(v), cmp = tv + '';
          if (v.indexOf('.') > 0) cmp = tv.toFixed(v.split('.')[1].length); // convert (string)100.00 to (int)100
          if (cmp === v) v = tv;
        }
        else if (v === 'true') v = true;
        else if (v === 'false') v = false;
        if (v === '') v = undefined;
      }

      // strip value blanks optionally
      if (typeof v === 'string' && !options.raw) {
        v = trim(v)
      }

      // namespace the field data
      var tmp = data
        , sep = options.nameSep || keyBreaker
        , parts = cleanup(key.split(sep))
        , isArray = key.indexOf('[]') === key.length - 2
        , p

      for (var i = -1, l = parts.length - 1; ++i < l; ) { // go through and create nested objects
        if (!tmp[parts[i]]) tmp[parts[i]] = {};
        tmp = tmp[parts[i]];
      }

      // translating value to a array if has multiple input with same name
      p = parts[parts.length - 1];
      if (isArray || tmp[p]) { // now we are on the last part, set the value
        if (!(tmp[p] instanceof Array)) {
          tmp[p] = tmp[p] === undefined ? [] : [tmp[p]];
        }
        tmp[p].push(v);
      } else if (!tmp[p]) {
        tmp[p] = v;
      }
    });

    return data;
  }

  /**
   * Gathers form element data into an k/v map that can
   * be passed to any of the following ajax functions: $.get, $.post, or load.  An
   * example of an array for a simple login form might be:
   *
   * { 'username': 'allex' , 'password': 'secret' }
   *
   * @method serializeForm
   */
  exports.serializeForm = serializeForm;

  /**
   * Apply k/v json data to a form DOM elements value.
   *
   * @method setFormData
   */
  exports.setFormData = setFormData;

});

// vim: set fdm=marker ts=2 sw=2 sts=2 tw=85 et :
