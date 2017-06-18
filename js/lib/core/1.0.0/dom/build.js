/**
 * DOM utility for parse node collection by html or original dom.
 *
 * @module core/dom/build
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var document = window.document
      , $ = require('jquery')

    function pushStack(list, key, elem, flatList) {
        if (flatList) {
            if (!list[key]) {
                list[key] = elem;
            }
        } else {
            if (!list[key]) {
                list[key] = $(elem);
            } else {
                list[key] = list[key].add(elem);
            }
        }
    }

    // Parse html element or html string to a normalized DOM mode
    var buildDom = function(sHTML, flatNodeList, selectorMap) {
        var container, domBox, domList, nodes, el;

        var process = function(box) {
            if (selectorMap) {
                for (var key in selectorMap) {
                    domList[key] = $(selectorMap[key].toString(), box);
                }
            }
            else {
                domList = {};
                nodes = $('[node-type]', box);
                for (var i = -1, len = nodes.length, el; ++i < len; ) {
                    el = nodes[i];
                    key = el.getAttribute('node-type');
                    pushStack(domList, key, el, flatNodeList);
                }
            }
        };

        var get = function(key) {
            var ret = domList[key], elems
            if (!ret || ret.length === 0) {
                elems = $('[node-type="' + key + '"]', container);
                if (elems.length) {
                    pushStack(domList, key, elems, flatNodeList);
                }
                ret = domList[key];
            }
            return ret;
        };

        if (flatNodeList === undefined) { // Defaults to flat
            flatNodeList = true;
        }

        container = sHTML;

        if (typeof sHTML === 'string' && sHTML.charAt(0) === '<') {
            container = document.createElement('div');
            container.innerHTML = sHTML;
            domBox = document.createDocumentFragment();
            while (el = container.firsChild) domBox.appendChild(el);
        } else {
            container = $(sHTML);
            domBox = container[0];
        }

        process(container);

        return {
            /**
             * Provide a api method for retrieve dom on the fly
             * @method
             * @param {String} key The node-type identify name.
             */
            get: get,

            /** @type {HTMLElement} */
            box: domBox,

            /** @type {NodeList} */
            list: domList
        };
    };

    // Expose

    /**
     * Build a html string or html elements to a simple DOM mode => { box, list }
     *
     * @method build
     *
     * @param {HTMLElement|String} el The container element or html string.
     * @param {Boolean} flatNodeList (Optional) set [FALSE] to return all matched node list (jQuery-Like Object)
     * @param {Object} selectorMap (Optional) use a set of selectors instead of [node-type].
     *
     * @return {Object} Returns a DOM model with [box] and [list] properties,
     * also provide api [get] to retrieve node on the fly.
     *
     * @example
     *
     * ```html
     *  <div id="c">
     *    <div node-type="foo"></div>
     *    <div node-type="bar"></div>
     *  </div>
     * ```
     *
     * ```js
     *  var builder = build.build('#c', false);
     *
     *  builder.get('foo'); // => <div node-type="foo"></div>
     *  builder.get('bar'); // => <div node-type="bar"></div>
     *
     *  // insert a new html struct on the fly
     *  builder.get('foo').html('<div node-type="lazy" />');
     *
     *  // retrieve lazy node
     *  builder.get('lazy'); // => <div node-type="lazy"></div>
     * ```
     */
    exports.build = buildDom,

    /**
     * Parse a HTMLElement for attributes `[node-type]` of selector mapping.
     *
     * @method parse
     *
     * @param {HTMLElement} el The container element.
     * @param {Boolean} flatNodeList (Optional) `false` to return all matched node list.
     * @param {Object} selectorMap (Optional) set the selectors instead of `node-type`.
     *
     * @return {Object} Returns a object with node mappings.
     */
    exports.parse = function(el, flatNodeList, selectorMap) {
        // Adaptor jQuery-Like object, use the firt match.
        if (typeof el === 'object' && el.length > 0) {
            el = el[0];
        }

        if (!el || el.nodeType !== 1) {
            throw TypeError('parse error, not a valid html element');
        }

        // shift arguments if selectorMap argument was omitted
        if (typeof selectorMap === 'boolean') {
            flatNodeList = selectorMap;
            selectorMap = null;
        }

        return buildDom(el, flatNodeList, selectorMap).list;
    }

    /**
     * @method dataset
     * @alias #{./dataset}
     */
    exports.dataset = require('./dataset');

});
