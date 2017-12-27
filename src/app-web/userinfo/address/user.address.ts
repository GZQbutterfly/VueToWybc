import Component from 'vue-class-component';
import { BaseVue } from '../../../commons/base-vue/base.vue';
import { get } from 'lodash';

import { getZoneData } from '../../../commons/common.env';
import { Address } from '../../../commons/components/address/address';

import service from './user.address.service';
import './user.address.scss';

@Component({
    template: require('./user.address.html'),
    components: {
        'address-operation': Address
    }
})
export class UserAddress extends BaseVue {
    addressList = [];
    private _$service;
    mounted() {
        this._$service = service(this.$store);

        this.$nextTick(() => {
            document.title = '我的地址';
            this.queryAddressList();
        });
    }
    queryAddressList() {
        this._$service.queryAddressList().then((res) => {
            let _result = res.data;
            if (_result.errorCode) {
                return;
            }
            this.addressList = get(_result, 'data');
            let _addressList: any = this.addressList;
            _addressList.sort((a: any, b: any) => b.isDefault - a.isDefault);
            if (_addressList && _addressList.length) {
                for (let i = 0, len = _addressList.length; i < len; i++) {
                    let _address: any = _addressList[i];
                    _address.addressInfo = getZoneData(_address);
                }
            }
        });
    }
    toCreate() {
        this.$router.push({ path: 'address', query: { type: 'create' } });
    }
    toUpdate(item) {
        this.$router.push({ path: 'address', query: { type: 'update', item } });
    }
}