/**
 * 精准化营销标签修饰
 *
 *  if (新品) {
 *      新品采用某种固定样式
 *
 *  } else {
 *      if (数字不在开始位置 && 第一个数字大于999) {
 *          在钱的地方换行
 *
 *      } else {
 *          在元和件的地方换行
 *      }
 *  }
 */

define(function(require, exports, module) {
    'use strict';

    var decorate = function(ele, txt) {
        if (txt === '新品') {
            ele.addClass('type-new-product');
            ele.html(txt);

        } else {
            var c = txt.match(/^.*?(\d+)/);
            var p = txt.match(/^\d/);
            var m = 0;
            var f = txt.match(/[元件]/);
            var r = new RegExp(f);

            if (c && c.length > 0) {
                m = c[1];
            }

            //  纯文字 同时不包含元/件等字样
            if (+m === 0 && !f) {
                ele.html(txt);

            // 在钱的前面换行
            } else if (!p && +m > 999) {
                if (!!f) {
                    txt = txt.replace(r, '<br >' + f);

                } else {
                    txt = txt.replace(/元/, '<br >元');
                    txt = txt.replace(/件/, '<br >件');
                }

                ele.html(txt);
                ele.addClass('type-lines');

            } else {
                if (!!f) {
                    txt = txt.replace(r, f + '<br >');

                } else {
                    txt = txt.replace(/元/, '元<br >');
                    txt = txt.replace(/件/, '件<br >');
                }

                ele.html(txt);
                ele.addClass('type-lines');
            }
        }
    };
    module.exports = {
        decorate: decorate
    };
});
