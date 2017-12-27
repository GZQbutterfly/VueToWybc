import { Component, Prop, Vue } from 'vue-property-decorator';
import { merge, isObject } from 'lodash';


import { AreasData, getZoneData, timeout, isAndroid } from '../../common.env';
import { Swiper } from '../../assets/swiper';
import { Zone } from '../zone/zone';



import service from './address.service';

import './address.scss';

// ==>
@Component({
    template: require('./address.html'),
    components: {
        'zone-component': Zone
    }
})
export class Address extends Vue {
    type: String = 'create';
    item: Object = {};
    title = '新增收货地址';// 
    formstate = {};
    formScope: Object = { name: '', phone: '', address: '', zipCode: '', isDefault: 0, province: '', city: '', district: '' };
    proviceList = [];
    cityList = [];
    districtList = [];
    private _$service;
    swiper: any;
    data() {
        return {};
    }
    mounted() {
        this._$service = service(this.$store);
        let _params = this.$route.query;
        this.type = _params.type;
        if (this.type === 'update') {
            let _item: any = _params.item;
            if(!isObject(_item)){
                _item = JSON.parse(sessionStorage.___addressItem) || {};
            }else{
                sessionStorage.___addressItem = JSON.stringify(_item);
            }
            this.title = '修改收货地址';
            let _scope: any = this.formScope;
            _scope.addrId = _item.addrId;
            _scope.name = _item.name;
            _scope.phone = _item.phone;
            _scope.address = _item.address;
            _scope.zipCode = _item.zipCode;
            _scope.isDefault = _item.isDefault;
            let _result = getZoneData(_item);
            this.cityList = _result.province.ch;
            this.districtList = _result.city.ch;
            _scope.province = _result.province.co;
            _scope.city = _result.city.co;
            _scope.district = _result.district.co;
        }
        this.$nextTick(() => {
            document.title = this.title;
            this.proviceList = AreasData;
        });
    }
    /**
     * 省份选择
     * @param event 
     */
    changeProvinceAddress(event) {
        let _self: any = this;
        let _form = _self.formScope;
        let _target = event.target;
        let _index = _target.selectedIndex;
        if (_index) {
            let data = _self.proviceList[_index - 1];
            if (data && data.ch) {
                _self.cityList = data.ch;
            } else {
                _self.cityList = [];
            }
            _form.city = '';
            _self.districtList = [];
            _form.district = '';
        } else {
            _self.cityList = [];
            _form.city = '';
            _self.districtList = [];
            _form.district = '';
        }
    }
    /**
     * 城市选择
     * @param event 
     */
    changeCityAddress(event) {
        let _self: any = this;
        let _form = _self.formScope;
        let _target = event.target;
        let _index = _target.selectedIndex;
        if (_index) {
            let data = _self.cityList[_index - 1];
            if (data && data.ch) {
                _self.districtList = data.ch;
            } else {
                _self.districtList = [];
            }
            _form.district = '';
        } else {
            _self.districtList = [];
            _form.district = '';
        }
    }
    // 切换地址默认checkbox
    switchDefault(event) {
        let _scope: any = this.formScope;
        _scope.isDefault = event.target.checked ? 1 : 0;
    }
    saveData() {
        let _toast = this.$store.state.$toast;
        let _formstate: any = this.formstate;
        let _dialog = this.$store.state.$dialog;
        if (_formstate.$invalid) {
            return;
        }
        let _scope: any = this.formScope;
        let data = merge({}, _scope, true);
        data.province = _scope.province;
        data.city = _scope.city;
        data.district = _scope.district;
        let _result = null;
        let _msg = '新增成功！';
        if (this.type === 'update') {
            _msg = '更新成功！';
            _result = this._$service.updateAddress(data);
        } else {
            _result = this._$service.createAddress(data);
        }
        _result.then((res) => {
            let _result = res.data;
            if (_result.errorCode) {
                _toast({ title: _result.msg, success: false });
            } else {
                this.close();
                timeout(()=>{
                    _toast({ title: _msg });
                }, 100);
            }
        });
    }
    delData() {
        let _scope: any = this.formScope;
        let _toast = this.$store.state.$toast;
        this._$service.deleteAddress({ addrId: _scope.addrId }).then((res) => {
            let _result = res.data;
            if (_result.errorCode) {
                _toast({ title: '删除失败！', success: false });
            } else {
                this.close();
                timeout(()=>{
                    _toast({ title: '删除成功！' });
                }, 100);
            }
        });
    }
    maxMe(e){
        let _target = e.target;
        if(_target.value.length <= _target.maxLength){
            _target.style.height = _target.scrollTop + _target.scrollHeight + "px";
        }
    }
    close() {
        this.$router.back();
    }
    destroyed() {
        sessionStorage.removeItem('___addressItem');
    }
}
