const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const baseConfig = require('./webpack.base');
const variable = require('./utils/wputils');

const { DIST_PATH, getCDNPath } = variable;
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const config = {
  mode: 'production',
  output: {
    path: DIST_PATH,
    publicPath: getCDNPath,
    filename: 'js/[name].[contenthash:8].bundle.js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['postcss-preset-env']],
              },
            },
          },
          'less-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin(), new HtmlMinimizerPlugin()],
    splitChunks: {
      chunks: 'all', // 匹配的块的类型：initial（初始块），async（按需加载的异步块），all（所有块）
      automaticNameDelimiter: '-',
      cacheGroups: {
        // 项目第三方组件
        vendor: {
          name: 'vendors',
          enforce: true, // ignore splitChunks.minSize, splitChunks.minChunks, splitChunks.maxAsyncRequests and splitChunks.maxInitialRequests
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
        },
        // 项目公共组件
        default: {
          minSize: 0, // 分离后的最小块文件大小默认3000
          name: 'common', // 用以控制分离后代码块的命名
          minChunks: 3, // 最小共用次数
          priority: 10, // 优先级，多个分组冲突时决定把代码放在哪块
          reuseExistingChunk: true,
        },
      },
    },
  },
};
const mergedConfig = webpackMerge.merge(baseConfig, config);
module.exports = mergedConfig;
