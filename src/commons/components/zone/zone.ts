
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Swiper } from '../../assets/swiper';
import { findIndex } from 'lodash';

import {timeout} from '../../common.env';

import './zone.scss';

@Component({
    template: require('./zone.html')
})
export class Zone extends Vue {
    @Prop({ default: [] })
    dataList: Array<object>;
    @Prop({ default: () => { } })
    selectItem: Function;
    @Prop({ default: '' })
    co: string;
    showContent = false;
    swiper;
    mounted() {
        let _self: any = this;
        _self.$nextTick(() => {
            _self.showContent = true;
            timeout(() => {
                _self.renderSwiper();
            });
        });
        // 监听datalist 
        _self.$watch('dataList', () => {
            _self.showContent = false;
            timeout(() => {
                _self.showContent = true;
                timeout(() => {
                    _self.renderSwiper();
                });
            });
        })
    }
    btnPrev;
    btnNext
    renderSwiper() {
        let _self: any = this;
        let _zoneContainer = _self.$refs.zoneContainer;
        _self.len = _self.dataList.length - 1;
        _self.btnPrev = _zoneContainer.querySelector('.btnPrev');
        _self.btnNext = _zoneContainer.querySelector('.btnNext');
        _self.swiper = new Swiper(_zoneContainer.querySelector('.swiper-container'), {
            direction: 'vertical',
            freeMode: true,
            slidesPerView: 7,
            slidesPerColumn: 1,
            slidesOffsetBefore: 65,
            slidesOffsetAfter: 75,
            observer: true,
            on: {
                init: function () {
                    if (_self.co) {
                        this.slideTo(findIndex(_self.dataList, { co: _self.co }));
                    }
                },
                touchEnd: function (event) {
                    // 修正位置
                    timeout(() => {
                        this.slideTo(this.activeIndex);
                    });
                },
                reachEnd() {
                    // timeout(() => {
                    //     //this.slideTo(_self.len);
                    // }, 500);
                    _self.btnNext.classList.remove('active');
                    _self.btnPrev.classList.add('active');
                },
                reachBeginning() {
                    _self.btnPrev.classList.remove('active');
                    _self.btnNext.classList.add('active');
                }
            }
        });
    }
    next() {
        let _self: any = this;
        if (_self.len == _self.swiper.activeIndex) {
            _self.btnNext.classList.remove('active');
        } else {
            _self.swiper.slideNext();
            _self.btnPrev.classList.add('active');
        }
    }
    prev() {
        let _self: any = this;
        if (!_self.swiper.activeIndex) {
            _self.btnPrev.classList.remove('active');
        } else {
            _self.swiper.slidePrev();
            _self.btnNext.classList.add('active');
        }
    }
    select() {
        let _index = this.swiper.activeIndex;
        let item = this.dataList[_index];
        if (item) {
            this.selectItem([item], _index);
        } else {
            this.selectItem([]);
        }
    }
}