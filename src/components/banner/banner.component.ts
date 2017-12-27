import Component from 'vue-class-component';
import Vue from 'vue';
import { Swiper } from '../../commons/assets/swiper';

import './banner.component.scss';


@Component({
    props: ['listImg', 'config'],
    template: require('./banner.component.html')
})
export class BannerComponent extends Vue {
    swiper: any;
    data() {
        return {}
    }
    mounted() {
        let _self: any = this;
        let _config = _self.config || {};
        _self.$nextTick(() => {
            _self.swiper = new Swiper(_self.$refs.bannerSwiper, {
                //disableOnInteraction: false,
                centeredSlides: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false,
                },
                // lazy: {
                //     loadPrevNext: true,
                //     loadOnTransitionStart: true,
                //     loadPrevNextAmount: 0,
                // },
                observer: true,
                observeParents: true,
            });
        });
    }
    goDetile(e, linkTarget, goodsId, linkType) {
        // alert(linkTarget);
        if (!goodsId||linkType == 1) {
            location.href = linkTarget;
        }
        else {
            let url = location.href;
            if (url.indexOf('cms') == -1) {
                this.$router.push({ path: "goods_detail", query: { goodsId: goodsId } });
                return;
            }
            this.$router.push({ path: "cmsPurchaseGoodsDetail", query: { goodsId: goodsId } });
        }
    }

    activated() {
        // 在渲染时执行一次，当路由组件keep-alive时，切换组件会默认触发一次
        let _self: any = this;
        let _swiper = _self.swiper;
        if (_swiper) {
            setTimeout(() => {
                if (!_swiper.slideNext()) {
                    _swiper.slideTo(0);
                }
            }, 2000);
        }
    }
    beforeUpdate() {
        let _self: any = this;
        let _swiper = _self.swiper;
        if (_swiper) {
            setTimeout(() => {
                if (!_swiper.slideNext()) {
                    _swiper.slideTo(0);
                }
            }, 2000);
        }
    }
    destroyed() { }
}