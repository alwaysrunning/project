/**
 * This module provides a UI for file selection and multiple file upload capability using
 * HTML5 XMLHTTPRequest Level 2 as a transport engine.
 *
 * @module lib/plugins/uploader/uploader
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
  'use strict';

  var _ = require('../../../lodash/3.1.0/lodash');
  var Events = require('./events');
  var Attribute = require('./attribute');
  var FileHTML5 = require('./filehtml5');
  var UploadButton = require('./uploadbutton');
  var utils = require('./utils');
  var nextTick = function(f) { setTimeout(f, 1) }

  /**
   * HTML5 File uploader contructor, UI optional customize <input type="file" /> `accept` and
   * `multiple` attribute, ref <http://www.w3schools.com/tags/att_input_accept.asp>
   *
   * @class Uploader
   * @constructor
   *
   * Uploader Options:
   *
   * - accept {String} Specifies the types of files that the server accepts, set to <input> element
   *                   attribute, e.g "image/*"
   *
   * - multiple {Boolean} Specifies that a user can enter more than one value in an <input> element.
   *
   * - uploadOnSelect {Boolean} Auto upload files when select, Defaults to false.
   *
   * - fileFilter {Function} A filtering function that is applied to every file selected by the user.
   *                        The function receives the `FileHTML5` object and must return a Boolean
   *                        value. If a `false` value is returned, the selected file ignored.
   *
   * - postVarsPerFile {String} An objects contains sets of k/v pairs for each file when POST to endpoint.
   */
  var Uploader = function(el, opts) {
    var self = this;
    opts = _.extend({

      /**
       * Auto upload files when select, Defaults to false.
       *
       * @attribute uploadOnSelect
       * @type {Boolean}
       * @default false
       */
      uploadOnSelect: false,

      /**
       * A filtering function that is applied to every file selected by the user.
       * The function receives the `FileHTML5` object and must return a Boolean value.
       * If a `false` value is returned, the file in question is not added to the
       * list of files to be uploaded.
       * Use this function to put limits on file sizes or check the file names for
       * correct extension, but make sure that a server-side check is also performed,
       * since any client-side restrictions are only advisory and can be circumvented.
       *
       * @type {Function}
       */
      fileFilter: null,

      /**
       * A String specifying what should be the POST field name for the file
       * content in the upload request.
       *
       * @type {String}
       * @default Filedata
       */
      fileFieldName: 'Filedata',

      /**
       * An object, keyed by `fileId`, containing sets of key-value pairs
       * that should be passed as POST variables along with each corresponding
       * file. This attribute is only used if no POST variables are specifed
       * in the upload method call.
       *
       * @attribute postVarsPerFile
       * @type {Object}
       * @default {}
       */
      postVarsPerFile: {},

      /**
       * Optimize options for scale images before upload to endpoint. The optimization options
       * includes: { width, height, quality }
       *
       * @attribute scale
       * @type {Object}
       */
      scale: null,

      /**
       * Upload multiple files synchronous, Defaults to false to upload files in parallel.
       *
       * @attribute sync
       * @default false
       */
      sync: false,

      /**
       * Classname for upload view wrapper (aka upload button className)
       *
       * @attribute className
       * @default ui-button-upload
       */
      className: 'ui-button-upload'

    }, opts);

    _.each(opts, function(v, k) { self.set(k, v); });

    self._fileList = [];
    self._uploader = null;

    self._initUploader(el);
  };

  _.extend(Uploader.prototype, Events.prototype, Attribute, {

    /**
     * Initialize upload button staffs.
     *
     * @protected
     */
    _initUploader: function(el) {
      var self = this;
      var buttonOpts = _.extend({
        accept: self.get('accept'),
        multiple: self.get('multiple'),
        className: self.get('className'),
        onChange: function(e) {
          var files = e.target.files;
          if (files) {
            self._updateFileList(files);
          }
          else {
            console.warn('No support for the File API in this web browser');
          }
        }
      });
      self._uploadQueue = [];
      self._uploader = new UploadButton(el, buttonOpts);
    },

    /**
     * Starts the upload of a specific file.
     *
     * @method upload
     * @param file {FileHTML5} Reference to the instance of the file to be uploaded.
     * @param url {String} The URL to upload the file to.
     * @param postVars {Object} (optional) A set of key-value pairs to send as variables along with the file upload HTTP request.
     *                          If not specified, the values from the attribute `postVarsPerFile` are used instead.
     */
    upload: function (file, url, postvars) {

      var uploadURL = url || this.get('endpoint') || this.get('uploadURL'),
          postVars = postvars || this.get('postVarsPerFile'),
          fileId = file.get('id');

          postVars = postVars.hasOwnProperty(fileId) ? postVars[fileId] : postVars;

      if (!uploadURL) {
        throw Error('Upload exception, the uploader endpointer not valid');
      }

      if (file instanceof FileHTML5) {

        file.on('uploadstart', this._uploadEventHandler, this);
        file.on('uploadprogress', this._uploadEventHandler, this);
        file.on('uploadcomplete', this._uploadEventHandler, this);
        file.on('uploaderror', this._uploadEventHandler, this);
        file.on('uploadcancel', this._uploadEventHandler, this);

        file.startUpload(uploadURL, postVars, this.get('fileFieldName'));
      }
    },

    /**
     * Handles and retransmits events fired by `FileHTML5`.
     *
     * @method _uploadEventHandler
     * @param event The event dispatched during the upload process.
     * @protected
     */
    _uploadEventHandler: function (event) {
      switch (event.type) {
        case 'uploadstart':
          this.emit('uploadstart', event);
        break;
        case 'uploadprogress':
          this.emit('uploadprogress', event);
        break;
        case 'uploadcomplete':
          this.emit('uploadcomplete', event);
        break;
        case 'uploaderror':
          this.emit('uploaderror', event);
        break;
        case 'uploadcancel':
          this.emit('uploadcancel', event);
        break;
      }
    },

    /**
     * Adjusts the content of the `fileList` based on the results of file selection
     *
     * @method _updateFileList
     * @param files {FileList} The file list received from the uploader.
     * @protected
     */
    _updateFileList: function(files) {
      var self = this,
          newfiles = files,
          parsedFiles = [],
          fileFilter = self.get('fileFilter'),
          scaleOptions = self.get('scale');

      if (fileFilter) {
        _.each(newfiles, function(value) {
          var newfile = new FileHTML5({ file: value, scale: scaleOptions });
          if (fileFilter(newfile)) {
            parsedFiles.push(newfile);
          } else {
            newfile.destroy();
          }
        });
      } else {
        _.each(newfiles, function(value) {
          parsedFiles.push(new FileHTML5({ file: value, scale: scaleOptions }));
        });
      }

      if (parsedFiles.length > 0) {
        var oldfiles = this.getFileList();

        this.enqueue(parsedFiles);
        this._fileList = oldfiles.concat(parsedFiles);

        this.emit('fileselect', {fileList: parsedFiles});

        if (this.get('uploadOnSelect')) {
          this.uploadThese(parsedFiles);
        }
      }
    },

    getFileList: function() {
      return this._fileList.concat();
    },

    enqueue: function(file) {
      var pending = this._uploadQueue, list = file;
      if (!(list instanceof Array)) {
        list = [ file ];
      }
      list.forEach(function(v, i) {
        if (v && pending.indexOf(v) === -1) {
          pending.push(v);
        }
      });
      return this
    },

    /**
     * Start to upload files in the pending queue.
     * `queueComplete` will be triggered when all files in the queue have been uploaded.
     *
     * @method startUpload
     */
    startUpload: function() {
      var self = this
      if (self.get('uploading')) {
        return;
      }
      self.set('uploading', true);

      var c = 0
        , pending = self._uploadQueue
        , parallelCount = self.get('sync') ? 1 : 4  // set parallel num to 4 when in sync mode
        , next = function() {
            while (c < parallelCount) {
              if (!pending.length) {
                return;
              }
              var f = pending.shift(); c++;
              f.once('ensure', function() { c--;
                if (!pending.length) {
                  self.set('uploading', false);
                  self.emit('queueComplete');
                  next = null;
                } else {
                  nextTick(next);
                }
              });
              self.upload(f);
            }
          };
      next();
    },

    uploadThese: function(files) {
      this.enqueue(files);
      this.startUpload();
    },

    removeFile: function(id) {
      this._fileList = _.filter(this._fileList, function(item) {
        if (item.get('id') === id) {
          item.destroy();
          self.emit('fileremove', {file: file});
          return false;
        }
        return true;
      });
    },

    destroy: function() {
      this._fileList = [];
      this.removeAllListeners();
      this._uploader.destroy();
      this._uploader = null;
    }

  });

  // Attaches static utilities.
  Uploader.genImageFileThumbnail = utils.genImageFileThumbnail;

  return Uploader;
});

/* vim: set fdm=marker et ff=unix et sw=2 ts=2 sts=2 tw=100: */
