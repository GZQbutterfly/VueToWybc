// 服务权限监控
import { isNotLogin, loginDialog, toLogin, cleanObject, match, qs, cleanLocalUserInfo, getCacheLoginFlag, closeDialog, timeout, isQQBrowser, hasOwn } from '../common.env';
import { merge, indexOf, set, get } from 'lodash';



import serviceData from './service.data';

export class ServiceAuth {
    private _$vm;
    private _$store;
    private _$router;
    private _$state;
    private _$http;
    private _$user;
    private _QQBrowserFlag;
    constructor(_vm) {
        let _self = this;
        _self._$vm = _vm;
        _self._$store = _vm.$store;
        _self._$router = _vm.$router;
        _self._$state = _self._$store.state;
        _self._QQBrowserFlag = isQQBrowser();

        _self._$http = _self._$state.$http;
        // 添加请求拦截器
        _self._$http.interceptors.request.use(_self.requestBefore.bind(_self), function (error) {
            return Promise.reject(error);
        });
        // 添加响应拦截器
        _self._$http.interceptors.response.use(this.response.bind(_self), function (error) {
            return Promise.reject(error);
        });
    }
    requestBefore(config) {

        this._$user = this._$state.workVO.user;
        let _baseUrl = get(this._$http, 'defaults.baseURL');
        let _apiUrl = config.url.replace(_baseUrl, '');

        // 匹配需要校验的服务并添加userId 和 token
        if (match(_apiUrl, serviceData)) {
            // 在发送请求之前做些什么
            let _userData = {
                userId: get(this._$user, 'userId'),
                token: get(this._$user, 'token')
            };
            config.data = merge(config.data, _userData, true);
        }
        // 默认序列化参数  isNotSer = true 不使用序列化
        if (!config.isNotSer) {
            cleanObject(config.data);
            //console.log('_QQBrowserFlag: ', this._QQBrowserFlag);
            // if (this._QQBrowserFlag) {
            //     let _data = config.data;
            //     let formData = new FormData();
            //     for (let key in _data) {
            //         hasOwn.call(_data, key) && formData.append(key, _data[key]);
            //     }
            //     set(config, 'data', formData);
            // } else {
            //     set(config, 'data', qs.stringify(config.data));
            // }
            set(config, 'data', qs.stringify(config.data));
        }
        return config;
    }
    response(response) {

        let _self = this;
        // 对响应数据做点什么
        //errorCode:96, msg:"登录过期，请重新登录"
        let data = response.data;
        // 94=用户数据不存在 95=非法请求 96=非法token  119 
        if (match(data.errorCode, [96, 94, 119])) {
            if (getCacheLoginFlag()) {
                // 默认缓存本地登录的用户，缓存失效，直接跳转到登录首页
                cleanLocalUserInfo();
                toLogin(_self._$router, { toPath: _self._$vm.$route.name });
            } else {
                timeout(() => {
                    closeDialog();
                    loginDialog('登录过期，请重新登录').then((flag) => {
                        cleanLocalUserInfo();
                        flag && toLogin(_self._$router, { toPath: _self._$vm.$route.name });
                    });
                });
            }
        } else {

        }
        return response;
    }
    /**
     * 检查请求的url是否有需要用户信息
     * @param url 
     */
    checkSericePromise(url: string) {
        //let _urlReg = new RegExp();
        for (let i = 0, len = serviceData.length; i < len; i++) {
            if (url.indexOf(serviceData[i]) > -1) {
                return false;
            }
        }
        return true;
    }
}