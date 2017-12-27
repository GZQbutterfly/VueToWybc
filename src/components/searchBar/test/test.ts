import Component from 'vue-class-component';
import { BaseVue } from '../../../commons/base-vue/base.vue';
import Vuex from 'vuex';
import { debounce } from 'lodash';
import './test.scss';

@Component({
    props: {
        /**
         * 搜索框初始化事件
         */
        _func_search_init: {
            type: Function,
            default: () => { }
        },
        /**
         * 搜索输入提示事件,确保返回的数据直接为数组
         */
        _func_search_change: {
            type: Function,
            default: (keyword) => { return [] }
        },
        /**
         * 输入框提交事件
         */
        _func_search_submit: {
            type: Function,
            default: (keyword) => { }
        },
        /**
         * 输入框placeHolder
         */
        _txt_search_placeholder: {
            type: String,
            default: '请输入搜索内容'
        },
        /**
         * 输入框是否有关键词提示功能
         */
        _bool_search_hasHint: {
            type: Boolean,
            default: true
        },
    },
    template: require('./test.html')
})

/**
 * 接收事件
 *  搜索初始化事件(显示历史/热门搜索等搜索前视图)
 *  搜索关键词提示事件(若空则表示没有)
 *  搜索提交事件(增加搜索历史,处理搜索结果视图)
 * 接收属性
 *  placeholder
 */

export class searchBarTest extends BaseVue {
    //待搜索关键字
    txt_search_keyword: String = '';
    //搜索占位词语
    txt_search_placeholder: String = '';
    //是否正在搜索
    bool_search_searching: Boolean = true;
    //是否有提示词
    bool_search_hasHint: Boolean = false;
    //搜索提示列表
    arr_saerch_hint: Array<String> = [];

    mounted() {
        this.txt_search_placeholder = this.$props._txt_search_placeholder;
        this.bool_search_hasHint = this.$props._bool_search_hasHint;
        let _self = this;
        //输入框关键词提示
        let _change = debounce(function () {
            console.log('关键词改变', _self.txt_search_keyword_format)
            if (_self.txt_search_keyword_format === '') {
                //初始化搜索控件
                _self.arr_saerch_hint = [];
            } else {
                //获取关键词列表
                this.func_search_init();
                this.$props._func_search_change().then((res) => {
                    console.log('关键词列表:', res)
                    _self.arr_saerch_hint = res;
                });
            }
        }, 500);
        if (_self.bool_search_hasHint) {
            this.$watch('ipt_search', () => {
                _change();
            });
        }
        //监听路由变化
        this.$watch('$route', () => {
            console.log('\n\n路由改变', this.$route.fullPath);
            this.func_search_init();
        });
    }

    /**
     * 搜索控件初始化到各个状态
     */
    func_search_init() {
        let _self:any = this;
        _self.$refs.ipt_search.blur();
        this.txt_search_keyword = this.$route.query.keyword || '';
        this.bool_search_searching = (this.bool_search_searching == undefined) || (this.$route.query.searching == 'true');
        if(!this.bool_search_searching){
            let keyword = this.txt_search_keyword_format;
            this.$props._func_search_submit(keyword);
        }
    }

    /**
     * 单项点击提交(热搜,历史,关键词等点击)
     */
    func_search_wordClick(e) {
        this.txt_search_keyword = e.target.innerText;
        this.func_search_submit();
    }

    /**
     * 输入框关键词格式化
     */
    get txt_search_keyword_format() {
        return this.txt_search_keyword.replace(/\s+/g, ' ').trim();
    }

    /**
     * 点击搜索框事件
     */
    func_search_iptClick() {
        !this.bool_search_searching &&
            (this.bool_search_searching = true);
    }

    /**
     * 搜索提交
     */
    func_search_submit() {
        let keyword = this.txt_search_keyword_format;
        if (keyword) {
            // hash --> '==' for undefined
            let hash = (this.$route.query.hash == '1' ? '0' : '1');
            let keyword = this.txt_search_keyword_format;
            let searching = 'false';
            let origin = this.func_search_getOrigin();
            let query = {
                keyword: keyword,
                searching: searching,
                origin: origin,
                hash: hash
            };
            let path: any = this.$route.path.split('/');
            path = path[path.length - 1];
            //第一次打开搜索 跳转记录url
            if (this.$route.query.search) {
                this.$router.replace({ path: path, query: query });
            } else {
                this.$router.push({ path: path, query: query });
            }
        }
        event.preventDefault();
    }

    /**
     * 搜索取消/提交
     */
    func_search_btnClick() {
        if (this.bool_search_searching) {
            //提交
            this.func_search_submit();
        } else {
            //取消
            let origin = this.func_search_getOrigin();
            this.$router.push({ path: origin });
        }
    }

    /**
     * 得到搜索框的上一页path
     */
    func_search_getOrigin() {
        let origin = this.$route.query.origin;
        if (!origin) {
            let path = this.$route.path;
            //管理端 or 前端
            if (path.indexOf('#') != -1) {
                origin = 'cms';
            } else {
                origin = 'home';
            }
        }
        return origin;
    }

    /**
     * 清空搜索关键词
     */
    func_search_clear() {
        this.txt_search_keyword = '';
    }
}