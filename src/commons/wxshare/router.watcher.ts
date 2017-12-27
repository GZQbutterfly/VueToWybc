
import config from './share.config';

import { wxshare } from './share';

export class WxShareWatcher {

    private _$router;
    custData: any = {};
    constructor(router) {
        this._$router = router;
        this._$router.afterEach(this.afterEach.bind(this));
    }

    afterEach(to, from) {
        let shareConfig: any = {};
        let fullPath = to.fullPath.toLowerCase();
        let name = to.name.toLowerCase();
        if (config.state.hideAllList[name]) {
            shareConfig = {
                hideAllItem: true,
            }
        }else if(config.state.shareConfig[name]){
            shareConfig = config.state.shareConfig[name]
        }else {
            shareConfig = config.state.shareConfig[fullPath];
        }
        wxshare(shareConfig, fullPath);
    }
}
