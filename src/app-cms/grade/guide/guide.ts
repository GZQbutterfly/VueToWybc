import { Component } from 'vue-property-decorator';
import { BaseVue } from '../../../commons/base-vue/base.vue';




import './guide.scss';
@Component({
    template: require('./guide.html')
})
export class GradeGuide extends BaseVue {
    mounted () {
        this.$nextTick(()=>{
            document.title = '店长等级说明';
        })
    }
}