const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require("webpack");
const fs = require("fs");

module.exports = {
  mode: 'production',
  optimization: {minimize: false},
  devtool: "source-map",
  entry: './src/index.js',
  module: {rules: [
    {
      test: /\.(woff|woff2|eot|ttf|otf|ico|png)$/,
      use: ['file-loader'],
    }
  ]},
  output: {
    filename: 'index.[contenthash].js',
    path: path.resolve(__dirname, 'docs')
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html', 
    }),
  ]
};
