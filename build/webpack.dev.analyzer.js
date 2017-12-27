let devConfig = require('./webpack.dev.config'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



devConfig.plugins.push(
    new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        reportFilename: 'report.dev.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.dev.json',
        statsOptions: null,
        logLevel: 'info'
    })
);

module.exports = devConfig;