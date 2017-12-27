import Vue from 'vue';
import Vuex from 'vuex';
// import vuexI18n from 'vuex-i18n/dist/vuex-i18n.es';
// import i18n from '../store/i18n';
import dialog from '../components/popup/dialog';
import info from '../components/popup/info';
import popup from '../components/popup/base';
import loadding from '../components/popup/loadding';
import topLoadding from '../components/popup/topLoadding';
import toast from '../components/popup/toast';
import axios from 'axios';

import { getLocalUserInfo } from '../commons/common.env';



const store = new Vuex.Store({
    modules: {
        // i18n: vuexI18n.store,
    },
    state: {
        $dialog: dialog,
        $info: info,
        $loadding: loadding,
        $toast: toast,
        $http: axios,
        $popup: popup,
        $topLoadding: topLoadding,
        workVO: {
            env: process.env.NODE_ENV,
            lang: 'zh_cn',
            user: getLocalUserInfo()
        },
        shopCar: {
            count: 0
        },
        // 缓存数据
        cache: {

        }
    },
    mutations: {
        increment(state) {

        }
    }
});
// Vue.use(vuexI18n.plugin, store);

// // zh_CN  us_EN
// let _vue: any = Vue;
// _vue.i18n.add('cn', i18n.i18n_cn);
// _vue.i18n.add('en', i18n.i18n_en);

// _vue.i18n.set('cn');



export default store;

