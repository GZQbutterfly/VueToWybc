// 实名认证路由
import { RealName } from './realname/real.name';
import { RealNameForm } from './realname/form/form';
import { RealNameResult } from './realname/result/result';
const routes = [
    // 实名认证
    {
        path: '/realName',
        name: 'realName',
        component: () => Promise.resolve(RealName)
    },
    // 实名认证填写
    {
        path: '/realNameForm',
        name: 'realNameForm',
        component: () => Promise.resolve(RealNameForm)
    },
    // 实名认证返回结果页
    {
        path: '/realNameResult',
        name: 'realNameResult',
        component: () => Promise.resolve(RealNameResult)
    },
];

export default routes;