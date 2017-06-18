define(function(require, exports, module) {
    var BBG = {};
    var Path = {
        cart : '//m.yunhou.com/',
        mall : '//m.yunhou.com/',
        settlement : '//m.yunhou.com/'
    };

    var URL = {
        index : {
            page : '//m.yunhou.com'//主页
        },
        Img : {
            blank : '//s1.bbgstatic.com/public/img/blank.gif'
        },
        Login: {
		    minLogin: 'https://ssl.yunhou.com/passport/loginMini', // 迷你登录
            login: 'https://ssl.yunhou.com/passport/h5/login' // 主登录
        },
        Time : {
            current : 'http://m.yunhou.com/region/gettime/'
        },
        //四级地址
        Addr: {
            //获取默认选中的地址
            selectedUrl: 'http://m.yunhou.com/region/getuserregion/',
            //选中最后一层，请求后台存储cookie
            changeCallBackUrl: 'http://m.yunhou.com/region/setuserregion/',
            // 请求多级地址的url
            url: 'http://m.yunhou.com/region/'
        },
        //个人中心
        UC : {
            page : '//m.yunhou.com/member',//个人中心
            addrList : '//m.yunhou.com/member/address_list',//地址列表
            cardList : '//m.yunhou.com/member/idcard_list',//身份认证列表
            editAddr : '//m.yunhou.com/member/address_edit',//编辑地址
            addNewAddr : '//m.yunhou.com/member/address_add',//使用新地址
            infoAddr : '//m.yunhou.com/member/idcard_add',//身份认证
            EditInfo : '//m.yunhou.com/member/idcard_edit'//编辑身份认证
        },
        Cart : {
            get : Path.cart + 'cart/get', // 获取购物车数据
            checked : Path.cart + 'cart/checked', // 选中购物车
            update : Path.cart + 'cart/update', // 更新购物车数据
            del : Path.cart + 'cart/del', // 删除购物车数据
            dels: Path.cart + 'cart/dels', //删除多个购物车数据
            col : Path.mall + 'member/collection_add',//收藏
            cols : Path.mall + 'member/collection_adds',//收藏
			emptyCart: Path.mall+ 'cart/cleara',//清空购物车
			emptyFailPro: Path.mall+ 'cart/invalid',//清空失效商品
            cancelCol : Path.mall + 'member/collection_cancle',//取消收藏
            page : '//m.yunhou.com/html/cart/cart.html'//购物车页面
        },
        // 结算
        settlement : {
            page : '//m.yunhou.com/html/order/order.html',//结算
            refreshPage : '//m.yunhou.com/html/order/order.html?isRefresh=1',//结算
            payAddr : '//m.yunhou.com/html/pay/pay.html',//支付成功
            buyAtOnce : '//m.yunhou.com/html/order/buy-at-once.html',//立即购买2
            buyNow : '//m.yunhou.com/html/order/buy-now.html',//立即购买
            getSettlementList : Path.settlement + 'checkout/get',//结算列表
            getRefresh : Path.settlement + 'checkout/getRefresh',//获取二次数据
            selectAddr : Path.settlement + 'checkout/selectAddr',// 选择收货地址
            selectIdCard : Path.settlement + 'checkout/selectIdCard',//实名认证
            getInvoiceList: Path.settlement+'checkout/taxContent',//获取发票列表
            saveInvoiceInfo : Path.settlement + 'checkout/saveTax',// 保存发票信息
            noInvoice : Path.settlement + 'checkout/cancelTax',// 不需要发票
            taxType : Path.settlement + 'checkout/taxType',//获取发票类型
            useOffers : Path.settlement + 'checkout/useCoupon',// 站外优惠券--使用
            cancelOffers : Path.settlement + 'checkout/cancelCoupon',// 站外优惠券--取消
            deliveryList : Path.settlement + 'checkout/getDelivery',//获取配送方式列表
            selectDeliveryType : Path.settlement + 'checkout/selectDelivery',// 选择配送方式
            couponList: Path.settlement + 'checkout/getCoupons',//查询优惠券
            subOrder : Path.settlement + 'checkout/genOrders'// 提交订单
        }
    };
    //
    BBG.Path = Path;
    BBG.URL = URL;
    return BBG;
});
