// 构建本地服务器
let webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./build.js');

config.entry.unshift(
    'webpack-dev-server/client?http://localhost:3047/',
    'webpack/hot/only-dev-server'
);

// ==>
new WebpackDevServer(webpack(config
), {
    contentBase: '../dist',
    publicPath: '/',
    hot: true,
    historyApiFallback: true,
    disableHostCheck: true,
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
}).listen(3047, 'localhost', function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Listening at http://localhost:3047');
    }
});
