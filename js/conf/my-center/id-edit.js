/**
 * 个人中心 - 身份证编辑
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    require('common/widget/happy/happy');
    var io = require('common/kit/io/request');
    var validator = require('common/widget/validator');

    // helper
    // 

    var eIdcard = $('#shenfenzheng');
    var oldIdcard = eIdcard.val();
    eIdcard.one('click', function() {
        $(this).val('');
    });


    var keys = ['同志', '先生', '男士', '女士', '小姐', '大哥', '哥哥', '大姐', '姐姐', '小弟', '弟弟', '妹妹', '妹子', '伢子', '爷爷', '婶婶', "奶奶", '婆婆', '叔叔', '伯伯', '舅舅', '舅妈', '公公', '大爷', '大妈', '阿姨', '姑姑', '妈妈', '爸爸', '爹爹', '夫人', '嫂嫂', '嫂子', '表哥', '表弟', '姊姊', '儿子', '女儿', '你', '我', '他', '她', '它', '逼', '死'];

    //获取url参数值
    var getUrlValue = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
            r = window.location.search.substr(1).match(reg);

        if (r != null) {
            return unescape(r[2]);
        }
    };

    //  获取来源url
    var getUrlParameter = function(key) {
        var p = window.location.href.split('?');
        if (p.length < 2) {
            return '';
        }
        var ps = p[1].split('&');
        for (var i = 0, len = ps.length; i < len; i = i + 1) {
            var k = ps[i].split('=');
            if (k[0] === key) {
                return decodeURIComponent(k[1]);
            }
        }
        return '';
    };
    var refUrl = getUrlParameter('ref');


    //身份证上传先不要了
    var Uploader = require('common/widget/uploader');

    //file uploader buton installations  失败：-1 初始值0 正在上传1 成功2
    var uploadArray = [];
    $('[node-type="uploadButton"]').each(function(i, el) {
        uploadArray[i] = 0;
        var $el = $(el),
            fieldName = $el.data('name'),
            fieldInput = $('<input type="hidden" name="_UPLOAD_' + i + '" />');

        $el.append(fieldInput);

        // initialize file upload component
        var uploader = Uploader(el, {
            endpoint: 'http://m.yunhou.com/member/upload'
        });

        uploader.on('fileselect', function(e) {
            $el.find('.upload-txt').text('正在等待上传...');
            var html = '<div class="progressbar"><div></div></div>';
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
                fieldInput.val(res.url);
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

    var clickHandlers = {
        deleteImgBtn: function(e) {
            var $this = $(this);
            $this.parents(".id-img").toggleClass("edit");
        }
    };
    for (var k in clickHandlers) {
        var handle = clickHandlers[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-id-edit").on("click", key, handle);
        }
    }


    var isVerification = {
        init: function() {
            isVerification.submitButton();
        },
        idName: function() {
            var username = $('#xingming').val();
            if (username === '') {
                Dialog.tips('请填写真实姓名');
                return false;
            } else if (!validator['isNoneMalformed'].func(username)) {
                Dialog.tips(validator['isNoneMalformed'].text);
                return false;
            }
            return true;
        },
        idNumber: function() {
            if (oldIdcard === eIdcard.val()) {
                return true;
            }
            var shenfenzheng = $('#shenfenzheng').val() || "";
            shenfenzheng = shenfenzheng.replace("x", "X");
            var isContain = true;
            for (var i = 0; i < keys.length; i++) {
                var patt = new RegExp(keys[i]);
                if (patt.test($('#xingming').val())) {
                    isContain = false;
                }
            }
            if (shenfenzheng === '') {
                Dialog.tips('请填写身份证号');
                return false;
            } else if (!validator['isIdCardNo'].func(shenfenzheng)) {
                Dialog.tips(validator['isIdCardNo'].text);
                return false;
            } else if (!isContain) {
                Dialog.tips('对不起，姓名与身份证号码不匹配！');
                return false;
            }
            return true;
        },
        idImg: function() {
            var flg = true;
            // 上传成功后又删除照片 或者编辑状态
            $('[node-type="uploadButton"]').each(function(i, el) {
                if (flg) {
                    var $el = $(el).children("img");
                    var $parent = $(el).parent(".edit");
                    //非编辑状态
                    if ($parent.length == 0) {
                        if ($el.length == 0) {
                            if (i == 0) {
                                Dialog.tips("请上传身份证正面照片");
                            } else {
                                Dialog.tips("请上传身份证反面照片");
                            }
                            flg = false;
                        }
                    }
                    // 编辑状态 把上传状态重置成2 （标识为上传成功）。
                    else {
                        uploadArray[i] = 2;
                    }

                }
            });
            // 上传状态判断  有可能上传未完成就点击提交了
            for (var i = 0; i < uploadArray.length; i++) {
                if (flg) {
                    if (uploadArray[i] < 2) {
                        flg = false;
                        if (uploadArray[i] < 1) {
                            if (i == 0) {
                                Dialog.tips("请上传身份证正面照片");
                                break;
                            } else {
                                Dialog.tips("请上传身份证反面照片");
                                break;
                            }
                        } else {
                            Dialog.tips("请身份证照片上传完成后再保存");
                            break;
                        }
                    }
                }
            }
            return flg;
        },
        idCheckType: function() { //全部验证
            if (isVerification.idName() && isVerification.idNumber() && isVerification.idImg()) {
                isVerification.Preservation();
            }
        },
        idCheckType_2: function() { //只验证身份证号和姓名
            if (isVerification.idName() && isVerification.idNumber()) {
                isVerification.Preservation();
            }
        },
        Preservation: function() { //提交数据保存
            Dialog.tips('正在提交');

            var $form = $(".mod-id-edit form"),
                url = $form.attr("action"),
                source = getUrlValue('source');

            io.post(url, $form.serialize(), function(e) {
                var enable = $.inArray(source, ['order', 'buy-now', 'buy-at-once']);

                if (getUrlParameter('idCheckType') != '' && enable !== -1) {
                    var date = {
                        cardId: e.data.id || getUrlParameter('id'),
                        buyType: ''
                    };
                    io.jsonp('/checkout/selectIdCard', date, function() {
                        window.location.href = 'http://m.yunhou.com/html/order/' + source + '.html';
                    }, function(e) {
                        Dialog.tips(e.msg);
                    });
                } else {
                    window.location.href = refUrl;
                }
            }, function(e) {
                Dialog.tips(e.msg || '提交失败，请稍后重试');
            });
        },

        //根据idCheckType参数判断验证类型
        submitButton: function() {
            $('#submitBtn').on('click', function() {
                if (getUrlParameter('idCheckType') == 1) {
                    isVerification.idCheckType_2();
                } else if (getUrlParameter('idCheckType') == 2) {
                    isVerification.idCheckType();
                } else {
                    isVerification.idCheckType();
                }
            })
        }
    };
    isVerification.init();
});
