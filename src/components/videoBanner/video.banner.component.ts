import Component from 'vue-class-component';
import Vue from 'vue';
import './video.banner.component.scss';
import { guid } from '../../commons/common.env';
import { Swiper } from '../../commons/assets/swiper';
import { VueVideo } from '../video/video.component';
import { Object } from 'core-js/library/web/timers';

@Component({
    props: {
        selectItem: {
            type: Function,
            default: () => { }
        },
        dataList: {
            type: Array,
            default: [],
        },
        playerOptions: {
            default: () => {
                return {
                    muted: true,
                }
            }
        },
        hasVideo:{
            type:Boolean,
            default:false,
        }
    },
    components: {
        fsvideo: VueVideo,
    },
    template: require('./video.banner.component.html')
})
export class VideoBannerComponent extends Vue {
    swiperClass = 'swiper' + guid();
    selectItem: Function;
    dataList: Array<Object>;
    swiperUi;
    //  {
    //     fluid: true,
    //     heigth:300,
    //     muted: true,
    //     sources: [{
    //         type: "video/mp4",
    //         src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
    //     }],
    //     poster: "http://wybc-qa.oss-cn-hangzhou.aliyuncs.com/WebApp/goods/SP00000107/bfjds.jpg",
    // }

    mounted() {
        let _self: any = this;
        _self.$nextTick(() => {
            _self.swiperUi = new Swiper('.' + this.swiperClass, {
                centeredSlides: true,
                observer: true,
                observeParents: true,
                loopAdditionalSlides: 1,
                // autoplay: {
                //     //delay: 3000,
                //     disableOnInteraction: false,
                // },
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