// VIP等级路由
import { Grade } from './grade';
import { GradeUp } from './up/up';
import { GradeGuide } from './guide/guide';

const routes = [
    // ===>
    // VIP 等级
    {
        path: '/grade',
        name: 'grade',
        meta: { title: '店长等级' },
        component: () => Promise.resolve(Grade)
    },
    {
        path: '/gradeUp',
        name: 'gradeUp',
        meta: { title: '立刻晋级' },
        component: () => Promise.resolve(GradeUp)
    },
    // GradeGuide
    {
        path: '/gradeGuide',
        name: 'gradeGuide',
        meta: { title: '店长等级说明' },
        component: () => Promise.resolve(GradeGuide)
    }
];

export default routes;