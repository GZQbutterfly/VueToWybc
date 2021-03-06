// 我的钱包
import { Component } from 'vue-property-decorator';
import { BaseVue } from '../../../commons/base-vue/base.vue';
import dialog from '../../../components/popup/dialog';
import { isNotLogin, isAndroid, isiOS, pageNotAccess } from '../../../commons/common.env';

import walletService from './wallet.service';
import './wallet.scss';

@Component({
    template: require('./wallet.html'),
})

export class MyWallet extends BaseVue {
    showRule: boolean = false;
    data_money: any = '';
    data_type: any = '1';
    data_name: any = '';

    vipName: string = '';

    withdrawInfo: any = {};

    shopData: any = {
        vip: '0',
    };


    userLogin: boolean = false;
    //用户头像
    user_img: any = '/static/images/pic-nologin.png';
    userMoney: any = '0';
    userInfo: any = {};
    private _$service: any;

    mounted() {
        document.title = "我的钱包";
        let _self = this;
        //注册服务
        this._$service = walletService(this.$store);

        //TODO
        this.$nextTick(() => {

            _self.queryWithdrawInfo();
            _self.setUserImg();
            _self.setUserMoney();
            _self.setUserLevel();
        });
    }

    changeShowRule() {
        let _self: any = this;
        let area = _self.$refs.walletTextArea;
        let areaIn = _self.$refs.walletTextAreaIn;
        area.style.height = ((_self.showRule = !_self.showRule) ? areaIn.getBoundingClientRect().height : 0) + 'px';
    }

    getAutoHeight() {

    }

    setUserImg() {
        if (!isNotLogin()) {
            this.userLogin = true;
            this.userInfo = this.$store.state.workVO.user;
            this.user_img = this.userInfo.headimgurl || '/static/images/pic-login.png';
        }
    }

    /**
     * 获取提现cms设置
     */
    queryWithdrawInfo() {
        let _self: any = this;
        _self._$service.queryWithdrawInfo().then((res) => {
            _self.withdrawInfo = res.data;
            _self.withdrawInfo.withDrawInstruction = _self.withdrawInfo.withDrawInstruction.split(/\s{2}/g);
        });
    }

    /**
     * 获取用户钱包余额
     */
    setUserMoney() {
        this._$service.queryUserMoney().then((res) => {
            this.userMoney = res.data.money;
        });
    }

    /**
     * 获取用户等级
     */
    setUserLevel() {
        let _self = this;
        this._$service.queryShopInfo().then((res) => {
            _self.shopData.wdName = res.data.wdVipInfo.wdName || '？？？';
            _self.shopData.vip = res.data.wdVipInfo.wdVipGrade || '0';
            _self.shopData.vipName = res.data.gradeName || '';
        });
    }

    /**
     * 钱包提现
     */
    withdraws() {
        // pageNotAccess();
        let _self: any = this;
        this._$service.queryRealName().then((res) => {
            console.log('用户实名认证信息', res.data)
            if (res.data.state != 4) {
                _self.alertMsg('您实名认证未成功，不能提交提现申请', '立即认证', () => {
                    _self.toAuthPage(res.data)
                });
                return;
            }
            //检查格式
            let msg = this.checkFormat();
            if (msg == '') {
                let data = {
                    // userId: 3,
                    money: this.data_money * 100,
                    TransferType: _self.data_type,
                    account: this.data_name,
                }
                this._$service.setWithdraw(data).then((res) => {
                    console.log('提现信息', res)
                    if (res.data.errorCode) {
                        this.alertMsg(res.data.msg);
                    } else {
                        this.$router.push({ path: 'withdraws_detail', query: { id: res.data.withdrawId } });
                    }
                });
            } else {
                //格式不正确
                this.alertMsg(msg);
            }
        });
    }

    alertMsg(msg, btn = '确认', cb = null) {
        let dialogObj = {
            title: '提示',
            content: msg,
            type: 'error',
            assistBtn: '',
            mainBtn: btn,
            assistFn() {
            },
            mainFn() {
                cb && cb();
            }
        };
        dialog({ dialogObj });
    }

    /**
     * 检查格式
     */
    checkFormat() {
        //待校验提现金额
        let money = Number(this.data_money);
        //提现金额倍数
        let withDrawBasic = this.withdrawInfo.withDrawBasic / 100;
        //最低提现金额
        let withDrawMinValue = this.withdrawInfo.withDrawMinValue / 100;
        //匹配正整数以及小数
        let reg_money = /^([1-9]\d*|0)(\.\d+)?$/;
        if (this.data_money == '') {
            return '请输入提现金额';
        }
        if (!reg_money.test('' + money)) {
            return '金额格式不正确';
        }
        if (money < withDrawMinValue) {
            return '提现金额需大于' + withDrawMinValue.toFixed(2) + '元';
        }
        if (money == 0) {
            return '提现金额不能为零';
        }
        if (money % withDrawBasic != 0) {
            return '提现金额需是' + withDrawBasic.toFixed(2) + '元的倍数';
        }
        if (money > this.userMoney) {
            return '钱包余额不足';
        }
        if (this.data_name == '') {
            return '请输入' + ['微信', '支付宝'][this.data_type - 1] + '账号';
        }
        let reg_wechat = /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/;
        if (this.data_type == 1) {
            if (!reg_wechat.test(this.data_name)) {
                return '微信账号格式不正确';
            }
        }
        return '';
    }

    /**
     * 等级
     */
    toLevelPage() {
        this.$router.push('grade');
    }

    /**
     * 提现记录
     */
    toWithdraws() {
        // pageNotAccess();
        this.$router.push('withdraws_list');
    }

    // 去 实名认证
    toAuthPage(res) {
        let _self: any = this;
        if (res.state == 0 || res.state == 3) {
            this.$router.push('realName');
        } else {
            this.$router.push({ path: 'realNameResult', query: { result: res } });
        }
    }

    imgLoad() {
        //暂用 根据大小判断 用户头像为640*640 错误头像为120*120 默认头像为175*175
        if (this.userLogin) {
            let img = new Image();
            img.src = this.user_img;
            if (img.width == 120) {
                console.log('检测到错误的用户头像,正在替换为默认头像...');
                this.user_img = '/static/images/pic-login.png';
            }
        }
    }
}