const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const context = path.resolve(__dirname, '../');

module.exports = {
  context: context,
  entry: path.resolve(context, 'src/index.js'),
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: context
    }),
    new CopyWebpackPlugin([
      { from: 'assets/fonts/iconfont/*' }
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(context, 'src/templates/index.html'),
      favicon: path.resolve(context, 'src/templates/favicon.ico')
    })
  ],
  output: {
    path: path.resolve(context, 'dist'),
    publicPath: '/',
    filename: '[name].[hash:10].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        include: path.resolve(context, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-0'],
            plugins: [
              ['import', {
                libraryName: 'antd',
                style: true
              }],
              'transform-runtime'
            ]
          }
        }
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                '@icon-url': '"/assets/fonts/iconfont/iconfont"',
              },
            },
          },
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  }
}
