/**
 * 个人中心 - 详细评论页面
 * add: liangyouyu
 * date: 2015/1/28
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var Dialog = require('common/ui/dialog/dialog');
    require('common/widget/happy/happy');
    var Lazyload = require('common/widget/lazyload');

    
    // 图片懒加载--start
    var imageLazyLoader = null;
    var resetImageLoader = function() {
        // Please make sure destroy it firts if not null
        if (imageLazyLoader) {
          imageLazyLoader.destroy();
        }
        imageLazyLoader = new Lazyload('img.jImg', {
          effect: 'fadeIn',
          dataAttribute: 'url'
        });
        return imageLazyLoader;
    }

    resetImageLoader();
    // 图片懒加载--end
    // 按钮初始化
    var blurHandles = {
        focus2textarea:function(){
            var $this = $(this);
            if($this.children("textarea").val().trim().length>0){

            }
            else
            {
                $this.children("textarea").val("");
                $this.children("label").show();
            }
        }
    }
    var clickHandles = {
        commentStar : function(e){
            var $this = $(this);
            var index = $this.children("i").indexOf(e.target);
            if(index>-1){
                $this.attr("class","comment-star comment-star-"+(index+1));
                $this.next("span").text((index+1)+".0");
                $this.parents(".comment-pro-start").find("[node-name=point]").val(index+1);
            }
        },
        focus2textarea:function(){
            var $this = $(this);
            $this.children("label").hide();
            $this.children("textarea").focus();
        },
        submitBtn: function(){
            //  表单验证
            var test = function() {
                var commentTextArray = $('textarea');
                for (var i = 0; i < commentTextArray.length ; i++) {
                    if (commentTextArray[i].value.length < 5 ) {
                        Dialog.tips('您还有商品未评论，或评论字数少于5');
                        return false;
                    }
                };
                return true;
            }
            if(test()){
                Dialog.tips('正在提交');
                $(".mod-comment-pro form").submit();
                // if($(".mod-comment-pro form").attr("data-init")!="1"){
                //     Dialog.tips('正在提交');
                //     $(".mod-comment-pro form").attr("data-init","1");
                //     $(".mod-comment-pro form").submit();
                // }
            }
        },
        anonymous:function(){
            var $this = $(this);
            $this.find("em").toggleClass("no-check");
            if($this.find("em").hasClass("no-check")){
                $this.find("input[type=hidden]").val("0");
            }
            else{
                $this.find("input[type=hidden]").val("1");
            }
        }
    }
    for(var k in clickHandles){
        var handle = clickHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-comment-pro").on("click",key,handle);
        }
    }
    for(var k in blurHandles){
        var handle = blurHandles[k];
        var key = "[node-type=" + k + "]";
        if (handle) {
            $(".mod-comment-pro").on("blur",key,handle);
        }
    }
    // 统计字数 keyup+blur事件
    $('.mod-comment-pro textarea').on('keyup', function() {
        var _length = $(this).val().length;
        $(this).parent("p").next().find(".string-length span").text(_length);
    });
    $('.mod-comment-pro textarea').on('input', function() {
        var _length = $(this).val().length;
        $(this).parent("p").next().find(".string-length span").text(_length);
    });
    $('.mod-comment-pro textarea').on('blur', function() {
        var _length = $(this).val().length;
        $(this).parent("p").next().find(".string-length span").text(_length);
    });

    //防止dom状态被保存
    //$(".mod-comment-pro form").attr("data-init"，"0");
});
