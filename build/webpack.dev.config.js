// webpack开发环境配置
let webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    baseConfig = require('./webpack.base.config');


baseConfig.entry = {
    webapp: [path.join(__dirname, '../src/app-web/index.ts')],
    cmsapp: [path.join(__dirname, '../src/app-cms/index.ts')],
    'vue': ['vue', 'vue-class-component', 'lodash', path.join(__dirname, '../src/commons/assets/swiper')],
    'common.env': [path.join(__dirname, '../src/commons/common.env')],
    'areasData': [path.join(__dirname, '../src/commons/areas/AreasData')]
}

// 文件映射
baseConfig.devtool = 'source-map';

baseConfig.plugins.push(
    new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/app-cms/index.tpl.html'),
        filename: path.join(__dirname, '../dist/cms/index.html'),
        inject: 'body',
        favicon: path.join(__dirname, '../src/favicon.ico'),
        chunks: ['vue', 'common.env', 'areasData', 'cmsapp'],
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    }),
    new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/app-web/index.tpl.html'),
        inject: 'body',
        favicon: path.join(__dirname, '../src/favicon.ico'),
        chunks: ['vue', 'common.env', 'areasData', 'webapp'],
        minify: {
            removeComments: true,
            collapseWhitespace: false
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vue', 'common.env', 'areasData'],
        minChunks: Infinity
    }),
    new ExtractTextPlugin({
        filename: '[name].css',
        disable: false,
        allChunks: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    })
);


module.exports = baseConfig;
