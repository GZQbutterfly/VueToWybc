import Component from 'vue-class-component';
import { BaseVue } from '../../../../commons/base-vue/base.vue';
import orderDetailService from './stock.order.detail.service';
import { getLocalUserInfo, toWEB } from '../../../../commons/common.env';
import dialog from '../../../../components/popup/dialog';


require('./stock.order.detail.scss');

@Component({
    template: require('./stock.order.detail.html')
})


export class StockOrderDetail extends BaseVue {

    private _$service: any;
    private orderId: any;
    timerID: any;
    orderTimer: any = {
        int_hour: 0,
        int_minute: 0,
        int_second: 0
    };

    orderInfo: any = {};

    //当前店铺折扣
    curShopBuyDisct = 100;

    goodsInfo: any = {};

    commi: any = {};

    mounted() {
        //订单编号
        this.orderId = this.$route.query.orderId || 0;
        let self = this;
        self._$service = orderDetailService(self.$store);
        self.$nextTick(() => {
            self._$service.getOrderInfo(self.orderId)
                .then(res => {
                    if (!res || res.errorCode) {
                        let dialogObj = {
                            title: '',
                            content: '订单数据错误:' + res.msg,
                            type: 'info',
                            mainBtn: '返回',
                            assistFn() {
                            },
                            mainFn() {
                                self.$router.back();
                            }
                        };
                        dialog({ dialogObj });
                        return
                    } else {
                        self.orderInfo = res.data.orderWhole;
                        self.goodsInfo = res.data.orderGoods;
                        self.commi = res.data.orderCommi;
                        self.curShopBuyDisct = res.data.curShopBuyDisct ? res.data.curShopBuyDisct : 100;
                        if (res.data.orderWhole.acceptTimeLeft > 0) {
                            self.countDown(res.data.orderWhole.acceptTimeLeft);
                        }
                    }
                })
        })

    }

    //1:自己接单 2:上线接单 3:等待自己进货接单 4:等待上线接单
    orderState(type) {
        let userId = getLocalUserInfo().userId;
        if (type == 1) {
            return  this.orderInfo && this.orderInfo.acceptStatus && (this.orderInfo.shopId == userId);
        } else if (type == 2) {
            return this.orderInfo && this.orderInfo.acceptStatus && (this.orderInfo.shopId != userId);
        } else if (type == 3) {
            return this.orderInfo && !this.orderInfo.acceptStatus && (this.orderInfo.shopId == userId);
        } else if (type == 4) {
            return this.orderInfo && !this.orderInfo.acceptStatus && (this.orderInfo.shopId != userId);
        } else {
            return false;
        }
    }

    toGoodsDetail(goodsId) {
        let self = this;
		this._$service.upShopInfo(getLocalUserInfo().userId)
		.then(res => {
			if (res && !res.errorCode) {
				let order = this.$props.order;
				if (!order.shopId || order.shopId != res.data.infoId) {
					let dialogObj = {
						title: '',
						content: '该店铺不是你的进货人店铺,是否直接进入当前进货人的进货店铺? ' + res.data.wdName,
						assistBtn: '取消',
						mainBtn: '确定',
						type: 'info',
						assistFn() {

						},
						mainFn() {
							self.$router.push({
								path: 'CmsPurchaseGoodsDetail',
								query: {
									goodsId: goodsId,
									shopId: res.data.infoId
								}
							});
						}
					};
					dialog({ dialogObj });
				}
			}
		})
    }

    isTichengOrder() {
        let userId = getLocalUserInfo().userId;
        return this.orderInfo.shopId != userId;
    }

    countDown(leftchektime) {
        this.timerID && clearInterval(this.timerID);
        let time_distance, _this = this;
        time_distance = leftchektime / 1000;
        this.timerID = setInterval(function () {
            time_distance--;
            if (time_distance > 0) {
                _this.orderTimer.int_hour = Math.floor(time_distance / (60 * 60) % 24);
                _this.orderTimer.int_minute = Math.floor(time_distance / 60 % 60);
                _this.orderTimer.int_second = Math.floor(time_distance % 60);
                //加0
                if (_this.orderTimer.int_hour < 10) {
                    _this.orderTimer.int_hour = "0" + _this.orderTimer.int_hour;
                }
                if (_this.orderTimer.int_minute < 10) {
                    _this.orderTimer.int_minute = "0" + _this.orderTimer.int_minute;
                }
                if (_this.orderTimer.int_second < 10) {
                    _this.orderTimer.int_second = "0" + _this.orderTimer.int_second;
                }
            }
            else {
                _this.orderTimer.int_day = 0;
                _this.orderTimer.int_hour = 0;
                _this.orderTimer.int_minute = 0;
                _this.orderTimer.int_second = 0;
                clearInterval(_this.timerID);
            }
        }, 1000);
    }

    refuse(orderId) {
        let self = this;
        this._$service.throwOrder(orderId)
            .then(res => {
                if (!res || res.errcode) {
                    let dialogObj = {
                        title: '',
                        content: '抛单错误:' + res.errcode,
                        type: 'info',
                        mainBtn: '返回',
                        assistFn() {
                        },
                        mainFn() {

                        }
                    };
                    dialog({ dialogObj });
                } else {
                    self.$router.back();
                }
            })
    }

    stockNow(orderId) {
        this.$router.push({
            path: 'myInventoryDetail',
            query: {
                goodsId: this.goodsInfo.goodsId,
            }
        })
    }

}
