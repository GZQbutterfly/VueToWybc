// 商品退款

import Component from 'vue-class-component';
import { BaseVue } from '../../../commons/base-vue/base.vue';
import { get, merge } from 'lodash';

import { OrderRefund } from './refund/order.refund';
import { OrderRefunding } from './refunding/order.refunding';
import { OrderRefunded } from './refunded/order.refunded';

import service from './layout.service';

import './layout.scss';

// ==>

@Component({
    template: require('./layout.html'),
    components: {
        'order-refund': OrderRefund,
        'order-refunding': OrderRefunding,
        'order-refunded': OrderRefunded
    }
})
export class OrderRefundLayout extends BaseVue {
    params: any = {};
    refundType: string = ''; // refund （退款） refunding  (退款中) refunded （退款完成）
    refundTypes = ['refund', 'refunding', 'refunded', 'refunded', 'refunding'];
    orderId: string;
    orderGoodsId: string;
    private _$service;
  
    data() {
        return {
            params: {
                //orderId: this.orderId,
                //orderGoodsId: this.orderGoodsId
            }
        };
    }
    mounted() {
        let _urlParams: any = this.$route.query;
        this.params.orderGoodsId = get(_urlParams, 'orderGoodsId');
        this.params.orderId = get(_urlParams, 'orderId');
        //注册服务
        this._$service = service(this.$store);
        this.$nextTick(() => {
            this.queryRefundGoods();
        });
    }
    queryRefundGoods() {
        let _self: any = this;
        _self._$service.queryRefundGoods(_self.params).then((res) => {
            console.log(res);
            let _result = res.data;
            if (!_result.errorCode) {
                // refundStatus
                merge(this.params, _result, true);
                // end
                let _refundGoods = _result.refundGoods;
                let _refundStatus = get(_refundGoods, 'refundStatus') || 0;
                if (_refundStatus == 2) {
                    // 退款成功
                    this.params.resultFlag = true;
                } else if (_refundStatus == 3) {
                    // 退款失败
                    this.params.resultFlag = false;
                } else if (_refundStatus == 4) {
                    this.params.cancelFlag = true;
                }
                //退款状态   0：未申请，1：申请中，2：同意退款，3：驳回退款 4：用户取消退款
                _self.refundType = _self.refundTypes[_refundStatus] || 'refunded';

            }
        });
    }
}