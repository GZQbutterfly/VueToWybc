
export default (_store) => {
    let _state = _store.state;
    let _http = _state.$http;

    function q(url, data?) {
        return _http({
            data: data,
            url:  url,
            method: 'post'
        });
    }
    // ==>
    return {
        // 添加物流地址
        // url:api/a_address

        createAddress(data) {
            return q('api/address/a_address', data);
        },
        // 修改物流地址
        // url:api/u_address
        updateAddress(data) {
            return q('api/address/u_address', data);
        },
        deleteAddress(data) {
            return q('api/address/d_address', data);
        }
    };
}