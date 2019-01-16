const path = require('path');
const webpack = require('webpack');

const
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
  webpackDevServerWaitpage = require('webpack-dev-server-waitpage'),
  CopyWebpackPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const node_modules = /[\\/]node_modules[\\/]/;
const PRODUCTION = mode === 'production';
const ANALYZE = process.env.ANALYZE;

module.exports = {
  mode,
  entry: './src/index.js',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath : "/",
    chunkFilename: "[name].[chunkhash].js",
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  devtool: ANALYZE ? 'source-map' : (PRODUCTION ? false : 'cheap-module-source-map'),
  /*optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: node_modules, // Create a vendor chunk with all the imported node_modules in it
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },*/
  devServer: {
    historyApiFallback: true,
    before: (app, server) => {

      // Be sure to pass the server argument from the arguments
      app.use(webpackDevServerWaitpage(server));

    }
  },
  resolve: {
    modules: [ path.resolve(__dirname, 'src'), 'node_modules' ]
  },
  plugins: [
    new webpack.BannerPlugin({ // Add copyright notice
      banner: (() => {
        const packageJson = require('./package.json');
        const author = (packageJson.author && packageJson.author.name) || packageJson.author;
        return `Copyright (c) ${(new Date()).getFullYear()} ${author}.  All Rights Reserved.`;
      })(),
      raw: false // wrap in a comment
    }),

    new MiniCssExtractPlugin({ // Minify and create one css file
      filename: "assets/style.[contenthash].css"
    }),

    new HtmlWebpackPlugin({ // Create index.html file
      cache: PRODUCTION,
      template: 'src/index.ejs',
    }),

    new CleanWebpackPlugin(['dist'], { // Cleanup before each build
      verbose: false,
      dry: !PRODUCTION
    }),

    new CopyWebpackPlugin([{ from: 'src/www', to: '' }]), // Copy root domain files

    new BundleAnalyzerPlugin({
      analyzerMode: ANALYZE ? 'static' : 'disabled',
      openAnalyzer: false
    }),
  ],
  module: {
    strictExportPresence: true,
    rules: [
      { test: /\.(c|le)ss$/,
        use: [
          PRODUCTION ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[local]__[hash:base64:5]',
            }
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: true,
              strictMath: true,
            }
          }
        ],
      },
      { test: /\.(ico|gif|png|jpe?g|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024, // 10KB
            name: '[path][name].[ext]',
            context: 'src'
          }
        }
      },
      { test: /\.js$/, exclude: node_modules,
        use: [
          'babel-loader',
          {
            loader: "eslint-loader",
            options: {
              formatter: require("eslint-friendly-formatter"),
              failOnWarning: PRODUCTION,
              failOnError: PRODUCTION,
              emitWarning: !PRODUCTION
            }
          }
        ]
      }
    ]
  },
};