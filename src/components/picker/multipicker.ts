let doc = document;

function $id(id) {
    return doc.getElementById(id);
}

function $class(name) {
    return doc.getElementsByClassName(name);
}

function loop(begin, length, fuc) {
    for (let i = begin; i < length; i++) {
        if (fuc(i)) break;
    }
}

function on(action, selector, callback) {
    doc.addEventListener(action, function (e) {
        if (selector === e.target.tagName.toLowerCase() || selector === e.target.className || selector === e.target.id) {
            callback(e);
        }
    })
}

export class Multipicker {
    constructor(config) {
        let _self: any = this;
        _self.input = config.input;
        _self.container = config.container;
        _self.noData = false;
        _self.textField = config.textField || 'value';
        _self.valueField = config.valueField || 'id';
        if (!config.jsonData.length) {
            config.jsonData.push({
                [_self.textField]: '没有数据',
                [_self.valueField]: '-1'
            });
            _self.noData = true;
        }
        _self.jsonData = config.jsonData || [];
        _self.success = config.success;
        _self.confirmText = config.confirmText || '完成';
        //_self.cancelText = config.cancelText || 'Cancel';
        _self.ulCount = 0; // 记录上一次的
        _self.ulIdx = 0;// ul下标计数器,前一次的计数器
        _self.ulDomArr = []; // ul的dom元素,【a】
        _self.idxArr = [];// 更新后的ul的下标 【a】
        _self.jsonArr = [];// 用来存储每个ul的li中显示的arr【a】
        _self.liHeight = 40;
        _self.maxHeight = [];// 每个ul的最大高度【a】
        _self.distance = []; // transition的移动位置【a】
        _self.start = {
            Y: 0,
            time: ''
        };
        _self.move = {
            Y: 0,
            speed: []
        };
        _self.end = {
            Y: 0,
            status: true
        };
        _self.resultArr = [];
        _self.count = 0;
        _self.deepIndex = 0;
        _self.initDomFuc();

        _self.initReady(0, _self.jsonData[0]);
        _self.initBinding();
    }

    generateArrData(targetArr) {
        let _self: any = this;
        let tempArr = [];
        loop(0, targetArr.length, function (i) {
            tempArr.push({
                [_self.textField]: targetArr[i][_self.textField],
                [_self.valueField]: targetArr[i][_self.valueField],
                ch: targetArr[i].ch
            });
        })
        return tempArr;
    }

    checkArrDeep(parent) { // 需要改变
        let _self: any = this;
        if ('child' in parent && parent.child.length > 0) {
            // 初始化jsonArr。每一个ul对应的数组并迭代
            _self.jsonArr.push(_self.generateArrData(parent.child));
            _self.checkArrDeep(parent.child[0]);
        }
        _self.idxArr.push(_self.ulIdx++);
    }

    insertLiArr(targetUl, arr) {
        let _self: any = this;
        let html = '';
        let nullObj = {
            [_self.textField]: '',
            [_self.valueField]: '-99',
            ch: []
        };
        arr.unshift(nullObj, nullObj);
        arr.push(nullObj, nullObj);
        loop(0, arr.length, function (i) {
            html += '<li data-id="' + arr[i][_self.valueField] + '">' + arr[i][_self.textField] + '</li>';
        })
        targetUl.innerHTML = html;
    }

    initDomFuc() {
        let _self: any = this;
        let html = '';
        html += `
      <div class="multi-picker-bg" id="multi-picker-bg-${_self.container}">
        <div class="multi-picker-container" id="multi-picker-container-${_self.container}">
          <div class="multi-picker-btn-box">
            <div class="multi-picker-btn" id="multi-picker-btn-cancel">
               <i class="wybc-icon wybc-icon-arrow-top" id="multi-picker-btn-top-${_self.container}"></i>
               <i class="wybc-icon wybc-icon-arrow-bottom ${_self.noData ? '' : 'active'}" id="multi-picker-btn-bottom-${_self.container}"></i>
            </div>
            <div class="multi-picker-btn" id="multi-picker-btn-save-${_self.container}">${_self.confirmText}</div>
          </div>
          <div class="multi-picker-content">
            <div class="multi-picker-up-shadow"></div>
            <div class="multi-picker-down-shadow"></div>
            <div class="multi-picker-line"></div>
          </div>
        </div>
      </div>`
        $id(_self.container).innerHTML = html;
        _self.jsonArr.push(_self.generateArrData(_self.jsonData));
    }

