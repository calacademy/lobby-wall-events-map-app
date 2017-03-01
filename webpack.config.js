const NODE_ENV = process.env.NODE_ENV;
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

require('dotenv').config();

module.exports = {
  devtool: NODE_ENV === 'production' ? 'cheap-module-source-map' : 'eval',
  entry: {
    app: './src/js/index.jsx'
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: 'js/[name].js?nocache=02282017',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css!sass',
          {
            publicPath: '../'
          }
        )
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        loader: 'file-loader?name=img/[name].[ext]'
      }
    ],
 },
 plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(NODE_ENV),
        'EVENTS_API_URL': NODE_ENV === 'production' ?
          JSON.stringify(process.env.EVENTS_API_URL_PROD) :
          JSON.stringify(process.env.EVENTS_API_URL_DEV),
        'EVENTS_API_DATATYPE': NODE_ENV === 'production' ?
          JSON.stringify('jsonp') :
          JSON.stringify('json'),
      }
    }),
    new ExtractTextPlugin('css/style.css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    })
  ]
};
