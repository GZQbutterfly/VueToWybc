import Component from 'vue-class-component';
import { BaseVue } from '../../commons/base-vue/base.vue';
import './home.scss';
import { debounce } from 'lodash';
import { isNotLogin, toLogin, appendParams, isWeiXin, getAuthUser } from "../../commons/common.env";
import { NavRow } from "../../components/navRow/navRow.component";
import { IconsList } from "./navScroll2/navScroll.component";
import { TopNotice } from '../../commons/components/notice/top/top.notice';
import homeService from './home.service';
import { GoodsBanner } from './goodsBanner/banner.component';

@Component({
    template: require('./home.html'),
    components: {
        'nav-row': NavRow,
        'iconsList': IconsList,
        'app-topnotice': TopNotice,
        'gs-banner': GoodsBanner
    }
})

export class Home extends BaseVue {

    //单次请求个数
    private pageLimit = 5;
    private _$service: any;

    //顶部店铺信息
    shopkeeper: any = {};
    //顶部banner
    homeAd: any = [];
    //小分类
    iconsList: any = [];
    //三格数据
    recommendations: any = [];
    //导航分类选项卡
    classfyList: any = [{
        classifyName: '学惠推荐',
        selectedImgUrl: '/static/images/newshop/tuijian_s.png',
        unselectedImgUrl: '/static/images/newshop/tuijian.png',
        goodsClassifyId: 0,
    }];
    //分类及商品数据
    classfyGoodses: any = [];
    //当前页数信息
    page = 0;
    //公告
    msgOpts: any = {
        list: []
    };
    //顶部活动banner
    activeBanner: any = [];
    mounted() {
        let self = this;
        this.$nextTick(() => {
            self._$service = homeService(this.$store);
            self.fetchShopData()
                .then((res: any) => {
                    let config = {
                        title: res.wdName + ',超值特惠',
                        desc: '一言不合买买买！~',
                        imgUrl: 'http://wybc-pro.oss-cn-hangzhou.aliyuncs.com/Wx/wxfile/share_gs.jpg',
                        link: appendParams({ shopId: res.infoId }).replace('user=own', ''),
                    }
                    self.updateWxShare(config);
                    self.shopkeeper = res;
                })
                .catch(error => {
                    let dialog = self.$store.state.$dialog;
                    let dialogObj = {
                        title: '提示',
                        content: '店铺不存在!',
                        mainBtn: '知道了',
                        type: 'info',
                        mainFn() {
                        }
                    };
                    dialog({ dialogObj });
                })
            //初始化三格数据
            self.fetchRecommentData();
            //查询公告信息
            self.queryTopNotice();
            //banner
            self.homeBanner();
            //分类列表
            self.classList();
            //活动banner
            self.activitBanner();
        })
    }

    fetchRecommentData() {
        let self = this;
        this._$service.recommendations().then(function (res) {
            if (res.data && res.data.data && res.data.data.length == 3) {
                self.recommendations = res.data.data;
            }
        });
    }

    queryTopNotice() {
        // 公告
        this._$service.queryTopNotice().then((res) => {
            let _result = res.data;
            if (_result.errorCode) {
                return;
            }
            let _newList = [];
            for (let i = 0, len = _result.length; i < len; i++) {
                _newList.push({ img: '', msg: _result[i], flag: '' });
            }
            this.msgOpts.list = _newList;
        });
    }

    //轮播
    homeBanner() {
        let self = this;
        this._$service.homeAd(1).then(res => {
            if (res.data.errorCode || !res.data) {
                self.homeAd = [];
            } else {
                self.homeAd = [];
                res.data.data.forEach(item => {
                    item.url = item.imgUrl;
                    self.homeAd.push(item);
                })
            }
        })
    }

    //小图标分类
    inconsList() {
        let self = this;
        this._$service.iconsList().then(function (res) {
            if (res.data.data.length == 0 || res.data.errorCode) {
                self.iconsList = [];
            } else {
                self.iconsList = res.data.data;
            }
        });
    }

    //搜索页面
    goSearch() {
        this.$router.push({ path: 'search', query: { origin: 'home' } });
    }

    //分类导航
    classList() {
        let self = this;
        this._$service.classfyList().then(res => {
            if (res.data && !res.data.errorCode) {
                res.data.data.forEach(element => {
                    self.classfyList.push(element);
                });
            }
        })
    }

    //活动banner
    activitBanner() {
        let self = this;
        this._$service.homeAd(4).then(res => {
            if (res.data.errorCode || !res.data) {
                self.activeBanner = [];
            } else {
                res.data.data.forEach(item => {
                    item.url = item.imgUrl;
                    self.activeBanner.push(item);
                })
            }
        })
    }

    fetchGoodsData(page, done) {
        let self = this;
        let ids = '';
        if (page <= 1) {
            for (let i = 0; i < self.pageLimit; ++i) {
                if (this.classfyList.length > i + 1) {
                    ids += '' + this.classfyList[i + 1].goodsClassifyId + ',';
                } else {
                    break;
                }
            }
        } else {
            for (let i = 0; i < self.pageLimit; ++i) {
                if (this.classfyList.length > (page - 1) * self.pageLimit + 1 + i) {
                    ids += '' + this.classfyList[(page - 1) * self.pageLimit + 1 + i].goodsClassifyId + ',';
                } else {
                    break;
                }
            }
        }

        this._$service.classfyShop(ids).then(res => {
            if (res.data.errorCode || !res.data || res.data.data.length == 0) {
                if (done) {
                    done(true);
                }
            } else {
                if (page <= 1) {
                    self.classfyGoodses = res.data.data;
                    self.page = 1;
                } else {
                    res.data.data.forEach(element => {
                        self.classfyGoodses.push(element);
                    });
                    self.page = page;
                }
                if (done) {
                    done(true);
                }
            }
        })
        .catch ((error) => {
            if (done) {
                done();
            }
        })
    }

    goodsBannerClicked(ad) {
        if (!ad.goodsId || ad.linkType == 1) {
            location.href = ad.linkTarget;
        } else {
            let url = location.href;
            if (url.indexOf('cms') == -1) {
                this.$router.push({ path: "goods_detail", query: { goodsId: ad.goodsId } });
            } else {
                this.$router.push({ path: "cmsPurchaseGoodsDetail", query: { goodsId: ad.goodsId } });
            }
        }
    }

    navSelected(index, data) {
        this.$router.push({ path: 'type', query: { classify: data.goodsClassifyId } });
    }

    goPage(link, goodsId) {
        if (link) {
            location.href = link;
        } else {
            this.$router.push({ path: 'goods_detail', query: { goodsId: goodsId } })
        }
    }

    refresh(done) {
        let self = this;
        setTimeout(() => {
            //初始化三格数据
            self.fetchRecommentData();
            //banner
            self.homeBanner();
            self.fetchGoodsData(1, done);
            //活动banner
            self.activitBanner();
        }, 500)
    }

    onSeeAll(classifyId) {
        this.$router.push({ path: "type", query: { classify: classifyId } });
    }

    infinite(done) {
        let self = this;
        setTimeout(() => {
            //第一页数据交给初始化
            if (self.page == 0) {
                if (!self.classfyList || self.classfyList.length < 2) {
                    done(false);
                } else{
                    self.fetchGoodsData(1, done);
                }
            } else {
                if (!self.classfyList || self.classfyList.length < 2) {
                    done(true);
                } else {
                    self.fetchGoodsData(self.page + 1, done);
                }
            }
        }, 1)
    }
}