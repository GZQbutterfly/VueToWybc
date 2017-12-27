//微店管理端 CMS 
import VueRouter from 'vue-router';



import { cmsHome } from './home/home';
import PurchaseRouter from './purchase/purchase.router';
import GradeRouter from './grade/grade.router';
import AuthRouter from './auth/auth.router';
import MyRouter from './my/my.router';
import ScannerRouter from './scanner/scanner.router';
import UserOrderRouter from './order/order.router';
import { NotFound } from './notfound/notfound';
import {MessageNotice} from '../commons/components/notice/message/message.notice';

const routes = [
    { path: '/', redirect: { name: 'cmsHome' } },
    // ===>
    // 微店管理端首页
    {
        path: '/cmsHome',
        name: 'cmsHome',
        meta:{
            // title: '微店管理'
        },
        component: () => Promise.resolve(cmsHome)
    },
    // 我要进货
    ...PurchaseRouter,
    // VIP Grade
    ...GradeRouter,
    // 实名认证
    ...AuthRouter,
    // 我的钱包，库存，收益
    ...MyRouter,
    // 扫描
    ...ScannerRouter,
    //订单
    ...UserOrderRouter,
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
    //mode: 'history', //去掉#号
    routes
});
export default router;