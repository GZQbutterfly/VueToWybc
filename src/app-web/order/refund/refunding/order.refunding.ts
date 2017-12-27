// 退款中（退款处理中，退款关闭）

import Component from 'vue-class-component';
import Vue from 'vue';
import { merge, find } from 'lodash';
import { goodsStatusDatas, processTypeDatas } from '../common';
import service from '../layout.service';
import './order.refunding.scss';

// ==>

@Component({
    props: {
        params: {
            type: Object,
            default: {}
        }
    },
    template: require('./order.refunding.html'),

})
export class OrderRefunding extends Vue {
    cancelFlag = false;
    fileList = [];
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
    private _$service;
    mounted() {
        this._$service = service(this.$store);
        // 处理数据
        this.preParseData();
    }
    preParseData() {
        let _params: any = this.params;
        this.cancelFlag = _params.cancelFlag;
        this.$set(this.refundScope, 'refundGoods', _params.refundGoods);
        this.$set(this.refundScope, 'refundOrder', _params.refundOrder);
        let _refundOrder: any = this.refundScope.refundOrder;
        if (_refundOrder.goodsState !== undefined) {
            let _goodsState: any = find(goodsStatusDatas, { co: _refundOrder.goodsState });
            this.formScope.goodsState.na = _goodsState.na;
            if (_refundOrder.refundReason !== undefined) {
                let _refundReason: any = find(_goodsState.ch, { co: _refundOrder.refundReason });
                this.formScope.refundReason.na = _refundReason.na;
            }
        }

        if (_refundOrder.processType !== undefined) {
            let _processType: any = find(processTypeDatas, { co: _refundOrder.processType });
            this.formScope.processType.na = _processType.na;
        }
        merge(this.refundScope, this.params, true);
        if (_refundOrder.refundImg !== undefined) {
            this.fileList = _refundOrder.refundImg.split(',');
        }
    }
    cancelRefund() {
        let _refundOrder: any = this.refundScope.refundOrder;
        let _toast = this.$store.state.$toast;
        let _data = {
            orderId: _refundOrder.orderId,
            orderGoodsId: _refundOrder.orderGoodsId,
        };
        this._$service.cancelRefund(_data).then((res) => {
            let _result = res.data;
            if (_result.errorCode) {
                _toast({ title: '提交失败！', success: false });
            } else {
                _toast({ title: '提交成功！' });
                this.$router.push({
                    path: 'order_detail',
                    query: {
                        orderId: _data.orderId
                    }
                });
            }
        })
    }
}