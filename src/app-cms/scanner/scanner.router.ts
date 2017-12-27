// Sacnner
import { EasyScanner } from './easy/easy';


const routes = [
    // ===>
    // 轻松扫描
    {
        path: '/easyScanner',
        name: 'easyScanner',
        component: () => Promise.resolve(EasyScanner)
    }
];

export default routes;