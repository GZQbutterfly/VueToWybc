import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueScroller from 'vue-scroller';
import VueProgressiveImage from 'vue-progressive-image';


let videoPlayer = require('vue-video-player');

const VueForm = require('vue-form');

let VueLazyload = require('vue-lazyload');

// 引入组件
import { BannerComponent } from '../components/banner/banner.component';
import { PullRefresh } from "../components/pullRefresh/pullRefresh.component";
import vuePicturePreview from '../components/picture/preview';
import {ContainerComponent} from '../components/container/container.component';

// 引入过滤器
import '../commons/filters/commons';
// 引入指令
import '../commons/directives';


//引入校验规则
import validators from '../commons/validators/validators';

// swiper 4.0 
import '../commons/assets/swiper/swiper.css';


// 装载插件
Vue.use(Vuex);
Vue.use(VueRouter);
// 下拉刷新上拉加载
Vue.use(VueScroller);
// 表单校验
Vue.use(VueForm, validators);
// 图片预览
Vue.use(vuePicturePreview);

// 视频播放
Vue.use(videoPlayer);

// 渐进式图片加载 
Vue.use(VueProgressiveImage, {
    delay: 100,
    blur: 10
});
// 图片懒加载
Vue.use(VueLazyload);

// 初始公共组件
Vue.component('app-banner', BannerComponent);
Vue.component('pull-refresh', PullRefresh);
Vue.component('app-container', ContainerComponent);
