const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: path.join(__dirname, './build/'),
    filename: './js/script.js',
    publicPath: '/'
  },
  devServer: {
    index: 'index.html',
    contentBase: path.resolve(__dirname, './build/'),
    publicPath: '/',
    port: 8000,
    host: 'localhost',
    historyApiFallback: {
      index: 'index.html'
    },
    open: true,
    watchContentBase: true,
    disableHostCheck: true,
    setup(app) {
      app.post('*', (req, res) => {
        res.redirect(req.originalUrl)
      })
    }
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-env']
            }
          },
          'eslint-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/style.css'
    })
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true
          }
        }
      }),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 5,
          safari10: true,
          ie8: true,
          output: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
