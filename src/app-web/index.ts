import '../static/lib/weui/weui.min.css';


import '../commons/scss/icon.scss';

import './index.scss';
import './main.ts';



(function (doc, win) {
    var winWidth = win.innerWidth;
    var $htmlFontSize = 100 * winWidth / 375;
    doc.documentElement.style.fontSize = $htmlFontSize + 'px';
})(document, window);


// document.body.ontouchmove = function(event){
//     event.preventDefault()
// }
// document.body.ontouchstart = function(event){
//     event.preventDefault()
// }

// 
// var overscroll = function (el) {
//     el.addEventListener('touchstart', function () {
//         var top = el.scrollTop,
//             totalScroll = el.scrollHeight,
//             currentScroll = top + el.offsetHeight;
//         //If we're at the top or the bottom of the containers
//         //scroll, push up or down one pixel.
//         //
//         //this prevents the scroll from "passing through" to
//         //the body.
//         if (top === 0) {
//             el.scrollTop = 1;
//         } else if (currentScroll === totalScroll) {
//             el.scrollTop = top - 1;
//         }
//     })
//     el.addEventListener('touchmove', function (evt: any) {
//         //if the content is actually scrollable, i.e. the content is long enough
//         //that scrolling can occur
//         //console.debug(el.offsetHeight, el.scrollHeight)
//         if (el.offsetHeight < el.scrollHeight) {
//             evt._isScroller = true;
//         }
//     })
// }
// overscroll(document.querySelector('#app'));
// document.body.addEventListener('touchmove', function (evt: any) {
//     //In this case, the default behavior is scrolling the body, which
//     //would result in an overflow.  Since we don't want that, we preventDefault.
//     if (evt._isScroller) {
//         evt.preventDefault();
//     }
// });
