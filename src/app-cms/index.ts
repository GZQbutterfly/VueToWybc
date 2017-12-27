import '../static/lib/weui/weui.min.css';


import '../commons/scss/icon.scss';

import './index.scss';
import './main.ts';



(function (doc, win) {
    var winWidth = win.innerWidth;
    var $htmlFontSize = 100 * winWidth / 375;
    doc.documentElement.style.fontSize = $htmlFontSize + 'px';
})(document, window);

