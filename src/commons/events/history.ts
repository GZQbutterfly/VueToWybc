// History  Events
import { isString } from 'lodash';
import { isCMS, match } from '../common.env';
let _CMSFlag = isCMS();

/**
 * auth history back to page
 */
window.addEventListener('popstate', (event) => {
    // Browser back
    if (_CMSFlag) {
        CMSHistory();
    } else {
        WEBHistory();
    }
});

// ==> history back function
let webPath = {
    'order_detail': { noBacks: ['order_submitting'], to: 'user_order' },
    'user_order': { noBacks: ['order_submitting'], to: 'userinfo' },
    'wybcProtocol': { noBacks: ['login'], to: 'login' }, // 登录页面存在参数，默认将参数存入sessionStorage里
    '*': { noBacks: ['login', 'loginBack'], to: 'home' }
};

/**
 * web-app no hash
 */
function WEBHistory() {
    let toPathName = location.pathname.replace('/', '').split('?')[0];
    let formPathName = localStorage._activePathname.replace('/', ''); // this value in 'commons/auth/router' has set
    // console.log('to  route  name: ', toPathName);
    // console.log('form  route name: ', formPathName);
    parse(toPathName, formPathName, webPath);
}

let cmsPath = {
    'cmsStockOrder': { noBacks: ['cmsPurchaseSubmitOrder'], to: 'cmsPurchaseUserinfo' },
    'cmsPurchaseOrderDetail': { noBacks: ['cmsPurchaseSubmitOrder'], to: 'cmsPurchaseUserinfo' },
    'grade': { noBacks: ['gradeUp'], to: 'cmsHome' },
    'cmsHome': { noBacks: ['realNameForm'], to: 'cmsHome' },
    '*': { noBacks: ['login', 'loginBack'], to: 'cmsHome' }
};

/**
 * cms-app  has hash
 */
function CMSHistory() {
    let thisPathName = location.pathname.replace('/', '').split('?')[0];
    let thisHashPathName = location.hash.replace('#/', '').split('?')[0];
    let formPathName = localStorage._activePathname.replace('/', ''); // this value in 'commons/auth/router' has set
    let toPathName = thisHashPathName;
    if (match(thisPathName, cmsPath['*'].noBacks)) {
        toPathName = thisPathName;
    }
    parse(toPathName, formPathName, cmsPath);
}

// ==> util 
function parse(toPathName, formPathName, mapPath) {
    if (toPathName !== formPathName) {
        let _path = mapPath[formPathName];
        if (_path && match(toPathName, _path.noBacks)) {
            to(_path.to);
        } else {
            _path = mapPath['*'];
            if (match(toPathName, _path.noBacks)) {
                to(_path.to);
            }
        }
    }
}

function to(path) {
    let _targetPath = getPath(path);
    history.pushState(_targetPath, null, _targetPath);
}

function getContentPath() {
    if (_CMSFlag) {
        return location.origin + '/cms/#';
    } else {
        return location.origin;
    }
}

function getPath(toPath) {
    return getContentPath() + '/' + toPath.replace('/', '');
}