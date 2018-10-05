const path = require('path');

module.exports = {
  entry: './js/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      // {
      //     test: /\.css$/,
      //     use: [ 'style-loader', 'css-loader' ],
      // },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'entry',
              },
            ],
          ],
        },
      },
    ],
  },
  mode: 'development',
  devtool: 'inline-source-map',
};
