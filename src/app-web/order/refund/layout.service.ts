import {getLocalUserInfo} from '../../../commons/common.env';
// 退款服务
export default (_store) => {
    let _state = _store.state;
    let _http = _state.$http;
    //;
    function q(url, data?) {
        return _http({
            data: data,
            url: url,
            method: 'post'
        });
    }

    return {
      
        /**
         * 查询商品退款信息
         */
        queryRefundGoods(data = { orderId: '', orderGoodsId: '' }) {
            return q('api/order/q_refund_goods', data);
        },
        /**
         * 提交申请退款
         */		
        applyRefund(data) {
            let _url = _http.defaults.baseURL + 'api/order/apply_refund';
            let _user = getLocalUserInfo();
            return new Promise((res, rej) => {
                let formData = new FormData();
                let _files = data.refundImgs;
                for (let i = 0, len = _files.length; i < len; i++) {
                    let _file = _files[i];
                    formData.append(`refundImgs`, _file);
                }
                for (let key in data) {
                    if (key !== 'refundImgs') {
                        formData.append(key, data[key]);
                    }
                }
                formData.append('userId', _user.id);
                formData.append('token', _user.token);
                // submit
                let xhr = new XMLHttpRequest();
                xhr.onload = function (event) {
                    console.log(event);
                    let _currentTarget: any = event.currentTarget;
                    let _response = _currentTarget.response;
                    res(JSON.parse(_response));
                }
                xhr.open("POST", _url, true);
                xhr.send(formData);
                //return q('api/order/apply_refund', data);
            });
        },
        // 13 取消退款申请
        // url:api/order/cancel_refund													
        // param:
        // userId:111
        // token:xxx
        // orderId:111
        // orderGoodsId:222
       cancelRefund(data){
           return  q('api/order/cancel_refund', data);
       }
    };
};