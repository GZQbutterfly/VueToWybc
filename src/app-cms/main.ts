import Vue from 'vue';
import axios from 'axios';

import '../vconsole.log';
import './cms.moudle';
import '../commons/events';

import router from './cms.router';
import store from './cms.store';


import authHandler from '../commons/auth';
import { axiosConfig } from '../commons/common.env';

import CmsRouterAuth from './cms.router.auth';

import WxShareWatcher from '../commons/wxshare';


// 初始化vue环境
let _vm: any = new Vue({
    el: '#app',
    router,
    store
});

// 请求配置
axiosConfig(axios)

// 权限监控
authHandler(_vm);

// 分享
WxShareWatcher(_vm.$router);

// 页面后的处理
_vm.$nextTick(() => {
    CmsRouterAuth(_vm, _vm.$router);

    
});