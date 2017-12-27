import Component from 'vue-class-component';
import Vue from 'vue';

import './toast.component.scss';

@Component({
    props: {
        show: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ''
        },
        time: {
            type: Number,
            default: 2000
        },
        success: {
            type: Boolean,
            default: true
        },
        mode: {
            type: Boolean,
            default: false
        }
    },
    template: require('./toast.component.html')
})
export class ToastComponent extends Vue {
    show: boolean;
    title: string;
    timer: number;
    time: number;
    mode: boolean;
    mounted() {
        this.$nextTick(() => {
            this.timer = window.setTimeout(() => {
                this.show = false;
            }, this.time);
        })
    }
    destroyed() {
        window.clearTimeout(this.timer);
    }

}