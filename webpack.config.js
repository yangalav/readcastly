var webpack = require('webpack');
var path = require('path');

var config = {
  entry: './client/components',
  output: {
    path: path.resolve(__dirname, 'client/build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};

module.exports = config;
