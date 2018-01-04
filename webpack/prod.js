const merge = require('webpack-merge');
const common = require('./common.js');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
  devtool: false,
  plugins: [
    new UglifyJSPlugin(),
	new webpack.optimize.UglifyJsPlugin({
	compress: {
		warnings: false
	  }
	}),
    new webpack.DefinePlugin({
      comments: false,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
})
