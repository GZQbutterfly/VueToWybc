// 我的库存路由

import { MyInventoryList } from './inventory_list/inventory.list';
import { MyInventoryDetail } from './inventory_detail/inventory.detail';

const routes = [
    // 库存列表
    {
        path: '/myInventoryList',
        name: 'myInventoryList',
        component: () => Promise.resolve(MyInventoryList)
    },
    // 库存详情
    {
        path: '/myInventoryDetail',
        name: 'myInventoryDetail',
        component: () => Promise.resolve(MyInventoryDetail)
    }
];

export default routes;