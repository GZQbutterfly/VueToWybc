import Component from 'vue-class-component';
import { BaseVue } from '../../../commons/base-vue/base.vue';
import './shopCar.scss';
import shopCarService from './shopCar.service';
import { isNotLogin, toLogin, cacheLogin } from "../../../commons/common.env";
import { EFAULT } from 'constants';


@Component({
    template: require('./shopCar.html')
})
export class CmsPurchaseShopCar extends BaseVue {
    // 组件方法也可以直接声明为实例的方法
    validLists: any = []//购物车列表
    invalidLists: any = [];//失效列表
    total = 0;//合计
    totalPrice = 0;//总额
    settlement = 0;//结算个数
    checkAll = false;//全选
    isEdit: boolean = true;//编辑状态
    edit: string = "编辑";
    isEmpty: boolean = false;//购物车为空
    isShow: boolean = false;//失效物品区域显示
    recommendShow: boolean = false;
    recommendLists: any = [];
    private _$service: any;
    page: any = 1;
    flag: any = false;
    wdName: any = '';
    infoId: any = '';
    headImg: any = '/static/newshop/images/pic-nologin.png';
    qflag:boolean = true;
    //最低购买金额
    isFirst: boolean = false;
    leastMoney: number = 0;


    private _shopcartCache;
    data() {
        return {

        };
    }
    mounted() {
        // 注册服务
        this._$service = shopCarService(this.$store);
    }
    activated() {
        document.title = "进货单";
        // keep-alive 时 会执行activated
        this.$nextTick(() => {
            this.getShoppcarMsg();
            this.getLeastBuyMoney();
        })

    }
    getShoppcarMsg() {
        this._shopcartCache = JSON.parse(localStorage.getItem("shopcartCache"));
        let _this = this;
        //用户是否登录
        _this.page = 1;
        _this.edit = "编辑";
        _this.isEdit = true;
        _this.checkAll = false;
        _this.recommendShow = false;
        _this.isEmpty = false;
        _this.validLists = []//购物车列表
        _this.invalidLists = [];//失效列表
        let dialog = this.$store.state.$dialog;
        _this._$service.getShopcarGoodsesList(1).then((res: any) => {
            if (res.data.errCode) {
                let dialogObj = {
                    title: '',
                    content: res.data.msg,
                    assistBtn: '',
                    mainBtn: '我知道了',
                    type: 'info',
                    assistFn() {
                    },
                    mainFn() {

                    }
                };
                dialog({ dialogObj });
                return;
            }
            if (res.data.data.length == 0) {
                _this.isEdit = true;
                _this.isEmpty = true;
                return;
            }
            if (res.data.message){
                let dialogObj = {
                    title: '',
                    content: '您已升级，进货单商品已更新！',
                    assistBtn: '',
                    mainBtn: '我知道了',
                    type: 'info',
                    assistFn() {
                    },
                    mainFn() {

                    }
                };
                dialog({ dialogObj });
            }

            _this.validLists.length = 0;
            _this.invalidLists.length = 0;
            if(res.data.data[0].shopId==0){
                _this.wdName ="学惠精选官方商城";
            }else{
                _this.wdName = res.data.data[0].wdName;
            }
           
            // _this.infoId = res.data.data[0].infoId;
            res.data.data.forEach(item => {
                item.check = false;
                if (item.isValid == 1) {
                    _this.validLists.push(item);
                } else {
                    _this.invalidLists.push(item);
                }
            });
           
            _this.setGoods();
            let num = 0;
            _this.validLists.forEach(ele => {
                num += Number(ele.number);
            });
            _this.$store.state.shopCar.count = num;
            if (_this.invalidLists.length == 0) {
                _this.isShow = false;
            }else{
                _this.isShow = true;
            }
            if (_this.validLists.length != 0) {
                _this.isEmpty = false;
            }else{
                _this.isEmpty = true;  
            }
           
        })
        //推荐商品
        this._$service.getShopcarRecommend().then((res: any) => {
            _this.recommendLists.length = 0;
            if (res.data.data.length == 0) {
                _this.recommendShow = true;
                return;
            }
            _this.recommendShow = false;
           _this.changePrice(res.data.data);
        });
    }

