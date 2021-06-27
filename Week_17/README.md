学习笔记
- [1 什么是工程化](#1-什么是工程化)
- [2 初始化与构建](#2-初始化与构建)
  - [2.1 初始化工具Yeoman](#21-初始化工具yeoman)
  - [2.2 利用yeoman创建脚手架的简单用法](#22-利用yeoman创建脚手架的简单用法)
    - [2.2.1 通过yeoman进行命令行交互](#221-通过yeoman进行命令行交互)
    - [2.2.2 通过yeoman进行HTML模板填充](#222-通过yeoman进行html模板填充)
    - [2.2.3 通过yeoman管理依赖](#223-通过yeoman管理依赖)
  - [2.3 利用yeoman搭建一个vue脚手架](#23-利用yeoman搭建一个vue脚手架)
    - [2.3.1 创建generator-vue项目](#231-创建generator-vue项目)
    - [2.3.2 配置webpack](#232-配置webpack)
    - [2.3.3 在template中添加index.html和main.js，并在index.js中将它们copy到src内](#233-在template中添加indexhtml和mainjs并在indexjs中将它们copy到src内)
  - [2.4 webpack基本知识](#24-webpack基本知识)
    - [2.4.1 webpack的设计初衷和基本理解](#241-webpack的设计初衷和基本理解)
    - [2.4.2 webpack安装使用的两种方式](#242-webpack安装使用的两种方式)
    - [2.4.3 webpack的基础概念](#243-webpack的基础概念)
  - [2.5 babel基本知识](#25-babel基本知识)
    - [2.5.1 babel的作用](#251-babel的作用)
    - [2.5.2 babel安装和使用](#252-babel安装和使用)
    - [2.5.3 在webpack中通过babel-loader使用babel](#253-在webpack中通过babel-loader使用babel)
# 1 什么是工程化
- 工具、流程、系统：从没有到有，从少到多
- 质量和效率：由低到高

# 2 初始化与构建
## 2.1 初始化工具Yeoman
Yeoman是社区流行的一个初始化工具，可以用来创建脚手架工具，相当于generator的generator

利用Yeoman创建generator的方法：
1. 利用`npm init`新建一个模块
2. 安装`yeoman-generator`包并全局安装yo命令
```
npm install yeoman-generator
npm install -g yo
```
3. 在index.js中参考Yeoman官网的例子编写一个Generator类
```js
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
  }
};

```
1. 修改package.json中的name（generator-模块名）和main路径(指向index.js的路径)
2. 利用`npm link`将本地的模块链接到标准全局模块中去
3. 最后执行`yo 模块名`启动脚手架

## 2.2 利用yeoman创建脚手架的简单用法
### 2.2.1 通过yeoman进行命令行交互
```js
  // 在Generator中增加prompting异步方法
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "confirm",
        name: "cool",
        message: "Would you like to enable the Cool feature?"
      },
      {
        type: "input",
        name: "title",
        message: "Your project title"
      }
    ]);

    this.log("app name", this.answers.name);
    this.log("cool feature", this.answers.cool);
  }
```
### 2.2.2 通过yeoman进行HTML模板填充
```js
  // 在Generator中增加writing方法并执行this.fs.copyTpl
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: this.answers.title } // user answer `title` used
    );
  }
```
### 2.2.3 通过yeoman管理依赖
更改package.json并执行npm install自动安装
```js
class extends Generator {
  writing() {
    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.npmInstall();
  }
};
```

## 2.3 利用yeoman搭建一个vue脚手架
### 2.3.1 创建generator-vue项目
按照2.1中介绍的步骤创建一个generator-vue项目，在package.json中加入vue依赖，注意package.json中的name（需要以generator-开头）和main路径要正确，入口文件index.js如下
```js
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      }
    ])
    this.log("app name", this.answers.name);
  }

  async initPackages() {
    const pkgJson = {
      "name": this.answers.name,
      "version": "1.0.0",
      "description": "",
      "main": "generators/app/index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "",
      "license": "ISC",
      "dependencies": {
        "yeoman-generator": "^4.11.0"
      },
    }
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall(["vue"], {"save-dev": false});
    this.npmInstall(["webpack", "vue-loader"],  {"save-dev": true})
  }
  
  copyFiles() {
    this.fs.copyTpl(
      this.templatePath('HelloVue.vue'),
      this.destinationPath('src/HelloVue.vue'),
      {}
    );
  }

};
```
### 2.3.2 配置webpack
在webpack配置文件中需要加上vue-loader,vue-stytle-loader,css-loader以及webpack的copy-plugin插件， 如下
```
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
```

### 2.3.3 在template中添加index.html和main.js，并在index.js中将它们copy到src内

## 2.4 webpack基本知识
### 2.4.1 webpack的设计初衷和基本理解
1. 设计初衷：webpack最初是为Node设计的打包工具，提供的能力是将node代码打包成浏览器可用的代码
2. 基本理解：webpack能够进行多文件合并，在合并过程中通过各种loader和plugin去控制合并的规则以及对文本进行一些转换

### 2.4.2 webpack安装使用的两种方式
1. 全局安装webpack-cli和webpack
2. 本地安装webpack-cli然后使用`npx webpack`命令执行webpack

### 2.4.3 webpack的基础概念
1. entry：用于设置入口文件
2. output：用于设置输出文件路径
3. loader：一种文件格式转换工具，用于将其它形式语言书写的文件转译成能被webpack识别的json或js格式，常见的loader有css-loader,vue-loader
4. plugin: 用于完成除Loader之外的其它功能，如打包优化、拷贝文件等

## 2.5 babel基本知识
### 2.5.1 babel的作用
将新版本的js文件转换成老版本的js文件，以便能够运行在老版本的浏览器中

### 2.5.2 babel安装和使用
需要全局安装@babel/core和@babel/cli两个库以及设定默认配置的@babel/preset-env，并在.babelrc文件中配置@babel/preset-env
```json
{
  "presets": ["@babel/preset-env"]
}
```
安装好后执行`babel filename.js`即可

### 2.5.3 在webpack中通过babel-loader使用babel
作用是能够在webpack打包过程中，自动利用babel对js文件进行处理
```js
rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [...]
          }
        }
      }
    ]
```


