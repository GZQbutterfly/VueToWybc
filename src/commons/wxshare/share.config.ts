
import Vuex from 'vuex';

//路由中大小写风格不统一  此配置统一小写


let store = new Vuex.Store({
    state: {
        hideAllList: {
            'ordersubmitting': true,
            'shoppcar': true,
            'userinfo': true,
            'submitorder': true,
            'cmspurchaseorderdetail': true,
            'orderrefundlayout': true,
            'cmspurchasesubmitorder': true,
            'search': true,
            'cmspurchaseshopcar': true,
            'useraddress': true,
            'cmspurchaseuserinfo': true,
            'login': true,
            'order_detail': true,
            'user_order': true,
            'cmsoutorder': true,
            'outorder':true,
            'outorderdetail':true,
            'myspread': true,
            'applyshopcampaign': true,
            'applyshop': true,
            'applyshopinvitecode':true,
            'cmspurchasegoodsdetail': true,
            'grade': true,
            'gradeup': true,
            'gradeguide': true,
            'myinventorylist':true,
            'mywallet':true,
            'myincome':true,
            'realname':true,
            'realnameform':true,
            'realnameresult':true,
            'withdraws_list':true,
            'withdraws_detail':true,
            'cmsstockorder':true,
            'cmsstockorderdetail':true,
            'cmsoutorderdetail':true,
            'cmspurchaseshoppcar':true,
            'messagenotice':true,
            'cmspurchasetype':true,
            'myteam':true,

        },
        shareConfig: {// 可动态带参存储---
            cmshome: {
                title: '管理我的店铺',
                desc: '快来管理自己的店铺吧！~',
                imgUrl: 'http://wybc-pro.oss-cn-hangzhou.aliyuncs.com/Wx/wxfile/share_sp.jpg',
            }
        }
    }
})

export default store;

