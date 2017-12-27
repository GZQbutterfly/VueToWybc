import Component from 'vue-class-component';
import Vue from 'vue';
import { Swiper } from '../../commons/assets/swiper';
import './navRow.component.scss';

@Component({
    props: ['navList', 'constIndex', 'excludeIndex'],
    template: require('./navRow.component.html')
})
export class NavRow extends Vue {
    swiper: any;
    activatedIndex = 0;
    mounted() {
        let _self: any = this;
        let reactive = false;
        let iii = 0;
        _self.$nextTick(() => {
            _self.swiper = new Swiper(_self.$refs.navSwiper, {
                slidesPerView: 4.5,
                observer: true,
                freeMode: true,
            });

        });
    }

    itemSelect(index,data) {
        if (!this.$props.constIndex && this.$props.excludeIndex!=index) {
            this.activatedIndex = index;
            if (this.swiper) {
                this.swiper.slideTo(index)
            }
        }
        this.$emit('on-change', index,data);
    }
}