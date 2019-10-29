const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './js/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                corejs: '3',
                useBuiltIns: 'entry',
              },
            ],
          ],
        },
      },
    ],
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? undefined : 'inline-source-map',
  devServer: {
    contentBase: './build',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Vessels',
    }),
    new CleanWebpackPlugin(),
  ],
};
