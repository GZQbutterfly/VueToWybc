import Vue from 'vue'
import { InfoComponent } from './info.componet';
import {merge} from 'lodash';



const Info = Vue.extend(InfoComponent);

const pool = [];

const getInstance = () => {
    if (pool.length > 0) {
        return pool.shift();
    }
    return new Info({
        el: document.createElement('div')
    })
};

const returnInstance = (instance) => {
    if (instance) pool.push(instance);
};

export default function (options = { callback: () => { } }) {
    const defaultOption = {
        content: '',
        duration: 2000,
        type: ''
    };

    let { content, duration, type } = defaultOption;

    if (typeof options === 'string') {
        content = options;
    } else {
        ({ content, duration, type } = merge(defaultOption, options));
    }

    const instance = getInstance();

    instance.content = content;
    instance.type = type;

    Vue.nextTick(() => {
        document.body.appendChild(instance.$el);
        instance.showIt = true;
        if (duration > 0) {
            setTimeout(() => {
                instance.showIt = false;
                setTimeout(() => {
                    'remove' in (<any>window).Element.prototype ? instance.$el.remove() : instance.$el.parentNode.removeChild(instance.$el);
                    returnInstance(instance);
                    options.callback && options.callback();
                }, 300)
            }, duration);
        }
    });
    return instance;
}
