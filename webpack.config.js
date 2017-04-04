const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './client/components/index.js',
  output: {
    path: path.resolve(__dirname, 'client/build'),
    filename: 'app.bundle.js',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
};

module.exports = config;
