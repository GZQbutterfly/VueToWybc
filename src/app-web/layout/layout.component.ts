import Component from 'vue-class-component';
import Vue from 'vue';
import layoutService from './layout.component.service';
import shopCarGoodsService from '../home/getShopCarCount';
import { isWeiXin, interval, getAuthUser, isNotLogin, toLogin } from '../../commons/common.env';
import { debounce } from 'lodash';

import './layout.component.scss';

@Component({
    template: require('./layout.component.html')
})
export class LayoutComponent extends Vue {
    list = layoutService.list;
    isCreatedMenu: boolean = true;
    activeName: string;
    data() {
        return {
            activeName: this.$route.name
        };
    }

    mounted() {
        this.$watch('$route', (newRoute, oldRoute) => {
            this.isCreatedMenu = newRoute.query.noMenu || newRoute.meta.noMenu ? false : true;
            this.activeName = newRoute.name;
        });
        //TODO  do some Adaptive
        let params = this.$route.query;
        let meta = this.$route.meta;
        this.isCreatedMenu = params.noMenu || meta.noMenu ? false : true;
        // if (!this.isCreatedMenu) {
        //     let _dom: any = document.querySelector('.warp');
        //     _dom && (_dom.style.overflow = 'hidden');
        // }

        this.$nextTick(() => {
            // 请求购物车 商品数量
            this.refreshServer(this);
            //禁止ios/微信的默认可下拉
            (<any>this).$refs.warpRef.addEventListener('touchmove', function (event: any) {
                event.preventDefault();
            });
        });
    }
    updated() {
        if (/user_order/i.test(this.$route.name)){
            this.refreshServer(this);
        }
    }

    refreshServer = debounce((_self)=>{
        _self.$nextTick(() => {
            // 请求购物车 商品数量
            shopCarGoodsService(this.$store).getShopcarGoodsesList();
        });
    }, 500);
}
