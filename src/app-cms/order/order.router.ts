import { OutOrder } from './out/out.order';
import { StockOrder } from './stock/stock.order';
import { StockOrderDetail } from './stock/detail/stock.order.detail';
import { OutOrderDetail } from './out/detail/out.order.detail';
import { resolve } from 'dns';

const routes = [
    {
        path: '/cmsoutOrder',
        name: 'cmsoutOrder',
        component: (resolve) => resolve(OutOrder)
    }, {
        path: '/cmsStockOrder',
        name: 'cmsStockOrder',
        component: (resolve) => resolve(StockOrder)
    }, {
        path: '/cmsStockOrderDetail',
        name: 'cmsOrderDetail',
        component: (resolve) => resolve(StockOrderDetail)
    }, {
        path: '/cmsOutOrderDetail',
        name: 'cmsOutOrderDetail',
        component: (resolve) => resolve(OutOrderDetail),
    }
];
export default routes;