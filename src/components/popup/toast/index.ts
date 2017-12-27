import Vue from 'vue'
import { ToastComponent } from './toast.component';
import { merge } from 'lodash';



const Toast = Vue.extend(ToastComponent);

export default function (opts: any) {

    const instance: any = new Toast({
        el: document.createElement('div')
    });

    instance.title = opts.title;
    instance.time = opts.time || 2000;
    instance.success = opts.success == null ? true : false;
    instance.mode = false;
    merge(instance, opts);
    Vue.nextTick(() => {
        document.body.appendChild(instance.$el);
        instance.show = true;
    });

    return {
        close() {
            instance.$el.remove();
        }
    }
}