// 构建本地服务器
let webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./build.js');

// config.entry.unshift(
//     'webpack-dev-server/client?http://qaservice.365bencao.cn/',
//     'webpack/hot/only-dev-server'
// );


// ==>
new WebpackDevServer(webpack(config), {
    contentBase: '../dist',
    publicPath: '/',
    hot: true,
    historyApiFallback: true,
    compress: true,
    quiet: false,
    noInfo: false,
    stats: {
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
    }
}).listen(8001, 'qaservice.365bencao.cn', function(err) {
    if (err) {
        console.error(err);
    } else {
        console.log('Listening at http://qaservice.365bencao.cn');
    }
});
