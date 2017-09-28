const webpack = require('webpack');
const configuration = require('./webpack.config');

const productionConfiguration = Object.assign({}, configuration);
productionConfiguration.devtool = 'source-map';
productionConfiguration.plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
    },
  }),
].concat(configuration.plugins);

module.exports = productionConfiguration;
