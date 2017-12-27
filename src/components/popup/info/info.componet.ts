import Component from 'vue-class-component';
import Vue from 'vue';
import './info.component.scss';

@Component({
    props: {
        type: {
            type: String,
            default: ''
        },
        showIt: {
            type: Boolean,
            default: false
        },
        content: {}
    },
    template: require('./info.component.html')
})
export class InfoComponent extends Vue {}