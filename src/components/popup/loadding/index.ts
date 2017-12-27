import Vue from 'vue';
import { LoaddingComponent } from './loadding.component';
import { merge } from 'lodash';



const Loadding = Vue.extend(LoaddingComponent);

export default function (msg?) {

    const instance: any = new Loadding({
        el: document.createElement('div')
    });

    Vue.nextTick(() => {
        document.body.appendChild(instance.$el);
        instance.show = true;
        msg && (instance.msg = msg);
    });

    return {
        close() {
            instance.$el.remove();
        }
    }
}