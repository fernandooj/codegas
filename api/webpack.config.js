const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: slsw.lib.entries,
    target: 'node',
    externals: {
        'aws-sdk': 'commonjs aws-sdk'
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^canvas$/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^bufferutil$/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^utf-8-validate$/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^cloudflare:sockets$/
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^@cloudflare\//
        }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^pg-native$/

        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'assets/img',
                    to: 'assets/img'
                }
            ]
        })
    ],
    resolve: {
        extensions: ['.js', '.json']
    },
    output: {
        libraryTarget: 'commonjs2',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    optimization: {
        minimize: false,
        splitChunks: false
    }
};
