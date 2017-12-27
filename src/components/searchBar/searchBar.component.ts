import Vue from 'vue';
import Component from 'vue-class-component';

import './serchBar.component.scss';

@Component({
    template: require('./searchBar.component.html'),
    props: {
        placeholder: {
            type: String,
            default:'輸入搜索內容',
            required: false
        },

        searchText: {
            type: String,
            default:'搜索',
            required: false
        },
    }
})

export class SearchBar extends Vue {

    value:string = '';

    data() {
        return {
            isFocusing: false
        };
    }

    mounted(){
        this.value = this.$props.value;
    }

    clearInput() {
        this.value = '';
    }

    //搜索
    searchBegin(event) {
        this.submit(event);
    }

    submit(event) {
        event.preventDefault();
        this.$emit('search', this.value);
        console.log('search submit');
    }
}