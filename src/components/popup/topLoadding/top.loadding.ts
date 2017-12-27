// 进度条加载器
import { Component, Vue } from 'vue-property-decorator';
import { interval } from '../../../commons/common.env';

import './top.loadding.scss';

@Component({
    template: require('./top.loadding.html')
})
export class TopLoadding extends Vue {
    value = 0;
    timer;
    mounted() {
        this.timer = interval(() => {
            this.value += 5;
            if (this.value >= 100) {
                window.clearInterval(this.timer);
                this.$el.remove();
            }
        }, 100);
    }
    destroyed() {
        window.clearInterval(this.timer);
    }
}