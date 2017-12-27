let prodConfig = require('./webpack.prod.config'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;




prodConfig.plugins.push(
    new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.prod.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.prod.json',
        statsOptions: null,
        logLevel: 'info'
    })
);

module.exports = prodConfig;