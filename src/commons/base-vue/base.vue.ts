import Component from 'vue-class-component';
import Vue from 'vue';
import { wxshare } from '../../commons/wxshare/share';
import { isWeiXin } from '../../commons/common.env';
import baseService from './base.vue.service';

//config  will be complete with derived class
@Component({
    template: require('./base.vue.html'),
})

export class BaseVue extends Vue {


    //config 默认 显示分享菜单  不可更改
    // title:  // 分享标题
    // link: , // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    // imgUrl: 分享图标
    // desc: 朋友圈分享无此项
    // success: 成功回调
    // cancel: 取消回调

    updateWxShare(config) {
        if (isWeiXin()) {
            let tempKey = this.$route.fullPath;
            wxshare(config,tempKey);
        }
    }

    //这个不好看吧.
    fetchShopData(){
        return baseService(this.$store).shopInfo();
    }

}