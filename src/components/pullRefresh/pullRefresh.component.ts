import Component from 'vue-class-component';
import Vue from 'vue';
import './pullRefresh.component.scss';

@Component({
    template: require('./pullRefresh.component.html'),
    props: ['refresh', 'infinite']
})

export class PullRefresh extends Vue {
    data() {
        return {

        }
    }
    mounted() {

    }

    refreshC(done) {
        let self = this;
        if (self.$props.refresh) {
            self.$props.refresh(done);
        }
    }

    infiniteC(done) {
        let self = this;
        if (self.$props.infinite) {
            self.$props.infinite(done);
        }
    }
}