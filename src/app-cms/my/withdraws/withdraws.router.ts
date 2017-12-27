
import { WithdrawsList } from './list/withdraws.list';
import { WithdrawsDetail } from './detail/withdraws.detail';

const routes = [
    // 提现记录列表
    {
        path: '/withdraws_list',
        name: 'withdraws_list',
        component: (resolve) => resolve(WithdrawsList)
    },
    // 提现记录详情
    {
        path: '/withdraws_detail',
        name: 'withdraws_detail',
        component: (resolve) => resolve(WithdrawsDetail)
    },
];
export default routes;