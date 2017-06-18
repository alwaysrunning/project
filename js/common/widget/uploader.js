/**
 * H5 Uploader implements
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Uploader = require('lib/plugins/uploader/1.0.0/uploader');
    var Dialog = require('common/ui/dialog/dialog');
    var uploading = false;
    var uploadingFileSize = 1;
    /**
     * Render upload file preview image view and staffs.
     */
    var renderFilePreview = function(oFile, container, uploader) {
        var $el = $(container),
            clipSize = {
                width: $el.width(),
                height: $el.height()
            };

        // generate preview image src
        Uploader.genImageFileThumbnail(oFile, clipSize, function(src) {
            var img = new Image();

            img.src = src;
            img.onload = function() {
                // central image visiable
                $(img).css({
                    top: (clipSize.height - img.height) / 2,
                    left: (clipSize.width - img.width) / 2,
                    position: 'absolute'
                });
                img = img.onload = null;
            };
            $el.append(img);

            // add close button
            var closeButton = $('<b class="icon-delete"></b>');
            closeButton.one('click', function(e) {
                $el.removeClass('file-uploaded').find('img').remove();
                var $mask = $el.find('.progressbar');
                closeButton.remove();
                $mask && $mask.remove();
                closeButton = container = $el = null;
                uploader.emit('imageremoved');
            });

            $el.append(closeButton).addClass('file-uploaded');
        });
    };

    var fileFilter = function(file) {
        var type = file.get('type');
        var size = file.get('size');
        if (size >= 2 * 1024 * 1024) {
            Dialog.tips('上传的图片不能大于2M!');
            return false;
        }
        return /^image\//.test(type);
    };

    var createProcessBar = function() {
        var el = $('<div class="process-bar-container"><div class="process-bar"></div></div>');
        return el;
    };

    module.exports = function(el, options) {
        // file uploader button installations
        var $el = $(el),
            fieldName = $el.data('name'),
            processBar = null;

        // initialize file upload component
        var uploader = new Uploader(el, {
            uploadURL: options.endpoint,
            uploadOnSelect: false,
            accept: 'image/*',
            fileFilter: fileFilter,
            multiple: null
        });

        
        function checkForUpload(e) {
            if(!uploading) {
                doUpload(e);
            } else {
                setTimeout(function() {
                    checkForUpload(e);
                }, 1);
            }
        }
        function doUpload(e) {
            uploading = true;

            var fileList = e.fileList;
            uploader.uploadThese(fileList);
            var file = fileList && fileList[0], oFile;
            uploadingFileSize = file.get('size');

            processBar = createProcessBar(el).appendTo($el).find('.process-bar');
            setTimeout(function() {
                if (file && (oFile = file.get('file'))) {
                    // generate preview image and staffs
                    renderFilePreview(oFile, el, uploader);
                }
            }, 1);
        }
        

        uploader.on('fileselect', function(e) {
            checkForUpload(e);
        });

        uploader.on('uploadprogress', function(e) {
            var percentLoaded = Math.min(100, Math.round(10000*e.bytesLoaded/uploadingFileSize)/100);
            e.bytesTotal = uploadingFileSize;
            e.percentLoaded = percentLoaded;

            var percent = percentLoaded + '%';
            processBar.width(percent);
            //console.log(percentLoaded + ',' + e.bytesLoaded + ',size=' + e.file.get('size') + ',uploadingFileSize=' + uploadingFileSize);
        });

        uploader.on('uploadcomplete', function(e) {
            processBar.parent().remove();
            processBar = null;
            uploading = false;
            uploadingFileSize = 1;
        });

        uploader.on('uploaderror', function(e) {
            processBar.parent().remove();
            processBar = null;
            uploading = false;
            uploadingFileSize = 1;
            console.log('upload fails');
        });

        return uploader;
    };

});
