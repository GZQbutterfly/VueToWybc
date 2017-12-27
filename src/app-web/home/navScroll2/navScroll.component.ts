import Component from 'vue-class-component';
import Vue from 'vue';
import { Swiper } from '../../../commons/assets/swiper';
import './navScroll.component.scss';


@Component({
    props: ['iconsList', 'config'],
    template: require('./navScroll.component.html')
})
export class IconsList extends Vue {

    data() {
        return {}
    }
    mounted() {
        let _self: any = this;
        let reactive = false;
        _self.$nextTick(() => {
            _self.swiper = new Swiper(_self.$refs.bannerSwiper, {
                slidesPerGroup: 1,
                slidesPerView: 4,
                observer: true,
                runCallbacksOnInit: true,
                on: {
                    transitionEnd() {
                        if (reactive) {
                            this.slideTo(0);
                            reactive = false;
                        }
                    }
                }
            });
            console.log(_self.swiper);
        });
        _self.$watch('iconsList', () => {
            reactive = true;
        })
    }
    goPage(e, url) {
        // location.href ="https://www.baidu.com";
        location.href = url;
    }

}