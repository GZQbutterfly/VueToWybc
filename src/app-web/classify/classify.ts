import Component from 'vue-class-component';
import { BaseVue } from '../../commons/base-vue/base.vue';
import './classify.scss';
import classifyService from './classify.service';
import getShopCarCount from '../home/getShopCarCount';
import { isNotLogin, toLogin, appendParams } from "../../commons/common.env";
import { NavScrollc } from "./navScroll/navScroll.component";

@Component({
    template: require('./classify.html'),
    components: {
        'navScrollc': NavScrollc
    }
})
export class Classify extends BaseVue {
    // 组件方法也可以直接声明为实例的方法
    show: any = 1;
    classfyList: any = [];
    classfyId: any = [];
    classfyGoodsList: any = [];
    private _$service: any;
    classifyAdImgPic: any = [];
    config: any = {};
    bb: any = [];
    page: number = 1;
    bannerShow: boolean = true;
    headImg: any = '/static/images/pic-nologin.png';
    noflag: boolean = true;
    shopkeeper: any = {};
    //private _getShopCarCount;
    private _classfyList;
    data() {
        return {
            // show: true
        };
    }
    mounted() {
        // 注册服务

        this._$service = classifyService(this.$store);
        let _this = this;
        //this.getClassifyMsg();
        this.$nextTick(() => {
            this._classfyList = this._$service.classfyList();
            this.fetchShopData()
                .then((res: any) => {
                    let config = {
                        title: res.wdName + ',超值特惠',
                        desc: '一言不合买买买！~',
                        imgUrl: 'http://wybc-pro.oss-cn-hangzhou.aliyuncs.com/Wx/wxfile/share_gs.jpg',
                        link: appendParams({ shopId: res.infoId }).replace('user=own','')
                    }
                    _this.updateWxShare(config);
                })
        });
    }

    activated() {
        document.title = "分类";
        // keep-alive 时 会执行activated
        this.$nextTick(() => {
            let _this = this;
            this._classfyList.then((res) => {
                _this.getClassifyMsg(res);
            });
        });
    }
    getClassifyMsg(res) {
        let _this = this;
     
            let shopId = this.$route.query.shopId;
            let wdInfo = JSON.parse(localStorage.wdVipInfo);
            if (!shopId) {
                shopId = wdInfo.infoId;
            }
            this._$service.queryWdInfo(shopId).then((res: any) => {//获取店信息
                console.log(res);
                if (!res.data.wdVipInfo.wdImg) {
                    res.data.wdVipInfo.wdImg = "/static/images/newshop/touxiang.png"
                }
                _this.shopkeeper = {
                    wdName: res.data.wdVipInfo.wdName,
                    wdImg: res.data.wdVipInfo.wdImg,
                    vipGrade: res.data.wdVipInfo.wdVipGrade
                }
            })
        
        this.page = 1;
        let classify = this.$route.query.classify;
        _this.classfyList = res.data.data;
        _this.classfyId = [];
        _this.classfyGoodsList = [];
        _this.classfyList.forEach(item => {
            _this.classfyId.push(item.goodsClassifyId);
        });
        if (classify) {
            _this.show = classify;
            _this.getImgs(classify);
        } else {
            _this.show = _this.classfyId[0];
            _this.getImgs(_this.classfyId[0]);
        }
    }
    refresh(done) {
        this.page = 1;
        let _this = this;
        setTimeout(() => {
            _this._classfyList.then((res) => {
                _this.getClassifyMsg(res);
                done();
            });

        }, 1500)
    }
    infinite(done) {
        let _this = this;
        _this.page++;
        console.log(this.page);
        setTimeout(() => {
            if (_this.page < 2) {
                _this.page = 2
            }
            let opt = {
                classifyId: _this.show,
                page: _this.page,
                limit: 20
            };
            this._$service.getClassfyGoodsList(opt).then(res => {
                console.log(res);
                if (res.data.msg || !res.data.data || res.data.data.length == 0) {
                    done(true);
                    return;
                } else {
                    res.data.data.forEach(item => {
                        _this.classfyGoodsList.push(item);
                    });
                    done(false);

                }
            })
            // done(_this.flag);
        }, 500)

    }

    getImgs(classify) {
        let _this = this;
        _this._$service.getClassifyAdImg(parseInt(classify)).then(res => {
            console.log(res);
            if (res.data.data.length == 0 || !res.data.data) {
                _this.bannerShow = false;
                return;
            }
            _this.bannerShow = true;
            let classifyAd = [];
            res.data.data.forEach(item => {
                item.url = item.imgUrl;
                classifyAd.push(item);
            })
            _this.classifyAdImgPic = classifyAd;
        });
        let opt = {
            classifyId: classify,
            page: 1,
            limit: 20
        };
        _this.classfyGoodsList = [];
        this._$service.getClassfyGoodsList(opt).then(res => {
            if (!res.data.errorCode) {
                console.log(res);
                _this.classfyGoodsList = res.data.data;
            }
        })
    }
    changeShop(e, classfyId) {
        this.page = 1;
        this.show = classfyId;
        let _this = this;
        _this.classfyGoodsList = [];
        _this.classifyAdImgPic= [];
        _this.getImgs(classfyId);
    }
    //跳转搜索页面
    goSearch() {
        let typeId = this.show ? '?classify=' + this.show : '';
        this.$router.push({ path: "search", query: { origin: 'type' + typeId } });
    }

    goLogin() {
        let flag = isNotLogin();
        if (flag) {
            this.$router.push({ path: "login" });
            toLogin(this.$router, { toPath: 'home' })
        } else {
            this.$router.push({ path: "userinfo" });
        }
    }
    imgError() {
        console.log(' ! ! ! ! ! ! ! ! ! ', 'user pic error ...');
        this.headImg = '/static/images/pic-login.png';
    }
    imgLoad() {
        //暂用 根据大小判断 用户头像为640*640 错误头像为120*120 默认头像为175*175
        if (this.headImg) {
            let img = new Image();
            img.src = this.headImg;
            if (img.width == 120) {
                console.log('检测到错误的用户头像,正在替换为默认头像...');
                this.headImg = '/static/images/pic-login.png';
            }
        }
    }
}