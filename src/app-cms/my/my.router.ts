// 我的路由
import { MyShop } from './shop/shop';
import { MyWallet } from './wallet/wallet';
import { MyIncome } from './income/income';
import { MyTeam } from './team/team';
import { MySpread } from './spread/spread';
import { TeamList } from './team/teamList/team.list';
import withdrawsRouter from './withdraws/withdraws.router';
import myInventoryRouter from './inventory/inventory.router';

import { Helper } from './helper/helper';




const routes = [
    // 我的微店
    {
        path: '/myShop',
        name: 'myShop',
        component: () => Promise.resolve(MyShop)
    },
    // 我的钱包
    {
        path: '/myWallet',
        name: 'myWallet',
        component: () => Promise.resolve(MyWallet)
    },
    // 我的收益
    {
        path: '/myIncome',
        name: 'myIncome',
        component: () => Promise.resolve(MyIncome)
    },
    // 团队
    {
        path: '/myTeam',
        name: 'myTeam',
        component: () => Promise.resolve(MyTeam)
    },
    // 我要推广 
    {
        path: '/mySpread',
        name: 'mySpread',
        component: () => Promise.resolve(MySpread)
    },
    {
        path: '/teamList',
        name: 'teamList',
        component: () => Promise.resolve(TeamList)
    },
    {
        path: '/helper',
        name: 'helper',
        component: () => Promise.resolve(Helper)
    },
    
    //提现记录
    ...withdrawsRouter,
    //我的库存
    ...myInventoryRouter,
];
export default routes;