    initReady(idx, target) {
        let _self: any = this;
        _self.ulIdx = 0;
        _self.idxArr.length = idx;
        _self.jsonArr.length = idx + 1;
        _self.checkArrDeep(target) // 查看某【对象】的深度
        // 取到class='multi-picker-content',可以在里面插入ul
        let parentNode = $id('multi-picker-container-' + _self.container).children[1];
        let tempMax = _self.ulCount <= _self.idxArr.length ? _self.ulCount : _self.idxArr.length;
        loop(idx + 1, tempMax, function (i) {
            let $picker = $id('multi-picker-' + _self.container + '-' + i);
            _self.insertLiArr($picker, _self.jsonArr[i]);
            _self.distance[i] = 0;
            $picker.style.transform = 'translate3d(0, 0, 0)';
            $picker.style.webkitTransform = 'translate3d(0, 0, 0)';
        })

        if (_self.ulCount <= _self.idxArr.length) {
            // 如果不足,则插入ul,从0开始计数
            loop(_self.ulCount, _self.idxArr.length, function (i) {
                let newPickerDiv = document.createElement('div');
                newPickerDiv.setAttribute('class', 'multi-picker');
                newPickerDiv.innerHTML = '<ul id="multi-picker-' + _self.container + '-' + i + '"></ul>';
                parentNode.insertBefore(newPickerDiv, parentNode.children[parentNode.children.length - 3]);
                let tempDomUl = $id('multi-picker-' + _self.container + '-' + i);
                _self.ulDomArr.push(tempDomUl);
                _self.distance.push(0);
                // 插入li
                _self.insertLiArr(tempDomUl, _self.jsonArr[i]);
                // 绑定事件
                let tempArray = _self.jsonArr[i];
                tempDomUl.addEventListener('touchstart', function (event) {
                    _self.touch(event, _self, tempDomUl, tempArray, i);
                }, false);
                tempDomUl.addEventListener('touchmove', function (event) {
                    _self.touch(event, _self, tempDomUl, tempArray, i);
                }, false);
                tempDomUl.addEventListener('touchend', function (event) {
                    _self.deepIndex = i;
                    _self.touch(event, _self, tempDomUl, tempArray, i);
                }, false);
            })
        } else { // 当上一次的ulCount 比当前ul的总数来的大的时候要清除子dom
            for (let j = _self.ulCount - 1; j > _self.idxArr.length - 1; j--) {
                let oldPicker = $class('multi-picker')[j];
                oldPicker.parentNode.removeChild(oldPicker);
                _self.ulDomArr.pop();
                _self.distance.pop();
            }
        }
        // 统一重新设置宽度和ul的maxHeight
        _self.maxHeight.length = 0;
        _self.resultArr.length = 0;
        loop(0, _self.idxArr.length, function (i) {
            let _dom: any = $class('multi-picker')[i];
            _dom.style.width = 100 / _self.idxArr.length + '%';
            _self.maxHeight.push($id('multi-picker-' + _self.container + '-' + i).offsetHeight);
            let _liIndex = _self.distance[i] / _self.liHeight + 2;
            _self.resultArr.push({
                [_self.valueField]: _self.jsonArr[i][_liIndex][_self.valueField],
                [_self.textField]: _self.jsonArr[i][_liIndex][_self.textField],
                ch: _self.jsonArr[i][_liIndex].ch
            });
        });
        _self.ulCount = _self.idxArr.length;
    }

    initBinding() {
        let _self: any = this;
        let bg = $id('multi-picker-bg-' + _self.container);
        let container = $id('multi-picker-container-' + _self.container);
        let body = doc.body;
        on('touchstart', _self.input, function () {
            bg.classList.add('multi-picker-bg-up');
            container.classList.add('multi-picker-container-up');
            body.classList.add('multi-picker-locked');
        });
        on('touchstart', 'multi-picker-btn-save-' + _self.container, function () {
            if (_self.noData) {
                _self.success([]);
            } else {
                _self.success(_self.resultArr);
            }
            bg.classList.remove('multi-picker-bg-up');
            container.classList.remove('multi-picker-container-up');
            body.classList.remove('multi-picker-locked');
        });
        on('touchstart', 'multi-picker-bg-' + _self.container, function () {
            bg.classList.remove('multi-picker-bg-up');
            container.classList.remove('multi-picker-container-up');
            body.classList.remove('multi-picker-locked');
        });
        // on('touchstart', 'multi-picker-btn-cancel', function () {
        //     bg.classList.remove('multi-picker-bg-up');
        //     container.classList.remove('multi-picker-container-up');
        //     body.classList.remove('multi-picker-locked');
        // });
        if (_self.noData) {
            return;
        }
        let len = _self.jsonData.length - 1;
        on('touchstart', 'multi-picker-btn-top-' + _self.container, function (e) {
            let target = e.target;
            let classList = target.classList;
            if (_self.count) { // 下滑
                _self.count--;
                _self.btnToChange(container);
                target.parentElement.lastElementChild.classList.add('active');
                !_self.count && classList.remove('active');
            } else {
                classList.remove('active');
            }
        });
        on('touchstart', 'multi-picker-btn-bottom-' + _self.container, function (e) {
            let target = e.target;
            let classList = target.classList;
            if (_self.count < len) {//上滑
                _self.count++;
                _self.btnToChange(container);
                target.parentElement.firstElementChild.classList.add('active');
                _self.count == len && classList.remove('active');
            } else {
                classList.remove('active');
            }
        });
    }
    btnToChange(container) {
        let _self: any = this;
        let _ulDom = container.querySelector('ul');
        let value = _self.liHeight * _self.count;
        _ulDom.style.transform = 'translate3d(0,-' + value + 'px, 0)';
        _ulDom.style.webkitTransform = 'translate3d(0,-' + value + 'px, 0)';
        _self.distance[_self.deepIndex] = value;
        _self.checkRange(_self.deepIndex);
    }
    checkRange(idx) {
        let _self: any = this;
        let tempObj = _self.jsonData;
        let targetIdx = 0;
        loop(0, idx + 1, function (i) {
            targetIdx = _self.distance[i] / _self.liHeight;
            tempObj = i === 0 ? tempObj[targetIdx] : tempObj.child[targetIdx];
        });
        _self.count = targetIdx;
        _self.initReady(idx, tempObj);
    }

