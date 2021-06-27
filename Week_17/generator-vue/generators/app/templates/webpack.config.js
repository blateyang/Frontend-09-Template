const webpack = require('webpack'); // 访问内置的插件
const VueLoaderPlugin  = require("vue-loader/lib/plugin")
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader', // 实现将vue文件转换成webpack能识别的js或json文件
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'], // css-loader要在后面，否则会报错
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(), // VueLoader插件
    new CopyPlugin({ // 拷贝插件
      patterns: [
        { from: "src/*.html", to: "[name].[ext]" },
      ],
    })
  ],
  mode: "development"
};