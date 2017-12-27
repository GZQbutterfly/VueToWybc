import Component from 'vue-class-component';
import Vue from 'vue';
import addressDialogService from './address.dialog.service';
import { get, merge, find, orderBy } from 'lodash';
import { getZoneData } from '../../../../commons/common.env';

import { Swiper } from '../../../../commons/assets/swiper';


import './address.dialog.component.scss';
// ==>
@Component({
    props: {
        close: {
            type: Function,
            default: () => { }
        },
        selectAddress: {
            type: Function,
            default: () => { }
        },
        selectId: {
            type: [String, Number],
            default: ''
        }
    },
    template: require('./address.dialog.component.html')
})
export class AddressDialogComponent extends Vue {
    showDialogMode = true;
    showAddressDiaogContent = false;
    showAddAddress: boolean = false;
    type: string = 'create';
    addressList: Array<Object> = [];
    activeItem: Object = {};
    private _$service;
    mounted() {
        this._$service = addressDialogService(this.$store);
        this.$nextTick(() => {
            localStorage.____addressBack = '11';
            this.queryAddressList();
            this.showAddressDiaogContent = true;
        });
    }
    renderSwiper() {
        let _self: any = this;
        let _dialogRef: any = _self.$refs.dialogRef
        _self.swiper = new Swiper(_dialogRef.querySelector('.swiper-container'), {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            autoHeight: true,
            observer: true,
            scrollbar: {
                el: '.swiper-scrollbar'
            },
        });
    }
    queryAddressList() {
        let _self: any = this;
        this._$service.queryAddressList().then((res) => {
            this.addressList = get(res, 'data.data');
            let _addressList = this.addressList;
            _addressList.sort((a: any, b: any) => b.isDefault - a.isDefault);
            if (_addressList.length) {
                for (let i = 0, len = _addressList.length; i < len; i++) {
                    let _address: any = _addressList[i];
                    _address.addressInfo = getZoneData(_address);
                    if (_self.selectId) {
                        _address._active = _self.selectId === _address.addrId;
                    } else {
                        if (_address.isDefault === 1) {
                            _address._active = true;
                        }
                    }
                }
            }
            setTimeout(() => {
                this.renderSwiper();
            });
        });
    }
    closeDialog() {
        let _self: any = this;
        this.showDialogMode = false;
        this.showAddressDiaogContent = false;
        setTimeout(() => {
            _self.close();
        }, 500);
    }
    toCreate() {
        this.$router.push({path:'address', query:{type:'create'}});
    }
    toUpdate(item) {
        this.$router.push({path:'address', query:{type:'update', item}});
    }
}