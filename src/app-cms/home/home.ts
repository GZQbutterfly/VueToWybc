// 微店管理端 首页
import Component from 'vue-class-component';
import dialog from '../../components/popup/dialog';
import { Swiper } from '../../commons/assets/swiper';
import { BaseVue } from '../../commons/base-vue/base.vue';
import { isNotLogin, toLogin, pageNotAccess, interval } from '../../commons/common.env';
import homeServer from './home.service';
import './home.scss';
import { TopNotice } from '../../commons/components/notice/top/top.notice';

@Component({
    template: require('./home.html'),
    components: {
        'app-topnotice': TopNotice
    }
})

export class cmsHome extends BaseVue {
    userLogin: boolean = false;
    //用户头像
    user_img: any = '/static/images/pic-login.png';
    userInfo: any;
    userLevel: any;
    userMoney: any = '0';
    userIncome: any = '0';
    systemMsg: any = [];
    radioMsg: any = [];
    gridsData: any = [];
    shopData: any = {
        vip: '0',
        wdName: '？？？',
        vipName: '',
    };
    bannerData: any = [];
    realNameInfo: any = {
        data: {}
    };

    msgNum: number = 0;
    realNameStateList = [
        '未实名认证',
        '认证审核中',
        '实名认证未通过',
        '实名认证异常',
        '实名认证成功'
    ];
    private _$service;
    // top notice  config
    msgOpts: any = {
        list: []
    };

    //当前页面是否活动中(用于关闭消息的定时器)
    pageLife: boolean = true;
    data() {
        return {};
    }
    mounted() {
        document.title = "学惠店管理端";
        let _self: any = this;
        // 注册服务
        _self._$service = homeServer(_self.$store);

        // 页面执行
        _self.$nextTick(() => {
            _self.queryUserInfo();
        })
    }
    destroyed() {
        this.pageLife = false;
    }

    /**
     * 获取用户的信息
     */
    queryUserInfo() {
        let _self = this;
        if (!isNotLogin()) {
            this.userLogin = true;
            this.userInfo = this.$store.state.workVO.user;
            this.user_img = this.userInfo.headimgurl || '/static/images/pic-login.png';

            //用户钱包
            _self.queryUserMoney();
            //店铺等级
            _self.queryShopInfo().then(() => {
                //实名
                _self.queryRealName();
                //系统消息
                _self.querySystemMsg();
            });
            //用户收益
            _self.queryMyIncome();
            //九宫格
            _self.queryGridsData();
            //banner
            _self.queryBannerData();
        }
    }

    /**
     * 获取用户实名认证
     */
    queryRealName() {
        let _self = this;
        this._$service.queryRealName().then((res) => {
            console.log('用户实名认证信息', res.data);
            _self.realNameInfo = res;
        });
    }

    /**
     * 获取用户钱包余额
     */
    queryUserMoney() {
        this._$service.queryUserMoney().then((res) => {
            console.log('用户钱包余额', res.data.money);
            this.userMoney = res.data.money;
        });
    }

    /**
     * 获取店铺等级信息
     */
    queryShopInfo() {
        let _self = this;
        return this._$service.queryShopInfo().then((res) => {
            console.log('店铺信息', res.data.wdVipInfo)
            _self.shopData.wdName = res.data.wdVipInfo.wdName || '？？？';
            _self.shopData.vip = res.data.wdVipInfo.wdVipGrade || '0';
            _self.shopData.vipName = res.data.gradeName || '';
        });
    }

    /**
     * 获取系统消息数据
     */
    querySystemMsg() {
        let _self = this;

        // this.msgOpts.list = [
        //     { img: '', msg: '12asdasd123123ebnnnnnnnnasdasd123123ebnnnnnnnnnn3123', flag: '' },
        //     { img: '/static/images/pic-login.png', msg: 'asdasd123123ss', flag: 'M1adad' },
        //     { img: '/static/images/pic-login.png', msg: 'asdasd123123', flag: 'M1adadss' }
        // ];

        _self._$service.querySystemMsg().then((res) => {
            let _result = res.data;
            if (_result.errorCode) {
                return;
            }
            let _newList = [];
            for (let i = 0, len = _result.length; i < len; i++) {
                _newList.push({ img: '', msg: _result[i], flag: '' });
            }
            _self.msgOpts.list = _newList;
        });

        _self._$service.queryMessageNum().then((res)=>{
            let _result = res.data;
            if (_result.errorCode) {
                return;
            }
            _self.msgNum = _result > 999 ? '999+': _result;
        });

    }

