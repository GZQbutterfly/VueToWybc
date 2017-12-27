//退款相关的数据配置

let goodsStatusDatas = [{
    co: 0,
    na: '未收到货',
    ch: [
        {
            co: '1',
            na: '多买/买错/不想要'
        },
        {
            co: '2',
            na: '快递无记录'
        },
        {
            co: '3',
            na: '少货/空包裹'
        },
        {
            co: '4',
            na: '快递一直未送达'
        },
        {
            co: '5',
            na: '其他'
        }
    ]
}, {
    co: 1,
    na: '已收到货',
    ch: [
        {
            co: '11',
            na: '商品破损/少件'
        },
        {
            co: '12',
            na: '商品发错货'
        },
        {
            co: '13',
            na: '商品描述不符'
        },
        {
            co: '14',
            na: '拍错/多拍/不喜欢'
        },
        {
            co: '15',
            na: '自量问题'
        },
        {
            co: '16',
            na: '假货'
        },
        {
            co: '17',
            na: '其他'
        }
    ]
}];

let processTypeDatas = [{
    co:1,
    na: '退货退款'
}];

export {
    goodsStatusDatas,
    processTypeDatas
};