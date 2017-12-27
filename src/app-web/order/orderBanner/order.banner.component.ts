import Component from 'vue-class-component';
import Vue from 'vue';
import './order.banner.component.scss';
import { guid } from '../../../commons/common.env';
import { extend, findIndex } from 'lodash';
import { Swiper } from '../../../commons/assets/swiper';

@Component({
    props: {
        selectItem: {
            type: Function,
            default: () => { }
        },
        dataList: {
            type: Array,
            default: []
        }
    },
    template: require('./order.banner.component.html')
})
export class OrderBannerComponent extends Vue {
    swiperClass = 'swiper' + guid();
    selectItem: Function;
    dataList: Array<Object>;
    swiperUi;

    mounted() {
        let _self: any = this;
        _self.$nextTick(() => {
            _self.swiperUi = new Swiper('.' + this.swiperClass, {
                autoHeight: true,
                effect: 'effect-fade',
                centeredSlides: true,
                observer: true,
                observeParents: true,
                loopAdditionalSlides: 1,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                on: {
                    click: function (event) {
                        _self.clickedItem(this.activeIndex);
                    }
                }
            });
        });
    }

    clickedItem(index) {
        if (this.selectItem) {
            this.selectItem(index);
        }
    }

}