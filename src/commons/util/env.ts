import AreasData from '../areas/AreasData';
import { set, merge, find, get, isEmpty } from 'lodash';
import { getLocalUserInfo } from './login';
import loadding from '../../components/popup/loadding';
import topLoadding from '../../components/popup/topLoadding';
import dialog from '../../components/popup/dialog';
import qs = require('qs');

import 'babel-polyfill';

// 序列化对象
export { qs };

let  wxAppid = 'wx676602d0ebcb0be1';

if ( location.origin.indexOf('xhjx.') != -1) {
    wxAppid = 'wx676602d0ebcb0be1';
}else if(location.origin.indexOf('qaservice.') != -1){
    wxAppid = 'wx6a032ad0cdca7a6b';
}else {
    wxAppid = 'wx6a032ad0cdca7a6b';
}
// 全局微信 wxAppid
export { wxAppid };

const aliAppid = process.env.NODE_ENV == 'development' ? 'ali6a032ad0cdca7a6b' : 'ali6a032ad0cdca7a6b';

// 全局支付宝 aliAppid
export { aliAppid };

// 区域数据
export { AreasData };


let hasOwn = {}.hasOwnProperty;
export {hasOwn};
/**
* 获取区域信息
* @param _item 
*/
export function getZoneData(_item) {
    let _result: any = {};
    let _param: any = {};
    if (_item.province) {
        _param.co = _item.province + '';
        let _res: any = find(AreasData, _param);
        if (_res) {
            _result.province = _res;
            _param.co = _item.city + '';
            _res = find(_res.ch, _param);
            if (_res) {
                _result.city = _res;
                _param.co = _item.district + '';
                _res = find(_res.ch, _param);
                if (_res) {
                    _result.district = _res;
                }
            }
        }
    }
    return _result;
}


let baseURL = 'http://qa.365bencao.cn/malls/';

if ( location.origin.indexOf('xhjx.') != -1) {
    baseURL = 'http://xhjxcms.365bencao.com/malls/';
}else if(location.origin.indexOf('qaservice.') != -1){
    baseURL = 'http://qa.365bencao.cn/malls/';
}else {
    baseURL = 'http://qa.365bencao.cn/malls/';
}


export { baseURL };

/**
 * axios请求设置
 * @param axios 
 */
export function axiosConfig(axios: any) {
    /* 
     *  1.超时处理
     *  2.post设置
     *  3.开发环境与正式环境的区别
     */
    axios.defaults.timeout = 5000;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    axios.defaults.baseURL = baseURL;
    //axios.defaults.transformRequest = (data)=>{ console.log('transformRequest', data); return data;};
    return Promise.resolve(true);
}

/**
 * timeout
 * @param fn 
 * @param time 
 */
export function timeout(fn, time?) {
    let timeFn: any = window.requestAnimationFrame || window.setTimeout;
    if (time) {
        return setTimeout(fn, time);
    } else {
        return timeFn(fn);
    }
}

/**
 * interval
 * @param fn 
 * @param time 
 */
export function interval(fn, time?) {
    let timeFn: any = window.setInterval;
    return timeFn(fn, time);
}


/**
 * 获取32位的UUID
 */
export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}



/**
 * 清空对象中 null, undefined
 * @param obj 
 */
export function cleanObject(obj) {
    for (let key in obj) {
        if (obj[key] === null) {
            delete obj[key];
        }
    }
}

/**
 * 匹配数组中的值
 * @param srouce 
 * @param macthArr 
 */
export function match(srouce: any = '', macthArr: Array<any>) {
    for (let i = 0, len = macthArr.length; i < len; i++) {
        if (macthArr[i] == srouce) {
            return true;
        }
        if (srouce.test && srouce.test(macthArr[i])) {
            return true;
        }
    }
    return false;
}

/**
 * 清除以app-dialog的弹窗
 */
export function closeDialog() {
    let doms = document.querySelectorAll('.app-dialog');
    let len = doms.length;
    if (len) {
        //console.log('发现弹窗,正在清除...');
        for (let i = 0; i < len; i++) {
            doms[i].remove();
        }
    }
}

/**
 * page暂未开放
 */
export function pageNotAccess() {
    let _self = this;
    let dialogObj = {
        title: '提示',
        content: '该功能暂未开放，敬请期待！',
        type: 'info',
        assistBtn: '',
        mainBtn: '确认',
        assistFn() {
        },
        mainFn() {
        }
    };
    dialog({ dialogObj });
}

/**
 * 
 * @param url   服务地址
 * @param data  请求参数
 * @param type  请求类型
 */
export function formHttp(url, data, type = 'POST') {
    let _loadding = loadding('请求中...');
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        let xhr = new XMLHttpRequest();
        let _user = getLocalUserInfo();
        formData.append('userId', _user.userId);
        formData.append('token', _user.token);
        for (let key in data) {
            hasOwn.call(data, key) && formData.append(key, data[key]);
        }
        xhr.onload = function (event) {
            let _currentTarget: any = event.currentTarget;
            let _response = _currentTarget.response;
            resolve(JSON.parse(_response));
            _loadding.close();
        }
        xhr.onerror = function (...args) {
            reject(...args);
            _loadding.close();
        }
        xhr.open("POST", baseURL + url, true);
        xhr.send(formData);
    });
}



try {
    window.localStorage.____TestIOReader = "reader";
} catch (_) {
    let dialogObj = {
        title: '提示',
        content: '本地储存写入错误，浏览器请关闭隐身模式浏览。',
        mainBtn: '知道啦',
        type: 'error',
        mainFn() { }
    };
    dialog({ dialogObj });
}

