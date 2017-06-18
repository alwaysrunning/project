// artDialog - 默认配置
define({

    /* -----已注释的配置继承自 popup.js，仍可以再这里重新定义它----- */

    // 对齐方式
    // align: 'bottom left',
    // 是否固定定位
    // fixed: false,
    // 对话框叠加高度值(重要：此值不能超过浏览器最大限制)
    // zIndex: 1024,
    // 设置遮罩背景颜色
    // backdropBackground: '#000',
    // 设置遮罩透明度
    backdropOpacity : 0.3,

    // 自动关闭时间
    // autoTime ： 3000,
    // 消息内容
    content : '<span class="ui-dialog-loading">Loading..</span>',

    // 标题
    title : '',

    // 对话框状态栏区域 HTML 代码
    statusbar : '',

    // 自定义按钮
    button : null,

    // 确定按钮回调函数
    ok : null,

    // 取消按钮回调函数
    cancel : null,

    // 确定按钮文本
    okValue : 'ok',

    // 取消按钮文本
    cancelValue : 'cancel',

    cancelDisplay : true,

    // 内容宽度
    width : '',

    // 内容高度
    height : '',

    // 内容与边界填充距离
    padding : '',

    /**
     * 弹窗类型
     * 
     * @param {String}
     *            null:默认选项 tips:提示消息 warning:普通消息 error:错误消息 ok:正确 loading-text :
     *            加载 question:疑问
     * 
     * @author djune update @ 2014.7.19
     */
    type : 'null',

    // 对话框自定义 className
    skin : '',

    // 是否支持快捷关闭（点击遮罩层自动关闭）
    quickClose : false,

    // css 文件路径，留空则不会使用 js 自动加载样式
    // 注意：css 只允许加载一个, relative amd loader `baseUrl`
    cssUri : './dialog.css',

    // 模板（使用 table 解决 IE7 宽度自适应的 BUG）
    // js 使用 i="***" 属性识别结构，其余的均可自定义
    innerHTML : '<div i="dialog" class="ui-dialog">' + '<div class="ui-dialog-arrow-a"></div>' + '<div class="ui-dialog-arrow-b"></div>' + '<table class="ui-dialog-grid">' + '<tr>' + '<td i="header" class="ui-dialog-header">' + '<button i="close" class="ui-dialog-close">&#215;</button>' + '<div i="title" class="ui-dialog-title"></div>' + '</td>' + '</tr>' + '<tr>' + '<td i="body" class="ui-dialog-body">' + '<div i="content" class="ui-dialog-content"></div>' + '</td>' + '</tr>' + '<tr>' + '<td i="footer" class="ui-dialog-footer">' + '<div i="statusbar" class="ui-dialog-statusbar"></div>' + '<div i="button" class="ui-dialog-button"></div>' + '</td>' + '</tr>' + '</table>' + '</div>'

});