    initPosition(dis, max, idx) {
        let _self: any = this;
        dis = dis < 0 ? 0 : dis;
        dis = dis > max ? max : dis;
        let sub = dis % _self.liHeight;
        if (sub < _self.liHeight / 2) {
            _self.distance[idx] = dis - sub;
        } else {
            _self.distance[idx] = dis + (_self.liHeight - sub);
        }
        return _self;
    }

    initSpeed(arr, dir, max, idx) {
        let _self: any = this;
        let letiance = 0; // 求方差
        let sum = 0;
        let rate = 0;
        for (let i in arr) {
            sum += arr[i] - 0;
        }
        for (let j in arr) {
            letiance += (arr[j] - (sum / arr.length)) * (arr[j] - (sum / arr.length));
        }
        let result: any = (letiance / arr.length);
        if (result.toFixed(2) > 0.1) { // 如果方差的结果大于.1 用来控制速度变化幅度
            rate = max > _self.liHeight * 15 ? dir * 2 : 0 // 如果数组长度是大于15的才会有加速度出现
            _self.initPosition(_self.distance[idx] + rate, max - _self.liHeight * 5, idx);
            _self.move.speed[0] = 0.2
        } else {
            _self.initPosition(_self.distance[idx], max, idx);
            _self.move.speed[0] = _self.move.speed[0] > 0.2 ? 0.2 : _self.move.speed[0];
        }
    }

    touch(event, that, $picker, array, idx) {
        let _self: any = this;
        event = event || window.event;
        event.preventDefault();
        switch (event.type) {
            case 'touchstart':
                if (that.end.status) {
                    that.end.status = !that.end.status;
                    event.preventDefault();
                    that.move.speed = [];
                    that.start.Y = event.touches[0].clientY;
                    that.start.time = Date.now();
                }
                break;
            case 'touchend':
                that.end.Y = Math.abs(event.changedTouches[0].clientY);
                let tempDis = that.distance[idx] + (that.start.Y - that.end.Y);
                let temp = that.distance[idx];
                that.distance[idx] = tempDis < 0 ? 0 : (tempDis < that.maxHeight[idx] - _self.liHeight * 5 ? tempDis : that.maxHeight[idx] - _self.liHeight * 5);
                that.initSpeed(that.move.speed, that.start.Y - that.end.Y, that.maxHeight[idx], idx);
                $picker.style.transform = 'translate3d(0,-' + that.distance[idx] + 'px, 0)';
                $picker.style.webkitTransform = 'translate3d(0,-' + that.distance[idx] + 'px, 0)';
                $picker.style.transition = 'transform ' + that.move.speed[0] + 's ease-out';
                $picker.style.webkitTransition = '-webkit-transform ' + that.move.speed[0] + 's ease-out';
                // 设置后续ul
                if (temp !== that.distance[idx]) that.checkRange(idx)
                setTimeout(function () {
                    that.end.status = true
                }, that.move.speed[0] * 1000);
                break;
            case 'touchmove':
                event.preventDefault();
                that.move.Y = event.touches[0].clientY;
                let offset = that.start.Y - that.move.Y;
                if (that.distance[idx] === 0 && offset < 0) { // 如果滑动move在顶部
                    $picker.style.transform = 'translate3d(0,' + 1.5 * that.liHeight + 'px, 0)';
                    $picker.style.webkitTransform = 'translate3d(0,' + 1.5 * that.liHeight + 'px, 0)';
                    $picker.style.transition = 'transform 0.2s ease-out';
                    $picker.style.webkitTransition = '-webkit-transform 0.2s ease-out';
                } else {
                    $picker.style.transform = 'translate3d(0,-' + (offset + that.distance[idx]) + 'px, 0)';
                    $picker.style.webkitTransform = 'translate3d(0,-' + (offset + that.distance[idx]) + 'px, 0)';
                }
                let offsetabs: any = Math.abs(offset);
                if (offsetabs.toFixed(0) % 5 === 0) {
                    let time = Date.now();
                    that.move.speed.push((Math.abs(offset) / (time - that.start.time)).toFixed(2));
                }
                break;
        }
    }
}
