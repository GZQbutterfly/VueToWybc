// 申请退款

import Component from 'vue-class-component';
import Vue from 'vue';
import { OrderRefundDialog } from '../components/dialog';
import { goodsStatusDatas } from '../common';
import { find, merge, indexOf } from 'lodash';
import service from '../layout.service';
import './order.refund.scss';

// ==>
@Component({
    props: {
        params: {
            type: Object,
            default: {}
        }
    },
    template: require('./order.refund.html'),
    components: {
        'order-refund-dialog': OrderRefundDialog
    }
})
export class OrderRefund extends Vue {
    formstate = {};
    refundScope: object = {
        orderNo: '',
        payTime: '',
        phone: '',
        processType: 1,
        goodsState: '', //商品状态 0：未收货，1：已收回
        refundReason: '',
        refundMark: '',
        refundImgs: [],
        refundGoods: {}
    };
    params: object;
    applyFlag: boolean = true; // 是否可申请退款
    listFiles = [];
    formScope = {
        totalMoney: 510,
        totalMoneyRoll: 520,
        goodsState: {
            co: '',
            na: ''
        },
        refundReason: {
            co: '',
            na: ''
        }
    };
    goodsStateList: any = [];
    refundReasonList: any = [];
    dialogName = '';
    private _$service;
    mounted() {
        //注册服务
        this._$service = service(this.$store);
        // 
        merge(this.refundScope, this.params, true);
    }
    /**
     * 弹出选择收货情况dialog
     */
    dialogSelectGoodstStaus() {
        this.goodsStateList = goodsStatusDatas;
        this.dialogName = 'goods';
    }
    /**
    * 弹出选择退款原因dialog
    */
    dialogSelectRefundReasons() {
        let _self: any = this;
        let _formScope: any = this.formScope;
        if (_formScope.goodsState.co === '') {
            let dialogObj = {
                title: '提示',
                content: '请选择收货情况！',
                assistBtn: '',
                mainBtn: '知道啦',
                assistFn() {

                },
                mainFn() {

                }
            };
            _self.$store.state.$dialog({ dialogObj });
        } else {
            let _result = find(goodsStatusDatas, { co: _formScope.goodsState.co });
            this.refundReasonList = _result ? _result.ch : [];
            this.dialogName = 'refund';
        }
    }
    selectItem(item) {
        let _formScope: any = this.formScope;
        if (this.dialogName === 'goods') {
            if (_formScope.goodsState.co !== item.co) {
                _formScope.goodsState.co = item.co;
                _formScope.goodsState.na = item.na;
                if (_formScope.refundReason.co) {
                    _formScope.refundReason.co = '';
                    _formScope.refundReason.na = '';
                }
            }
        } else {
            if (_formScope.refundReason.co !== item.co) {
                _formScope.refundReason.co = item.co;
                _formScope.refundReason.na = item.na;
            }
        }
    }
    closeDialog() {
        this.dialogName = '';
    }
    addFile(e) {
        let _fileDom: any = this.$refs.fileDom;
        _fileDom && _fileDom.click();
    }
    removeFile(item, index) {
        console.log(item, index);
        let _self: any = this;
        //_self.$refs[item.img][0].remove();
        let _len = _self.listFiles.length;
        _self.listFiles.splice(index, 1);
        //_self.freaderLocalFile();
        if (!_self.listFiles.length) {
            (<any>this.$refs.fileDom).files.clear();
        }
    }
    chageFile(e) {
        let _self: any = this;
        let _target = e.target;
        let _value = _target.value;
        let _files = _target.files;
        let _len = _files.length;
        let _localFile: any = _self.$refs.localFile;
        let _num = _self.listFiles.length;
        let _count = _num - 1;
        if (_len) {
            for (let i = 0; i < _len; i++) {
                let _file = _files[i];
                if (i + _num >= 5) {
                    _self.dialogImg('最多可上传5张照片');
                    _target.value = '';
                    return;
                }
                if(_file.size > 1048576){
                    _self.dialogImg('图片只支持小于1MB');
                    _target.value = '';
                    return;
                }
                _count++;
                let _imgRef = 'img' + _count;
                _self.listFiles.push({
                    name: _file.name,
                    img: _imgRef,
                    file: _file,
                    url: null
                });
                _self.freaderLocalFile(_file, _count);
            }

        }
    }
    /**
     * 回显本地img
     */
    freaderLocalFile(_file, _count) {
        let _self: any = this;
        let freader = new FileReader();
        freader.readAsDataURL(_file);
        freader.onload = function (ev: any) {
            _self.listFiles[_count].url = ev.target.result;
        }
    }
    submitApplyRefund() {
        let _self: any = this;
        let _toast = _self.$store.state.$toast;
        let _formstate: any = _self.formstate;
        if (_formstate.$invalid) {
            return;
        }
        let _refundScope = _self.refundScope;
        let _formScope = _self.formScope;
        let _param = {
            orderId: _refundScope.orderId,
            orderGoodsId: _refundScope.orderGoodsId,
            phone: _refundScope.phone,
            processType: _refundScope.processType,
            goodsState: _formScope.goodsState.co,
            refundReason: _formScope.refundReason.co,
            refundMark: _refundScope.refundMark,
            refundImgs: []
        };
        for (let i = 0, len = _self.listFiles.length; i < len; i++) {
            _param.refundImgs.push(_self.listFiles[i].file);
        }
        // 已收货1需要验证图片举证
        if(_formScope.goodsState.co === 1){
            if (!_param.refundImgs.length) {
                _self.dialogImg('请上传举证图片');
                return;
            }
        }
        this._$service.applyRefund(_param).then((_result) => {
            console.log(_result);
            if (_result.errorCode) {
                _toast({ title: '提交失败！', success: false });
            } else {
                _toast({ title: '提交成功！' });
                this.$router.push({
                    path: 'order_detail',
                    query: {
                        orderId: _refundScope.orderId
                    }
                });
            }
        })
    }
    dialogImg(msg) {
        let _self: any = this;
        let dialogObj = {
            title: '上传提示',
            content: msg,
            assistBtn: '',
            mainBtn: '确定',
            assistFn() {

            },
            mainFn() {

            }
        };
        _self.$store.state.$dialog({ dialogObj });
    }
}