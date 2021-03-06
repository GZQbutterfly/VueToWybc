// 实名认证
import { Component } from 'vue-property-decorator';
import { BaseVue } from '../../../../commons/base-vue/base.vue';
import { timeout } from '../../../../commons/common.env';
import service from './form.service';
import './form.scss';
@Component({
    template: require('./form.html')
})
export class RealNameForm extends BaseVue {
    // 表单校验
    formstate = {};

    userInfo = { idCard: '', realName: '' }
    upImg = '';
    footerStyle = { position: 'fixed', bottom: 0 };
    resizeFlag = false;
    private _$service;
    mounted() {
        this._$service = service(this.$store);
        this.$nextTick(() => {
            document.title = '实名认证';
            window.addEventListener('resize', this.resizeWin);
        });
    }
    resizeWin() {
        let _self: any = this;
        let _footerRef = _self.$refs.footerRef;
        let activeElement: any = document.activeElement;
        if (/input/i.test(activeElement.tagName)) {
            if (_self.resizeFlag) {
                _self.resizeFlag = false;
                _self.footerStyle = { position: 'fixed', bottom: 0 };
            } else {
                _self.resizeFlag = true;
                _self.footerStyle = { position: 'absolute', bottom: 'inherit' };
            }
        } else {
            _self.resizeFlag = false;
            _self.footerStyle = { position: 'fixed', bottom: 0 };
        }
    }
    /**
     * 选择需要上传的文件
     */
    selectFile() {
        let _fileBtn: any = this.$refs.fileBtn;
        _fileBtn.click();
        timeout(() => {
            this.resizeFlag = false;
            this.footerStyle = { position: 'fixed', bottom: 0 };
        }, 100);
    }
    changeFile(e) {
        let _self: any = this;
        let _target = e.target;
        let _file = _target.files[0];
        let freader = new FileReader();
        freader.readAsDataURL(_file);
        freader.onload = function (ev: any) {
            _self.upImg = ev.target.result;
            // console.log('图片上传。。。。')
        }
        _self.userInfo.file = _file;
    }
    removeFile() {
        let _self: any = this;
        _self.upImg = '';
        let _fileBtn: any = this.$refs.fileBtn;
        _fileBtn.files.clear();
    }

    submitInfo() {
        // console.log(this.formstate, this.userInfo);
        let _self = this;
        this._$service.queryRealName().then((res) => {
            if (res.data.state == 4) {
                let dialogObj = {
                    title: '实名提示',
                    content: '您已通过实名认证，不需要在提交认证申请！',
                    mainBtn: '我知道了',
                    type: 'info',
                    assistFn() { },
                    mainFn() {
                        _self.$router.push('cmsHome');
                    }
                };
                _self.$store.state.$dialog({ dialogObj });
                return;
            }
            let _userInfo: any = this.userInfo;
            let _formstate: any = this.formstate;
            if (_formstate.$invalid) {
                return;
            }
            if (!_userInfo.file) {
                let _self: any = this;
                let dialogObj = {
                    title: '上传提示',
                    content: '请上传手持身份证照片!',
                    mainBtn: '知道啦',
                    type: 'info',
                    assistFn() { },
                    mainFn() { }
                };
                _self.$store.state.$dialog({ dialogObj });
            } else {
                this._$service.save(this.userInfo).then((_result) => {
                    if (_result.errorCode) {
                        this.errorResult(_result.msg === 'null' ? '' : _result.msg);
                    } else {
                        this.successResult(_result);
                    }
                }).catch(() => {
                    this.errorResult();
                });
            }
        });
    }
    errorResult(msg?) {
        let _self: any = this;
        let dialogObj = {
            title: '提示',
            content: msg || '服务异常',
            assistBtn: '',
            mainBtn: '知道了',
            type: 'error',
            assistFn() { },
            mainFn() { }
        };
        _self.$store.state.$dialog({ dialogObj });
    }
    successResult(res) {
        let result: any = { 'data': res };
        this.$router.push({ path: 'realNameResult', query: { result: result } });
    }
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeWin);
    }
}