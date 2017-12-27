// 开店宣传信息
import { Component } from 'vue-property-decorator';
import { BaseVue } from '../../../commons/base-vue/base.vue';
import campaignService from './campaign.service';
import { isEmpty } from 'lodash';
import { toCMS, isNotLogin, toLogin } from '../../../commons/common.env';

import './campaign.scss';
@Component({
    template: require('./campaign.html'),
})

export class ApplyShopCampaign extends BaseVue {
    incode: string = '';
    private _$service: any;
    private _$popup;
    private _$dialog;
    mounted() {
        let _self: any = this;
        this._$popup = _self.$store.state.$popup;
        this._$dialog = _self.$store.state.$dialog;
        _self.incode = this.$route.query.incode;
        //注册服务
        this._$service = campaignService(this.$store);
        this.$nextTick(() => {
            document.title = "申请开店";
            _self.isLoginCheckWd();
        });
    }

    /**
     * isLogin && check hasWd
     */
    isLoginCheckWd() {
        if (!isNotLogin()) {
            this.queryUserHasShop();
        }
    }

    /**
     * 查询用户是否已经开店
     */
    queryUserHasShop(cb?) {
        let _self = this;
        this._$service.queryUserHasShop().then((res) => {
            console.log('用户开店信息', res);
            if (res.data.errorCode) {
                _self._$dialog({
                    dialogObj: {
                        title: '提示',
                        type: 'error',
                        content: res.data.msg,
                        mainBtn: '确定',
                        mainFn() {
                            this.$router.push('userinfo');
                        }
                    }
                });
            } else if (!isEmpty(res.data)) {
                _self._$dialog({
                    dialogObj: {
                        title: '开店提示',
                        type: 'info',
                        content: '您的账户已有店铺，不能继续开店！',
                        mainBtn: '管理我的店铺',
                        mainFn() {
                            toCMS('cmsHome');
                        }
                    }
                });
            }
        });
    }

    /**
     * 点击我要开店
     */
    toInvitecode() {
        //屏蔽二维码开店功能
        //this.incode = '';
        let _self = this;
        if (isNotLogin()) {
            let _url = _self.incode ? ('?incode=' + _self.incode) : '';
            toLogin(this.$router, { toPath: 'applyShopInvitecode', realTo: 'applyShopInvitecode' + _url })
        } else {
            if (_self.incode) {
                _self.$router.push({ path: 'applyShopInvitecode', query: { incode: _self.incode } });
            } else {
                _self.$router.push('applyShopInvitecode');
            }
        }
    }
}



