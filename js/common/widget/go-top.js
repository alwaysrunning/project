// go-top.js
define(function(require, exports, module) {
    'use strict';

    exports.goTop = (function(window) {

        var topDiv = document.createElement("div"),

        body = document.body;

        topDiv.className = "go-top";

        topDiv.id = "jGoTop";

        topDiv.innerHTML = '<span class="top-bg"></span><span class="icon iconfont">&#xe60b;</span>';

        body.appendChild(topDiv);

        var goTop = document.getElementById('jGoTop'),

            height = window.screen.height,
            
            time = null;

        function goTo(){
            clearTimeout(time);
            time = setTimeout(function(){
                var scrollTop = window.document.body.scrollTop;
                if(scrollTop>height){
                    goTop.style.display = 'block';
                }else{
                    goTop.style.display = 'none';
                }
            },300);
        }
            
        window.addEventListener('scroll', function() {
            goTo();
        });

        goTop.addEventListener('click',function(){
            window.scrollTo(0,0)
        });

        goTo();

    })(window);

});
