import Component from 'vue-class-component';
import Vue from 'vue';
import { Multipicker } from './multipicker';
import './multipicker.component.scss';
import { merge } from 'lodash';

@Component({
    props: ['config'],
    template: require('./multipicker.component.html')
})
export class MultiPickerComponent extends Vue {
    multipicker: Multipicker;
    config: Object;
    targetContainer:string;
    data(){
        return {
            targetContainer: 'targetContainer' + this.getUid()
        }
    }
    mounted() {
        let _config: any = this.config;
        this.multipicker = new Multipicker(merge({
            //input: _config.pickerId,
            container: this.targetContainer,
            //jsonData: _config.selectList,
            // success: (arr) => {
            //     this.$emit('change', arr);
            // }
        }, _config, true));
    }
    destroyed() {
        this.multipicker = null
    }
    getUid() {
        return Array.prototype.slice.call('111111').map(() => { return Math.ceil(Math.random() * 9) }).join('');
    }
}
//
// this.multipicker = new Multipicker({
//     input: this.pickerId,
//     container: 'targetContainer',
//     jsonData: this.selectList,
//     success: (arr) => {
//         this.$emit('change', arr);
//     }
// });