    changePrice(res){
        let _this =this;
        let shopId = localStorage.selfShopId;
        let goodsIds = []; let opt = { infoId: shopId, listStr: "" };
        res.forEach(ele => {
            goodsIds.push(ele.goodsId)
        });
        opt.listStr = goodsIds.join(",");
        this._$service.getDiscountPrice(opt).then(discount=>{
            for (let i = 0, len = res.length; i < len; i++) {
                for (let j = 0, lenj = discount.data.length; j < lenj; j++) {
                    if (i == j) {
                        res[i].moneyPrice = Math.ceil(res[i].moneyPrice * discount.data[j] / 100);
                        break;
                    }
                }
            }
            _this.recommendLists = res;   
            _this.qflag = false;
        })
    }
    //刷新
    refresh(done) {
        let _this = this;
        setTimeout(() => {
            _this.getShoppcarMsg();
            done();
        }, 1500)
    }
    //加载更多
    infinite(done) {
        if(this.qflag){
            done(false);
            return;
        }
        let login = !isNotLogin();
        if (login) {
            this.page++;
            let _this = this;
            setTimeout(() => {
                if (_this.page < 2) {
                    _this.page = 2;
                }
                _this._$service.getShopcarGoodsesList(_this.page).then((res: any) => {
                    if (res.data.data.length == 0 || res.data.errCode) {
                        //    _this.flag = true;
                        done(true);
                        return;
                    }
                    console.log(res);
                    res.data.data.forEach(item => {
                        item.check = false;
                        if (item.isValid == 1) {
                            _this.validLists.push(item);
                        } else {
                            _this.invalidLists.push(item);
                        }
                    });
                    _this.setGoods();
                    let num = 0;
                    _this.validLists.forEach(ele => {
                        num += Number(ele.number);
                    });
                    _this.$store.state.shopCar.count = num;
                    _this.qflag = false;
                    done(false);
                });
                //  done(_this.flag); 
            }, 1500)
        } else {
            setTimeout(() => {
                done(true);
            }, 1500);
        }
    }
    //选中商品
    setGoods() {
        let goodsId = JSON.parse(localStorage.getItem("checkStateCms"));
        let _this = this;
        let flag = true;
        if (goodsId && goodsId.length != 0) {
            this.validLists.forEach(item => {
                goodsId.forEach(ele => {
                    if (item.goodsId == ele) {
                        item.check = true;
                    }
                });
                if (!item.check) {
                    flag = false;
                }
            });
            _this.checkAll = flag;
            _this.calTotalMoney();
        }
    }
    //单选
    onRadio(e, index) {
        let _this = this;
        this.validLists[index].check = !this.validLists[index].check;
        let goodsId = [];
        let flag = true;
        this.validLists.forEach(item => {
            if (!item.check) {
                flag = false;
            }
            if (_this.edit === "编辑") {
                if (item.check) {
                    goodsId.push(item.goodsId);
                }
            }
        });
        this.checkAll = flag;
        this.calTotalMoney();
        if (_this.edit == "编辑") {
            localStorage.setItem("checkStateCms", JSON.stringify(goodsId));
        }

    }
    //全选
    checkAllState(e) {
        let _this = this;
        let flag = true;
        let goodsId = [];
        if (this.checkAll) {
            flag = false;
        }

        this.validLists.forEach(item => {
            item.check = flag;
            if (_this.edit == "编辑") {
                if (item.check) {
                    goodsId.push(item.goodsId);
                }
            }
        })
        this.checkAll = !this.checkAll;
        this.calTotalMoney();

        if (_this.edit == "编辑") {
            localStorage.setItem("checkStateCms", JSON.stringify(goodsId));
        }
        console.log(_this.edit);
    }
    //减
    minus(index) {
        if (this.validLists[index].number <= 1) {
            this.validLists[index].number = 1;
            return;
        }
        this.validLists[index].number--;
        this.getCount(index);
    }
    //加
    add(index) {
        this.validLists[index].number++;
        this.getCount(index);
    }
    //修改值
    changeNum(e, index) {
        let isNum = ('' + this.validLists[index].number).indexOf('.');
        console.log(isNum);
        if (!this.validLists[index].number || this.validLists[index].number <= 0 || isNum == 1) {
            this.validLists[index].number = 1;
            let _toast = this.$store.state.$toast;
            _toast({ title: '输入数量不正确', success: false });
            return;
        }
        this.getCount(index);
    }
    //修改购物车数量
    getCount(index) {
        let _this = this;
        let maxNum = this.validLists[index].maxBuyNum;
        if (maxNum && this.validLists[index].number > maxNum) {
            this.validLists[index].number = maxNum;
            let _toast = this.$store.state.$toast;
            _toast({ title: '一次最多购买' + maxNum + '件', success: false });
        }
        let opt = {
            cartId: this.validLists[index].id,
            num: this.validLists[index].number,
            goodsId: this.validLists[index].goodsId
        }
        this._$service.changeShopcarNumber(opt).then(res => {
            if(res.data.errorCode){
                let _toast = _this.$store.state.$toast;
                _toast({ title: res.data.msg, success: false });
                _this.validLists[index].number = 1;
            }

        });
        let num = 0;
        this.validLists.forEach(ele => {
            num += Number(ele.number);
        });
        this.$store.state.shopCar.count = num;
    }
    //计算商品总价
    calTotalMoney() {
        let totalMoney = 0, settlementNum = 0;
        this.validLists.forEach(item => {
            if (item.check) {
                let num: any = Number(item.number)
                totalMoney += item.moneyPrice * num;//应付价格
                settlementNum += num;

            }
        })
        this.total = totalMoney;
        this.settlement = settlementNum;
    }
    //购物车编辑
    editShopCar() {
        if (this.edit === "编辑") {
            this.edit = "完成";
            this.isEdit = false;
            this.checkAll = false;
            this.validLists.forEach(item => {
                item.check = false;
            })
        } else {
            this.isEdit = true;
            this.edit = "编辑";
            this.validLists.forEach(item => {
                item.check = false;
            })
            this.checkAll = false;
            this.setGoods();
        }
        this.calTotalMoney();
    }
    //删除购物车
    onDelete() {
        //弹出层
        let dialog = this.$store.state.$dialog;
        let _this = this;

        if (this.settlement == 0) {
            let dialogObj = {
                title: '',
                content: '您未选中要删除的商品',
                assistBtn: '',
                mainBtn: '确定',
                type: 'info',
                assistFn() {
                },
                mainFn() {
                }
            };
            dialog({ dialogObj });
            return;
        }
        let dialogObj = {
            title: '删除商品',
            content: '是否删除选中商品',
            assistBtn: '取消',
            mainBtn: '确定',
            type: 'info',
            assistFn() {
            },
            mainFn() {
                _this.delete();
                if (_this.validLists.length === 0) {
                    _this.isEmpty = true;
                }
            }
        };
        dialog({ dialogObj });
    }
    //删除购物车选中列表
    delete() {
        let goodsId = JSON.parse(localStorage.getItem("checkStateCms"));
        let goodsIdarr = [];
        let arr = [], del = [];
        this.validLists.forEach((item, index) => {
            if (!item.check) {
                arr.push(item);
            }
            else {
                del.push(item.id);
            }
        });
        this.validLists = arr;
        let num = 0;
        this.validLists.forEach(ele => {
            num += Number(ele.number);
        });
        this.$store.state.shopCar.count = num;

        if (goodsId && goodsId != 0) {
            goodsId.forEach(ele => {
                arr.forEach(item => {
                    if (ele == item.goodsId) {
                        goodsIdarr.push(ele);
                    }
                })
            });
            localStorage.setItem("checkStateCms", JSON.stringify(goodsIdarr));
        }
        let opt = {
            cartId: del.join(',')
        }
        console.log(opt);
        this._$service.deleteShopcar(opt).then(function (res) {
            console.log(res);
        })
    }
    //结算
    onSettle() {
        let flag = !isNotLogin();//判断用户有缓存登录
        let dialog = this.$store.state.$dialog;
        let _this = this;
        let cartId = [];

        this.validLists.forEach(item => {
            if (item.check) {
                cartId.push(item.id);
            }
        });
        if (cartId.length == 0) {
            let dialogObj = {
                title: '',
                content: '您未选中商品！！',
                assistBtn: '',
                mainBtn: '确定',
                type: 'info',
                assistFn() {
                    console.log('ok');
                },
                mainFn() {
                }
            };
            dialog({ dialogObj });
            return;
        }
        if (!flag) {
            let dialogObj = {
                title: '用户未登录',
                content: '登录后才可购买商品',
                assistBtn: '取消',
                mainBtn: '确定',
                type: 'info',
                assistFn() {

                },
                mainFn() {
                    toLogin(_this.$router, { toPath: 'cmsPurchaseShoppcar', realTo: 'cmsPurchaseShoppcar' });
                }
            };
            dialog({ dialogObj });
            return;
        }
        this.$router.push({ path: 'cmsPurchaseSubmitOrder', query: { cartId: cartId.join(','), orderSrouce: 'car' } });
    }
    //清空
    onClear() {
        let dialog = this.$store.state.$dialog;
        let _this = this;
        let dialogObj = {
            title: '提示',
            content: '是否清空失效商品?',
            assistBtn: '取消',
            mainBtn: '确定',
            type: 'info',
            assistFn() {
            },
            mainFn() {
                let cartsId = [];
                _this.invalidLists.forEach(ele => {
                    cartsId.push(ele.id);
                });
                let opt = {
                    cartId: cartsId.join(',')
                }
                _this._$service.deleteShopcar(opt).then(function (res) {
                    console.log(res);
                })
                _this.invalidLists = [];
                _this.isShow = false;
            }
        };
        dialog({ dialogObj });
    }

    //最低购买金额
    getLeastBuyMoney(){
        let _self:any = this;
        _self._$service.getLeastBuyMoney().then((res) => {
            _self.isFirst = res.data.flag;
            _self.leastMoney = res.data.leastBuy;
        });
    }
}