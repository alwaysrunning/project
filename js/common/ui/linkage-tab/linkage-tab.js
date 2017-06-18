/*
 * @name: linkageTab;
 * @author: licuiting;
 * @email: 250602615@qq.com;
 * @date: 2014-4-13;
 * @version: 1.2;
 * 联动选项卡;
 *
 * @update  taotao  2015-09-01
 *
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var cookie = require('common/kit/io/cookie');
    var io = require('common/kit/io/request');
    var BBG = require('url');

    /**
     * 判断表单元素
     * @param  {jQuery Element}  element
     * @return {Boolean}         is froms
     */
    function isForms(element) {
        var forms = ['input', 'textarea', 'select'],
            nodeName;

        if (element && element.length) {
            element = element[0];
            nodeName = element.nodeName;
        }

        if ( nodeName && $.inArray( nodeName.toLowerCase(), forms ) !== -1 ) {
            return true;
        }

    }
    //
    function LinkageTab(opt ,param) {
        if((typeof opt).toLowerCase() == 'object'){
            //缓存对象
            $('#'+opt.selector).data('linkageTab',$.extend(this, this.defaultSetting, opt || {}));
            this.init();
        }else{
            //执行方法
            eval('this.'+ opt +'(param)');
        }
    }
    LinkageTab.prototype = {
        defaultSetting: {
            //调用多级地址的对象
            linkageBox : $('#jAddrPop'),
            // 外围盒子id
            selector: '_jAddrPop',
            //tab面板id
            tabSelector : '_jAddrPopTab',
            // 数据url
            url: BBG.URL.Addr.url,
            // 获取选中数据的url:'http://10.201.7.62/openapi/common.area/api'
            selectedUrl : BBG.URL.Addr.selectedUrl,
            // 点击最后一个选项内容请求的url:'http://10.201.7.62/openapi/common.area/api'
            changeCallBackUrl : BBG.URL.Addr.changeCallBackUrl,
            // ps:{area :湖南_长沙市_芙蓉区_文艺路街道:43_430100000000_430102000000_430102010000}
            // selectedData: Cookie.read('bbg_def_addr'),
            ajaxData : {},//外部ajax参数
            selectedData:'',
             // 下拉列表隐藏域的id
            selectValInput : 'f1',
            // 只存选中的value值
            selectValId : 'f2',
            selectValName : '',
            //三级地址id
            threeAddrId : 'f5',
            // area 存文本和id的隐藏域的id
            areaId : 'areaInfo',
            // 存最后一个值的隐藏域的id
            lastValueId : 'f4',
            //省级id
            firstValueId : 'f6',
            // 层级
            degree : 4,
            //地址是否为空
            isAddressNull:false,
            //默认文字
            defaultText : '请选择',
            //
            loadTxt : '加载中...',
            //第一次加载,是否显示地址
            isShowAddr : false,
            //加载完毕执行
            loaded : function(){},
            //是否显示服务器上的默认四级地址--content
            isShowDefault : true,
            isShowLink : true,//是否展示四级地址--linkageTab
            //选项卡文字
            labelTxt : ['选择省','选择市','选择区','选择街道'],
            //默认展示第几个tab;参数为数值[0,..];false表示不启用;
            defaultTab : '0',
            //多级选择完毕后的回调
            lastChangeCallBack:function(){

            },
            changeCallBack : function(){

            },
            onShow : function(){

            },
            onHide : function(){

            },
            //关闭的回调
            onClose : function(){

            }
        },
        init: function() {
            var _self = this;
            // html
            if($('#'+_self.selector).length == 0){
                //防止id重复
                _self.creaHiddenId();
                $('body').append(_self.createDiv());
            }
             // wrap
            _self.o = $('#'+_self.selector);
            // tab
            _self._t = $( '#'+_self.selector+' .tab li');
            // content
            _self._c = $( '#'+_self.selector + ' .mc');
            //cookie有值就读cookie里的值
            if(cookie('_address')){ _self.selectedData = cookie('_address') };
             //获取缓存的值
             if(_self.linkageBox.length!=0 && _self.linkageBox.attr('data-linkage-tab')){
                    _self.selectedData = _self.linkageBox.attr('data-linkage-tab');
             }
             //
            _self.isShowLink && _self.show();
            // 设置默认高度
            _self.setHeight();
            // 获取选中的值
            _self.getSelectedData(function(){
                // 给隐藏域填值
                _self.setValForHidden( true );
                // 绑定事件
                _self.eventBind();
                //内容加载完毕
                _self.loaded();
                _self.isShowAddr && _self.o.find('.text').click();
            });
        },
        setHeight : function(){
            var self = this;
            var h = $(window).height();
                //self.o.find('.tab').height(h);
                self.o.find('.content').height(h-$('#jLinkageTopBox').height());
        },
        //设置地址 把地址1复制到地址2;
        //param : [ '地址1的id' ,'地址2的id'  ];
        setAddr : function( param ){
            var $before = $('#' + param[0]);
            var $after = $('#' + param[1]);
            var opt = $after.data('linkageTab');
            //选中的值
            $after.attr('data-linkage-tab',$before.attr('data-linkage-tab'));
            new LinkageTab(opt);
        },
        getSelectedData : function( callback ){
            var _self = this;

            if( _self.selectedUrl !=null
                    && _self.selectedUrl !=''
                        && (_self.selectedData ==''
                            || _self.selectedData ==null)
                                && _self.isAddressNull == false && _self.isShowDefault){
                //获取默认地址
                setTimeout(function(){
                    _self.ajax(_self.selectedUrl, {
                        action : 'get_def_area'

                    },
                    function(data) {
                        _self.selectedData = data;
                        callback && callback();
                    },function(){
                        callback && callback();
                    });
                },30);
            }else{
                //填充地址
                callback && callback();
            }
        },
        //防止id重复
        creaHiddenId : function(){
            var idArr = ['selectValInput','selectValId','areaId','threeAddrId','lastValueId','firstValueId'];
            var _self = this;
            $.each(idArr,function(){
                if($('#'+_self[this]).length!=0){
                    _self[this] = _self[this]+'_'+_self.selector;
                }
            })
        },
        //
        createDiv : function(){
            var self = this;
            var ar = [];
            var dis = self.isShowLink?'':' style="display:none;"';
            ar.push('   <div class="linkage-tab" id="'+ self.selector + '"'+ dis +'>',
                            self.createTop(),
                            '<div class="linkage-tab-body">',
                                '<input type="hidden" id="'+ self.selectValInput +'" name="'+ self.selectValInput +'"/>',
                                '<input type="hidden" id="'+ self.selectValId +'" />',
                                '<input type="type" id="'+ self.areaId +'" name="'+ self.areaId +'" class="linkage-tab-input"/>',
                                '<input type="hidden" id="'+ self.threeAddrId +'" name="'+ self.threeAddrId +'">',
                                '<input type="hidden" id="'+ self.lastValueId +'" />',
                                '<div class="close">×</div>',
                                self.createTxt(),
                                self.createTab(),
                                self.createContent(),
                            '</div>',
                        '</div>');
            return ar.join('');
        },
        createTop : function(){
            var ar = ['<header class="ui-header" id="jLinkageTopBox">',
                        '<a  class="icon iconfont ui-back jLinkAgeClose">&#xe60d;</a>',
                        '<span class="ui-title">地址选择</span>',
                        '<a class="icon iconfont ui-handle jLinkageTab">&#xe60a;</a>',
                    '</header>'];
            return ar.join('');
        },
        createTxt : function(){
            return '<div class="text" style="display:none;"></div>'
        },
        //tab
        createTab : function(){
            var self = this;
            var d = self.degree;
            var ar = [];
                ar.push('<div class="tab" id="'+ self.tabSelector +'">','<ul>');
                    for(var m=0;m<d;m++){
                        ar.push( '<li data-index="'+ m +'" data-widget="tab-item" class="'+ (m==0?'hover':'') +'" style="display:'+ (m==0?'block':'none') +';">',
                                    self.labelTxt[m],
                                '</li>');
                    }
                ar.push('</ul>','</div>');
            return ar.join('');
        },
        //content
        createContent : function(){
            var self = this;
            var d = self.degree;
            var ar = [];
                ar.push('<div class="content">','<div class="inner">');
                    for(var n=0;n<d;n++){
                        ar.push( '<div class="mc" data-index="'+ n +'" data-widget="tab-content" style="display:'+ (n==0?'block':'none') +'">',
                                    '<div class="load-txt-box jLoadBox">'+ self.loadTxt +'</div>',
                                    '<ul class="area-list">',
                                    '</ul>',
                                '</div>');
                    }
                ar.push('</div>','</div>');
            return ar.join('');
        },
        // 添加内容
        addStr: function(data ,index) {
            var _self = this;
            var str = '';
            //获取当前选中的id
            var selectedId = _self._t.eq(index).attr('data-value');
            //索引
            var _i = 0;
            $.each(data, function(k, v) {
                //
                if(v){
                    str += '<li data-value="' + k + '" data-a-index="'+ _i +'" class="limit '+ (k==selectedId?'hover':'') +'" title="'+ v +'"><a href="javascript:;">'+ v +'</a></li>';
                }
                _i++;
            });
            return str;
        },
        //
        ajax: function(url, data, successFun, errorFun) {
            var opt = $.extend({ platform   :'js'},data);
            io.jsonp(url,opt,function (data) {
                successFun && successFun(data);
            },function(data){
                errorFun && errorFun(data);
            })
        },
        // tab效果;
        tab : function( index ){
            var _self = this;
            // 显示对应tab
            _self._t.eq(index).siblings().removeClass('hover');
            _self._t.eq(index).show().addClass('hover');
            // 显示相应content
            _self._c.hide();
            _self._c.eq(index).show();
        },
        //根据配置重置tab顺序
        resetTab : function(){
            var _self = this;
            if(_self.defaultTab){
                _self.tab(_self.defaultTab);
            }
        },
        // 显示tab
        showTab : function( obj ){
            var _self = this;
            var _tab = _self._t.eq(obj.index);
            var text = _tab;
            _tab.show();
            _tab.attr({ 'title' :  obj.text });
            text.attr({ 'data-value' : obj.id }).html(obj.text);
        },
        // 默认or编辑状态
        defaultOrEdit:function(){
            var _self = this;
            var valArr = [ ];
            var textArr = [];
            var jsonArr = [];
            var lastIndex = '';
            var _parentId = '';
            // edit 湖南_长沙市_芙蓉区_文艺路街道:43_430100000000_430102000000_430102010000
            if(_self.selectedData!='' && _self.selectedData!=null && _self.selectedData.indexOf(':')>-1){
                valArr = _self.selectedData.split(':')[1].split('_');
                textArr = _self.selectedData.split(':')[0].split('_');
                // 父级默认为0;
                valArr.unshift('0');
                // 循环输出content的值;
                for(var i=0;i<valArr.length-1;i++){
                    _self.addContent( i,valArr[i]);
                    _self.showTab({ id : valArr[i+1] ,text : textArr[i] ,index : i });
                }
                //默认展示最后一项，并选中最后一项的文字
                lastIndex = valArr.length-1;//最后一项的索引;
                _parentId = valArr.pop();//父级id;
                //显示
                _self._t.removeClass('hover');
                _self._c.hide();
                _self.addContent( lastIndex ,_parentId ,function(data){
                    if(data && !$.isEmptyObject(data['data'])){
                        var _data = data['data'][lastIndex][_parentId];
                        if(!_data||$.isEmptyObject(_data)||_data==''){
                            lastIndex--;
                        }
                    }else{
                        lastIndex--;
                    }
                    //级数判断
                    if(lastIndex>_self.degree-1){
                        lastIndex = _self.degree-1;
                    }
                    //
                    _self.defaultTab && (lastIndex = _self.defaultTab);
                    _self.tab(lastIndex);
                });
            }else{
                // 默认加载第一项;
                _self.addContent( 0,0);
            }
        },
        //是否第一次选择
        isFirstClick : function(){
            var self = this;
            return ($.trim(this._c.eq(0).find('.area-list').html())=='');
        },
        //显示
        show : function(){
            var self = this;
                self.o.addClass('linkage-tab-hover');
                $('html').addClass('linkage-tab-hidden');
                // 默认或编辑状态显示,禁止重复请求;
                self.isFirstClick() && self.defaultOrEdit();
                self.onShow();
        },
        //
        hide : function(){
            $('html').removeClass('linkage-tab-hidden');
            this.o.removeClass('linkage-tab-hover');
            this.onHide();
        },
        eventBind: function() {
            var _self = this;
            // 事件绑定
            _self.o.off('click')
            // 点击option,显示内容
            .on('click','.text',function(){
                 _self.o.addClass('linkage-tab-hover');
                // 默认或编辑状态显示,禁止重复请求;
                _self.isFirstClick() && _self.defaultOrEdit();
            })
            // 关闭
            .on('click','.jLinkAgeClose',function(){
                _self.hide();
                _self.resetTab();
                _self.onClose();
            })
            //点击选项卡
            .on('click','.tab li',function(){
                var index = $(this).attr('data-index');
                    _self.tab( index );
            })
            //点击选中文字
            .on('click','.mc li',function(e){
                var $this = $(this);
                var index = Number($(this).closest('.mc').attr('data-index'));
                var text = $(this).text();
                var defaultText = '请选择';
                var parentId = $(this).attr('data-value');
                _self.addContent( index+1 ,parentId ,function( data ){
                    // 填text;
                    _self._t.eq( index ).attr('title' ,text);
                    _self._t.eq(index).html(text);
                    // 填value;
                    _self._t.eq( index ).attr('data-value',parentId);
                    //记录当前选中的值
                    _self._c.eq( index ).removeClass('hover');
                    $this.siblings().removeClass('hover');
                    $this.addClass('hover');
                    // 判断下级是否有数据
                    if( data['data'][index+1]&& index<_self.degree-1 ){
                        // 显示
                        _self._t.show();
                        $.each(_self._t, function(i, v){
                            if (i > index+1) {
                                $(this).hide();
                            }
                        });
                        // tab
                        _self.tab( index+1 );
                        // next填值
                        _self._t.eq( index+1 ).attr('title' ,defaultText);
                        _self._t.eq( index+1 ).html(defaultText);
                    }else{
                        $.each(_self._t, function(i, v){
                            if (i > index) {
                                $(this).hide();
                            }
                        });
                        // 给后台存值
                        _self.setValForHidden();
                        // 关闭界面
                        _self.o.removeClass('linkage-tab-hover');
                        // 点击最后一个内容后的回调函数;
                        _self.setChangeBack();
                    }
                });
            });

        },
        // 设置返回后调用的公用函数
        setChangeBack : function(){
            var _self = this;
            if(_self.changeCallBackUrl!=''){
                _self.ajax(_self.changeCallBackUrl, {
                    action : 'set_def_area',
                    area : $('#'+_self.areaId).val()
                },
                function(data) {
                    _self.changeCallBack( data );
                    _self.lastChangeCallBack( data );
                });
            }else{
                _self.changeCallBack(  );
                _self.lastChangeCallBack(  );
            }


        },
        // 添加内容
        addContent : function( index ,parentId ,callback ){
            var _self = this;
            var defaultText =  '请选择';
            _self.ajax(_self.url, {
                pregionid: parentId
            },
            function(data) {
                if(data && data['data'][ index ]){
                    // 载入数据
                    _self._c.eq(index).find('.area-list').html(_self.addStr( data['data'][ index ][ parentId ] ,index))
                    _self.o.find('.jLoadBox').eq(index).hide();
                }
                // 回调
                callback && callback( data );
            })
        },
        // 给隐藏域填值
        setValForHidden : function( flag ){
            var _self = this;
            // 取text
            var textArr = [];
            // 取 value
            var valArr = [];
            // 默认文本
            var firstText = 'mainland';
            // 初始值
            var firstValue = '';
            // 最终值
            var lastValue = '';
            //
            var selectVal = '';
            var threeVal = '';
            var threeArr = [];
            // 界面初始化
            if(flag){
                if(_self.selectedData!='' && _self.selectedData!=null && _self.selectedData.indexOf(':')>-1){
                    var dataArr = _self.selectedData.split(':');
                    var _txt = dataArr[0].split('_');
                    var _val = dataArr[1].split('_');
                    for(var j=0;j<_self.degree;j++){
                        textArr.push(_txt[j]);
                        valArr.push(_val[j]);
                    }
                }else{
                    return false;
                }
            }else{
                _self._t.each(function(i,v){
                    if($(this).closest('li').attr('display')!='none'){
                        textArr.push( $(this).text() );
                        valArr.push( $(this).attr('data-value') );
                    }
                })
            }
            //省级vaue
            firstValue = valArr[0];
            // 最终value,取数组的最后一个值
            lastValue = valArr[ valArr.length-1 ];
            // 获取返回的字符串(ps---mainland:湖南/长沙市/芙蓉区/司门口:4320000(ps:这是最后一个下拉框的value值))
            selectVal = firstText + ':' + textArr.join('/') + ':' + lastValue;
            //三级地址的值
            threeVal = selectVal;
            if(textArr.length>3){
                $.each(textArr,function(i,v){
                    if(i<3){
                        threeArr.push(textArr[i]);
                    }
                });
                threeVal = firstText + ':' + threeArr.join('/') + ':' + valArr[2];
            }
            // 填充值
            _self.o.find('.text').attr('title' ,textArr.join(','));
            //
            _self.o.find('.text').html(textArr.join('<i></i>'));
            // 给隐藏域赋下拉列表返回的值
            $('#'+_self.selectValInput).val( selectVal );
            // 储存下拉列表的value,默认用逗号隔开;
            $('#'+_self.selectValId).val( valArr.join(',') );
            // 储存text:val
            $('#'+_self.areaId).val(textArr.join('_')+':'+valArr.join('_'));
            //储存三级地址
            $('#'+_self.threeAddrId).val(threeVal);
            //给linkage
            _self.o.attr({'data-linkage-tab':textArr.join('_')+':'+valArr.join('_')});
            //
            $('#'+_self.lastValueId).val(lastValue);
            //
            $('#'+_self.firstValueId).val(firstValue);
            //
            if(_self.linkageBox.length != 0){
                _self.linkageBox[ isForms(_self.linkageBox) ? 'val' : 'text']( textArr.join(',') );
                // _self.linkageBox.text(textArr.join(','));
                _self.linkageBox.attr({'data-linkage-tab':textArr.join('_')+':'+valArr.join('_')});
            }
        }
    }
    //
    return function(opt ,param){
        return new LinkageTab(opt ,param);
    }
})
