import Component from 'vue-class-component';
import Vue from 'vue';
import payOrderService from './pay.order.service';
import './pay.order.scss';

@Component({
    template: require('./pay.order.html')
})
export class PayOrder extends Vue {
    orderInfo: any;
    dataList: any = [];

    formatDate: string = '';
    payTime: number;
    timer: any;
    orderId: any;
    loadding: any;
    private _$service: any;

    mounted() {
        //注册服务
        let _self = this;
        this._$service = payOrderService(this.$store);
        this.orderId = this.$route.query.orderId;
        console.log('query', this.$route.query);
        //查询订单
        this._$service.getOrderInfo(this.orderId).then((res) => {
            this.orderInfo = res.data;
            if (this.orderInfo.errorCode) {
                let dialogObj = {
                    title: '订单支付',
                    content: this.orderInfo.msg,
                    assistBtn: '',
                    type: 'error',
                    mainBtn: '知道啦',
                    assistFn() {
                    },
                    mainFn() {
                        _self.$router.push({ path: 'user_order' });
                    }
                };
                _self.$store.state.$dialog({ dialogObj });
                return;
            }
            if (this.orderInfo.orderState != 1) {
                this.goGoodDetail('订单已支付或关闭');
                return;
            }
            //设置倒计时
            this.formatDate = "<span>--</span>:<span>--</span>:<span>--</span>";
            this.payTime = this.orderInfo.leftTime / 1000;
            if(this.payTime >0 ){
                this.timer = setInterval(() => {
                    if (this.payTime >= 0) {
                        this.setFormatDate();
                        this.payTime = this.payTime - 1;
                    } else {
                        this.goGoodDetail('订单支付超时！');
                        clearInterval(this.timer);
                    }
                }, 1000);
                // 支付倒计时立即执行一次
                this.setFormatDate();
            }
            //设置展示数据
            this.setDataList(res);
        });
    }
    
    goGoodDetail(content){
        let _self = this;
        let dialogObj = {
            title: '订单支付',
            content: content,
            type: 'info',
            assistBtn: '',
            mainBtn: '知道啦',
            assistFn() {
            },
            mainFn() {
                _self.$router.push({
                    path: 'order_detail',
                    query: {
                        orderId: _self.orderInfo.id
                    }
                });
            }
        };
        this.$store.state.$dialog({ dialogObj });
    }

    setFormatDate() {
        this.formatDate = "<span>" + this.formatT(this.payTime / 3600)
            + "</span>:<span>" + this.formatT(this.payTime / 60 % 60)
            + "</span>:<span>" + this.formatT(this.payTime % 60) + "</span>";
    }

    formatT(numb) {
        numb = Math.floor(numb);
        return numb > 9 ? numb : '0' + numb;
    }

    setDataList(data) {
        console.log(data.data)
        data = data.data;//mmp
        this.dataList = [
            {
                name: '订单编号',
                value: data.orderNo,
                color: '333333',
                created: true
            },
            {
                name: '商品名称',
                value: data.goods[0].goodsName,
                color: '333333',
                created: true
            },
            {
                name: '需付电子币',
                value: (data.totalMoney / 100).toFixed(2),
                color: 'ff1c1c',
                created: true
            },
            {
                name: '需付惠品券',
                value: (data.totalMoneyRoll / 100),
                color: 'ee893e',
                created: data.consuType === 3
            },
            {
                name: '支付方式',
                value: '电子钱包支付',
                color: '333333',
                created: true
            },
        ];
    }

    goPay() {
        this.loadding = this.$store.state.$loadding();
        this._$service.pay(this.orderInfo);
    }

    destroyed() {
        //loadding遮罩
        this.loadding && this.loadding.close();
    }

}