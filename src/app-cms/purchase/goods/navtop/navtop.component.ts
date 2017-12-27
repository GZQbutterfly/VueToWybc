import Component from 'vue-class-component';
import Vue from 'vue';
import './navtop.component.scss';


@Component({
  template: require('./navtop.component.html')
})



export class NavTop extends Vue {
  goHome() {
    this.$router.push({
      path: 'cmsPurchaseType',
    });
  }
  goMine() {
    this.$router.push({
      path: 'cmsPurchaseUserinfo'
    });
  }
}

