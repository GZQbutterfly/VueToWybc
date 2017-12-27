import Vue from 'vue';

import { TopLoadding } from './top.loadding';

const Loadding = Vue.extend(TopLoadding);

export default () => {
    const instance: any = new Loadding({
        el: document.createElement('div')
    });

    Vue.nextTick(() => {
        document.body.appendChild(instance.$el);
    });

    return {
        close() {
            instance.$el.remove();
        }
    }
}