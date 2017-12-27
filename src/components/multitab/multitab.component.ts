import Component from 'vue-class-component';
import Vue from 'vue';

require('./multitab.component.scss');

@Component({
    template: require('./multitab.component.html'),
    props: {
        tabs: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        },
        more: {
            type: String,
            default: '更多状态',
        },
        maxItem: {
            default: 4
        },
        custStyle: {
            type: Object,
            default: () => {
                return {
                    lineOnColor: '#7ecc44',
                    lineColor: '#ffffff',
                    itemColor: '#FFFFFF',
                    itemOnColor: '#FFFFFF'
                }
            }
        }
    }
})

export class MultiTab extends Vue {
    //上次选中的更多页签   杨一龙要求的 //2017年12月12日16:26:15
    perTabIndex:number = 0;
    
    tabIndex: number = 0;
    isMenuExpanded: boolean = false;
    data() {
        return {
            tabIndex: Number(this.$props.index)
        }
    }
    mounted(){
        if (this.$props.index>=this.$props.maxItem-1) {
            this.perTabIndex = this.$props.index;
        }
    }

    tabChange(i) {
        if (i>=this.$props.maxItem-1) {
            this.perTabIndex = i;
        }

        this.tabIndex = i;
        this.$emit('on-change', i);
        this.isMenuExpanded = false;
    }

    tabMoreText(){

         if(this.perTabIndex>=this.$props.maxItem-1){
            return this.$props.tabs[this.perTabIndex];
        }else {
            return this.$props.more;
        }
    }

    expandMenu() {
        this.isMenuExpanded = !this.isMenuExpanded;
    }

}