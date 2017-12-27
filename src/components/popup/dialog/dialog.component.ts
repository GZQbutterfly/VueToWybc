import Component from 'vue-class-component';
import Vue from 'vue';

import { timeout } from '../../../commons/common.env';

import './dialog.component.scss';
import { childMixin } from '../../mixins';

@Component({
    mixins: [childMixin],
    props: {
        android: {
            type: Boolean,
            default: false
        },
        dialogObj: {
            type: Object,
            default: () => { }
        },
        type: {
            type: String,
            default: ''
        }
    },
    template: require('./dialog.component.html')
})
export class DialogComponent extends Vue {
    show: boolean;
    dialogObj: object;
    dialogStyleObj = {};
    data() {
        return {
            show: true
        };
    }
    mounted() {
        this.$nextTick(() => {
            timeout(() => {
                this.getDialogStyleObj();
                let _dialogRef: any = this.$refs.dialogRef;
                _dialogRef.addEventListener('touchmove', function (e) { e.preventDefault() });
            });
        });
    }
    cancel() {
        this.show = false;
        document.body.style.overflow = '';
        this.$emit('hide');
        'remove' in (<any>window).Element.prototype ? this.$el.remove() : this.$el.parentNode.removeChild(this.$el);
    }
    cbFn(fn) {
        if (fn) {
            fn();
        }
        this.cancel();
    }
    getDialogStyleObj() {
        let _self: any = this;
        _self.dialogStyleObj = { 'top': _self.type ? '45%' : '50%' };
    }
}