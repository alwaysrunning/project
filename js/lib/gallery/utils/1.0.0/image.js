/**
 * Image utility for CDN image service spec adaptor.
 *
 * @auhtor Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var _dpr = window.devicePixelRatio || 1;

  var forIn = function(o, fn) {
    for (var k in o) {
      if (o.hasOwnProperty(k)) {
        fn(o[k], k)
      }
    }
  }

  var keys = Object.keys || function(o) {
    var arr = [];
    for (var k in o) {
      if (o.hasOwnProperty(k)) arr.push(k);
    }
    return arr;
  }

  var types = {
    's1': 70,
    's2': 100,
    'm1': 200,
    'm2': 300,
    'l1': 400,
    'l2': 600,
    'l5': 750,
    'l3': 800,
    'l4': 1000,
    'dk1': 500,
    'sp1': 640
  };

  var reverseTypes = {}, sizes = [];

  forIn(types, function(v, k) {
    sizes.push(+v);
    reverseTypes[v] = k;
  });
  sizes.sort(function(a, b) { return a > b });

  var rImgType = /(.*?)\.(\w+)!(\w+?)$/
  var rImgSize = /_(\d+)x(\d+)\.[\w]+(?:!(\w+?)|\?.*)*$/

  function rangeSearch(arr, v, round) {
    var low = 0, high = arr.length - 1, index, tmp

    // out of range
    if (v >= arr[high]) {
      return high;
    } else if (v <= arr[low]) {
      return low;
    }

    while (low <= high) {
      index = (low + high) / 2 | 0;
      tmp = arr[index];

      if (tmp < v) {
        low = index + 1;
      }
      else if (tmp > v) {
        high = index - 1;
      }
      else {
        return index;
      }
    }

    if (low > high) {
      tmp = low;
      low = high;
      high = tmp;
    }

    var middle = (arr[high] + arr[low]) / 2
      , ratio = (middle - v) / (middle - arr[low])
      , absRatio = Math.abs(ratio)

    if (ratio > 0) {
      return round || ratio > 0.5 ? low : high;
    } else {
      return high;
    }
  }

  function getImageType(size, round) {
    var index = rangeSearch(sizes, size, round);
    var k = sizes[index];
    return reverseTypes[k];
  }

  function rebuildImageURL(origin, dpr1, dpr2) {
    if (!dpr1) {
      throw 'The original dpr not defined.'
    }

    var matches = rImgType.exec(origin) || []
      , base = matches[1]
      , ext = '.' + matches[2]
      , spec = matches[3]
      , size = spec && types[spec]

    if (dpr2 === undefined) {
      dpr2 = _dpr;
    }
    if (!size || dpr1 === dpr2) {
      return origin;
    }

    spec = getImageType(Math.ceil((size / dpr1) * dpr2), dpr2 > 1) || spec;

    return base + ext + '!' + spec;
  }

  // Get image url by spec type name: s1, s2, m1, etc,.
  function getImageURL(url, type) {
    if (!types[type]) {
      return url;
    }
    var matches = rImgType.exec(url) || [], spec = matches[3]
    if (spec) {
      return spec !== type ? url.replace('!' + spec, '!' + type) : url;
    } else {
      return url + '!' + type;
    }
  }

  // Parse image size by url with special pattern, eg: 500x500.jgeg
  function parseSize(url) {
    var matches, spec, t, size;
    if (matches = rImgSize.exec(url)) {
      // parse !s1, !m1 etc,.
      if ( (spec = matches[3]) && (size = types[spec]) ) {
        size = { width: size, height: size }
      } else {
        size = { width: +matches[1], height: +matches[2] }
      }
    }
    return size;
  }

  /**
   * Get CDN image spec type by image size.
   *
   * @param {Number} size The special size to calculate.
   * @param {Boolean} round Returns a round size type if not found the exactly.
   * @return {String} Returns the cdn image spec names, eg, s1, s2, m1, m2 etc,.
   */
  exports.getImageType = getImageType;

  /**
   * Rebuild image url by the device pixel ratio (dpr)
   *
   * @param {String} url The target image url
   * @param {Number} dpr1 The original DPR of the image referenced.
   * @param {Number} dpr2 (Optional) set the dpr to rebuild. defaults to current devices dpr.
   */
  exports.rebuildImageURL = rebuildImageURL;

  /**
   * Get a new image url with a specific type matched.
   *
   * @param {String} url The original url
   * @param {String} type The target type to rebuild.
   *
   * @example
   * ```js
   *  #.getImageURL('http://foo/asdf.jpg!m1', 's1'); // => http://foo/asdf.jpg!s1
   * ```
   */
  exports.getImageURL = getImageURL;

  /**
   * Parse image url size with a specific patterns.
   *
   * @param {String} url The image url to parse.
   *
   * @example
   * ```js
   *  #.parseSize('http://foo/asdf_100x100.jpg'); // => { width: 100, height: 100 }
   *  #.parseSize('http://foo/asdf_100x100.jpg!m1'); // => { width: 200, height: 200 }
   * ```
   */
  exports.parseSize = parseSize;

  /**
   * Load a image url.
   *
   * @param {String} src The target image url to pre-load
   * @param {Function} success (Optional) The callback for listen to image loaded.
   * @param {Function} error (Optional) error handler.
   */
  exports.load = function(src, success, error, option) {
    var img;
    if (!src) return error && error();
    if (typeof src === 'string') {
      img = new Image();
    } else {
      // for some image need to lazy load
      img = src;
      src = img.getAttibute('data-url') || img.getAttibute('data-src');
    }
    var reset = function() {
      img.onload = img.onerror = img = null;
      reset = null;
    }
    if (error) img.onerror = function() { error(img); reset(); }
    if (success) img.onload = function() { success(img); reset(); }
    img.src = src;
  }

});
// vim: set fdm=marker ts=2 sw=2 sts=2 tw=85 et :
