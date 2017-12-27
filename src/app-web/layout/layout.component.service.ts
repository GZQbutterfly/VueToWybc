// 菜单数据
import axios from 'axios';

export default {
    list: [
        {
            path: '/home',
            name: 'home',
            title: '首页',
            imgDefSrc: 'static/images/newshop/house2.png',
            imgActSrc: 'static/images/newshop/house.png'
        },
        {
            path: '/type',
            name: 'type',
            title: '分类',
            imgDefSrc: 'static/images/newshop/icon.png',
            imgActSrc: 'static/images/newshop/icon2.png'
        },
        {
            path: '/shoppcar',
            name: 'shoppcar',
            title: '购物车',
            showTip: true,
            imgDefSrc: 'static/images/newshop/shopping-cart.png',
            imgActSrc: 'static/images/newshop/shopping-cart2.png'
        },
        {
            path: '/userinfo',
            name: 'userinfo',
            title: '我的',
            imgDefSrc: 'static/images/newshop/man-user.png',
            imgActSrc: 'static/images/newshop/man-user2.png'
        }
    ],
    getList() {
        return axios.get('/static/i18n/zh_cn.json');
    },
    getWdInfo(data) {
        return axios.post("api/q_wdInfo_by_userId",data);
    },
    records(data){
        return axios.post("api/a_shopId_by_openId",data)
    }

};
