import Component from 'vue-class-component';
import Vue from 'vue';

import './loadding.component.scss';

@Component({
    props:{
       show: {
           type: Boolean,
           default: true
       }
    },
    template: require('./loadding.component.html')
})
export class LoaddingComponent extends Vue {
    msg = '加载中...';

    mounted () {
        this.$nextTick(()=>{

        });
    }
}