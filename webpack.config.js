const path = require('path');
const webpack = require('webpack');

const
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin,
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
  webpackDevServerWaitpage = require('webpack-dev-server-waitpage'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  TerserJSPlugin = require('terser-webpack-plugin'),
  OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
  StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin'),
  WorkboxPlugin = require('workbox-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const node_modules = /[\\/]node_modules[\\/]/;
const PRODUCTION = mode === 'production';
const ANALYZE = process.env.ANALYZE;

const outputPath = path.resolve(__dirname, PRODUCTION ? 'dist' : 'dist-dev');

module.exports = {
  mode,
  bail: PRODUCTION,
  entry: PRODUCTION ? './src/index.js' : ['react-hot-loader/patch', './src/index.js'],
  output: {
    filename: '[name]-[hash].js',
    path: outputPath,
    publicPath : "/",
    chunkFilename: "[name]-[chunkhash].js",
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  node: {
    Buffer: false,
    setImmediate: false,
  },
  devtool: ANALYZE ? 'source-map' : (PRODUCTION ? false : 'cheap-module-source-map'),
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      minSize: 30000,
      cacheGroups: {
        commons: {
          test: node_modules, // Create a vendor chunk with all the imported node_modules in it
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    before: (app, server) => {
      app.use(require('./api.mock'));
      // Be sure to pass the server argument from the arguments
      app.use(webpackDevServerWaitpage(server));
    },
  },
  resolve: {
    alias: PRODUCTION ? {} : {
      'react-dom': '@hot-loader/react-dom'
    },
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
      filename: 'assets/style-[contenthash].css',
      chunkFilename: 'assets/[name]-style-[contenthash].css',
    }),

    new HtmlWebpackPlugin({ // Create index.html file
      cache: PRODUCTION,
      template: 'src/index.ejs',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    PRODUCTION && new StyleExtHtmlWebpackPlugin(),

    PRODUCTION && new CleanWebpackPlugin(), // Cleanup before each build

    new CopyWebpackPlugin([{ from: 'public', to: '' }]), // Copy root domain files

    ANALYZE && new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false }),

    PRODUCTION && new WorkboxPlugin.GenerateSW({
      skipWaiting: true,
      exclude: [ /htaccess/, /robots\.txt/, /\.php$/ ]
    }),
  ].filter(Boolean),
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      { test: /\.(c|le)ss$/,
        use: [
          !PRODUCTION ? 'style-loader' : MiniCssExtractPlugin.loader, 
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true,
              modules: {
                localIdentName: PRODUCTION ? '[hash:base64:8]' : '[local]__[hash:base64:5]',
              },
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
      {
        test: /\.worker\.js$/,
        use: { 
          loader: 'worker-loader',
          options: { inline: true, fallback: false } 
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