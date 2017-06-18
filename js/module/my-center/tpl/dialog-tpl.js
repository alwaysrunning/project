
define(function(require, exports, module) {

    'use strict';

    return [
    '<div class="cancel-cnt">',
    '<div class="ui-item">',
    '<label class="ui-label">取消原因:</label>',
    '<div class="inner-ctrls">',
    '<select id="jCancelReason">',
    '<option value="">请选择取消原因</option>',
    '<option value="不想买了">不想买了</option>',
    '<option value="商品价格高">商品价格高</option>',
    '<option value="支付不成功">支付不成功</option>',
    '<option value="送货时间太长">送货时间太长</option>',
    '<option value="商品缺货">商品缺货</option>',
    '<option value="地址/发票填写有误">地址/发票填写有误</option>',
    '<option value="需添加或删除商品">需添加或删除商品</option>',
    '<option value="需修改优惠券信息">需修改优惠券信息</option>',
    '</select>',
    '</div>',
    '</div>',
    '<div class="ui-item">',
    '<label class="ui-label">其它原因:</label>',
    '<div class="inner-ctrls">',
    '<textarea id="jOtherReason"></textarea>',
    '<p class="hint">请填写取消原因(4-250字符)</p>',
    '</div>',
    '</div>',
    '</div>'
    ].join('');

});