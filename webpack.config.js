const path = require("path");
const webpack = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HtmlWebpackPlugin = require("html-webpack-plugin"),
  webpackDevServerWaitpage = require("webpack-dev-server-waitpage"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  WorkboxPlugin = require("workbox-webpack-plugin"),
  ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin"),
  ESLintPlugin = require("eslint-webpack-plugin");

const node_modules = /[\\/]node_modules[\\/]/;
const PRODUCTION = process.env.NODE_ENV === "production";
const ANALYZE = process.env.ANALYZE;

const outputPath = path.resolve(__dirname, PRODUCTION ? "dist" : "dist-dev");

module.exports = {
  target: PRODUCTION ? "browserslist" : "web",
  bail: PRODUCTION,
  output: {
    filename: "[name]-[contenthash].js",
    path: outputPath,
    publicPath: "/",
    chunkFilename: "[name]-[chunkhash].js",
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")
  },
  devtool: ANALYZE ? "source-map" : PRODUCTION ? false : "cheap-module-source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: node_modules,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  devServer: {
    hot: true,
    port: 8080,
    compress: true,
    historyApiFallback: true,
    onBeforeSetupMiddleware: server => {
      server.app.use(require("./api.mock"));
      // Be sure to pass the server argument from the arguments
      server.app.use(webpackDevServerWaitpage(server, { theme: "material" }));
    }
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    symlinks: false,
    fallback: {
      vm: false
    }
  },
  plugins: [
    new webpack.BannerPlugin({
      // Add copyright notice
      banner: (() => {
        const packageJson = require("./package.json");
        const author = (packageJson.author && packageJson.author.name) || packageJson.author;
        return `Copyright (c) ${new Date().getFullYear()} ${author}.  All Rights Reserved.`;
      })(),
      entryOnly: true,
      exclude: /\.worker\.js$/,
      raw: false // wrap in a comment
    }),

    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      scriptLoading: "defer"
    }),

    PRODUCTION && new CleanWebpackPlugin(), // Cleanup before each build

    !PRODUCTION && new ReactRefreshWebpackPlugin(), // hot module replacement for React

    !PRODUCTION && webpackDevServerWaitpage.plugin(),

    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "." }]
    }),

    ANALYZE && new BundleAnalyzerPlugin({ analyzerMode: "static", openAnalyzer: false }),

    PRODUCTION &&
      new WorkboxPlugin.GenerateSW({
        skipWaiting: true,
        exclude: [/\.html$/, /htaccess/, /robots\.txt/, /\.php$/],
        runtimeCaching: [
          {
            urlPattern: ({ event }) => event.request.url === "/",
            handler: "NetworkFirst"
          }
        ]
      }),

    new ESLintPlugin({
      lintDirtyModulesOnly: !PRODUCTION,
      formatter: require("eslint-friendly-formatter"),
      failOnWarning: PRODUCTION,
      failOnError: PRODUCTION,
      emitWarning: !PRODUCTION
    })
  ].filter(Boolean),
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ico|gif|png|jpe?g|svg)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024, // 10KB
            name: "[path][name].[ext]",
            context: "src"
          }
        }
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: "worker-loader",
          options: { inline: "no-fallback" }
        }
      },
      {
        test: /\.js$/,
        exclude: node_modules,
        resolve: {
          fullySpecified: false
        },
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: !PRODUCTION
          }
        }
      }
    ]
  }
};
