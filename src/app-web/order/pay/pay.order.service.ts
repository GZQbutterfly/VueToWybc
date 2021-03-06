import axios from 'axios';

export default (_store) => {
    let _state:any = _store.state;
    let _http = _state.$http;

    //获取订单详情
    let orderinfourl =   'api/order/q_order';

    function q(url, data?){
        return  _http({
            data: data,
            url: url,
            method: 'post'
        });
    }

    return{

        /**
         * 查询订单详情
         */
        getOrderInfo(orderNo){
            let user = _state.workVO.user;
            let data = {
                userId: user.id,
                token: user.token,
                orderId: orderNo
            }
            return q(orderinfourl,data);
        },

        pay(orderInfo) {
            let payResult = {
                orderId:orderInfo.id,
                totalMoney:orderInfo.totalMoney,
                totalMoneyRoll:orderInfo.totalMoneyRoll
            };
            return new Promise((res) => {
                _state.$pay.pay('api/order/pay_order', payResult ).then((result) => {
                    res(result);
                },(result) => {
                    res(result);
                });
            })
        },
    }
}