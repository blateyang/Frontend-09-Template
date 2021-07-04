const webpack = require('webpack'); // 访问内置的插件
const {VueLoaderPlugin}  = require("vue-loader") // 注意用原来的const VueLoaderPlugin = require("vue-loader/bin/plugin")会报找不到module的错
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
      },
      {
        test: /\.js$/,
        use: [
            {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            },
          }
        ]
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