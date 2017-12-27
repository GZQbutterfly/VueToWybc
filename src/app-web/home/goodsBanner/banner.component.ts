import Component from 'vue-class-component';
import Vue from 'vue';
import { Swiper } from '../../../commons/assets/swiper';

import './banner.component.scss';

@Component({
    props: ['adList', 'itemClicked'],
    template: require('./banner.component.html')
})
export class GoodsBanner extends Vue {
    swiper: any;
    mounted() {
        let _self: any = this;
        let _config = _self.config || {};
        _self.$nextTick(() => {
            _self.swiper = new Swiper(_self.$refs.bannerSwiper, {
                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false,
                },
                observer: true,
                spaceBetween: 20
            });
        });
    }

    swiperClicked(target){
        if (this.$props.itemClicked) {
            this.$props.itemClicked(target);
        }
    }
}