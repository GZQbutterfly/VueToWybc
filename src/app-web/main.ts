import Vue from 'vue';
import axios from 'axios';

import '../vconsole.log';
import './app.moudle';
import '../commons/events';

import router from './app.router';
import store from './app.store';

import authHandler from '../commons/auth';

import { axiosConfig } from '../commons/common.env';


import shareWatcher from '../commons/wxshare';


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

// 分享监控
shareWatcher(_vm.$router);

// 页面后的处理
_vm.$nextTick(() => {
    // _vm.$Lazyload.$on('loaded', function (listener) {
    //     console.table(_vm.$Lazyload.performance())
    // })

    try {
        window.localStorage.____TestIOReader = "reader";
    } catch (_) {
        let _dialog = _vm.$store.state.$dialog;
        let dialogObj = {
            title: '提示',
            content: '本地储存写入错误，浏览器请关闭隐身模式浏览。',
            mainBtn: '知道啦',
            type: 'error',
            mainFn() {}
        };
        _dialog({ dialogObj });
    }
});