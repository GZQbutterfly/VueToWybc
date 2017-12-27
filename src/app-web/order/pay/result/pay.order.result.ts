//提交订单后，结果面板
import Component from 'vue-class-component';
import Vue from 'vue';

import './pay.order.result.scss';
// ==>
@Component({
    template: require('./pay.order.result.html')
})
export class PayResult extends Vue {
    result: any;
    payType: string = ''; //支付类型（购买状态 （现金（实物，虚拟），积分（实物，虚拟）））
    resultScope: object = {};
    mounted() {
        let _self: any = this;
        let _urlParams = _self.$route.query;
        this.result = _urlParams.payResult;
        if (this.result.success) {
            _self.resultScope = {
                success: true,
                message: '支付成功',
                showmsg: '实付电子币：' + (this.result.totalMoney / 100).toFixed(2) + '<br/>实付惠品券：'+ (this.result.totalMoneyRoll/100) + '<br/>支付方式：电子钱包支付',
            }
        } else {
            _self.resultScope = {
                success: false,
                message: '支付失败',
                showmsg:'系统心情不好，导致支付失败，并且不想道歉！',
            }
        }
    }
    doOk() {
        let _self: any = this;
        if (this.result.success) {

        } else {

        }
        _self.$router.push({
            path: 'order_detail',
            query: {
                orderId: _self.result.orderId
            }
        });
    }
    onceAgain(){
        //去待支付界面
        this.$router.push({
            path: 'payOrder',
            query: {
                orderId: this.result.orderId
            }
        });
    }
}