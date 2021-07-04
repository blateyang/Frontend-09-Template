学习笔记
## 1 单元测试工具Mocha
### 1.1 单元测试的适用场景
1. 可能会被很多人使用的开源项目
2. 复用度比较高的商业项目
3. 其它需要保证已有功能正确不受影响的复杂大型项目
  
### 1.2 前端两大单测工具
- Mocha
- Jtest

### 1.3 Mocha的安装和简单使用
1. 安装
  - 全局安装： `npm install -g mocha`
  - 项目安装： `npm install --save-dev mocha`
2. 简单使用
add.js
```js
function add(a, b) {
  return a+b
}

module.exports = add
```
test.js
```js
let add = require("./add")
var assert = require('assert');

describe('test add function', function() {
    it('1 + 2 should return 3', function() {
      assert.equal(add(1, 2), 3);
    });
});
```
最后在test.js目录下执行mocha即可运行单元测试

3. 在2中引入和导出模块使用的是node的require/exports，如果想改成import/export语法，需要借助babel
- 本地安装mocha
- 本地安装@babel/core,@babel/preset-env,@babel-register
- 配置.babelrc的presets
```json
{
  "presets": ["@babel/preset-env"],
}
```
- 在package.json中的test字段添加运行mocha的脚本`mocha --require @babel/register`
- 最后执行`npm run test`即可

### 1.4 单元测试的核心概念code coverage

code coverage是用来检测编写的单元测试用例是否完整覆盖了项目代码，可以使用[nyc插件](https://www.npmjs.com/package/nyc)。
单测应达到的目标：函数覆盖率100%，行覆盖率>90%

将nyc应用于使用了babel的mocha项目的方法：
- 本地安装nyc`npm i --save-dev nyc`
- 安装两个插件：`npm i --save-dev babel-plugin-istanbul @istanbuljs/nyc-config-babel `
- 在.babelrc中添加`"plugins": ["istanbul"]`然后在.nycrc配置文件中添加如下配置
```json
{
    "extends": "@istanbuljs/nyc-config-babel"
}
```
- 在package.json中的test字段添加coverage的脚本`"coverage": "nyc mocha"`
- 最后执行`npm run coverage`命令即可
  
code covrage测试结果示例
-----------|---------|----------|---------|---------|-------------------------------------------------------------------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------|---------|----------|---------|---------|-------------------------------------------------------------------------------
All files  |   90.43 |    82.04 |     100 |   90.29 |                                                                              
 parser.js |   90.43 |    82.04 |     100 |   90.29 | 25,80,105,170-171,227,237,249,260,265,271,273,293,297,316,356,362-365,373,392
-----------|---------|----------|---------|---------|-------------------------------------------------------------------------------

## 2 实例：对parseHTML函数进行单元测试
几点注意：
1. 需要在调试的配置文件launch.json中加入两个额外的配置
```json
      "runtimeArgs": ["--require", "@babel/register"],
      "sourceMaps": true, // 开启源映射，以便调试的时候能够映射到真实的代码而非babel转译的代码
```
并在.babelrc中加入配置`"sourceMaps": "inline" /*不会产生额外的输出文件*/`
2. launch.json中的program配置要指定到`node_modules/bin/mocha`目录

## 3 将单测集成到工具链中