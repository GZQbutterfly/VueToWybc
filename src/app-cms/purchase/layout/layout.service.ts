// 菜单数据
import axios from 'axios';
export default {
    list: [
        {
            path: '/cmsPurchaseType',
            name: 'cmsPurchaseType',
            title: '进货首页',
            imgDefSrc: '/static/images/newshop/icon.png',
            imgActSrc: '/static/images/newshop/icon2.png'
        },
        {
            path: '/cmsPurchaseShoppcar',
            name: 'cmsPurchaseShoppcar',
            title: '进货单',
            showTip: true,
            imgDefSrc: '/static/images/newshop/shopping-cart.png',
            imgActSrc: '/static/images/newshop/shopping-cart2.png'
        },
        {
            path: '/cmsPurchaseUserinfo',
            name: 'cmsPurchaseUserinfo',
            title: '我的',
            imgDefSrc: '/static/images/newshop/man-user.png',
            imgActSrc: '/static/images/newshop/man-user2.png'
        }
    ]
};
