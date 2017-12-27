import { Component } from 'vue-property-decorator';
import { BaseVue } from '../../commons/base-vue/base.vue';
import { LoginComponent } from './login.component';

import './login.scss';
@Component({
    template: require('./login.html'),
    components: {
        'wybc-login': LoginComponent
    }
})
export class Login extends BaseVue {


    loginName = 'wybc';

    
    mounted() {

    }

}