var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                }
            }
        ],
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};