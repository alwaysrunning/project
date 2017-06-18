define(function(require, exports, module) {
    
    'use strict';

    var $ = require('jquery'),
        Dialog = require('common/ui/dialog/dialog'),
        Uploader = require('common/widget/uploader');

    require('common/widget/happy/happy');

    function getInput(element) {
        if (! ('type' in element[0]) ) {
            element = element.find('input');
        }
        return element;
    }
    //file uploader buton installations  失败：-1 初始值0 正在上传1 成功2
    var uploadArray = [];
    $('.jUpload').each(function(i, el) {
        uploadArray[i] = 0;
        var $el = $(el),
            fieldName = $el.data('name'),
            fieldInput = $('<span>选择图片<span><input type="hidden" name="_UPLOAD_' + i + '" />');

        $el.append(fieldInput);

        // initialize file upload component
        var uploader = Uploader(el, {
            endpoint: 'http://m.yunhou.com/member/upload'
        });

        uploader.on('fileselect', function(e) {
            $el.find('.upload-txt').text('正在等待上传...');
            var html = '<div class="progressbar"><div></div></div>'
            $el.append(html);
            uploadArray[i] = 1;
        });

        uploader.on('uploadprogress', function(e) {
            var percent = Math.min(e.percentLoaded, 99) + '%';
            $el.find('.progressbar div').css('width', percent).text(percent);
            $el.find('.upload-txt').text('选择图片');
        });

        uploader.on('uploadcomplete', function(e) {
            var res = e.data || {};
            if (res.code == "1") {
                uploadArray[i] = 2;
                getInput(fieldInput).val(res.url);
                $el.find('.progressbar').remove();
            } else {
                var isFirst = true;
                var timer = setInterval(function() {
                    var eImg = $el.removeClass('file-uploaded').find('img');
                    var eDel = $el.find('.icon-delete');
                    if (isFirst && eImg.length > 0) {
                        Dialog.tips(res.msg || '图片上传失败');
                        eImg.remove();
                        eDel.remove();
                        isFirst = false;
                        clearInterval(timer);
                    }
                }, 100);
            }
        });
        uploader.on('uploaderror', function(e) {
            uploadArray[i] = -1;
            Dialog.tips('图片上传失败!');
        });

    });
   
});    