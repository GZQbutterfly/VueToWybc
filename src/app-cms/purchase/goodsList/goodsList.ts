import Component from 'vue-class-component';
import Vue from 'vue'
import './goodsList.scss';

@Component({
    template: require('./goodsList.html'),
    props: ["dataList"]
})

export class GoodsList extends Vue {
    goodsList: any = { 'data': [] };

    mounted() {
        this.goodsList = this.$props.dataList;
    }
    toDetail(id) {
        this.$router.push({ path: "cmsPurchaseGoodsDetail", query: { goodsId: id } });
    }
}
