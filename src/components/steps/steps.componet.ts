import Component from 'vue-class-component';
import Vue from 'vue';
import './steps.component.scss';


@Component({
    props: {
        steps: {
            type: Array,
            default: () => ['', '', '']
        },
        value: {
            type: [String, Array],
            default: '0'
        }
    },
    computed: {
        lineWidth() {
            return this.steps.length > 3 ? { width: '5%' } : { width: '15%' }
        },
        processing() {
            return Number(this.value)
        }
    },
    template: require('./steps.component.html')
})
export class StepsComponent extends Vue {

}

// html 

// <div class="steps-view">
// <Step :steps="steps" :value="value"></Step>
// <div style="margin-top: 20px;">
//   <button class="weui-btn_primary weui-btn" type="button"  @click="nextStep">Next</button>
//   <button class="weui-btn_plain-default weui-btn" type="button"  @click="reset">Reset</button>
// </div>
// </div>


// js
// export default {
//     data () {
//       return {
//         steps: ['step-1', 'step-2', 'step-3'],
//         value: 0
//       }
//     },
//     methods: {
//       nextStep () {
//         this.value++
//       },
//       reset () {
//         this.value = 0
//       }
//     }
//   }