/**
 * A Collection class that maintains both numeric indexes and keys and exposes events.  ** Inspired by Extjs **
 *
 * @module clib/util/mixed-collection
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var _ = require('_');
    var isArray = _.isArray;
    var isEmpty = _.isEmpty;
    var escapeRe = _.escapeRegExp;

    var isValue = function(o) {
        // faster really
        if (o === null || o === undefined) return false;
        return _.isNumber(o) ? isFinite(o) : true;
    }

    /**
     * Returns a regular expression based on the given value and matching options. This is used internally for finding and filtering,
     * and by Ext.data.Store#filter
     * @private
     */
    var createValueMatcher = function(value, anyMatch, caseSensitive, exactMatch) {
        if (!value.exec) { // not a regex
            var er = escapeRe;
            value = String(value);

            if (anyMatch === true) {
                value = er(value);
            } else {
                value = '^' + er(value);
                if (exactMatch === true) {
                    value += '$';
                }
            }
            value = new RegExp(value, caseSensitive ? '' : 'i');
        }
        return value;
    };

    /** @constructor */
    var MixedCollection = function(list, options) {
        if (!options && _.isObject(list)) {
            options = list;
        }

        var keyFn;
        if (typeof options === 'function') {
            keyFn = options;
            options = {};
        } else {
            options = options || {};
            keyFn = options.keyFn;
        }

        this.dic = {};
        this.items = [];
        this.keys = [];
        this.length = 0;

        this.allowFunctions = options.allowFunctions === true;

        if (keyFn) {
            this.getKey = keyFn;
        } else {
            this.pkey = options.primaryKey || 'id';
        }

        if (isArray(list) && list.length > 0) {
            this.addAll(list);
        }
    };

    MixedCollection.prototype = {
        constructor: MixedCollection,

        add: function(key, o) {
            if (arguments.length == 1) {
                o = arguments[0];
                key = this.getKey(o);
            }
            if (isValue(key)) {
                var old = this.dic[key];
                if (typeof old != 'undefined') {
                    return this.replace(key, o);
                }
                this.dic[key] = o;
            }
            this.length++;
            this.items.push(o);
            this.keys.push(key);
            return o;
        },

        getKey: function(o) {
            return o[this.pkey];
        },

        /**
         * Replaces an item in the collection.
         */
        replace: function(key, o) {
            if (arguments.length == 1) {
                o = arguments[0];
                key = this.getKey(o);
            }
            var old = this.dic[key];
            if (!isValue(key) || old === undefined) {
                return this.add(key, o);
            }
            var index = this.indexOfKey(key);
            this.items[index] = o;
            this.dic[key] = o;
            return o;
        },

        /**
         * Adds all elements of an Array or an Object to the collection.
         */
        addAll: function(objs) {
            if (arguments.length > 1 || isArray(objs)) {
                var args = arguments.length > 1 ? arguments : objs;
                for (var i = 0, len = args.length; i < len; i++) {
                    this.add(args[i]);
                }
            } else {
                for (var key in objs) {
                    if (this.allowFunctions || typeof objs[key] !== 'function') {
                        this.add(key, objs[key]);
                    }
                }
            }
        },

        /**
         * Executes the specified function once for every item in the collection, passing the following arguments:
         * <div class="mdetail-params"><ul>
         * <li><b>item</b> : Mixed<p class="sub-desc">The collection item</p></li>
         * <li><b>index</b> : Number<p class="sub-desc">The item's index</p></li>
         * <li><b>length</b> : Number<p class="sub-desc">The total number of items in the collection</p></li>
         * </ul></div>
         * The function should return a boolean value. Returning false from the function will stop the iteration.
         * @param {Function} fn The function to execute for each item.
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the current item in the iteration.
         */
        each: function(fn, scope) {
            var items = [].concat(this.items); // each safe for removal
            for (var i = 0, len = items.length; i < len; i++) {
                if (fn.call(scope || items[i], items[i], i, len) === false) {
                    break;
                }
            }
        },

        /**
         * Map calls a provided callback function once for each element in an array,
         * in order, and constructs a new array from the results. callback is invoked
         * only for indexes of the array which have assigned values; it is not
         * invoked for indexes which have been deleted or which have never been
         * assigned values.
         *
         * @param {Function} fn The function to execute for each item.
         * @param {Object} scope (optional) Object to use as this when executing callback. Defaults to the current item in the iteration.
         * @return {Array} A new array with the results of calling a provided function on every element in this collection.
         */
        map: function(fn, scope) {
            var T, A, i, O, len;

            // If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if (typeof fn !== 'function') {
                throw new TypeError(fn+ ' is not a function');
            }

            O = this.items;
            len = O.length >>> 0;

            T = scope;
            A = new Array(len);
            i = 0;

            while(i < len) {
                var kValue, mappedValue;
                if (i in O) {
                    kValue = O[ i ];
                    mappedValue = fn.call(T || kValue, kValue, i, O);
                    A[ i ] = mappedValue;
                }
                i++;
            }

            return A;
        },

        /**
         * Executes the specified function once for every key in the collection, passing each
         * key, and its associated item as the first two parameters.
         * @param {Function} fn The function to execute for each item.
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
         */
        eachKey: function(fn, scope) {
            for (var i = 0, len = this.keys.length; i < len; i++) {
                fn.call(scope || window, this.keys[i], this.items[i], i, len);
            }
        },

        /**
         * Returns the first item in the collection which elicits a true return value from the
         * passed selection function.
         * @param {Function} fn The selection function to execute for each item.
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to the browser window.
         * @return {Object} The first item in the collection which returned true from the selection function.
         */
        find: function(fn, scope) {
            for (var i = 0, len = this.items.length; i < len; i++) {
                if (fn.call(scope || window, this.items[i], this.keys[i])) {
                    return this.items[i];
                }
            }
            return null;
        },

        /**
         * Inserts an item at the specified index in the collection.
         */
        insert: function(index, key, o) {
            if (arguments.length == 2) {
                o = arguments[1];
                key = this.getKey(o);
            }
            if (index >= this.length) {
                return this.add(key, o);
            }
            this.length++;
            this.items.splice(index, 0, o);
            if (typeof key != 'undefined' && key !== null) {
                this.dic[key] = o;
            }
            this.keys.splice(index, 0, key);
            return o;
        },

        /**
         * Remove an item from the collection.
         * @param {Object} o The item to remove.
         * @return {Object} The item removed or false if no item was removed.
         */
        remove: function(o) {
            return this.removeAt(this.indexOf(o));
        },

        /**
         * Remove an item from a specified index in the collection. Fires the {@link #remove} event when complete.
         * @param {Number} index The index within the collection of the item to remove.
         * @return {Object} The item removed or false if no item was removed.
         */
        removeAt: function(index) {
            if (index < this.length && index >= 0) {
                this.length--;
                var o = this.items[index];
                this.items.splice(index, 1);
                var key = this.keys[index];
                if (typeof key != 'undefined') {
                    delete this.dic[key];
                }
                this.keys.splice(index, 1);
                return o;
            }
            return false;
        },

        /**
         * Removed an item associated with the passed key fom the collection.
         * @param {String} key The key of the item to remove.
         * @return {Object} The item removed or false if no item was removed.
         */
        removeKey: function(key) {
            return this.removeAt(this.indexOfKey(key));
        },

        /**
         * Returns the number of items in the collection.
         * @return {Number} the number of items in the collection.
         */
        getCount: function() {
            return this.length;
        },

        /**
         * Returns index within the collection of the passed Object.
         * @param {Object} o The item to find the index of.
         * @return {Number} index of the item. Returns -1 if not found.
         */
        indexOf: function(o) {
            return this.items.indexOf(o);
        },

        /**
         * Returns index within the collection of the passed key.
         * @param {String} key The key to find the index of.
         * @return {Number} index of the key.
         */
        indexOfKey: function(key) {
            return this.keys.indexOf(key);
        },

        /**
         * Returns the item associated with the passed key OR index.
         * Key has priority over index.  This is the equivalent
         * of calling {@link #key} first, then if nothing matched calling {@link #itemAt}.
         * @param {String/Number} key The key or index of the item.
         * @return {Object} If the item is found, returns the item.  If the item was not found, returns <tt>undefined</tt>.
         * If an item was found, but is a Class, returns <tt>null</tt>.
         */
        item: function(key) {
            var mk = this.dic[key], item = mk !== undefined ? mk : (typeof key == 'number') ? this.items[key] : undefined;
            return typeof item != 'function' || this.allowFunctions ? item : null; // for prototype!
        },

        /**
         * Returns the item at the specified index.
         * @param {Number} index The index of the item.
         * @return {Object} The item at the specified index.
         */
        itemAt: function(index) {
            return this.items[index];
        },

        /**
         * Returns the item associated with the passed key.
         * @param {String/Number} key The key of the item.
         * @return {Object} The item associated with the passed key.
         */
        key: function(key) {
            return this.dic[key];
        },

        /**
         * Returns true if the collection contains the passed Object as an item.
         * @param {Object} o  The Object to look for in the collection.
         * @return {Boolean} True if the collection contains the Object as an item.
         */
        contains: function(o) {
            return this.indexOf(o) !== -1;
        },

        /**
         * Returns true if the collection contains the passed Object as a key.
         * @param {String} key The key to look for in the collection.
         * @return {Boolean} True if the collection contains the Object as a key.
         */
        containsKey: function(key) {
            return typeof this.dic[key] != 'undefined';
        },

        /**
         * Removes all items from the collection.  Fires the {@link #clear} event when complete.
         */
        clear: function() {
            this.length = 0;
            this.dic = {};
            this.items = [];
            this.keys = [];
            return this;
        },

        /**
         * Returns the first item in the collection.
         * @return {Object} the first item in the collection..
         */
        first: function() {
            return this.items[0];
        },

        /**
         * Returns the last item in the collection.
         * @return {Object} the last item in the collection..
         */
        last: function() {
            return this.items[this.length - 1];
        },

        /**
         * @private
         * Performs the actual sorting based on a direction and a sorting function. Internally,
         * this creates a temporary array of all items in the MixedCollection, sorts it and then writes
         * the sorted array data back into this.items and this.keys
         * @param {String} property Property to sort by ('key', 'value', or 'index')
         * @param {String} dir (optional) Direction to sort 'ASC' or 'DESC'. Defaults to 'ASC'.
         * @param {Function} fn (optional) Comparison function that defines the sort order.
         * Defaults to sorting by numeric value.
         */
        _sort: function(property, dir, fn) {
            var i, len,
                dsc = String(dir).toUpperCase() == 'DESC' ? -1 : 1,

                //this is a temporary array used to apply the sorting function
                c = [],
                keys = this.keys,
                items = this.items;

            //default to a simple sorter function if one is not provided
            fn = fn || function(a, b) {
                return a - b;
            };

            //copy all the items into a temporary array, which we will sort
            for (i = 0, len = items.length; i < len; i++) {
                c[c.length] = {
                    key: keys[i],
                    value: items[i],
                    index: i
                };
            }

            //sort the temporary array
            c.sort(function(a, b) {
                var v = fn(a[property], b[property]) * dsc;
                if (v === 0) {
                    v = (a.index < b.index ? -1 : 1);
                }
                return v;
            });

            //copy the temporary array back into the main this.items and this.keys objects
            for (i = 0, len = c.length; i < len; i++) {
                items[i] = c[i].value;
                keys[i] = c[i].key;
            }
        },

        /**
         * Sorts this collection by <b>item</b> value with the passed comparison function.
         * @param {String} direction (optional) 'ASC' or 'DESC'. Defaults to 'ASC'.
         * @param {Function} fn (optional) Comparison function that defines the sort order.
         * Defaults to sorting by numeric value.
         */
        sort: function(dir, fn) {
            this._sort('value', dir, fn);
        },

        /**
         * Reorders each of the items based on a mapping from old index to new index. Internally this
         * just translates into a sort. The 'sort' event is fired whenever reordering has occured.
         * @param {Object} mapping Mapping from old item index to new item index
         */
        reorder: function(mapping) {
            // this.suspendEvents();

            var items = this.items,
                index = 0,
                length = items.length,
                order = [],
                remaining = [],
                oldIndex;

            // object of {oldPosition: newPosition} reversed to {newPosition: oldPosition}
            for (oldIndex in mapping) {
                order[mapping[oldIndex]] = items[oldIndex];
            }

            for (index = 0; index < length; index++) {
                if (mapping[index] == undefined) {
                    remaining.push(items[index]);
                }
            }

            for (index = 0; index < length; index++) {
                if (order[index] == undefined) {
                    order[index] = remaining.shift();
                }
            }

            this.clear();
            this.addAll(order);
        },

        /**
         * Sorts this collection by <b>key</b>s.
         * @param {String} direction (optional) 'ASC' or 'DESC'. Defaults to 'ASC'.
         * @param {Function} fn (optional) Comparison function that defines the sort order.
         * Defaults to sorting by case insensitive string.
         */
        keySort: function(dir, fn) {
            this._sort('key', dir, fn || function(a, b) {
                var v1 = String(a).toUpperCase(), v2 = String(b).toUpperCase();
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            });
        },

        /**
         * Returns a range of items in this collection
         * @param {Number} startIndex (optional) The starting index. Defaults to 0.
         * @param {Number} endIndex (optional) The ending index. Defaults to the last item.
         * @return {Array} An array of items
         */
        getRange: function(start, end) {
            var items = this.items;
            if(items.length < 1){
                return [];
            }
            start = start || 0;
            end = Math.min(typeof end == 'undefined' ? this.length-1 : end, this.length-1);
            var i, r = [];
            if(start <= end){
                for(i = start; i <= end; i++) {
                    r[r.length] = items[i];
                }
            }else{
                for(i = start; i >= end; i--) {
                    r[r.length] = items[i];
                }
            }
            return r;
        },

        /**
         * Filter the <i>objects</i> in this collection by a specific property.
         * Returns a new collection that has been filtered.
         * @param {String} property A property on your objects
         * @param {String/RegExp} value Either string that the property values
         * should start with or a RegExp to test against the property
         * @param {Boolean} anyMatch (optional) True to match any part of the string, not just the beginning
         * @param {Boolean} caseSensitive (optional) True for case sensitive comparison (defaults to False).
         * @return {MixedCollection} The new filtered collection
         */
        filter: function(property, value, anyMatch, caseSensitive) {
            if (isEmpty(value, false)) {
                return this.clone();
            }
            value = createValueMatcher(value, anyMatch, caseSensitive);
            return this.filterBy(function(o) {
                return o && value.test(o[property]);
            });
        },

        /**
         * Filter by a function. Returns a <i>new</i> collection that has been filtered.
         * The passed function will be called with each object in the collection.
         * If the function returns true, the value is included otherwise it is filtered.
         * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key)
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to this MixedCollection.
         * @return {MixedCollection} The new filtered collection
         */
        filterBy: function(fn, scope) {
            var r = new MixedCollection();
            r.getKey = this.getKey;
            var k = this.keys, it = this.items;
            for (var i = 0, len = it.length; i < len; i++) {
                if (fn.call(scope || this, it[i], k[i])) {
                    r.add(k[i], it[i]);
                }
            }
            return r;
        },

        /**
         * Finds the index of the first matching object in this collection by a specific property/value.
         * @param {String} property The name of a property on your objects.
         * @param {String/RegExp} value A string that the property values
         * should start with or a RegExp to test against the property.
         * @param {Number} start (optional) The index to start searching at (defaults to 0).
         * @param {Boolean} anyMatch (optional) True to match any part of the string, not just the beginning.
         * @param {Boolean} caseSensitive (optional) True for case sensitive comparison.
         * @return {Number} The matched index or -1
         */
        findIndex: function(property, value, start, anyMatch, caseSensitive) {
            if (isEmpty(value, false)) {
                return -1;
            }
            value = createValueMatcher(value, anyMatch, caseSensitive);
            return this.findIndexBy(function(o) {
                return o && value.test(o[property]);
            }, null, start);
        },

        /**
         * Find the index of the first matching object in this collection by a function.
         * If the function returns <i>true</i> it is considered a match.
         * @param {Function} fn The function to be called, it will receive the args o (the object), k (the key).
         * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the function is executed. Defaults to this MixedCollection.
         * @param {Number} start (optional) The index to start searching at (defaults to 0).
         * @return {Number} The matched index or -1
         */
        findIndexBy: function(fn, scope, start) {
            var k = this.keys, it = this.items;
            for (var i = (start || 0), len = it.length; i < len; i++) {
                if (fn.call(scope || this, it[i], k[i])) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * Creates a shallow copy of this collection
         * @return {MixedCollection}
         */
        clone: function() {
            var r = new MixedCollection();
            var k = this.keys, it = this.items;
            for (var i = 0, len = it.length; i < len; i++) {
                r.add(k[i], it[i]);
            }
            r.getKey = this.getKey;
            return r;
        }
    };

    // Exports
    return MixedCollection;
});
