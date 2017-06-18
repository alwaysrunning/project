/*
Uploadify v3.2.1
Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
Last modified by Allex Wang (allex.wxn@gmail.com)
*/
(function f(e, f, o) {
  if ("function" == typeof define && define.amd) define(o); else if ("undefined" != typeof module) o(require, module.exports, module); else {
    var n = {exports: {}};
    o(null, n.exports, n), e[f] = n.exports;
  }
}(this, 'Uploadify', function( require, exports, module ) {
    'use strict';

    var $ = require('jquery');
    var swfobject = require('../../swfobject/2.3/swfobject');
    var SWFUpload = require('../../swfupload/2.2/swfupload');

    function forEach(o, fn) {
        var i = -1, l = o.length;
        if (o.forEach) o.forEach(fn)
        else if (l) {
            while (++i < l) fn(o[i], i);
        } else {
            for (i in o) if (o.hasOwnProperty(i)) {
                fn(o[i], i);
            }
        }
    }

    function calculateViewSize(elem) {
        var size = {
            width: elem.offsetWidth,
            height: elem.offsetHeight
        };
        var sides = {'width': ['left', 'right'], 'height': ['top', 'bottom']};
        var $el = $(elem);
        forEach(size, function(v, k) {
            forEach(sides[k], function(side, i) {
                v -= parseInt($el.css('border-' + side + '-width'), 10) || 0;
            });
            size[k] = v;
        });
        return size;
    }

    // These methods can be called by adding them as the first argument in the uploadify plugin call
    var methods = {// {{{

        init : function(options, swfUploadOptions) {

            return this.each(function(i, el) {

                // Create a reference to the jQuery DOM object
                var $this = $(el);

                // Clone the original DOM object
                var $clone = $this.clone();

                // Setup the default options
                var settings = $.extend({// {{{
                    // Required Settings
                    id       : $this.attr('id'), // The ID of the DOM object
                    swf      : 'uploadify.swf',  // The path to the uploadify SWF file
                    uploader : 'uploadify.php',  // The path to the server-side upload script

                    // Options
                    auto            : true,               // Automatically upload files when added to the queue
                    buttonClass     : '',                 // A class name to add to the browse button DOM object
                    buttonCursor    : 'hand',             // The cursor to use with the browse button
                    buttonImage     : null,               // (String or null) The path to an image to use for the Flash browse button if not using CSS to style the button
                    buttonText      : 'SELECT FILES',     // The text to use for the browse button
                    checkExisting   : false,              // The path to a server-side script that checks for existing files on the server
                    debug           : false,              // Turn on swfUpload debugging mode
                    fileObjName     : 'Filedata',         // The name of the file object to use in your server-side script
                    fileSizeLimit   : 0,                  // The maximum size of an uploadable file in KB (Accepts units B KB MB GB if string, 0 for no limit)
                    fileTypeDesc    : 'All Files',        // The description for file types in the browse dialog
                    fileTypeExts    : '*.*',              // Allowed extensions in the browse dialog (server-side validation should also be used)
                    height          : 30,                 // The height of the browse button
                    itemTemplate    : false,              // The template for the file item in the queue
                    method          : 'post',             // The method to use when sending files to the server-side upload script
                    multi           : true,               // Allow multiple file selection in the browse dialog
                    formData        : {},                 // An object with additional data to send to the server-side upload script with every file upload
                    preventCaching  : true,               // Adds a random value to the Flash URL to prevent caching of it (conflicts with existing parameters)
                    progressData    : 'percentage',       // ('percentage' or 'speed') Data to show in the queue item during a file upload
                    queueID         : false,              // The ID of the DOM object to use as a file queue (without the #)
                    queueSizeLimit  : 999,                // The maximum number of files that can be in the queue at one time
                    removeCompleted : true,               // Remove queue items from the queue when they are done uploading
                    removeTimeout   : 3,                  // The delay in seconds before removing a queue item if removeCompleted is set to true
                    requeueErrors   : false,              // Keep errored files in the queue and keep trying to upload them
                    successTimeout  : 30,                 // The number of seconds to wait for Flash to detect the server's response after the file has finished uploading
                    uploadLimit     : 0,                  // The maximum number of files you can upload
                    width           : 120,                // The width of the browse button

                    // Events
                    overrideEvents  : []             // (Array) A list of default event handlers to skip
                    /*
                    onCancel         // Triggered when a file is cancelled from the queue
                    onClearQueue     // Triggered during the 'clear queue' method
                    onDestroy        // Triggered when the uploadify object is destroyed
                    onDialogClose    // Triggered when the browse dialog is closed
                    onDialogOpen     // Triggered when the browse dialog is opened
                    onDisable        // Triggered when the browse button gets disabled
                    onEnable         // Triggered when the browse button gets enabled
                    onFallback       // Triggered is Flash is not detected
                    onInit           // Triggered when Uploadify is initialized
                    onQueueComplete  // Triggered when all files in the queue have been uploaded
                    onSelectError    // Triggered when an error occurs while selecting a file (file size, queue size limit, etc.)
                    onSelect         // Triggered for each file that is selected
                    onSWFReady       // Triggered when the SWF button is loaded
                    onUploadComplete // Triggered when a file upload completes (success or error)
                    onUploadError    // Triggered when a file upload returns an error
                    onUploadSuccess  // Triggered when a file is uploaded successfully
                    onUploadProgress // Triggered every time a file progress is updated
                    onUploadStart    // Triggered immediately before a file upload starts
                    */
                }, options);// }}}

                // Prepare settings for SWFUpload
                var swfUploadSettings = {// {{{
                    assume_success_timeout   : settings.successTimeout,
                    button_placeholder_id    : settings.id,
                    button_width             : settings.width,
                    button_height            : settings.height,
                    button_text              : null,
                    button_text_style        : null,
                    button_text_top_padding  : 0,
                    button_text_left_padding : 0,
                    button_action            : (settings.multi ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILE),
                    button_disabled          : false,
                    button_cursor            : (settings.buttonCursor == 'arrow' ? SWFUpload.CURSOR.ARROW : SWFUpload.CURSOR.HAND),
                    button_window_mode       : SWFUpload.WINDOW_MODE.TRANSPARENT,
                    debug                    : settings.debug,
                    requeue_on_error         : settings.requeueErrors,
                    file_post_name           : settings.fileObjName,
                    file_size_limit          : settings.fileSizeLimit,
                    file_types               : settings.fileTypeExts,
                    file_types_description   : settings.fileTypeDesc,
                    file_queue_limit         : settings.queueSizeLimit,
                    file_upload_limit        : settings.uploadLimit,
                    flash_url                : settings.swf,
                    prevent_swf_caching      : settings.preventCaching,
                    post_params              : settings.formData,
                    upload_url               : settings.uploader,
                    use_query_string         : (settings.method == 'get'),

                    // Event Handlers
                    file_dialog_complete_handler : handlers.onDialogClose,
                    file_dialog_start_handler    : handlers.onDialogOpen,
                    file_queued_handler          : handlers.onSelect,
                    file_queue_error_handler     : handlers.onSelectError,
                    swfupload_loaded_handler     : settings.onSWFReady,
                    upload_complete_handler      : handlers.onUploadComplete,
                    upload_error_handler         : handlers.onUploadError,
                    upload_progress_handler      : handlers.onUploadProgress,
                    upload_start_handler         : handlers.onUploadStart,
                    upload_success_handler       : handlers.onUploadSuccess
                };// }}}

                // Merge the user-defined options with the defaults
                if (swfUploadOptions) {
                    swfUploadSettings = $.extend(swfUploadSettings, swfUploadOptions);
                }
                // Add the user-defined settings to the swfupload object
                swfUploadSettings = $.extend(swfUploadSettings, settings);

                // Detect if Flash is available
                var playerVersion  = swfobject.getFlashPlayerVersion();
                var flashInstalled = (playerVersion.major >= 9);

                if (flashInstalled) {
                    var id = settings.id;

                    if (!$('#uploadify-css')[0]) {
                        var _css = '.uploadify-button-wrapper{position:absolute;top:0;left:0;}'
                            $('head').append('<style type="text/css" id="uploadify-css">' +
                                (settings.css || _css) + (settings.cssAddon || '') + '</style>');
                    }

                    if ($this.css('position') === 'static') {
                        $this.css('position', 'relative');
                    }

                    var viewSize = calculateViewSize(el);
                    var $button = $this;
                    var $wrapper = $('<div class="uploadify-button-wrapper"><div id="' + id + '"></div></div>').appendTo($this);

                    $wrapper.css(viewSize);

                    // Create the swfUpload instance
                    var swfuploadify = new SWFUpload(
                        $.extend(swfUploadSettings, {
                            button_width: viewSize.width,
                            button_height: viewSize.height
                        })
                    );

                    // Add the SWFUpload object to the elements data object
                    $this.data('uploadify', swfuploadify);

                    $wrapper.attr('id', id)
                        .data('uploadify', swfuploadify)
                        .delegate('.cancel a', 'click', function(e) {
                            var fileId = $(e.target).data('file-id');
                            if (fileId) {
                                FlashUpload.call(id, 'cancel', fileId);
                            }
                        });

                    // Create the file queue wrapper container
                    if (!settings.queueID) {
                        var $queue = $('<div />', {
                          'id'    : settings.id + '-queue',
                          'class' : 'uploadify-queue'
                        });
                        $wrapper.after($queue);
                        swfuploadify.settings.queueID = settings.id + '-queue';
                        swfuploadify.settings.defaultQueue = true;
                    }

                    // Create some queue related objects and variables
                    swfuploadify.queueData = {
                        files              : {}, // The files in the queue
                        filesSelected      : 0, // The number of files selected in the last select operation
                        filesQueued        : 0, // The number of files added to the queue in the last select operation
                        filesReplaced      : 0, // The number of files replaced in the last select operation
                        filesCancelled     : 0, // The number of files that were cancelled instead of replaced
                        filesErrored       : 0, // The number of files that caused error in the last select operation
                        uploadsSuccessful  : 0, // The number of files that were successfully uploaded
                        uploadsErrored     : 0, // The number of files that returned errors during upload
                        averageSpeed       : 0, // The average speed of the uploads in KB
                        queueLength        : 0, // The number of files in the queue
                        queueSize          : 0, // The size in bytes of the entire queue
                        uploadSize         : 0, // The size in bytes of the upload queue
                        queueBytesUploaded : 0, // The size in bytes that have been uploaded for the current upload queue
                        uploadQueue        : [], // The files currently to be uploaded
                        errorMsg           : 'Some files were not added to the queue:'
                    };

                    // Save references to all the objects
                    swfuploadify.original = $clone;
                    swfuploadify.wrapper  = $wrapper;
                    swfuploadify.button   = $button;
                    swfuploadify.queue    = $queue;

                    // Call the user-defined init event handler
                    if (settings.onInit) settings.onInit.call($this, swfuploadify);

                } else {

                    // Call the fallback function
                    if (settings.onFallback) settings.onFallback.call($this);
                }
            });
        },

        // Stop a file upload and remove it from the queue
        cancel : function(fileID, supressEvent) {

            var args = arguments;

            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this        = $(this),
                    swfuploadify = $this.data('uploadify'),
                    settings     = swfuploadify.settings,
                    delay        = -1;

                if (args[0]) {
                    // Clear the queue
                    if (args[0] == '*') {
                        var queueItemCount = swfuploadify.queueData.queueLength;
                        $('#' + settings.queueID).find('.uploadify-queue-item').each(function() {
                            delay++;
                            if (args[1] === true) {
                                swfuploadify.cancelUpload($(this).attr('id'), false);
                            } else {
                                swfuploadify.cancelUpload($(this).attr('id'));
                            }
                            $(this).find('.data').removeClass('data').html(' - Cancelled');
                            $(this).find('.uploadify-progress-bar').remove();
                            $(this).delay(1000 + 100 * delay).fadeOut(500, function() {
                                $(this).remove();
                            });
                        });
                        swfuploadify.queueData.queueSize   = 0;
                        swfuploadify.queueData.queueLength = 0;
                        // Trigger the onClearQueue event
                        if (settings.onClearQueue) settings.onClearQueue.call($this, queueItemCount);
                    } else {
                        for (var n = 0; n < args.length; n++) {
                            swfuploadify.cancelUpload(args[n]);
                            $('#' + args[n]).find('.data').removeClass('data').html(' - Cancelled');
                            $('#' + args[n]).find('.uploadify-progress-bar').remove();
                            $('#' + args[n]).delay(1000 + 100 * n).fadeOut(500, function() {
                                $(this).remove();
                            });
                        }
                    }
                } else {
                    var item = $('#' + settings.queueID).find('.uploadify-queue-item').get(0);
                    $item = $(item);
                    swfuploadify.cancelUpload($item.attr('id'));
                    $item.find('.data').removeClass('data').html(' - Cancelled');
                    $item.find('.uploadify-progress-bar').remove();
                    $item.delay(1000).fadeOut(500, function() {
                        $(this).remove();
                    });
                }
            });

        },

        // Revert the DOM object back to its original state
        destroy : function() {

            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this        = $(this),
                    swfuploadify = $this.data('uploadify'),
                    settings     = swfuploadify.settings;

                // Destroy the SWF object and
                swfuploadify.destroy();

                // Destroy the queue
                if (settings.defaultQueue) {
                    $('#' + settings.queueID).remove();
                }

                // Reload the original DOM element
                $('#' + settings.id).replaceWith(swfuploadify.original);

                // Call the user-defined event handler
                if (settings.onDestroy) settings.onDestroy.call(this);

                swfuploadify = null;
            });

        },

        // Disable the select button
        disable : function(isDisabled) {

            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this        = $(this),
                    swfuploadify = $this.data('uploadify'),
                    settings     = swfuploadify.settings;

                // Call the user-defined event handlers
                if (isDisabled) {
                    swfuploadify.button.addClass('disabled');
                    if (settings.onDisable) settings.onDisable.call(this);
                } else {
                    swfuploadify.button.removeClass('disabled');
                    if (settings.onEnable) settings.onEnable.call(this);
                }

                // Enable/disable the browse button
                swfuploadify.setButtonDisabled(isDisabled);
            });

        },

        // Get or set the settings data
        settings : function(name, value, resetObjects) {

            var args        = arguments;
            var returnValue = value;

            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this        = $(this),
                    swfuploadify = $this.data('uploadify'),
                    settings     = swfuploadify.settings;

                if (typeof(args[0]) == 'object') {
                    for (var n in value) {
                        setData(n,value[n]);
                    }
                }
                if (args.length === 1) {
                    returnValue =  settings[name];
                } else {
                    switch (name) {
                        case 'uploader':
                            swfuploadify.setUploadURL(value);
                            break;
                        case 'formData':
                            if (!resetObjects) {
                                value = $.extend(settings.formData, value);
                            }
                            swfuploadify.setPostParams(settings.formData);
                            break;
                        case 'method':
                            if (value == 'get') {
                                swfuploadify.setUseQueryString(true);
                            } else {
                                swfuploadify.setUseQueryString(false);
                            }
                            break;
                        case 'fileObjName':
                            swfuploadify.setFilePostName(value);
                            break;
                        case 'fileTypeExts':
                            swfuploadify.setFileTypes(value, settings.fileTypeDesc);
                            break;
                        case 'fileTypeDesc':
                            swfuploadify.setFileTypes(settings.fileTypeExts, value);
                            break;
                        case 'fileSizeLimit':
                            swfuploadify.setFileSizeLimit(value);
                            break;
                        case 'uploadLimit':
                            swfuploadify.setFileUploadLimit(value);
                            break;
                        case 'queueSizeLimit':
                            swfuploadify.setFileQueueLimit(value);
                            break;
                        case 'buttonImage':
                            swfuploadify.button.css('background-image', settingValue);
                            break;
                        case 'buttonCursor':
                            if (value == 'arrow') {
                                swfuploadify.setButtonCursor(SWFUpload.CURSOR.ARROW);
                            } else {
                                swfuploadify.setButtonCursor(SWFUpload.CURSOR.HAND);
                            }
                            break;
                        case 'buttonText':
                            $('#' + settings.id + '-button').find('.uploadify-button-text').html(value);
                            break;
                        case 'width':
                            swfuploadify.setButtonDimensions(value, settings.height);
                            break;
                        case 'height':
                            swfuploadify.setButtonDimensions(settings.width, value);
                            break;
                        case 'multi':
                            if (value) {
                                swfuploadify.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILES);
                            } else {
                                swfuploadify.setButtonAction(SWFUpload.BUTTON_ACTION.SELECT_FILE);
                            }
                            break;
                    }
                    settings[name] = value;
                }
            });

            if (args.length === 1) {
                return returnValue;
            }

        },

        // Stop the current uploads and requeue what is in progress
        stop : function() {

            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this        = $(this),
                    swfuploadify = $this.data('uploadify');

                // Reset the queue information
                swfuploadify.queueData.averageSpeed  = 0;
                swfuploadify.queueData.uploadSize    = 0;
                swfuploadify.queueData.bytesUploaded = 0;
                swfuploadify.queueData.uploadQueue   = [];

                swfuploadify.stopUpload();
            });

        },

        // Start uploading files in the queue
        upload : function() {

            var args = arguments;

            this.each(function() {
                // Create a reference to the jQuery DOM object
                var $this        = $(this),
                    swfuploadify = $this.data('uploadify');

                // Reset the queue information
                swfuploadify.queueData.averageSpeed  = 0;
                swfuploadify.queueData.uploadSize    = 0;
                swfuploadify.queueData.bytesUploaded = 0;
                swfuploadify.queueData.uploadQueue   = [];

                // Upload the files
                if (args[0]) {
                    if (args[0] == '*') {
                        swfuploadify.queueData.uploadSize = swfuploadify.queueData.queueSize;
                        swfuploadify.queueData.uploadQueue.push('*');
                        swfuploadify.startUpload();
                    } else {
                        for (var n = 0; n < args.length; n++) {
                            swfuploadify.queueData.uploadSize += swfuploadify.queueData.files[args[n]].size;
                            swfuploadify.queueData.uploadQueue.push(args[n]);
                        }
                        swfuploadify.startUpload(swfuploadify.queueData.uploadQueue.shift());
                    }
                } else {
                    swfuploadify.startUpload();
                }

            });

        }

    };// }}}

    // These functions handle all the events that occur with the file uploader
    var handlers = {// {{{

        // Triggered when the file dialog is opened
        onDialogOpen : function() {
            // Load the swfupload settings
            var settings = this.settings;

            // Reset some queue info
			      this.queueData.errorMsg       = 'Some files were not added to the queue:';
            this.queueData.filesReplaced  = 0;
            this.queueData.filesCancelled = 0;

            // Call the user-defined event handler
            if (settings.onDialogOpen) settings.onDialogOpen.call(this);
        },

        // Triggered when the browse dialog is closed
        onDialogClose :  function(filesSelected, filesQueued, queueLength) {
            // Load the swfupload settings
            var settings = this.settings;

            // Update the queue information
            this.queueData.filesErrored  = filesSelected - filesQueued;
            this.queueData.filesSelected = filesSelected;
            this.queueData.filesQueued   = filesQueued - this.queueData.filesCancelled;
            this.queueData.queueLength   = queueLength;

            // Run the default event handler
            if ($.inArray('onDialogClose', settings.overrideEvents) < 0) {
                if (this.queueData.filesErrored > 0) {
                    alert(this.queueData.errorMsg);
                }
            }

            // Call the user-defined event handler
            if (settings.onDialogClose) settings.onDialogClose.call(this, this.queueData);

            // Upload the files if auto is true
            if (settings.auto) {
                FlashUpload.call(settings.id, 'upload', '*');
            }
        },

        // Triggered once for each file added to the queue
        onSelect : function(file) {
            // Load the swfupload settings
            var settings = this.settings;

            // Check if a file with the same name exists in the queue
            var queuedFile = {};
            for (var n in this.queueData.files) {
                queuedFile = this.queueData.files[n];
                if (queuedFile.uploaded != true && queuedFile.name == file.name) {
                    var replaceQueueItem = confirm('The file named "' + file.name + '" is already in the queue.\nDo you want to replace the existing item in the queue?');
                    if (!replaceQueueItem) {
                        this.cancelUpload(file.id);
                        this.queueData.filesCancelled++;
                        return false;
                    } else {
                        $('#' + queuedFile.id).remove();
                        this.cancelUpload(queuedFile.id);
                        this.queueData.filesReplaced++;
                    }
                }
            }

            // Get the size of the file
            var fileSize = Math.round(file.size / 1024);
            var suffix   = 'KB';
            if (fileSize > 1000) {
                fileSize = Math.round(fileSize / 1000);
                suffix   = 'MB';
            }
            var fileSizeParts = fileSize.toString().split('.');
            fileSize = fileSizeParts[0];
            if (fileSizeParts.length > 1) {
                fileSize += '.' + fileSizeParts[1].substr(0,2);
            }
            fileSize += suffix;

            // Truncate the filename if it's too long
            var fileName = file.name;
            if (fileName.length > 25) {
                fileName = fileName.substr(0,25) + '...';
            }

            // Create the file data object
            var itemData = {
                'fileID'     : file.id,
                'instanceID' : settings.id,
                'fileName'   : fileName,
                'fileSize'   : fileSize
            }

            var itemHTML = settings.itemTemplate

            // Create the file item template
            if (itemHTML == false) {
                itemHTML = ['<div id="${fileID}" class="uploadify-queue-item">',
                    '<div class="cancel">',
                        '<a href="javascript:;" data-file-id="${fileID}">X</a>',
                    '</div>',
                    '<span class="fileName">${fileName} (${fileSize})</span><span class="data"></span>',
                    '<div class="uploadify-progress">',
                        '<div class="uploadify-progress-bar"><!--Progress Bar--></div>',
                    '</div>',
                '</div>'].join('');
            }

            // Run the default event handler
            if (itemHTML && $.inArray('onSelect', settings.overrideEvents) < 0) {

                // Replace the item data in the template
                itemHTML = itemHTML.replace(/\$\{([^}]+)\}/g, function($0, $1) { return itemData[$1] || $0 });

                // Add the file item to the queue
                $('#' + settings.queueID).append(itemHTML);
            }

            this.queueData.queueSize += file.size;
            this.queueData.files[file.id] = file;

            // Call the user-defined event handler
            if (settings.onSelect) settings.onSelect.apply(this, arguments);
        },

        // Triggered when a file is not added to the queue
        onSelectError : function(file, errorCode, errorMsg) {
            // Load the swfupload settings
            var settings = this.settings;

            // Run the default event handler
            if ($.inArray('onSelectError', settings.overrideEvents) < 0) {
                switch(errorCode) {
                    case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
                        if (settings.queueSizeLimit > errorMsg) {
                            this.queueData.errorMsg += '\nThe number of files selected exceeds the remaining upload limit (' + errorMsg + ').';
                        } else {
                            this.queueData.errorMsg += '\nThe number of files selected exceeds the queue size limit (' + settings.queueSizeLimit + ').';
                        }
                        break;
                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                        this.queueData.errorMsg += '\nThe file "' + file.name + '" exceeds the size limit (' + settings.fileSizeLimit + ').';
                        break;
                    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
						            this.queueData.errorMsg += '\nThe file "' + file.name + '" is empty.';
                        break;
                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
						            this.queueData.errorMsg += '\nThe file "' + file.name + '" is not an accepted file type (' + settings.fileTypeDesc + ').';
                        break;
                }
            }
            if (errorCode != SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                delete this.queueData.files[file.id];
            }

            // Call the user-defined event handler
            if (settings.onSelectError) settings.onSelectError.apply(this, arguments);
        },

        // Triggered when all the files in the queue have been processed
        onQueueComplete : function() {
            if (this.settings.onQueueComplete) this.settings.onQueueComplete.call(this, this.settings.queueData);
        },

        // Triggered when a file upload successfully completes
        onUploadComplete : function(file) {
            // Load the swfupload settings
            var settings     = this.settings,
                swfuploadify = this;

            // Check if all the files have completed uploading
            var stats = this.getStats();
            this.queueData.queueLength = stats.files_queued;
            if (this.queueData.uploadQueue[0] == '*') {
                if (this.queueData.queueLength > 0) {
                    this.startUpload();
                } else {
                    this.queueData.uploadQueue = [];

                    // Call the user-defined event handler for queue complete
                    if (settings.onQueueComplete) settings.onQueueComplete.call(this, this.queueData);
                }
            } else {
                if (this.queueData.uploadQueue.length > 0) {
                    this.startUpload(this.queueData.uploadQueue.shift());
                } else {
                    this.queueData.uploadQueue = [];

                    // Call the user-defined event handler for queue complete
                    if (settings.onQueueComplete) settings.onQueueComplete.call(this, this.queueData);
                }
            }

            // Call the default event handler
            if ($.inArray('onUploadComplete', settings.overrideEvents) < 0) {
                if (settings.removeCompleted) {
                    switch (file.filestatus) {
                        case SWFUpload.FILE_STATUS.COMPLETE:
                            setTimeout(function() {
                                if ($('#' + file.id)) {
                                    swfuploadify.queueData.queueSize   -= file.size;
                                    swfuploadify.queueData.queueLength -= 1;
                                    delete swfuploadify.queueData.files[file.id]
                                    $('#' + file.id).fadeOut(500, function() {
                                        $(this).remove();
                                    });
                                }
                            }, settings.removeTimeout * 1000);
                            break;
                        case SWFUpload.FILE_STATUS.ERROR:
                            if (!settings.requeueErrors) {
                                setTimeout(function() {
                                    if ($('#' + file.id)) {
                                        swfuploadify.queueData.queueSize   -= file.size;
                                        swfuploadify.queueData.queueLength -= 1;
                                        delete swfuploadify.queueData.files[file.id];
                                        $('#' + file.id).fadeOut(500, function() {
                                            $(this).remove();
                                        });
                                    }
                                }, settings.removeTimeout * 1000);
                            }
                            break;
                    }
                } else {
                    file.uploaded = true;
                }
            }

            // Call the user-defined event handler
            if (settings.onUploadComplete) settings.onUploadComplete.call(this, file);
        },

        // Triggered when a file upload returns an error
        onUploadError : function(file, errorCode, errorMsg) {
            // Load the swfupload settings
            var settings = this.settings;

            // Set the error string
            var errorString = 'Error';
            switch(errorCode) {
                case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                    errorString = 'HTTP Error (' + errorMsg + ')';
                    break;
                case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                    errorString = 'Missing Upload URL';
                    break;
                case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                    errorString = 'IO Error';
                    break;
                case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                    errorString = 'Security Error';
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                    alert('The upload limit has been reached (' + errorMsg + ').');
                    errorString = 'Exceeds Upload Limit';
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                    errorString = 'Failed';
                    break;
                case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                    errorString = 'Validation Error';
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                    errorString = 'Cancelled';
                    this.queueData.queueSize   -= file.size;
                    this.queueData.queueLength -= 1;
                    if (file.status == SWFUpload.FILE_STATUS.IN_PROGRESS || $.inArray(file.id, this.queueData.uploadQueue) >= 0) {
                        this.queueData.uploadSize -= file.size;
                    }
                    // Trigger the onCancel event
                    if (settings.onCancel) settings.onCancel.call(this, file);
                    delete this.queueData.files[file.id];
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                    errorString = 'Stopped';
                    break;
            }

            // Call the default event handler
            if ($.inArray('onUploadError', settings.overrideEvents) < 0) {

                if (errorCode != SWFUpload.UPLOAD_ERROR.FILE_CANCELLED && errorCode != SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED) {
                    $('#' + file.id).addClass('uploadify-error');
                }

                // Reset the progress bar
                $('#' + file.id).find('.uploadify-progress-bar').css('width','1px');

                // Add the error message to the queue item
                if (errorCode != SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND && file.status != SWFUpload.FILE_STATUS.COMPLETE) {
                    $('#' + file.id).find('.data').html(' - ' + errorString);
                }
            }

            var stats = this.getStats();
            this.queueData.uploadsErrored = stats.upload_errors;

            // Call the user-defined event handler
            if (settings.onUploadError) settings.onUploadError.call(this, file, errorCode, errorMsg, errorString);
        },

        // Triggered periodically during a file upload
        onUploadProgress : function(file, fileBytesLoaded, fileTotalBytes) {
            // Load the swfupload settings
            var settings = this.settings;

            // Setup all the variables
            var timer            = new Date();
            var newTime          = timer.getTime();
            var lapsedTime       = newTime - this.timer;
            if (lapsedTime > 500) {
                this.timer = newTime;
            }
            var lapsedBytes      = fileBytesLoaded - this.bytesLoaded;
            this.bytesLoaded     = fileBytesLoaded;
            var queueBytesLoaded = this.queueData.queueBytesUploaded + fileBytesLoaded;
            var percentage       = Math.round(fileBytesLoaded / fileTotalBytes * 100);

            // Calculate the average speed
            var suffix = 'KB/s';
            var mbs = 0;
            var kbs = (lapsedBytes / 1024) / (lapsedTime / 1000);
                kbs = Math.floor(kbs * 10) / 10;
            if (this.queueData.averageSpeed > 0) {
                this.queueData.averageSpeed = Math.floor((this.queueData.averageSpeed + kbs) / 2);
            } else {
                this.queueData.averageSpeed = Math.floor(kbs);
            }
            if (kbs > 1000) {
                mbs = (kbs * .001);
                this.queueData.averageSpeed = Math.floor(mbs);
                suffix = 'MB/s';
            }

            // Call the default event handler
            if ($.inArray('onUploadProgress', settings.overrideEvents) < 0) {
                if (settings.progressData == 'percentage') {
                    $('#' + file.id).find('.data').html(' - ' + percentage + '%');
                } else if (settings.progressData == 'speed' && lapsedTime > 500) {
                    $('#' + file.id).find('.data').html(' - ' + this.queueData.averageSpeed + suffix);
                }
                $('#' + file.id).find('.uploadify-progress-bar').css('width', percentage + '%');
            }

            // Call the user-defined event handler
            if (settings.onUploadProgress) settings.onUploadProgress.call(this, file, fileBytesLoaded, fileTotalBytes, queueBytesLoaded, this.queueData.uploadSize);
        },

        // Triggered right before a file is uploaded
        onUploadStart : function(file) {
            // Load the swfupload settings
            var settings = this.settings;

            var timer        = new Date();
            this.timer       = timer.getTime();
            this.bytesLoaded = 0;
            if (this.queueData.uploadQueue.length == 0) {
                this.queueData.uploadSize = file.size;
            }
            if (settings.checkExisting) {
                $.ajax({
                    type    : 'POST',
                    async   : false,
                    url     : settings.checkExisting,
                    data    : {filename: file.name},
                    success : function(data) {
                        if (data == 1) {
                            var overwrite = confirm('A file with the name "' + file.name + '" already exists on the server.\nWould you like to replace the existing file?');
                            if (!overwrite) {
                                this.cancelUpload(file.id);
                                $('#' + file.id).remove();
                                if (this.queueData.uploadQueue.length > 0 && this.queueData.queueLength > 0) {
                                    if (this.queueData.uploadQueue[0] == '*') {
                                        this.startUpload();
                                    } else {
                                        this.startUpload(this.queueData.uploadQueue.shift());
                                    }
                                }
                            }
                        }
                    }
                });
            }

            // Call the user-defined event handler
            if (settings.onUploadStart) settings.onUploadStart.call(this, file);
        },

        // Triggered when a file upload returns a successful code
        onUploadSuccess : function(file, data, response) {

            // Load the swfupload settings
            var settings = this.settings;
            var stats    = this.getStats();

            this.queueData.uploadsSuccessful = stats.successful_uploads;
            this.queueData.queueBytesUploaded += file.size;

            // Call the default event handler
            if ($.inArray('onUploadSuccess', settings.overrideEvents) < 0) {
                $('#' + file.id).find('.data').html(' - Complete');
            }

            // Try to parse the response data as a JSON object.
            try {
                data = data.replace(/\/\*[\s\S]*?\*\//g, ''); // remove comments
                data = $.parseJSON(data);
            } catch (e) {}

            // Call the user-defined event handler
            if (settings.onUploadSuccess) settings.onUploadSuccess.call(this, file, data, response);
        }
    };// }}}

    var guidSeed = (((1 + Math.random()) * 0x10000) | 0);
    function guid(i){return i=i||'',i+(++guidSeed).toString(32)}
    function noop() {}
    function implEventEmitter(n,e){n=n||{};var t=$(n),o=Array.prototype.slice;return e=e||n.name,$.each({on:"on",un:"off",once:"one",emit:"trigger"},function(r,i){n[r]=function(n){var c=o.call(arguments,0),u=c[1];return e&&!~n.indexOf(".")&&(c[0]=n+"."+e),"function"==typeof u&&("on"===r||"once"===r?c[1]=u.__||(u.__=function(n){return n.preventDefault(),u.apply(this,o.call(arguments,1))}):"un"===r&&(c[1]=u.__)),t[i].apply(t,c)}}),n}
    function capitalize(s) { return s.replace(/\b[a-z]/g, function($0) { return $0.toUpperCase() }) }

    /**
     * FlashUpload class implements
     *
     * @constructor
     *
     * @event
     *
     * - cancel         // Triggered when a file is cancelled from the queue
     * - clearQueue     // Triggered during the 'clear queue' method
     * - destroy        // Triggered when the uploadify object is destroyed
     * - dialogClose    // Triggered when the browse dialog is closed
     * - dialogOpen     // Triggered when the browse dialog is opened
     * - disable        // Triggered when the browse button gets disabled
     * - enable         // Triggered when the browse button gets enabled
     * - initError      // Triggered when init FlashUploader failed (seem like fallback)
     * - fallback       // Triggered is Flash is not detected
     * - init           // Triggered when Uploadify is initialized
     * - queueComplete  // Triggered when all files in the queue have been uploaded
     * - selectError    // Triggered when an error occurs while selecting a file (file size, queue size limit, etc.)
     * - select         // Triggered for each file that is selected
     * - sWFReady       // Triggered when the SWF button is loaded
     * - uploadComplete // Triggered when a file upload completes (success or error)
     * - uploadError    // Triggered when a file upload returns an error
     * - uploadSuccess  // Triggered when a file is uploaded successfully
     * - uploadProgress // Triggered every time a file progress is updated
     * - uploadStart    // Triggered immediately before a file upload starts
     *
     * @author Allex Wang (allex.wnx@gmail.com)
     */
    function FlashUpload(placeholder, options, swfUploadOptions) {

        var self = this
          , cfg = $.extend({}, options)
          , $holder = $(placeholder)

        if (!$holder[0]) {
            throw Error('Initialize flash upload error, invalid holder node.');
        }

        cfg.uploader = cfg.endpoint || cfg.uploader

        if (!cfg.id) {
            cfg.id = guid('__file__');
        }

        // Adaptor event handler with emitter mechanism listeners
        implEventEmitter(self);

        var events = [
          'cancel',
          'clearQueue',
          'destroy',
          'dialogClose',
          'dialogOpen',
          'disable',
          'enable',
          // 'init',
          'initError',
          'fallback',
          'queueComplete',
          'selectError',
          'select',
          'SWFReady',
          'uploadComplete',
          'uploadError',
          'uploadSuccess',
          'uploadProgress',
          'uploadStart' ]

        $.each(events, function(i, event, handleName) { handleName = 'on' + capitalize(event);

            // Wrap buildin event handle, `onEventName`
            // The events callback will be invoked with **this** bound to `SWFUpload` context
            cfg[handleName] = function() {
                self.handleEvent(event, Array.prototype.slice.call(arguments))
            };

            // Transform event callback to emit listener
            if (options[handleName]) {
                self.on(event, options[handleName]);
            }
        });

        if (cfg.showPreview) {
            self.on('uploadSuccess', function(file, data, result) {
                // Show priew image with additional
                self.showPreview((data.data || 0).url);
            });
        }

        self.once('destroy', function() {
            self.un();
            $holder.off();
            $holder = null;
        });

        /**
         * @type {jQuery} The uploader placeholder DOM element
         */
        self.$holder = $holder;

        /**
         * @type {SWFUpload} The SWFUpload instance
         */
        self.swfupload = null;

        // Lazy initial
        setTimeout(function() {
            self.init(cfg, swfUploadOptions);
            var swfupload = self.swfupload = $holder.data('uploadify');
            if (!swfupload) {
                self.emit('initError', Error('Flash upload installation failed.'));
            }
        }, 1);
    }

    $.extend(FlashUpload.prototype, methods, {
        constructor: FlashUpload,
        each: function(callback) {
            this.$holder.each(callback);
        },
        handleEvent: function(type, args) {
            var self = this;
            switch (type) {
                case 'uploadSuccess':
                    // ARGS: [ file, data, result ]
                    var file = args[0], data = args[1], errorCode = +data.error, isError = isNaN(errorCode) || errorCode;
                    // Rewrite onUploadSuccess to handler upload api errors
                    if (isError) {
                        args[2] = false;
                        type = 'uploadError'
                        self.cancel(file.id);
                    }
                    break;
                case 'uploadError':
                    // ARGS: [ file, errorCode, errorMsg, errorString ]
                    // Normalize uploadError event parameters
                    args = [ args[0], { error: args[1],
                                        messageg: args[2],
                                        data: args[3] } ];
                    break;
            }
            self.emit(type, args); // jquery event handler will flat event args
        }
    });

    /**
     * Provide a api for call swfUpload build-in method.
     *
     * @method call
     * @param {String|HTMLElement} The uploadify target element.
     * @param {String} method The build-in method name
     *
     * @static
     */
    FlashUpload.call = function(input, method) {
        if (typeof input === 'string') {
            input = $('#' + input);
        }
        if (input[0] && methods[method]) {
            return methods[method].apply(input, Array.prototype.slice.call(arguments, 2));
        }
        throw Error('The method ' + method + ' does not exist in `uploadify`');
    };

    // Exports

    exports = module.exports = FlashUpload;

    /**
     * FlashUpload factory api.
     *
     * @param {String|HTMLElement} input The placeholder element to wrap.
     * @param {Object} options The uploadify options for installation.
     *
     * @static
     * @return {FlashUpload} Returns a new {FlashUpload} instance
     */
    exports.uploadify = function(holder, options) {
        var $el = $(holder), o = $el.data('uploader');

        // Initialize uploadify
        return o || (o = new FlashUpload(holder, options, arguments[2]), $el.data('uploader', o), o);
    };

}));
