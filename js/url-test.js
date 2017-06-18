define(function(require, exports, module) {
    var cookie = require('common/kit/io/cookie');
    cookie('_nick', '111'); //设置用户名

    var BBG = {};
    var ip = 'http://test.data.com/';
    var URL = {
        index: {
            page: '//m.yunhou.com' //主页
        },
        Img: {
            blank: '//s1.bbgstatic.com/public/img/blank.gif'
        },
        Login: {
            minLogin: 'https://login.bubugao.com/login-min.php', // 迷你登录
            login: 'https://login.bubugao.com/login.php' // 主登录
        },
        Time: {
            current: 'http://m.yunhou.com/region/gettime/'
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
        UC: {
            page: '//m.yunhou.com/member', //个人中心
            addrList: '//m.yunhou.com/member/address_list', //地址列表
            cardList: '//m.yunhou.com/member/idcard_list', //身份认证列表
            editAddr: '//m.yunhou.com/member/address_edit', //编辑地址
            addNewAddr: '//m.yunhou.com/member/address_add', //使用新地址
            infoAddr: '//m.yunhou.com/member/idcard_add', //身份认证
            EditInfo: '//m.yunhou.com/member/idcard_edit' //编辑身份认证
        },
        Cart: {
            get: ip + 'mall/cart/get.php', // 获取购物车数据
            checked: ip + 'mall/cart/get.php', // 选中购物车
            update: ip + 'mall/cart/update.php', // 更新购物车数据
            del: ip + 'mall/cart/dels.php', // 删除购物车数据
            dels: ip + 'mall/cart/dels.php', // 删除购物车数据
            col: ip + 'mall/cart/addfavorite.php', // 收藏商品
            cols: ip + 'mall/cart/addfavorite.php', // 收藏商品
            emptyCart: ip+'success.php', //清空购物车
            emptyFailPro: ip + 'mall/cart/get.php', //清空失效商品
            cancelCol: ip + 'mall/cart/cancelAddfavorite.php', // 收藏商品
            page: 'html/cart/cart.html' //购物车页面
        },
        // 结算
        settlement: {
            page: '//m.yunhou.com/html/order/order.html', //结算
            refreshPage: 'order.html?isRefresh=1', //结算
            payAddr: '//m.yunhou.com/html/pay/pay.html', //支付成功
            buyAtOnce: '//m.yunhou.com/html/order/buy-at-once.html', //立即购买2
            buyNow: '//m.yunhou.com/html/order/buy-now.html', //立即购买
            getSettlementList: ip + "/mall/order/checkout.php", //结算列表
            getRefresh: ip + "/mall/order/getRefresh.php", //获取二次数据
            selectAddr: ip + "/mall/order/selectAddr.php", //选择收货地址
            selectIdCard: ip + '/mall/order/checkout.php', //实名认证
            getInvoiceList: 'http://test.data.com/mall/order/getInvoiceList.php', //获取发票信息
            saveInvoiceInfo: ip + "/mall/order/saveTax.php", // 保存发票信息
            noInvoice: ip + "/mall/order/setDefaultAddr.php", // 不需要发票
            taxType: ip + '/mall/order/taxType.php', //获取发票类型
            useOffers: ip + "/mall/order/useCoupons.php", // 站外优惠券--使用
            //useOffers          : "http://localhost:8000/error.php",// 站外优惠券--使用
            cancelOffers: ip + "/mall/order/useCoupons.php", // 站外优惠券--取消
            //cancelOffers          : "http://localhost:8000/error.php",// 站外优惠券--使用
            deliveryList: ip + "/mall/order/deliveryList.php", //获取配送方式列表
            selectDeliveryType: ip + "/mall/order/useCoupons.php", // 选择配送方式
            couponList: ip + "/mall/order/coupon/getCouponList.php",
            subOrder: ip + "/mall/order/genOrders.php" //提交
        }

    };
    BBG.URL = URL;
    return BBG;
});
