const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.BITFINEX_HOST || '127.0.0.1';
const PORT = process.env.BITFINEX_PORT || '8888';

const configuration = {

  devtool: 'eval',

  entry: {
    app: ['./src/index'],
  },

  output: {
    path: path.join(__dirname, '/build/'),
    filename: '[name].js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.css'],
    modules: [path.resolve(__dirname), 'node_modules'],
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      inject: 'body',
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],

  devServer: {
    contentBase: './build',
    noInfo: true,
    hot: false,
    inline: false,
    historyApiFallback: true,
    port: PORT,
    host: HOST,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
            plugins: ['transform-runtime', 'transform-class-properties', 'transform-es2015-spread',
              'transform-object-rest-spread'],
          },
        },
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};

module.exports = configuration;
