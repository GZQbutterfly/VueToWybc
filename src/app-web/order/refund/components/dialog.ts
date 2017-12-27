
import Component from 'vue-class-component';
import Vue from 'vue';

import './dialog.scss';

// ==>

@Component({
    props: {
        list: {
            type: Array,
            default: []
        },
        selectItem: {
            type: Function,
            default: () => { }
        },
        close: {
            type: Function,
            default: () => { }
        },
        co: {
            type: [String, Number],
            default: ''
        }
    },
    template: require('./dialog.html'),

})
export class OrderRefundDialog extends Vue {
    title:string= '请选择收货情况';
    selectItem: Function;
    close: Function;
    select(item) {
        this.selectItem && this.selectItem(item);
        this.close();
    }
}