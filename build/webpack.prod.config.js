// webpack生产环境配置
let webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    //UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    baseConfig = require('./webpack.base.config');

baseConfig.entry = {
    webapp: [path.join(__dirname, '../src/app-web/index.ts')],
    cmsapp: [path.join(__dirname, '../src/app-cms/index.ts')],
    'vue': ['vue', 'vue-class-component', 'lodash', path.join(__dirname, '../src/commons/assets/swiper')],
    'common.env': [path.join(__dirname, '../src/commons/common.env')],
    'areasData': [path.join(__dirname, '../src/commons/areas/AreasData')]
};


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
    new ExtractTextPlugin('[name].css'),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
    }),
    // new UglifyJSPlugin({
    //     test: /\.js$/i
    // }),
    new ParallelUglifyPlugin({
        cacheDir: '.cache/',
        uglifyJS: {
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vue', 'common.env', 'areasData'],
        minChunks: Infinity
    }),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    })
);

module.exports = baseConfig;
