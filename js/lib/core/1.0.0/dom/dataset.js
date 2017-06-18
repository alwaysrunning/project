/**
 * DOM utility for parse HTML dataset
 *
 * @module core/dom/dataset
 * @author Allex Wang (allex.wxn@gmail.com)
 *
 * @example
 *
 * ```
 * // <div id="user" data-id="1234567890" data-user="johndoe" data-date-of-birth="2000-01-01" data-json-data="{&quot;foo&quot;:1,&quot;bar&quot;:[1,2,3]}">John Doe</div>
 *
 * var dataset = require('./dataset')
 *
 * var data = dataset('#user')
 * // => {"id":1234567890,"user":"johndoe","dateOfBirth":"","jsonData":{"foo":1,"bar":[1,2,3]}}
 * ```
 */
define(function(require, exports, module) {
  'use strict';

  var document = window.document
    , $ = require('jquery')


      // Matches dashed string for camelizing
    , rmsPrefix = /^-ms-/
    , rdashAlpha = /-([\da-z])/gi

      // Used by camelCase as callback to replace()
    , fcamelCase = function(all, letter) { return letter.toUpperCase() }

    , rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
    , rmultiDash = /[A-Z]/g

  // Convert dashed to camelCase; used by the css and data modules
  // Support: IE9-11+
  // Microsoft forgot to hump their vendor prefix (#9572)
  function camelCase(string) {
    return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
  }

  // Every attempt is made to convert the string to a JavaScript value (this
  // includes booleans, numbers, objects, arrays, and null)
  // When the data attribute is an object (starts with '{') or array (starts with
  // '[') then jQuery.parseJSON is used to parse the string;
  function normalizeAttrValue(v) {
    try {
      return v === 'true' ? true :
        v === 'false' ? false :
        v === 'null' ? null :

        // Only convert to a number if it doesn't change the string
        +v + '' === v ? +v :
        rbrace.test(v) ? $.parseJSON(v) :
        v;
    } catch (e) {}
  }

  function dataAttr(elem, key, data) {
    var name;

    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if (data === undefined && elem.nodeType === 1) {
      name = 'data-' + key.replace(rmultiDash, '-$&').toLowerCase();
      data = elem.getAttribute(name);
      if (typeof data !== 'string') {
        data = undefined;
      }
    }
    return data;
  }

  var dataset = function(el, key, value) {
    if (!el || el.nodeType !== 1)
      throw new TypeError('dataset(): Not a valid DOM element.')

    var i, name, attrs, map
    if (arguments.length === 1) {
      if (attrs = el.dataset) {
        map = {}
        for (name in attrs)
          if (attrs.hasOwnProperty(name)) map[name] = normalizeAttrValue(attrs[name]);
        return map;
      }
      attrs = el.attributes;
      i = attrs.length;
      map = {}
      while (i--) {
        // Support: IE11+
        // The attrs elements can be null (#14894)
        if (attrs[i]) {
          name = attrs[i].name;
          if (name.indexOf('data-') === 0) {
            name = camelCase(name.slice(5));
            map[name] = normalizeAttrValue(dataAttr(el, name));
          }
        }
      }
      return map;
    }
  }

  /**
   * Parse DOM dataset attributes to js k/v object. Returns a associative map.
   *
   * NOTE
   * ====
   * The attribute name must be prefix `data-`, and case-sensitive transform to
   * camelCase name.  The attribute value will be convert to a JavaScript value (this
   * includes booleans, numbers, objects, arrays, and null)
   *
   * @param {HTMLElement} el The element to parse.
   * @param {Object|String} key (Optional) Assign data to DOM attributes as data-* value.
   * @param {Mixed} value (Optional) The value to be assigned
   *
   * [1]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
   */
  module.exports = dataset;

});
