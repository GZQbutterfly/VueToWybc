import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';
import { merge } from 'lodash';

import { timeout } from '../../../commons/common.env';

import './popup.base.component.scss';

import { Swiper } from '../../../commons/assets/swiper';


@Component({
    template: require('./popup.base.component.html')
})
export class PopupComponent extends Vue {
    @Prop({ type: Object, default: {} })
    options;

    swiper: any;
    data() {
        return this.popupInit();
    }
    mounted() {
        let _self: any = this;
        // this.setHTMLScollerYHidden(true);
        this.$nextTick(() => {
            this.renderSwiper();
            timeout(() => {
                let _dialogRef: any = this.$refs.dialogRef;
                _dialogRef.addEventListener('touchmove', function (e) { e.preventDefault() });
            });
        });
    }
    // setHTMLScollerYHidden(falg) {
    //     let _htmlDom = document.querySelector('html');
    //     if (falg) {
    //         _htmlDom.classList.add('not-scoller-y');
    //     } else {
    //         _htmlDom.classList.remove('not-scoller-y');
    //     }
    // }
    renderSwiper() {
        let _self: any = this;
        // 渲染 swiper 
        _self.swiper = new Swiper(_self.$refs.popupSwiper, {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            autoHeight: true,
            scrollbar: {
                el: _self.$refs.popupSwiperScorllbar
            },
            observer: true,
            on: {
                init() {
                    //console.log(this, this.params.swipeHandler);
                    setTimeout(() => {
                        if (this.scrollbar.el.style.display === 'none') {
                            // 滚动条隐藏的 添加不可滚动的属性
                            // console.log('滚动条隐藏的');
                            this.params.swipeHandler = '.swipe-handler';
                        }
                    }, 10);
                }
            }
        });
    }
    popupInit() {
        let _self: any = this;
        let _bH = window.innerHeight;
        let _bW = window.innerWidth;
        let width = Math.ceil(_bW * 0.7);
        let height = Math.ceil(_bH * 0.50);
        let cH = _self.options.height * 0.6;

        if(_self.options.height <= 1){
            cH = cH * _bH;
            _self.options.height = _self.options.height * 100 + '%';
        }
        return {
            popupContainerStyle: merge({
                width: _self.options.width,
                height: _self.options.height,
                'max-height': (height + 5) + 'px',
                'max-width': (width + 5) + 'px',
            }, _self.setAlgin(_self.options, width, _bW, height, _bH)),
            popupBodyStyle: {
                  height: cH + 'px'
            }
        };
    }
    setAlgin(options, w, bW, h, bH) {
        let _self: any = this;
        let _algin = options.algin;
        let _result: any = {};
        if (_algin == 'top') {

        } else if (_algin == 'right') {

        } else if (_algin == 'bottom') {

        } else if (_algin == 'left') {

        } else {
            // center
            _result.left = _self.getRate(w, bW) + '%';
            _result.top = _self.getRate(h, bH) + '%';
        }
        return _result;
    }
    getRate(s, t) {
        //console.log(s, t, (1 - (s / t)));
        return Math.ceil((1 - (s / t)) * 100) / 2;
    }
    //获取元素的纵坐标 
    // getTop(e) {
    //     let offset = e.offsetTop;
    //     if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
    //     return offset;
    // }
    resizePopup() {
        let _self: any = this;
        _self.options.resize && _self.options.resize();
        //console.log('resize popup ........ ');
    }
    fn(callBack) {
        this.close();
        callBack && callBack(this);
    }
    close() {
        this.$el.remove();
    }
}
