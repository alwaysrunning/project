<?php
header("Content-type: application/json");
sleep(1);
$a = 'json';

if (isset($_GET['callback'])) {
    $a = $_GET['callback'];
}

$type = 1;




$dom = '<div class="mod-item mod-item-thumbnail jProductItem item-sold-out" data-id="10095000477"><a href="/item/9982000083.html"><img src="//s1.bbgstatic.com/gshop/images/index/temp/390x226.png" class="jImg gd-img" style="opacity: 1;"><div class="gd-info"><div class="gd-name"><div class="title">'.date("YmdHHmmss").'</div></div><div class="gd-price"><div class="gd-price-now"><em>￥</em>69.00</div><div class="gd-price-ori"><em>￥</em>69.00</div></div></div></a><div class="gd-cmd jAdd2Cart"><i class="iconglobal"></i></div></div>';

$ret = array();
$data = array();

$ret['error'] = '0';
$ret['msg'] = '';

if($type === 1) {
    $data['html'] = $dom;
    $ret['data'] = $data;



} else if($type === 0) {
    $ret['error'] = '1303';
    $ret['msg'] = '\u8be5\u5206\u7c7b\u4e0d\u5b58\u5728,id=91002';
    $data['data'] = "";


} else {
    $data['stack'] = "com.bubugao.framework.mvc.BbgCenterException: \u8be5\u5206\u7c7b\u4e0d\u5b58\u5728,id=91002\n\tat com.bubugao.goods.common.util.CenterExceptionUtil.createCenterException(CenterExceptionUtil.java:19)\n\tat com.bubugao.goods.service.validator.CategoryValidator.validateIdExsist(CategoryValidator.java:280)\n\tat com.bubugao.goods.service.validator.CategoryValidator.validateUnNeededParam(CategoryValidator.java:257)\n\tat com.bubugao.goods.service.validator.CategoryValidator.validateSearch(CategoryValidator.java:148)\n\tat com.bubugao.goods.service.compleximpl.CategoryServiceImpl.search(CategoryServiceImpl.java:204)\n\tat com.alibaba.dubbo.common.bytecode.Wrapper6.invokeMethod(Wrapper6.java)\n\tat com.alibaba.dubbo.rpc.proxy.javassist.JavassistProxyFactory$1.doInvoke(JavassistProxyFactory.java:46)\n\tat com.alibaba.dubbo.rpc.proxy.AbstractProxyInvoker.invoke(AbstractProxyInvoker.java:72)\n\tat com.alibaba.dubbo.rpc.protocol.InvokerWrapper.invoke(InvokerWrapper.java:53)\n\tat com.bubugao.framework.dubbo.FrameworkExceptionFilter.invoke(FrameworkExceptionFilter.java:31)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.AccessLogFilter.invoke(AccessLogFilter.java:199)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.TimeoutFilter.invoke(TimeoutFilter.java:42)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.monitor.support.MonitorFilter.invoke(MonitorFilter.java:65)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.protocol.dubbo.filter.TraceFilter.invoke(TraceFilter.java:78)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.ContextFilter.invoke(ContextFilter.java:60)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.GenericFilter.invoke(GenericFilter.java:112)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.ClassLoaderFilter.invoke(ClassLoaderFilter.java:38)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.filter.EchoFilter.invoke(EchoFilter.java:38)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.bubugao.framework.eye.dubbo.EyeProviderFilter.invoke(EyeProviderFilter.java:29)\n\tat com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper$1.invoke(ProtocolFilterWrapper.java:91)\n\tat com.alibaba.dubbo.rpc.protocol.dubbo.DubboProtocol$1.reply(DubboProtocol.java:108)\n\tat com.alibaba.dubbo.remoting.exchange.support.header.HeaderExchangeHandler.handleRequest(HeaderExchangeHandler.java:84)\n\tat com.alibaba.dubbo.remoting.exchange.support.header.HeaderExchangeHandler.received(HeaderExchangeHandler.java:170)\n\tat com.alibaba.dubbo.remoting.transport.DecodeHandler.received(DecodeHandler.java:52)\n\tat com.alibaba.dubbo.remoting.transport.dispatcher.ChannelEventRunnable.run(ChannelEventRunnable.java:82)\n\tat java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)\n\tat java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)\n\tat java.lang.Thread.run(Thread.java:745)\n";
    $ret['error'] = '1303';
    $ret['msg'] = '\u8be5\u5206\u7c7b\u4e0d\u5b58\u5728,id=91002';
    $ret['data'] = $data;
}

echo $a.'('.json_encode($ret).')';
?>