    /**
     * 设置系统消息动画
     * @param data   消息数据
     * @param isLoop 是否循环广播 
     */
    setSysMsgAnim(data, isLoop = false) {
        let i = 0;
        let _self: any = this;
        let dom = _self.$refs.cmsHomeHeadMsg;
        //消息总条数
        let len = data.length;
        //换消息之间的间隔(这时设置的数值是第一次显示的时间)
        let offset = 3000;
        //得到数值间的伪随机数(含左不含右 ms)
        let getRandom = function (min, max) {
            return min + Math.floor(Math.random() * (max - min));
        }
        //设置单条消息
        let setMsg = function (offset) {
            console.log('第' + i + '条消息', '显示延迟', offset + 'ms');
            setTimeout(() => {
                _self.systemMsg = data[i];
                dom.style.display = 'inline-block';
                //华丽入场
                dom.style.animation = 'msgIn .3s';
                offset = 6000;
                console.log('第' + i + '条消息', '显示时间', offset + 'ms');
                setTimeout(() => {
                    //黯然离场
                    dom.style.animation = 'msgOut .3s';
                    setTimeout(() => {
                        //设置下一次单条消息
                        dom.style.display = 'none';
                        offset = getRandom(1000, 3000);
                        (++i == len && !isLoop && (offset = 0)) || (_self.pageLife && offset && setMsg(offset));
                    }, 300);
                }, offset);
            }, offset);
        }
        //start
        len && setMsg(offset);
    }

    /**
     * 获取用户收益数据
     */
    queryMyIncome() {
        let _self = this;
        _self._$service.queryMyIncome().then((res) => {
            _self.userIncome = res.data.totalMoney;
        });
    }

    /**
     * 获取九宫格数据
     */
    queryGridsData() {
        let _self = this;
        this._$service.queryGridsData().then((res) => {
            for (var i = 0, len = res.length; i < len; i += 6) {
                _self.gridsData.push(res.slice(i, i + 6));
            }
            _self.renderGridsSwiper();
        });
    }

    /**
     * 设置九宫格swiper
     */
    renderGridsSwiper() {
        let _self: any = this;
        _self.swiper = new Swiper(_self.$refs.gridsSwiper, {
            slidesPerView: 1,
            slidesPerColumn: 1,
            observer: true,
            followFinger: false,
            speed: 800,
            spaceBetween: 30,
            // swipeHandler: '.ttttttttttttttt',//禁止用户滑动行为
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }

    /**
     * 获取banner数据
     */
    queryBannerData() {
        let _self = this;
        this._$service.queryBannerData().then((res) => {
            console.log('微店管理端banner', res.data.data);
            _self.bannerData = res.data.data;
            _self.bannerData.length > 1 && _self.renderBannerSwiper();
        });
    }

    /**
     * 设置banner的swiper
     */
    renderBannerSwiper() {
        let _self: any = this;
        _self.swiper = new Swiper(_self.$refs.cmsBannerSwiper, {
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            loop: true,
            observer: true,
            speed: 800,
            spaceBetween: 10,
        });
    }

    /**
     * 切换账号
     */
    userLogOff() {
        let _self = this;
        let dialogObj = {
            title: '切换账号',
            content: '确认切换账号？',
            type: 'info',
            assistBtn: '取消',
            mainBtn: '确认',
            assistFn() {
            },
            mainFn() {
                toLogin(_self.$router, { toPath: 'cmsHome' })
            }
        };
        dialog({ dialogObj });
    }

    visit(path, canVisit) {
        if (canVisit) {
            this.$router.push(path);
        } else {
            pageNotAccess();
        }
    }

    // 去 升级VIP等级
    toLevelPage() {
        this.$router.push('grade');
    }
    // 去 实名认证
    toAuthPage() {
        let _self: any = this;
        if (_self.realNameInfo.data.state == 0 || _self.realNameInfo.data.state == 3) {
            this.$router.push('realName');
        } else {
            this.$router.push({ path: 'realNameResult', query: { result: _self.realNameInfo.data } });
        }
    }
    // 去 我的钱包
    toWallet() {
        this.$router.push('myWallet');
    }
    // 去 我的收益
    toIncome() {
        // pageNotAccess();
        this.$router.push('myIncome');
    }
    //错误头像处理
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

    goUrl(linkType, linkTarget, id) {
        if (linkType) {
            location.href = linkTarget;
            return;
        }
        this.$router.push({ path: 'cmsPurchaseGoodsDetail', query: { goodsId: id } })
    }
    toMessageNotice() {
        this.$router.push('messageNotice');
    }
}