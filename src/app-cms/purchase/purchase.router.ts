import { CmsLayout } from './layout/layout';
// import { CmsPurchaseHome } from './home/home';
import { CmsPurchaseClassify } from './classify/classify';
import { CmsPurchaseShopCar } from './shopCar/shopCar';
import { CmsPurchaseUserinfo } from './userinfo/userinfo';
import { CmsPurchaseSubmitOrder } from './order/submit/submit.order';
import { CmsPurchaseGoodsDetail } from './goods/goods.detail';
import { CmsPurchaseOrderDetail } from './order/detail/order.detail';
import { Search } from './search/search';

const routes = [
    // ===>
    // 我要进货
    {
        path: '/cmsPurchase',
        name: 'cmsPurchase',
        component: () => Promise.resolve(CmsLayout),
        redirect: { name: 'cmsPurchaseType' },
        children: [
            // 
            // {
            //     path: '/cmsPurchaseHome',
            //     name: 'cmsPurchaseHome',
            //     meta: {
            //         keepAlive: true,
            //         menu: true,
            //         title: '微店XXX'
            //     },
            //     component: () => Promise.resolve(CmsPurchaseHome)
            // },
            // 分类
            {
                path: '/cmsPurchaseType',
                name: 'cmsPurchaseType',
                meta: { keepAlive: true, menu: true },
                component: () => Promise.resolve(CmsPurchaseClassify)
            },
            // 购物车
            {
                path: '/cmsPurchaseShoppcar',
                name: 'cmsPurchaseShoppcar',
                meta: { keepAlive: true, menu: true },
                component: () => Promise.resolve(CmsPurchaseShopCar)
            },
            // 我的
            {
                path: '/cmsPurchaseUserinfo',
                name: 'cmsPurchaseUserinfo',
                meta: { keepAlive: true, menu: true },
                component: () => Promise.resolve(CmsPurchaseUserinfo)
            },
            //商品详情
            {
                path: '/cmsPurchaseGoodsDetail',
                name: 'cmsPurchaseGoodsDetail',
                component: () => Promise.resolve(CmsPurchaseGoodsDetail)

            },
            //提交订单
            {
                path: '/cmsPurchaseSubmitOrder',
                name: 'cmsPurchaseSubmitOrder',
                component: () => Promise.resolve(CmsPurchaseSubmitOrder)
            },
            //订单详情
            {
                path: '/cmsPurchaseOrderDetail',
                name: 'cmsPurchaseOrderDetail',
                component: () => Promise.resolve(CmsPurchaseOrderDetail)
            },
            //我要进货搜索页面
            {
                path: '/cmsPurchaseSearch',
                name: 'cmsPurchaseSearch',
                component: () => Promise.resolve(Search)
            }
        ]
    }
];
export default routes;