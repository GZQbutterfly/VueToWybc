const QRCode = require('./qrcode.js');

/**
 * 定义logo图片
 */
QRCode.prototype.drawLogo = function (imgSrc) {
    if (imgSrc) {
        let _self: any = this;
        let width = _self._htOption.width;
        let height = _self._htOption.height;
        let x = width * 0.4;
        let y = height * 0.4;
        let lw = width * 0.2;
        let lh = height * 0.2;
        let ctx = _self._oDrawing._oContext;
        let img = new Image();
        img.crossOrigin = '*';//anonymous *
        img.src = imgSrc;
        img.onload = function (e) {   
            ctx.drawImage(img, x, y, lw, lh);
            // _self._oDrawing._elImage.style.display = 'none';
            // _self._oDrawing._elCanvas.style.display = 'block';
            _self._oDrawing._elImage.src = _self._oDrawing._elCanvas.toDataURL("image/png");
        }
    }
}
export { QRCode };