/*
SWFObject v2.2 <http://code.google.com/p/swfobject/>
is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
var swfobject=function(){function v(){if(!t){try{var a=d.getElementsByTagName("body")[0].appendChild(d.createElement("span"));a.parentNode.removeChild(a)}catch(b){return}t=!0;for(var a=y.length,c=0;c<a;c++)y[c]()}}function M(a){t?a():y[y.length]=a}function N(a){if(typeof m.addEventListener!=i)m.addEventListener("load",a,!1);else if(typeof d.addEventListener!=i)d.addEventListener("load",a,!1);else if(typeof m.attachEvent!=i)V(m,"onload",a);else if("function"==typeof m.onload){var b=m.onload;m.onload=function(){b();a()}}else m.onload=a}function W(){var a=d.getElementsByTagName("body")[0],b=d.createElement(s);b.setAttribute("type",z);var c=a.appendChild(b);if(c){var f=0;(function(){if(typeof c.GetVariable!=i){var g=c.GetVariable("$version");g&&(g=g.split(" ")[1].split(","),e.pv=[parseInt(g[0],10),parseInt(g[1],10),parseInt(g[2],10)])}else if(10>f){f++;setTimeout(arguments.callee,10);return}a.removeChild(b);c=null;E()})()}else E()}function E(){var a=q.length;if(0<a)for(var b=0;b<a;b++){var c=q[b].id,f=q[b].callbackFn,g={success:!1,id:c};if(0<e.pv[0]){var d=n(c);if(d)if(A(q[b].swfVersion)&&!(e.wk&&312>e.wk))u(c,!0),f&&(g.success=!0,g.ref=F(c),f(g));else if(q[b].expressInstall&&G()){g={};g.data=q[b].expressInstall;g.width=d.getAttribute("width")||"0";g.height=d.getAttribute("height")||"0";d.getAttribute("class")&&(g.styleclass=d.getAttribute("class"));d.getAttribute("align")&&(g.align=d.getAttribute("align"));for(var h={},d=d.getElementsByTagName("param"),j=d.length,k=0;k<j;k++)"movie"!=d[k].getAttribute("name").toLowerCase()&&(h[d[k].getAttribute("name")]=d[k].getAttribute("value"));H(g,h,c,f)}else X(d),f&&f(g)}else if(u(c,!0),f){if((c=F(c))&&typeof c.SetVariable!=i)g.success=!0,g.ref=c;f(g)}}}function F(a){var b=null;if((a=n(a))&&"OBJECT"==a.nodeName)typeof a.SetVariable!=i?b=a:(a=a.getElementsByTagName(s)[0])&&(b=a);return b}function G(){return!B&&A("6.0.65")&&(e.win||e.mac)&&!(e.wk&&312>e.wk)}function H(a,b,c,f){B=!0;I=f||null;O={success:!1,id:c};var g=n(c);if(g){"OBJECT"==g.nodeName?(x=J(g),C=null):(x=g,C=c);a.id=P;if(typeof a.width==i||!/%$/.test(a.width)&&310>parseInt(a.width,10))a.width="310";if(typeof a.height==i||!/%$/.test(a.height)&&137>parseInt(a.height,10))a.height="137";d.title=d.title.slice(0,47)+" - Flash Player Installation";f=e.ie&&e.win?"ActiveX":"PlugIn";f="MMredirectURL="+m.location.toString().replace(/&/g,"%26")+"&MMplayerType="+f+"&MMdoctitle="+d.title;b.flashvars=typeof b.flashvars!=i?b.flashvars+("&"+f):f;e.ie&&(e.win&&4!=g.readyState)&&(f=d.createElement("div"),c+="SWFObjectNew",f.setAttribute("id",c),g.parentNode.insertBefore(f,g),g.style.display="none",function(){4==g.readyState?g.parentNode.removeChild(g):setTimeout(arguments.callee,10)}());K(a,b,c)}}function X(a){if(e.ie&&e.win&&4!=a.readyState){var b=d.createElement("div");a.parentNode.insertBefore(b,a);b.parentNode.replaceChild(J(a),b);a.style.display="none";(function(){4==a.readyState?a.parentNode.removeChild(a):setTimeout(arguments.callee,10)})()}else a.parentNode.replaceChild(J(a),a)}function J(a){var b=d.createElement("div");if(e.win&&e.ie)b.innerHTML=a.innerHTML;else if(a=a.getElementsByTagName(s)[0])if(a=a.childNodes)for(var c=a.length,f=0;f<c;f++)!(1==a[f].nodeType&&"PARAM"==a[f].nodeName)&&8!=a[f].nodeType&&b.appendChild(a[f].cloneNode(!0));return b}function K(a,b,c){var f,g=n(c);if(e.wk&&312>e.wk)return f;if(g)if(typeof a.id==i&&(a.id=c),e.ie&&e.win){var p="",h;for(h in a)a[h]!=Object.prototype[h]&&("data"==h.toLowerCase()?b.movie=a[h]:"styleclass"==h.toLowerCase()?p+=' class="'+a[h]+'"':"classid"!=h.toLowerCase()&&(p+=" "+h+'="'+a[h]+'"'));h="";for(var j in b)b[j]!=Object.prototype[j]&&(h+='<param name="'+j+'" value="'+b[j]+'" />');g.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+p+">"+h+"</object>";D[D.length]=a.id;f=n(a.id)}else{j=d.createElement(s);j.setAttribute("type",z);for(var k in a)a[k]!=Object.prototype[k]&&("styleclass"==k.toLowerCase()?j.setAttribute("class",a[k]):"classid"!=k.toLowerCase()&&j.setAttribute(k,a[k]));for(p in b)b[p]!=Object.prototype[p]&&"movie"!=p.toLowerCase()&&(a=j,h=p,k=b[p],c=d.createElement("param"),c.setAttribute("name",h),c.setAttribute("value",k),a.appendChild(c));g.parentNode.replaceChild(j,g);f=j}return f}function Q(a){var b=n(a);b&&"OBJECT"==b.nodeName&&(e.ie&&e.win?(b.style.display="none",function(){if(4==b.readyState){var c=n(a);if(c){for(var f in c)"function"==typeof c[f]&&(c[f]=null);c.parentNode.removeChild(c)}}else setTimeout(arguments.callee,10)}()):b.parentNode.removeChild(b))}function n(a){var b=null;try{b=d.getElementById(a)}catch(c){}return b}function V(a,b,c){a.attachEvent(b,c);w[w.length]=[a,b,c]}function A(a){var b=e.pv;a=a.split(".");a[0]=parseInt(a[0],10);a[1]=parseInt(a[1],10)||0;a[2]=parseInt(a[2],10)||0;return b[0]>a[0]||b[0]==a[0]&&b[1]>a[1]||b[0]==a[0]&&b[1]==a[1]&&b[2]>=a[2]?!0:!1}function R(a,b,c,f){if(!e.ie||!e.mac){var g=d.getElementsByTagName("head")[0];if(g){c=c&&"string"==typeof c?c:"screen";f&&(L=l=null);if(!l||L!=c)f=d.createElement("style"),f.setAttribute("type","text/css"),f.setAttribute("media",c),l=g.appendChild(f),e.ie&&(e.win&&typeof d.styleSheets!=i&&0<d.styleSheets.length)&&(l=d.styleSheets[d.styleSheets.length-1]),L=c;e.ie&&e.win?l&&typeof l.addRule==s&&l.addRule(a,b):l&&typeof d.createTextNode!=i&&l.appendChild(d.createTextNode(a+" {"+b+"}"))}}}function u(a,b){if(S){var c=b?"visible":"hidden";t&&n(a)?n(a).style.visibility=c:R("#"+a,"visibility:"+c)}}function T(a){return null!=/[\\\"<>\.;]/.exec(a)&&typeof encodeURIComponent!=i?encodeURIComponent(a):a}var i="undefined",s="object",z="application/x-shockwave-flash",P="SWFObjectExprInst",m=window,d=document,r=navigator,U=!1,y=[function(){U?W():E()}],q=[],D=[],w=[],x,C,I,O,t=!1,B=!1,l,L,S=!0,e=function(){var a=typeof d.getElementById!=i&&typeof d.getElementsByTagName!=i&&typeof d.createElement!=i,b=r.userAgent.toLowerCase(),c=r.platform.toLowerCase(),f=c?/win/.test(c):/win/.test(b),c=c?/mac/.test(c):/mac/.test(b),b=/webkit/.test(b)?parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,g=!+"\v1",e=[0,0,0],h=null;if(typeof r.plugins!=i&&typeof r.plugins["Shockwave Flash"]==s){if((h=r.plugins["Shockwave Flash"].description)&&!(typeof r.mimeTypes!=i&&r.mimeTypes[z]&&!r.mimeTypes[z].enabledPlugin))U=!0,g=!1,h=h.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),e[0]=parseInt(h.replace(/^(.*)\..*$/,"$1"),10),e[1]=parseInt(h.replace(/^.*\.(.*)\s.*$/,"$1"),10),e[2]=/[a-zA-Z]/.test(h)?parseInt(h.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}else if(typeof m.ActiveXObject!=i)try{var j=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if(j&&(h=j.GetVariable("$version")))g=!0,h=h.split(" ")[1].split(","),e=[parseInt(h[0],10),parseInt(h[1],10),parseInt(h[2],10)]}catch(k){}return{w3:a,pv:e,wk:b,ie:g,win:f,mac:c}}();(function(){e.w3&&((typeof d.readyState!=i&&"complete"==d.readyState||typeof d.readyState==i&&(d.getElementsByTagName("body")[0]||d.body))&&v(),t||(typeof d.addEventListener!=i&&d.addEventListener("DOMContentLoaded",v,!1),e.ie&&e.win&&(d.attachEvent("onreadystatechange",function(){"complete"==d.readyState&&(d.detachEvent("onreadystatechange",arguments.callee),v())}),m==top&&function(){if(!t){try{d.documentElement.doScroll("left")}catch(a){setTimeout(arguments.callee,0);return}v()}}()),e.wk&&function(){t||(/loaded|complete/.test(d.readyState)?v():setTimeout(arguments.callee,0))}(),N(v)))})();(function(){e.ie&&e.win&&window.attachEvent("onunload",function(){for(var a=w.length,b=0;b<a;b++)w[b][0].detachEvent(w[b][1],w[b][2]);a=D.length;for(b=0;b<a;b++)Q(D[b]);for(var c in e)e[c]=null;e=null;for(var f in swfobject)swfobject[f]=null;swfobject=null})})();return{registerObject:function(a,b,c,f){if(e.w3&&a&&b){var d={};d.id=a;d.swfVersion=b;d.expressInstall=c;d.callbackFn=f;q[q.length]=d;u(a,!1)}else f&&f({success:!1,id:a})},getObjectById:function(a){if(e.w3)return F(a)},embedSWF:function(a,b,c,d,g,p,h,j,k,m){var n={success:!1,id:b};e.w3&&!(e.wk&&312>e.wk)&&a&&b&&c&&d&&g?(u(b,!1),M(function(){c+="";d+="";var e={};if(k&&typeof k===s)for(var l in k)e[l]=k[l];e.data=a;e.width=c;e.height=d;l={};if(j&&typeof j===s)for(var q in j)l[q]=j[q];if(h&&typeof h===s)for(var r in h)l.flashvars=typeof l.flashvars!=i?l.flashvars+("&"+r+"="+h[r]):r+"="+h[r];if(A(g))q=K(e,l,b),e.id==b&&u(b,!0),n.success=!0,n.ref=q;else{if(p&&G()){e.data=p;H(e,l,b,m);return}u(b,!0)}m&&m(n)})):m&&m(n)},switchOffAutoHideShow:function(){S=!1},ua:e,getFlashPlayerVersion:function(){return{major:e.pv[0],minor:e.pv[1],release:e.pv[2]}},hasFlashPlayerVersion:A,createSWF:function(a,b,c){if(e.w3)return K(a,b,c)},showExpressInstall:function(a,b,c,d){e.w3&&G()&&H(a,b,c,d)},removeSWF:function(a){e.w3&&Q(a)},createCSS:function(a,b,c,d){e.w3&&R(a,b,c,d)},addDomLoadEvent:M,addLoadEvent:N,getQueryParamValue:function(a){var b=d.location.search||d.location.hash;if(b){/\?/.test(b)&&(b=b.split("?")[1]);if(null==a)return T(b);for(var b=b.split("&"),c=0;c<b.length;c++)if(b[c].substring(0,b[c].indexOf("="))==a)return T(b[c].substring(b[c].indexOf("=")+1))}return""},expressInstallCallback:function(){if(B){var a=n(P);a&&x&&(a.parentNode.replaceChild(x,a),C&&(u(C,!0),e.ie&&e.win&&(x.style.display="block")),I&&I(O));B=!1}}}}();

/*
SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com

mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/

SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilzén and Mammon Media and is released under the MIT License:
http://www.opensource.org/licenses/mit-license.php

SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:
http://www.opensource.org/licenses/mit-license.php
*/
var SWFUpload=window.SWFUpload;void 0==SWFUpload&&(window.SWFUpload=SWFUpload=function(e){this.initSWFUpload(e)}),function(b){b.prototype.initSWFUpload=function(e){try{this.customSettings={},this.settings=e,this.eventQueue=[],this.movieName="SWFUpload_"+b.movieCount++,this.movieElement=null,b.instances[this.movieName]=this,this.initSettings(),this.loadFlash(),this.displayDebugInfo()}catch(t){throw delete b.instances[this.movieName],t}},b.instances={},b.movieCount=0,b.version="2.2.0 2009-03-25",b.QUEUE_ERROR={QUEUE_LIMIT_EXCEEDED:-100,FILE_EXCEEDS_SIZE_LIMIT:-110,ZERO_BYTE_FILE:-120,INVALID_FILETYPE:-130},b.UPLOAD_ERROR={HTTP_ERROR:-200,MISSING_UPLOAD_URL:-210,IO_ERROR:-220,SECURITY_ERROR:-230,UPLOAD_LIMIT_EXCEEDED:-240,UPLOAD_FAILED:-250,SPECIFIED_FILE_ID_NOT_FOUND:-260,FILE_VALIDATION_FAILED:-270,FILE_CANCELLED:-280,UPLOAD_STOPPED:-290},b.FILE_STATUS={QUEUED:-1,IN_PROGRESS:-2,ERROR:-3,COMPLETE:-4,CANCELLED:-5},b.BUTTON_ACTION={SELECT_FILE:-100,SELECT_FILES:-110,START_UPLOAD:-120},b.CURSOR={ARROW:-1,HAND:-2},b.WINDOW_MODE={WINDOW:"window",TRANSPARENT:"transparent",OPAQUE:"opaque"},b.completeURL=function(e){if(!e)return"";if("string"!=typeof e||e.match(/^https?:\/\//i)||e.match(/^\//))return e;var t=window.location.pathname.lastIndexOf("/");return path=0>=t?"/":window.location.pathname.substr(0,t)+"/",path+e},b.prototype.initSettings=function(){this.ensureDefault=function(e,t){this.settings[e]=void 0==this.settings[e]?t:this.settings[e]},this.ensureDefault("upload_url",""),this.ensureDefault("preserve_relative_urls",!1),this.ensureDefault("file_post_name","Filedata"),this.ensureDefault("post_params",{}),this.ensureDefault("use_query_string",!1),this.ensureDefault("requeue_on_error",!1),this.ensureDefault("http_success",[]),this.ensureDefault("assume_success_timeout",0),this.ensureDefault("file_types","*.*"),this.ensureDefault("file_types_description","All Files"),this.ensureDefault("file_size_limit",0),this.ensureDefault("file_upload_limit",0),this.ensureDefault("file_queue_limit",0),this.ensureDefault("flash_url","swfupload.swf"),this.ensureDefault("prevent_swf_caching",!0),this.ensureDefault("button_image_url",""),this.ensureDefault("button_width",1),this.ensureDefault("button_height",1),this.ensureDefault("button_text",""),this.ensureDefault("button_text_style","color: #000000; font-size: 16pt;"),this.ensureDefault("button_text_top_padding",0),this.ensureDefault("button_text_left_padding",0),this.ensureDefault("button_action",b.BUTTON_ACTION.SELECT_FILES),this.ensureDefault("button_disabled",!1),this.ensureDefault("button_placeholder_id",""),this.ensureDefault("button_placeholder",null),this.ensureDefault("button_cursor",b.CURSOR.ARROW),this.ensureDefault("button_window_mode",b.WINDOW_MODE.WINDOW),this.ensureDefault("debug",!1),this.settings.debug_enabled=this.settings.debug,this.settings.return_upload_start_handler=this.returnUploadStart,this.ensureDefault("swfupload_loaded_handler",null),this.ensureDefault("file_dialog_start_handler",null),this.ensureDefault("file_queued_handler",null),this.ensureDefault("file_queue_error_handler",null),this.ensureDefault("file_dialog_complete_handler",null),this.ensureDefault("upload_start_handler",null),this.ensureDefault("upload_progress_handler",null),this.ensureDefault("upload_error_handler",null),this.ensureDefault("upload_success_handler",null),this.ensureDefault("upload_complete_handler",null),this.ensureDefault("debug_handler",this.debugMessage),this.ensureDefault("custom_settings",{}),this.customSettings=this.settings.custom_settings,this.settings.prevent_swf_caching&&(this.settings.flash_url=this.settings.flash_url+(0>this.settings.flash_url.indexOf("?")?"?":"&")+"ts="+(+new Date)),this.settings.preserve_relative_urls||(this.settings.upload_url=b.completeURL(this.settings.upload_url),this.settings.button_image_url=this.settings.button_image_url?b.completeURL(this.settings.button_image_url):this.settings.button_image_url),delete this.ensureDefault},b.prototype.loadFlash=function(){var e,t;if(null!==document.getElementById(this.movieName))throw"ID "+this.movieName+" is already in use. The Flash Object could not be added";e=document.getElementById(this.settings.button_placeholder_id)||this.settings.button_placeholder;if(void 0==e)throw"Could not find the placeholder element: "+this.settings.button_placeholder_id;t=document.createElement("div"),t.innerHTML=this.getFlashHTML(),e.parentNode.replaceChild(t.firstChild,e),void 0==window[this.movieName]&&(window[this.movieName]=this.getMovieElement())},b.prototype.getFlashHTML=function(){return['<object id="',this.movieName,'" type="application/x-shockwave-flash" data="',this.settings.flash_url,'" width="',this.settings.button_width,'" height="',this.settings.button_height,'" class="swfupload"><param name="wmode" value="',this.settings.button_window_mode,'" /><param name="movie" value="',this.settings.flash_url,'" /><param name="quality" value="high" /><param name="menu" value="false" /><param name="allowScriptAccess" value="always" />','<param name="flashvars" value="'+this.getFlashVars()+'" />',"</object>"].join("")},b.prototype.getFlashVars=function(){var e=this.buildParamString(),t=this.settings.http_success.join(",");return["movieName=",encodeURIComponent(this.movieName),"&amp;uploadURL=",encodeURIComponent(this.settings.upload_url),"&amp;useQueryString=",encodeURIComponent(this.settings.use_query_string),"&amp;requeueOnError=",encodeURIComponent(this.settings.requeue_on_error),"&amp;httpSuccess=",encodeURIComponent(t),"&amp;assumeSuccessTimeout=",encodeURIComponent(this.settings.assume_success_timeout),"&amp;params=",encodeURIComponent(e),"&amp;filePostName=",encodeURIComponent(this.settings.file_post_name),"&amp;fileTypes=",encodeURIComponent(this.settings.file_types),"&amp;fileTypesDescription=",encodeURIComponent(this.settings.file_types_description),"&amp;fileSizeLimit=",encodeURIComponent(this.settings.file_size_limit),"&amp;fileUploadLimit=",encodeURIComponent(this.settings.file_upload_limit),"&amp;fileQueueLimit=",encodeURIComponent(this.settings.file_queue_limit),"&amp;debugEnabled=",encodeURIComponent(this.settings.debug_enabled),"&amp;buttonImageURL=",encodeURIComponent(this.settings.button_image_url),"&amp;buttonWidth=",encodeURIComponent(this.settings.button_width),"&amp;buttonHeight=",encodeURIComponent(this.settings.button_height),"&amp;buttonText=",encodeURIComponent(this.settings.button_text),"&amp;buttonTextTopPadding=",encodeURIComponent(this.settings.button_text_top_padding),"&amp;buttonTextLeftPadding=",encodeURIComponent(this.settings.button_text_left_padding),"&amp;buttonTextStyle=",encodeURIComponent(this.settings.button_text_style),"&amp;buttonAction=",encodeURIComponent(this.settings.button_action),"&amp;buttonDisabled=",encodeURIComponent(this.settings.button_disabled),"&amp;buttonCursor=",encodeURIComponent(this.settings.button_cursor)].join("")},b.prototype.getMovieElement=function(){void 0==this.movieElement&&(this.movieElement=document.getElementById(this.movieName));if(null===this.movieElement)throw"Could not find Flash element";return this.movieElement},b.prototype.buildParamString=function(){var e=this.settings.post_params,t=[];if("object"==typeof e)for(var n in e)e.hasOwnProperty(n)&&t.push(encodeURIComponent(n.toString())+"="+encodeURIComponent(e[n].toString()));return t.join("&amp;")},b.prototype.destroy=function(){try{this.cancelUpload(null,!1);var e=null;if((e=this.getMovieElement())&&"unknown"==typeof e.CallFunction){for(var t in e)try{"function"==typeof e[t]&&(e[t]=null)}catch(n){}try{e.parentNode.removeChild(e)}catch(r){}}return window[this.movieName]=null,b.instances[this.movieName]=null,delete b.instances[this.movieName],this.movieName=this.eventQueue=this.customSettings=this.settings=this.movieElement=null,!0}catch(i){return!1}},b.prototype.displayDebugInfo=function(){this.debug(["---SWFUpload Instance Info---\nVersion: ",b.version,"\nMovie Name: ",this.movieName,"\nSettings:\n    upload_url:               ",this.settings.upload_url,"\n    flash_url:                ",this.settings.flash_url,"\n use_query_string:         ",this.settings.use_query_string.toString(),"\n   requeue_on_error:         ",this.settings.requeue_on_error.toString(),"\n   http_success:             ",this.settings.http_success.join(", "),"\n   assume_success_timeout:   ",this.settings.assume_success_timeout,"\n    file_post_name:           ",this.settings.file_post_name,"\n    post_params:              ",this.settings.post_params.toString(),"\n    file_types:               ",this.settings.file_types,"\n    file_types_description:   ",this.settings.file_types_description,"\n    file_size_limit:          ",this.settings.file_size_limit,"\n   file_upload_limit:        ",this.settings.file_upload_limit,"\n file_queue_limit:         ",this.settings.file_queue_limit,"\n  debug:                    ",this.settings.debug.toString(),"\n  prevent_swf_caching:      ",this.settings.prevent_swf_caching.toString(),"\n    button_placeholder_id:    ",this.settings.button_placeholder_id.toString(),"\n  button_placeholder:       ",this.settings.button_placeholder?"Set":"Not Set","\n    button_image_url:         ",this.settings.button_image_url.toString(),"\n   button_width:             ",this.settings.button_width.toString(),"\n   button_height:            ",this.settings.button_height.toString(),"\n  button_text:              ",this.settings.button_text.toString(),"\n    button_text_style:        ",this.settings.button_text_style.toString(),"\n  button_text_top_padding:  ",this.settings.button_text_top_padding.toString(),"\n    button_text_left_padding: ",this.settings.button_text_left_padding.toString(),"\n   button_action:            ",this.settings.button_action.toString(),"\n  button_disabled:          ",this.settings.button_disabled.toString(),"\n    custom_settings:          ",this.settings.custom_settings.toString(),"\nEvent Handlers:\n   swfupload_loaded_handler assigned:  ",("function"==typeof this.settings.swfupload_loaded_handler).toString(),"\n    file_dialog_start_handler assigned: ",("function"==typeof this.settings.file_dialog_start_handler).toString(),"\n   file_queued_handler assigned:       ",("function"==typeof this.settings.file_queued_handler).toString(),"\n file_queue_error_handler assigned:  ",("function"==typeof this.settings.file_queue_error_handler).toString(),"\n    upload_start_handler assigned:      ",("function"==typeof this.settings.upload_start_handler).toString(),"\n    upload_progress_handler assigned:   ",("function"==typeof this.settings.upload_progress_handler).toString(),"\n upload_error_handler assigned:      ",("function"==typeof this.settings.upload_error_handler).toString(),"\n    upload_success_handler assigned:    ",("function"==typeof this.settings.upload_success_handler).toString(),"\n  upload_complete_handler assigned:   ",("function"==typeof this.settings.upload_complete_handler).toString(),"\n debug_handler assigned:             ",("function"==typeof this.settings.debug_handler).toString(),"\n"].join(""))},b.prototype.addSetting=function(e,t,n){return void 0==t?this.settings[e]=n:this.settings[e]=t},b.prototype.getSetting=function(e){return void 0!=this.settings[e]?this.settings[e]:""},b.prototype.callFlash=function(a,c){c=c||[];var b=this.getMovieElement(),e,f;try{f=b.CallFunction('<invoke name="'+a+'" returntype="javascript">'+__flash__argumentsToXML(c,0)+"</invoke>"),e=eval(f)}catch(g){throw"Call to "+a+" failed"}return void 0!=e&&"object"==typeof e.post&&(e=this.unescapeFilePostParams(e)),e},b.prototype.selectFile=function(){this.callFlash("SelectFile")},b.prototype.selectFiles=function(){this.callFlash("SelectFiles")},b.prototype.startUpload=function(e){this.callFlash("StartUpload",[e])},b.prototype.cancelUpload=function(e,t){!1!==t&&(t=!0),this.callFlash("CancelUpload",[e,t])},b.prototype.stopUpload=function(){this.callFlash("StopUpload")},b.prototype.getStats=function(){return this.callFlash("GetStats")},b.prototype.setStats=function(e){this.callFlash("SetStats",[e])},b.prototype.getFile=function(e){return"number"==typeof e?this.callFlash("GetFileByIndex",[e]):this.callFlash("GetFile",[e])},b.prototype.addFileParam=function(e,t,n){return this.callFlash("AddFileParam",[e,t,n])},b.prototype.removeFileParam=function(e,t){this.callFlash("RemoveFileParam",[e,t])},b.prototype.setUploadURL=function(e){this.settings.upload_url=e.toString(),this.callFlash("SetUploadURL",[e])},b.prototype.setPostParams=function(e){this.settings.post_params=e,this.callFlash("SetPostParams",[e])},b.prototype.addPostParam=function(e,t){this.settings.post_params[e]=t,this.callFlash("SetPostParams",[this.settings.post_params])},b.prototype.removePostParam=function(e){delete this.settings.post_params[e],this.callFlash("SetPostParams",[this.settings.post_params])},b.prototype.setFileTypes=function(e,t){this.settings.file_types=e,this.settings.file_types_description=t,this.callFlash("SetFileTypes",[e,t])},b.prototype.setFileSizeLimit=function(e){this.settings.file_size_limit=e,this.callFlash("SetFileSizeLimit",[e])},b.prototype.setFileUploadLimit=function(e){this.settings.file_upload_limit=e,this.callFlash("SetFileUploadLimit",[e])},b.prototype.setFileQueueLimit=function(e){this.settings.file_queue_limit=e,this.callFlash("SetFileQueueLimit",[e])},b.prototype.setFilePostName=function(e){this.settings.file_post_name=e,this.callFlash("SetFilePostName",[e])},b.prototype.setUseQueryString=function(e){this.settings.use_query_string=e,this.callFlash("SetUseQueryString",[e])},b.prototype.setRequeueOnError=function(e){this.settings.requeue_on_error=e,this.callFlash("SetRequeueOnError",[e])},b.prototype.setHTTPSuccess=function(e){"string"==typeof e&&(e=e.replace(" ","").split(",")),this.settings.http_success=e,this.callFlash("SetHTTPSuccess",[e])},b.prototype.setAssumeSuccessTimeout=function(e){this.settings.assume_success_timeout=e,this.callFlash("SetAssumeSuccessTimeout",[e])},b.prototype.setDebugEnabled=function(e){this.settings.debug_enabled=e,this.callFlash("SetDebugEnabled",[e])},b.prototype.setButtonImageURL=function(e){void 0==e&&(e=""),this.settings.button_image_url=e,this.callFlash("SetButtonImageURL",[e])},b.prototype.setButtonDimensions=function(e,t){this.settings.button_width=e,this.settings.button_height=t;var n=this.getMovieElement();void 0!=n&&(n.style.width=e+"px",n.style.height=t+"px"),this.callFlash("SetButtonDimensions",[e,t])},b.prototype.setButtonText=function(e){this.settings.button_text=e,this.callFlash("SetButtonText",[e])},b.prototype.setButtonTextPadding=function(e,t){this.settings.button_text_top_padding=t,this.settings.button_text_left_padding=e,this.callFlash("SetButtonTextPadding",[e,t])},b.prototype.setButtonTextStyle=function(e){this.settings.button_text_style=e,this.callFlash("SetButtonTextStyle",[e])},b.prototype.setButtonDisabled=function(e){this.settings.button_disabled=e,this.callFlash("SetButtonDisabled",[e])},b.prototype.setButtonAction=function(e){this.settings.button_action=e,this.callFlash("SetButtonAction",[e])},b.prototype.setButtonCursor=function(e){this.settings.button_cursor=e,this.callFlash("SetButtonCursor",[e])},b.prototype.queueEvent=function(e,t){void 0==t?t=[]:t instanceof Array||(t=[t]);var n=this;if("function"==typeof this.settings[e])this.eventQueue.push(function(){this.settings[e].apply(this,t)}),setTimeout(function(){n.executeNextEvent()},0);else if(null!==this.settings[e])throw"Event handler "+e+" is unknown or is not a function"},b.prototype.executeNextEvent=function(){var e=this.eventQueue?this.eventQueue.shift():null;"function"==typeof e&&e.apply(this)},b.prototype.unescapeFilePostParams=function(e){var t=/[$]([0-9a-f]{4})/i,n={},r;if(void 0!=e){for(var i in e.post)if(e.post.hasOwnProperty(i)){r=i;for(var s;null!==(s=t.exec(r));)r=r.replace(s[0],String.fromCharCode(parseInt("0x"+s[1],16)));n[r]=e.post[i]}e.post=n}return e},b.prototype.testExternalInterface=function(){try{return this.callFlash("TestExternalInterface")}catch(e){return!1}},b.prototype.flashReady=function(){var e=this.getMovieElement();e?(this.cleanUp(e),this.queueEvent("swfupload_loaded_handler")):this.debug("Flash called back ready but the flash movie can't be found.")},b.prototype.cleanUp=function(e){try{if(this.movieElement&&"unknown"==typeof e.CallFunction){this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");for(var t in e)try{"function"==typeof e[t]&&(e[t]=null)}catch(n){}}}catch(r){}window.__flash__removeCallback=function(e,t){try{e&&(e[t]=null)}catch(n){}}},b.prototype.fileDialogStart=function(){this.queueEvent("file_dialog_start_handler")},b.prototype.fileQueued=function(e){e=this.unescapeFilePostParams(e),this.queueEvent("file_queued_handler",e)},b.prototype.fileQueueError=function(e,t,n){e=this.unescapeFilePostParams(e),this.queueEvent("file_queue_error_handler",[e,t,n])},b.prototype.fileDialogComplete=function(e,t,n){this.queueEvent("file_dialog_complete_handler",[e,t,n])},b.prototype.uploadStart=function(e){e=this.unescapeFilePostParams(e),this.queueEvent("return_upload_start_handler",e)},b.prototype.returnUploadStart=function(e){var t;if("function"==typeof this.settings.upload_start_handler)e=this.unescapeFilePostParams(e),t=this.settings.upload_start_handler.call(this,e);else if(void 0!=this.settings.upload_start_handler)throw"upload_start_handler must be a function";void 0===t&&(t=!0),this.callFlash("ReturnUploadStart",[!!t])},b.prototype.uploadProgress=function(e,t,n){e=this.unescapeFilePostParams(e),this.queueEvent("upload_progress_handler",[e,t,n])},b.prototype.uploadError=function(e,t,n){e=this.unescapeFilePostParams(e),this.queueEvent("upload_error_handler",[e,t,n])},b.prototype.uploadSuccess=function(e,t,n){e=this.unescapeFilePostParams(e),this.queueEvent("upload_success_handler",[e,t,n])},b.prototype.uploadComplete=function(e){e=this.unescapeFilePostParams(e),this.queueEvent("upload_complete_handler",e)},b.prototype.debug=function(e){this.queueEvent("debug_handler",e)},b.prototype.debugMessage=function(e){if(this.settings.debug){var t=[];if("object"==typeof e&&"string"==typeof e.name&&"string"==typeof e.message){for(var n in e)e.hasOwnProperty(n)&&t.push(n+": "+e[n]);e=t.join("\n")||"",t=e.split("\n"),e="EXCEPTION: "+t.join("\nEXCEPTION: ")}b.Console.writeLine(e)}},b.Console={},b.Console.writeLine=function(e){var t,n;try{t=document.getElementById("SWFUpload_Console"),t||(n=document.createElement("form"),document.getElementsByTagName("body")[0].appendChild(n),t=document.createElement("textarea"),t.id="SWFUpload_Console",t.style.fontFamily="monospace",t.setAttribute("wrap","off"),t.wrap="off",t.style.overflow="auto",t.style.width="700px",t.style.height="350px",t.style.margin="5px",n.appendChild(t)),t.value+=e+"\n",t.scrollTop=t.scrollHeight-t.clientHeight}catch(r){alert("Exception: "+r.name+" Message: "+r.message)}}}(SWFUpload);

/*
Uploadify v3.2.1

Copyright (c) 2012 Reactive Apps, Ronnie Garcia
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>

Code cleanup and Image preview extension by Allex Wang (allex.wxn@gmail.com)
*/

(function( root, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        define( ['jquery'], factory );
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(jQuery);
    }
}(this, function( $ ) {
    'use strict';

    // These methods can be called by adding them as the first argument in the uploadify plugin call
    var methods = {// {{{

        init : function(options, swfUploadOptions) {

            return this.each(function() {

                // Create a reference to the jQuery DOM object
                var $this = $(this);

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
                    var $ctrl = $('#' + id);
                    var $wrapper = $('<div class="uploadify"><div class="uploadify-button-wrapper"></div></div>');

                    $ctrl.before($wrapper);

                    // Create the button
                    var $button = $('<div />', {
                        'id'    : id + '-button',
                        'class' : ['uploadify-button', settings.buttonClass].join(' ')
                    });

                    if (settings.buttonImage) {
                        $button.css({
                            'background-image' : 'url(' + settings.buttonImage + ')',
                            'text-indent'      : '-9999px'
                        });
                    }

                    $button.html('<span class="uploadify-button-text">' + settings.buttonText + '</span>')
                    .css({
                        'height'      : settings.height + 'px',
                        'width'       : settings.width + 'px',
                        'line-height' : settings.height + 'px'
                    });

                    // Wrap the controll instance and append the button to the wrapper
                    var $buttonWrapper = $wrapper.find('.uploadify-button-wrapper');
                    $buttonWrapper.append($button);

                    var vs = {
                        width: $button.outerWidth(),
                        height: $button.outerHeight(),
                        position: 'relative'
                    };
                    $buttonWrapper.css(vs);

                    // position swfuploader placeholder
                    $button.append($ctrl);

                    // Create the swfUpload instance
                    var swfuploadify = new SWFUpload($.extend(swfUploadSettings, {
                        button_width: vs.width,
                        button_height: vs.height
                    }));

                    // Add the SWFUpload object to the elements data object
                    $this.data('uploadify', swfuploadify);

                    $wrapper
                        .attr('id', id)
                        .data('uploadify', swfuploadify)
                        .delegate('.cancel a', 'click', function(e) {
                            var fileId = $(e.target).data('file-id');
                            if (fileId) {
                                Uploadify.call(id, 'cancel', fileId);
                            }
                        });

                    // Create the file queue
                    if (!settings.queueID) {
                        var queueID = id + '-queue', $queue = $('<div id="' + queueID + '" class="uploadify-queue" />');
                        $wrapper.append($queue);
                        swfuploadify.settings.queueID      = queueID;
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
            this.queueData.errorMsg       = '文件上传错误:';
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
                    if (settings.onNativeError) {
                        settings.onNativeError.call(this, this.queueData.errorMsg);

                    } else {
                        alert(this.queueData.errorMsg);
                    }
                }
            }

            // Call the user-defined event handler
            if (settings.onDialogClose) settings.onDialogClose.call(this, this.queueData);

            // Upload the files if auto is true
            if (settings.auto) {
                Uploadify.call(settings.id, 'upload', '*');
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

            // Create the file item template
            if (settings.itemTemplate == false) {
                settings.itemTemplate = ['<div id="${fileID}" class="uploadify-queue-item">',
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
            if ($.inArray('onSelect', settings.overrideEvents) < 0) {

                // Replace the item data in the template
                var itemHTML = settings.itemTemplate;
                for (var d in itemData) {
                    itemHTML = itemHTML.replace(new RegExp('\\$\\{' + d + '\\}', 'g'), itemData[d]);
                }

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
                        this.queueData.errorMsg += '\n文件"' + file.name + '" 超出大小限制 (' + settings.fileSizeLimit + ').';
                        break;
                    case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                        this.queueData.errorMsg += '\n文件 "' + file.name + '" 是空文件.';
                        break;
                    case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                        this.queueData.errorMsg += '\n文件 "' + file.name + '" 格式不符合要求 (' + settings.fileTypeDesc + ').';
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
                data = $.parseJSON(data);
            } catch (e) {}

            // Call the user-defined event handler
            if (settings.onUploadSuccess) settings.onUploadSuccess.call(this, file, data, response);
        }
    };// }}}

    var _slice = [].slice;

    var guidSeed = (((1 + Math.random()) * 0x10000) | 0);
    var guid = function guid(prefix) {
        prefix = prefix || '';
        return prefix + (++guidSeed).toString(32);
    };

    // provide a simple event mechanism.
    var setupEventProvider = function(obj, $el) {
        obj = obj || {};
        $el = $el || $('<b />');
        $.each({'on': 'on', 'un': 'off', 'emit': 'trigger'}, function(k, v) {
            obj[k] = function() { return $el[v].apply($el, arguments); };
        });
        return obj;
    };

    /**
     * Uploadify wrapper class implements
     * @constructor
     */
    function Uploadify($file, options, swfUploadOptions) {
        var self = this;

        // Implements generic custom event APIs
        setupEventProvider(self, $file);

        $.each(methods, function(k, fn) {
            if (methods.hasOwnProperty(k)) {
                self[k] = function(k) { return fn.apply($file, arguments); };
            }
        });

        // Init uploadify
        self.init(options, swfUploadOptions);

        var swfUpload = $file.data('uploadify');
        if (!swfUpload) {
            setTimeout(function() {
                var ex = { message: 'Uploader installation error.' }
                self.emit('setupError', [$file, ex]);
            }, 1)
            return;
        }

        self.swfUpload = swfUpload;
        self.settings = swfUpload.settings;
    }

    Uploadify.prototype = {

        /**
         * Reset the swfUpload states.
         */
        reset: function() {
            // TODO: implemen if necessary

        },

        /**
         * Show preview image by a specifc pic url.
         *
         * @param {String} url The image url
         */
        showPreview: function(url) {
            var self = this, settings = self.settings, $pwrap, $pimg, $wrapper;

            // swfUpload wrapper
            $wrapper = $('#' + settings.id);

            $pwrap = $wrapper.find('.uploadify-preview');
            if (!$pwrap.length) {
                $pwrap = $('<div class="uploadify-preview"><a href="#">X</a></div>').hide();
                $pwrap
                    .delegate('a', 'click', function(e) {
                        e.preventDefault();
                        $pwrap.hide();
                        self.emit('imageRemoved');
                    })
                    .appendTo($wrapper);
            }

            if (url) {
                $pimg = $pwrap.find('img');
                if (!$pimg.length) {
                    $pimg = $('<img node-type="preview" src="' + url +'" />');
                    $pimg
                        .on('load', function() { $pwrap.show(); })
                        .appendTo($pwrap);
                }

                $pimg.attr('src', url);
                $pwrap.show();
            } else {
                $pwrap.hide();
            }

            return this;
        }

    };

    /**
     * Provide a api for call swfUpload build-in method.
     *
     * @method call
     * @param {String|HTMLElement} The uploadify target element.
     * @param {String} method The build-in method name
     *
     * @static
     */
    Uploadify.call = function(input, method) {
        if (typeof input === 'string') {
            input = $('#' + input);
        }
        if (input[0] && methods[method]) {
            return methods[method].apply(input, _slice.call(arguments, 2));
        }
        $.error('The method ' + method + ' does not exist in `uploadify`');
    };

    // Exports
    var exports = {

        /**
         * Uploadify main entry api method.
         *
         * @param {String|HTMLElement} input The placeholder element to wrap.
         * @param {Object} options The uploadify options for installation.
         */
        uploadify: function(input, method) {
            var $file = $(input), file = $file[0];

            if (!file) {
                throw Error('Initialize uploadify error, invalid holder node.');
            }

            if (!file.id) {
                file.id = guid('__file__');
            }

            if (typeof method === 'object' || !method) {

                var self;

                var options = $.extend({}, method), swfUploadOptions = arguments[2] || {};
                var showPreview = options.showPreview;
                delete options.showPreview;

                var successFn = options.onUploadSuccess;
                options.onUploadSuccess = function(file, data, res) {
                    // show priew image with additional
                    if (showPreview) {
                        self.showPreview((data.data || 0).url);
                    }

                    if (successFn) {
                        successFn.apply(this, arguments);
                    }
                    else {
                        if (+data.error) {
                            self.cancel(file.id);
                            self.emit('error', [file, data]);
                        } else {
                            self.emit('uploadSuccess', [file, data, res]);
                        }
                    }
                };

                var errorFn = options.onUploadError;
                options.onUploadError = function(file, errorCode, errorMsg, errorString) {
                    var data = {error: errorCode, msg: errorMsg, data: errorString}
                    if (errorFn) {
                        errorFn.apply(this, arguments);
                    }
                    self.emit('error', [file, data]);
                };

                var destroyFn = options.onDestroy;
                options.onDestroy = function() {
                    $file.off();
                    $file = null;
                };

                // Initialize uploadify
                self = new Uploadify($file, options, swfUploadOptions);

                return self;
            } else {
                return Uploadify.call.apply(null, arguments);
            }
        }
    };

    return exports;
}));
