// 我的微店  是直接跳转到微店前端，指的是已经开店的用户，这里不做任何逻辑
import { Component } from 'vue-property-decorator';
import { BaseVue } from '../../../commons/base-vue/base.vue';





import './shop.scss';
@Component({
    template: require('./shop.html')
})
export class MyShop extends BaseVue {

}