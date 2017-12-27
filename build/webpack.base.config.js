// webpack基础配置
let webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');
// ==>
module.exports = {
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: 'vue-loader'
        }, {
            test: /\.ts$/,
            use: ['babel-loader','ts-loader']
        },
        {
            test: /\.(html|htm)$/,
            use: 'raw-loader'
        }, 
        {
            test: /\.(scss|css)$/,
            use: ExtractTextPlugin.extract({
                use: ['css-loader', 'postcss-loader', 'sass-loader'],
                fallback: 'style-loader'
            })
        }, 
        {
            test: /\.(png|svg|jpg|gif|eot|woff)$/,
            use: ['url-loader?limit=8192&name=static/images/build/[name].[hash:8].[ext]']
        }]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'vue$': path.resolve(__dirname,'../node_modules/vue/dist/vue.esm.js')
        }
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(__dirname, '../src/static'),
            to: path.join(__dirname, '../dist/static')
        }])
    ]
};
