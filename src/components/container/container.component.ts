import { Component, Vue, Prop } from 'vue-property-decorator';
import { Scroller } from '../../commons/assets/scroller';
import { timeout, interval } from '../../commons/common.env';
import { debounce } from 'lodash';

const getContentRender = require('../../commons/assets/scroller/render.js');


import './container.component.scss';
@Component({
    template: require('./container.component.html')
})
export class ContainerComponent extends Vue {
    @Prop({ type: Number, default: 0 })
    width;
    @Prop({ type: Number, default: 0 })
    height;
    showContent = false;
    mounted() {
        this.$nextTick(() => {
            this.initContainer();
            this.showContent = true;
        });
    }
    initContainer() {
        let _self: any = this;
        let _$refs = _self.$refs;
        _self.container = _$refs.containerRef;
        if (_self.width) {
            _self.container.style.width = _self.width;
        }

        if (_self.height) {
            _self.container.style.height = _self.height;
        }

        _self.content = _$refs.contentRef;

        let render = getContentRender(_self.content);

        _self.scroller = new Scroller(render, {
            scrollingX: false,
            snapping: false,
            animating: true,
            animationDuration: true,
            bouncing: false
        });

        // setup scroller
        let rect = _self.container.getBoundingClientRect();
        _self.scroller.setPosition(rect.left + _self.container.clientLeft, rect.top + _self.container.clientTop);

        const getContentSize: any = () => {
            return {
                width: _self.content.offsetWidth,
                height: _self.content.offsetHeight
            }
        }
        //let { content_width, content_height } = getContentSize();

        let _contentSize = getContentSize();

        _self.getContentSize = getContentSize;

        _self.content_width = _contentSize.width;

        _self.content_height = _contentSize.height;

        // _self.resizeTimer = interval(() => {
        //    _self.reArea();
        // }, 10);


        // timeout(()=>{
        //     _self.reArea();
        // }, 1000);

        _self.debounceArea = debounce(_self.reArea, 500);

        window.addEventListener('resize', _self.debounceArea);

    }
    reArea() {
        let _self: any = this;
        let { width, height } = _self.getContentSize();
        if (width !== _self.content_width || height !== _self.content_height) {
            _self.content_width = width;
            _self.content_height = height;
            _self.resize();
        }
    }
    resize() {
        let _self: any = this;
        let container = _self.container;
        let content = _self.content;
        _self.scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight);
    }

    scrollTo(x, y, animate) {
        let _self: any = this;
        _self.scroller.scrollTo(x, y, animate);

    }

    scrollBy(x, y, animate) {
        let _self: any = this;
        _self.scroller.scrollBy(x, y, animate);
    }

    touchStart(e) {
        let _self: any = this;
        // Don't react if initial down happens on a form element
        if (e.target.tagName.match(/input|textarea|select/i)) {
            return;
        }
        _self.reArea();
        _self.scroller.doTouchStart(e.touches, e.timeStamp);
    }

    touchMove(e) {
        let _self: any = this;
        e.preventDefault();
        _self.scroller.doTouchMove(e.touches, e.timeStamp);
    }
    touchEnd(e) {
        let _self: any = this;
        _self.scroller.doTouchEnd(e.timeStamp);
    }
    beforeDestroy() {
        let _self: any = this;
        window.clearInterval(_self.resizeTimer);
        window.removeEventListener('resize', _self.debounceArea);
    }
}