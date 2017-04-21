const webpack = require('webpack');
const path = require('path');

const config = {
  entry: '/client/index.jsx',
  output: {
    path: path.join(__dirname, 'client/build'),
    filename: 'app.bundle.js',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
  watch: true
};

module.exports = config;
