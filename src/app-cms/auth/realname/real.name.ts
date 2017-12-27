// 实名认证
import { Component } from 'vue-property-decorator';
import { BaseVue } from '../../../commons/base-vue/base.vue';
import { getLocalUserInfo } from '../../../commons/common.env';

import './real.name.scss';
@Component({
    template: require('./real.name.html'),
})
export class RealName extends BaseVue {
    mounted() {
      document.title = '实名认证';
    }
    toForm() {
        // 填写实名信息
        this.$router.push('realNameForm');
    }
}