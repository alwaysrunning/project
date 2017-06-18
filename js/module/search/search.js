/**
 * top banner search
 * @author	taotao
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var io = require('common/kit/io/request');
    var cookie = require('common/kit/io/cookie');

    var cookieArray = [];// 缓存变量
    var cookiekKey = "_searchHistory";
    var searchCookie = {
        add: function(str) {
            if(str){
                str = str.length > 200 ? str.substr(0,200) : str;
            }
            else{
                return ;
            }
            cookieArray = searchCookie.get();
            var len = cookieArray.length;
            // 如果搜索的词 已经在历史记录中了，那么更新顺序
            for(var i = 0; i<len; i++){
                if(cookieArray[i] == str){
                    cookieArray.splice(i, 1);
                    cookieArray.push(str);
                    searchCookie.update();
                    return false;
                }
            }
            if (len > 9) {
                cookieArray.shift();
                cookieArray.push(str);
            }
            else{
                cookieArray.push(str);
            }
            searchCookie.update();
        },
        remove: function(idx) {
            var len = cookieArray.length;
            // 因为展数组是倒叙展示在页面上，所以删除元素就要倒置一下index
            var index = len - idx;
            if( len > idx){
                cookieArray.splice(index-1, 1);
                searchCookie.update();
            }
        },
        clear: function() {
            cookieArray = [];
            searchCookie.update();
        },
        get: function() {
            var cookieData = cookie(cookiekKey) || "";
            if(cookieData == ""){
                cookieArray = [];
            }
            else{
                cookieArray = JSON.parse(cookieData);
            }
            return cookieArray;
        },
        update: function(){
            var str = JSON.stringify(cookieArray);
            cookie(cookiekKey,str,{expires:365,path:"/",domain:"yunhou.com"});
        }
    }

    var makeHistoryList = function(resUrl, _u){
        var data = [];
        var strArray = searchCookie.get();

        for(var i = strArray.length - 1; i > -1; i--){
            data.push({keyword:strArray[i]});
        }
        fillSearchRes(data, resUrl, _u, true);
    }

    var fillSearchRes = function(data, resUrl, _u, historyFlg) {
        if (!!!data) {
            $('#_jSearchCnt ul').empty();

        } else {
            var str = '';
            for (var i = 0, len = data.length; i < len; i = i + 1) {
                str += '<li><a href="' + resUrl + '?keyword='+ encodeURIComponent(data[i].keyword) + _u + '">' + $('<div />').text(data[i].keyword).html() + '</a>' + '</li>';
            }
            hideRes('show');
            if(historyFlg && data.length > 0){
                $(".clear-history-btn").show();
            }
            else{
                $(".clear-history-btn").hide();
            }
            $('#_jSearchCnt ul').html(str);
        }
    };

    var hideRes = function(t) {
        var type = t || 'hide' ;
        if (type === 'hide') {
            $('#_jSearchCnt').css('display', 'none');
        } else {
            $('#_jSearchCnt').css('display', 'block');
        }
    };

    var urlArgument2Obj = function() {
        var o     = {},
            urlA  = window.location.search.replace(/^[?]/, '').split('&'),
            key   = '',
            value = '';

        for (var ia = 0, len = urlA.length; ia < len; ia = ia + 1) {
            if (urlA[ia] !== '') {
                key   = urlA[ia].split('=')[0];
                value = urlA[ia].split('=')[1];

                if (value === undefined) {
                    o[key] = '';

                } else {
                    o[key] = decodeURIComponent(value);
                }
            }
        }
        return o;
    };

    var obj2Url = function(obj) {
        var url = '';
        for (var i = 0, len = obj.length; i < len; i = i + 1) {
            url += '&' + obj[i].name + '=' + encodeURIComponent(obj[i].value);
        }
        return url.replace('&', '?');
    };


    //监听input输入时，延时方法
    var delay = (function () {
        var timer = 0;
        return function (callback, time) {
            clearTimeout(timer);
            timer = setTimeout(callback, time);
        };
    })();


    module.exports = function(opts) {
        var defaults = {
            ctx       : '.ui-header .search-mod',
            frontTxt  : '.ui-header .search-key',
            url       : 'http://api.search.yunhou.com/bubugao-search-server/api/search',
            resUrl    : 'http://m.yunhou.com/search/index',
            searchStr : '<div id="_search-popup" class="_search-popup-animate" data-animate="_search-popup-animate"><div class="_wrap-search-cnt"><div id="_search-header"><form id="_search-form" action="/search"><div class="_search-close-btn iconglobal icon-md" id="_jClosePage">&#xe60f;</div><i class="_search-input-icon iconglobal icon-md">&#xe604;</i><input class="_input-cnt" name="keyword" id="_jSearchInput" type="text" placeholder="购全球，上云猴" autocomplete="off"><div class="clear-input iconglobal icon-sm">&#xe61b;</div><div class="ui-button-yun _btn-serch" id="_jSearchBtn" data-bpm="3.1.1.1.1.0">搜索</div></form></div><div id="_search-cnt-default"></div><div class="_search-cnt" id="_jSearchCnt"><ul></ul><div class="clear-history-btn"><a class="_jClearHistory">清空历史记录</a></div></div></div></div>',
            method    : 'bubugao.search.autoComplete.get',
            cont      : 10,
            htmlClass : '_search'
        };
        var opt = $.extend({}, defaults, opts);

        var url       = opt.url;
        var resUrl    = opt.resUrl;
        var searchStr = opt.searchStr;
        var ctx       = opt.ctx;
        var htmlClass = opt.htmlClass;
        var frontTxt  = opt.frontTxt;
        var locationArgs;//解析的url 为了获取搜索关键字

        delete opt.url;
        delete opt.resUrl;
        delete opt.searchStr;
        delete opt.ctx;
        delete opt.htmlClass;
        delete opt.frontTxt;

        var data    =  {};
        var urlArgs =  {};

        locationArgs = urlArgument2Obj();

        // data    = urlArgument2Obj();
        // urlArgs = urlArgument2Obj();

        // if (urlArgs.hasOwnProperty('k')) {
        //     delete urlArgs.k;
        //     delete data.k;
        // }

        //  判断是有制定的搜索url 店铺搜索会制定搜索的url
        resUrl = $(ctx).attr('data-search-url') || resUrl;

        var _u = '';

        var showSearch = function() {
            if ($('#_search-popup').length === 0) {
                $('body').append(searchStr);

                // 默认有内容需要填充到搜索弹出的input中
                if (locationArgs && locationArgs.k) {
                    $('#_jSearchInput').val(locationArgs.k);
                } else{
                    makeHistoryList(resUrl, _u);
                }

                //  判断是否门店
                // var shopid = $(ctx).attr('data-shopid') || '';
                // if (shopid !== '') ctx{
                //     urlArgs.si = shopid;
                //     data.si = shopid;
                // }

                if (_u === '') {
                    for (var p in urlArgs) {
                        _u += '&' + p + '=' + encodeURIComponent(urlArgs[p]);
                    }
                }

                $('#_search-form').on('submit', function() {
                    if ($('#_jSearchInput').val() == '') {
                        return false;
                    }
                });

                //  search
                $('#_jSearchInput').on('input', function() {
                    //  basic config
                    data.method    = opt.method;
                    data.prefixStr = $(this).val();
                    data.cont      = opt.cont;

                    if (data.prefixStr === '') {
                        //hideRes();
                        $(frontTxt).text('搜索');
                        makeHistoryList(resUrl, _u);

                    } else {
                        $(frontTxt).text(data.prefixStr);

                        delay(function(){
                            io.jsonp(url, data, function(res) {
                                if (!!res) {
                                    fillSearchRes(res.data, resUrl, _u);
                                }
                            });
                        },200);

                    }
                });

                //  onclick search btn
                $('#_search-form').submit(function(e) {
                    var _key = $('#_jSearchInput').val().replace(/\s/g,"");
                    if (_key == '') {
                        return false;
                    }
                    e.preventDefault();
                    searchCookie.add($('#_search-form input[name=keyword]').val());
                    window.location.href = resUrl + obj2Url($('#_search-form').serializeArray()) + _u;
                });

                $("#_jSearchBtn").click(function(e) {
                    var _key = $('#_jSearchInput').val().replace(/\s/g,"");
                    if (_key == '') {
                        return false;
                    }
                    e.preventDefault();
                    searchCookie.add($('#_search-form input[name=keyword]').val());
                    window.location.href = resUrl + obj2Url($('#_search-form').serializeArray()) + _u;
                });
                // add clickItem to history
                $('#_jSearchCnt').on('click', 'li a', function() {
                    searchCookie.add($(this).text());
                });

                // claer History
                $("._jClearHistory").click(function(e) {
                    e.preventDefault();
                    searchCookie.clear();
                    fillSearchRes([], resUrl, _u ,true);
                });
                $('#_search-popup').on('click', '#_jClosePage', function() {
                    window.history.go(-1);
                });
                // close the result page
                $('#_search-popup').on('click', '.clear-input', function() {
                    $('#_jSearchInput').val("");
                    makeHistoryList(resUrl, _u);
                });
            }
            var animateClass = $('#_search-popup').attr('data-animate');
            $('#_search-popup').addClass(animateClass);
            $('html').addClass(htmlClass);
            $(document.body).find('#_jSearchInput').get(0).focus();
        };


        // close the result page
        function closSearch(){
            var animateClass = $('#_search-popup').attr('data-animate');
            $('#_search-popup').removeClass(animateClass);
            $('html').removeClass(htmlClass);
        }
        //  bind event to search header
        $(ctx).on('click', function() {
            if (window.location.hash === '#search') {
                $(window).trigger('hashchange');

            } else {
                window.location.hash = 'search';
            }
        });

        $(window).on('hashchange.search', function() {
            if(window.location.hash === '#search') {
                showSearch();

            } else {
                closSearch();
            }
        });
    };
});
