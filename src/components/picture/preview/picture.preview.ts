import Component from 'vue-class-component';
import Vue from 'vue';

import { Swiper } from '../../../commons/assets/swiper';

import './picture.preview.scss';

@Component({
    name: 'Preview',
    computed: {
        preview() {
            return (<any>window).LOGIC_EVENT_BUS.LOGIC_PREVIEW;
        }
    },
    template: require('./picture.preview.html')
})
export class PicturePreview extends Vue {
    swiper;
    data() {
        return {};
    }
    mounted() {
        let _self: any = this;
        this.$watch('preview', () => {
            console.log('LOGIC_PREVIEW...');
        });

        this.$nextTick(() => {
            _self.swiper = new Swiper(_self.$refs.imgSwiper, {
                // zoom: {
                //     toggle: false
                // },
                observer: true,
                on: {
                    init() {
                        _self.$refs.imgSwiper.addEventListener('touchmove', function (e) { e.preventDefault() });
                    }
                }
            });

        });
    }
    leave(e) {
        let _self: any = this;
        if ((_self.preview.show) && (e.target.className.indexOf('lg-preview-nav-arrow') != 0)) {
            _self.close();
            // _self.swiper.zoom.out();
        }
    }
    close() {
        let _self: any = this;
        _self.preview.show = false;
    }
    preAction() {
        let _self: any = this;
        _self.preview.loading = true;
        let index = _self.preview.list.indexOf(_self.preview.current);
        if (index === 0) {
            _self.preview.loading = false;
            return;
        }
        index--;
        _self.preview.current = _self.preview.list[index];
        const img = new (<any>window).Image();
        img.src = _self.preview.current.src;
        img.onload = function () {
            setTimeout(() => {
                (<any>window).LOGIC_EVENT_BUS.LOGIC_PREVIEW.loading = false;
            }, 500);
        };
    }
    nextAction() {
        let _self: any = this;
        _self.preview.loading = true;
        let index = _self.preview.list.indexOf(_self.preview.current);
        if (index === _self.preview.list.length - 1) {
            _self.preview.loading = false;
            return;
        }
        index++;
        _self.preview.current = _self.preview.list[index];
        const img = new (<any>window).Image();
        img.src = _self.preview.current.src;
        img.onload = function () {
            setTimeout(() => {
                (<any>window).LOGIC_EVENT_BUS.LOGIC_PREVIEW.loading = false;
            }, 500);
        };
    }
}