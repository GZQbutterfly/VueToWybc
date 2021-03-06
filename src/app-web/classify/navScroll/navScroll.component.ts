import Component from 'vue-class-component';
import Vue from 'vue';

import { isEmpty, findIndex } from 'lodash';

import { Swiper } from '../../../commons/assets/swiper';



import navScrollComponentService from "./navScroll.component.service";



import './navScroll.component.scss';

@Component({
    props: ['config', 'onchangeShop'],
    template: require('./navScroll.component.html')
})
export class NavScrollc extends Vue {
    classifyShow: any = '';//图片显示
    private _$service: any;
    classfyList: any = [];//分类数据
    classfyId: any = [];//分类id
    swiper: any;
    data() {
        return {}
    }
    created() {
        this._$service = navScrollComponentService(this.$store);
        let classify = this.$route.query.classify;
        let _this = this;
        this.$nextTick(() => {
            this._$service.classfyList().then(res => {  //获取分类列表
                if (!res.data.errorCode) {
                    _this.classfyList = res.data.data;
                    if (classify) {
                        _this.classifyShow = classify;
                    } else {
                        _this.classifyShow = _this.classfyList[0].goodsClassifyId;
                    }
                }
            });
        });
    }
    mounted() {
        let _self: any = this;
        let _route = _self.$route;
        let _query = _route.query;
        let firstIndex = 0;// 保持第一个
        let reactive = false;
        let silderlen = 0;
        _self.$nextTick(() => {
            _self.swiper = new Swiper(_self.$refs.bannerSwiper, {
                slidesPerGroup: 1,
                slidesPerView: 4,
                observer: true,
                on: {
                    transitionEnd() {
                        if (reactive) {
                            this.slideTo(firstIndex);
                            reactive = false;
                        }
                    }
                }
            });
            silderlen = _self.swiper.slides.length;
        });

        _self.$watch('classfyList', (list) => {
            reactive = true;
            if (!isEmpty(_query)) {
                firstIndex = findIndex(list, { goodsClassifyId: Number(_query.classify) }) + silderlen - 1;
            }
        })
    }
    activated() {
        // keep-alive 
        let classify = this.$route.query.classify;
        if (classify) {
            this.classifyShow = classify;
        } else {
            if (this.classfyList.length) {
                this.classifyShow = this.classfyList[0].goodsClassifyId;
            }
        }
        if (this.classfyList.length) {
            let activeIndex = findIndex(this.classfyList, { goodsClassifyId: Number(classify) }) + 1;
            if (this.swiper) {
                this.swiper.slideTo(activeIndex)
            }
        }
    }
    changeShop(e, id) {
        let _this = this;
        console.log(id);
        _this.classifyShow = id;
        this.$props.onchangeShop(e, id);
        this.$router.replace({ path: "type", query: { classify: id } });
    }
}