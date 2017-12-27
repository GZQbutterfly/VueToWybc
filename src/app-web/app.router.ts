// 路由配置
import Vue from 'vue';
import VueRouter from 'vue-router';

import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { Home } from './home/home';
import { Classify } from './classify/classify';
import { Shopcar } from './shopCar/shopCar';
import { UserInfo } from './userinfo/userinfo';
import { Search } from './search/search';
import { UserOrder } from './order/list/user.order';
import { GoodsDetail } from './goods/goods.detail';
import { OrderDetail } from './order/detail/order.detail';
import { OrderSubmitting } from './order/submitting/order.submitting';
import { GoodsList } from './goodsList/goodsList';
import { UserAddress } from './userinfo/address/user.address';
import { Package } from "./package/package";

import { Login } from './login/login';
import { PayOrder } from './order/pay/pay.order';
import { PayResult } from './order/pay/result/pay.order.result';
import { LoginBack } from './login/back/back';
import { NotFound } from './notfound/notfound';
//搜索控件test
import { searchBarTest } from '../components/searchBar/test/test';
// 申请开店
import { ApplyShopCampaign } from './apply/campaign/campaign';
import { ApplyShopInvitecode } from './apply/invitecode/invitecode';
import { ApplyShop } from './apply/shop/shop';
import { applyShopWiki } from './apply/wiki/wiki';

import { Address } from '../commons/components/address/address';
import { MessageNotice } from '../commons/components/notice/message/message.notice';

import { Protocol } from './protocol/protocol';

const routes = [
    { path: '/', redirect: { name: 'home' } },
    {
        path: '/layout',
        name: 'layout',
        component: () => Promise.resolve(LayoutComponent),
        redirect: { name: 'home' },
        children: [
            // 首页
            {
                path: '/home',
                name: 'home',
                title: '微商城',
                meta: { keepAlive: true },
                component: () => Promise.resolve(Home),

            },
            // 分类
            {
                path: '/type',
                name: 'type',
                meta: { keepAlive: true },
                component: () => Promise.resolve(Classify)
            },
            // 购物车
            {
                path: '/shoppcar',
                name: 'shoppcar',
                meta: { keepAlive: true },
                component: () => Promise.resolve(Shopcar)
            },
            // 我的
            {
                path: '/userinfo',
                name: 'userinfo',
                meta: { keepAlive: true },
                component: () => Promise.resolve(UserInfo)
            },
            // 商品详情
            {
                path: '/goods_detail',
                name: 'goods_detail',
                meta: {
                    noMenu: 1,
                },
                component: () => Promise.resolve(GoodsDetail)
            },
            {
                path: '/user_order',
                name: 'user_order',
                meta: {
                    noMenu: 1,
                },
                component: () => Promise.resolve(UserOrder),
            },
            // 订单详情
            {
                path: '/order_detail',
                name: 'order_detail',
                meta: {
                    noMenu: 1,
                },
                component: OrderDetail

            },
            // 提交订单页面流程 submitting
            {
                path: '/order_submitting',
                name: 'order_submitting',
                meta: {
                    noMenu: true
                },
                component: () => Promise.resolve(OrderSubmitting)
            },
            // 搜索、首页、分类的公共商品列表组件
            {
                path: '/goodsList',
                name: 'goodsList',
                component: () => Promise.resolve(GoodsList)
            } 
        ]
    },
    // 登录
    {
        path: '/login',
        name: 'login',
        component: () => Promise.resolve(Login)
    },
    // 搜索
    {
        path: '/search',
        name: 'search',
        component: () => Promise.resolve(Search),
        history: false
    },
    // 地址
    {
        path: '/userAddress',
        name: 'userAddress',
        component: () => Promise.resolve(UserAddress)
    },
    //订单支付
    {
        path: '/payOrder',
        name: 'payOrder',
        component: () => Promise.resolve(PayOrder)
    },
    //支付结果
    {
        path: '/payResult',
        name: 'payResult',
        component: () => Promise.resolve(PayResult)
    },
    //活动套餐
    {
        path: '/package',
        name: 'package',
        component: () => Promise.resolve(Package)
    },
    // 登录回调结果中转站
    // {
    //     path: '/cztback*',
    //     component: () => Promise.resolve(LoginBack)
    // },
    //开店
    // 宣传信息
    {
        path: '/applyShopCampaign',
        name: 'applyShopCampaign',
        component: () => Promise.resolve(ApplyShopCampaign)
    },
    // 邀请码
    {
        path: '/applyShopInvitecode',
        name: 'applyShopInvitecode',
        component: () => Promise.resolve(ApplyShopInvitecode)
    },
    // 申请开店
    {
        path: '/applyShop',
        name: 'applyShop',
        component: () => Promise.resolve(ApplyShop)
    },
    // 申请开店Wiki
    {
        path: '/applyShopWiki',
        name: 'applyShopWiki',
        component: () => Promise.resolve(applyShopWiki)
    },
    {
        path: '/address',
        name: 'address',
        component: () => Promise.resolve(Address)
    },

    // 搜索控件测试
    {
        path: '/searchBarTest',
        component: () => Promise.resolve(searchBarTest)
    },

    // 无忧本草协议
    {
        path: '/wybcProtocol',
        name: 'wybcProtocol',
        component: () => Promise.resolve(Protocol)
    },
    // LoginBack
    {
        path: '/loginBack',
        name: 'loginBack',
        component: () => Promise.resolve(LoginBack)
    },
    {
        path: '/messageNotice',
        name: 'messageNotice',
        component: () => Promise.resolve(MessageNotice)
    },
    // 404
    {
        path: '**',
        name: 'NotFound',
        meta: { keepAlive: true },
        component: () => Promise.resolve(NotFound)
    }
];

// 创建路由实例
const router = new VueRouter({
    mode: 'history', //去掉#号
    routes
});

export default router;
