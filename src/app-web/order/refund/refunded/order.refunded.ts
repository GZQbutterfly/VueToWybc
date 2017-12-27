// 退款完成(失败，成功)

import Component from 'vue-class-component';
import Vue from 'vue';
import { merge, find } from 'lodash';
import { goodsStatusDatas, processTypeDatas } from '../common';

import './order.refunded.scss';

// ==>

@Component({
    props: {
        params: {
            type: Object,
            default: {}
        }
    },
    template: require('./order.refunded.html')
})
export class OrderRefunded extends Vue {
    resultFlag = false;
    fileList=[];
    refundScope = {
        refundGoods: {},
        refundOrder: {}
    };
    formScope = {
        goodsState: {
            co: '',
            na: ''
        },
        refundReason: {
            co: '',
            na: ''
        },
        processType: {
            co: '',
            na: ''
        }
    };
    params: object;
    mounted() {
        this.preParseData();
    }
    preParseData() {
        let _params: any = this.params;
        this.resultFlag = _params.resultFlag;
        this.$set(this.refundScope, 'refundGoods', _params.refundGoods);
        this.$set(this.refundScope, 'refundOrder', _params.refundOrder);
        let _refundOrder: any = this.refundScope.refundOrder;
        if (_refundOrder.goodsState !== undefined) {
            let _goodsState: any = find(goodsStatusDatas, { co: _refundOrder.goodsState });
            this.formScope.goodsState.na = _goodsState.na;
            if (_refundOrder.refundReason !== undefined) {
                let _refundReason:any = find(_goodsState.ch, { co: _refundOrder.refundReason });
                this.formScope.refundReason.na = _refundReason.na;
            }
        }

        if (_refundOrder.processType !== undefined) {
            let _processType: any = find(processTypeDatas, { co: _refundOrder.processType });
            this.formScope.processType.na = _processType.na;
        }
        merge(this.refundScope, this.params, true);
        if(_refundOrder.refundImg!== undefined){
            this.fileList = _refundOrder.refundImg.split(',');
        }
    }
}