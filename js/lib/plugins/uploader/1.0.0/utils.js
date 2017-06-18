/**
 * Upload file utils.
 *
 * @module lib/plugins/uploader/utils
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var document = window.document;

  function isNum(o) { return typeof o === 'number' }
  function extend(r, s) { for (var k in s) if (s.hasOwnProperty(k)) r[k] = s[k]; return r }

  // re-calcuate image size by limit region
  function scaleImageSize(img, max_w, max_h) {
    var w = img.width, h = img.height, scale = w / h;
    if (w > 0 && h > 0) {
      if (scale >= max_w / max_h) {
        if (w > max_w) {
          w = max_w;
          h = w / scale;
        }
      } else {
        if (h > max_h) {
          h = max_h;
          w = h * scale;
        }
      }
    }
    return {width: ~~w, height: ~~h}
  }

  // Compress image, Returns a new image object with compressed dataURI
  function compress(img, output) {
    output = output || {}
    var quality = output.quality || 0.9
      , outputFormat = output.format
      , mimetype = output.mimetype || 'image/jpeg'
      , width = img.naturalWidth || img.width
      , height = img.naturalHeight || img.height
      , maxSize, maxW, maxH

    if (isNum(maxW = output.width) && isNum(maxH = output.height)) {
      var size = scaleImageSize({ width: width, height: height }, maxW, maxH)
      width = size.width
      height = size.height
    }

    if (quality > 1)
      quality /= 100

    if (outputFormat !== undefined && outputFormat === 'png')
      mimetype = 'image/png'

    // Scaling images with canvas
    var cvs = document.createElement('canvas')
    cvs.width = width
    cvs.height = height

    var ctx = cvs.getContext('2d').drawImage(img, 0, 0, width, height)
    var newImageData = cvs.toDataURL(mimetype, quality)
    var o = new Image()
    o.src = newImageData

    return o;
  }

  // https://gist.github.com/allex/5098339
  // generate a thumbnail by scaling images with canvas
  function getThumbnail(src, opts, callback) {
    var img = new Image();
    img.onload = function(e) {
      var i = compress(img, opts)
      callback(i.src);
    };
    img.src = src;
  }

  function scaleImageFile(oFile, opts, callback) {
    if (typeof FileReader !== 'undefined' && (/image/i).test(oFile.type)) {
      blob2uri(oFile, function(dataURI) {
        var img = new Image();
        img.onload = function(e) {
          var i = compress(img, extend({mimetype: oFile.type}, opts))
          callback(uri2blob(i.src));
        };
        img.src = dataURI;
      })
    } else {
      callback(oFile);
    }
  }

  function blob2uri(blob, cb) {
    var oReader = new FileReader();
    oReader.onload = function(e) {
      cb(oReader.result);
      oReader = oReader.onload = null;
    };
    // read selected file as DataURL
    oReader.readAsDataURL(blob);
  }

  function uri2blob(dataUri) {
    var arr = dataUri.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }

  /**
   * Generate file preview image by FileReader
   *
   * @param {File} oFile The html file instance.
   * @param {Object} opts Options to limits thumbnail images. { width, height, type }
   * @param {Function} The callback to executed when image generated.
   */
  exports.genImageFileThumbnail = function(oFile, opts, callback) {
    if (typeof FileReader !== 'undefined' && (/image/i).test(oFile.type)) {
      blob2uri(oFile, function(dataURI) {
        getThumbnail(dataURI, opts, callback)
      })
    } else {
      callback(null);
    }
  }

  /**
   * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
   *
   * @param {File|Blob} img The source image file object
   * @param {Object} options Specific compress output option, The accessible options
   * list below:
   *  - width {Integer} Scaling image with a specific max width
   *  - height {Integer} Scaling image with a specific max height
   *  - quality {Integer} The output quality of Image Object
   *  - format {String} Possible values are jpg and png
   * @param {Function} callback Async callback with a new File instance scaled.
   *
   * @return {Image} The compressed Image Object
   */
  exports.scaleImageFile = scaleImageFile;

});
