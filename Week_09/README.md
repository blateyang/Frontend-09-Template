学习笔记
## 1 浏览器工作原理——解析HTML生成DOM树
### 1.1 HTML parser模块的文件拆分
1. 设计HTML parser模块的使用接口
2. 为便于文件管理，将parser模块拆分到其它文件中

### 1.2 用FSM实现HTML的分析
1. [HTML标准](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)中已经规定了HTML分析的各种状态，toy-browser只需要实现其中最基础的部分
2. 用FSM分析HTML的框架如下
```js
module.exports.parseHTML = function parseHTML(html) {
  let state = data
  for(let c of html) {
    state = state(c)
  }
  state = state(EOF) // 添加文件终结符，强制状态机结束
  return stack.pop()
}
```
### 1.3 解析标签
1. 总共有3种标签：开始标签、结束标签和自封闭标签
2. 解析HTML时的状态迁移画出图来比较直观（状态迁移图如下）
![解析HTML的状态迁移图](https://img-blog.csdnimg.cn/20210509180724103.jpg#pic_center)

### 1.4 创建元素
1. 在状态转移的过程中要加入业务逻辑
2. 在标签结束状态提交创建的标签token

### 1.5 处理属性
1. 属性分为单引号、双引号和无引号，需要较多状态处理
2. 处理属性的方式跟标签类似
3. 属性结束时把属性加到标签Token上

### 1.6 用Token构建DOM树
1. 根据标签构建DOM树的基本思想是使用栈（HTML的标签层层嵌套，符合栈先入后出的操作特点）
2. 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
3. 自封闭标签可视作入栈后立即出栈
4. 任何元素的父元素是它入栈前的栈顶

### 1.7 将文本节点加到DOM树
1. 文本字符需要合并为文本节点
2. 文本节点与自封闭标签处理类似

## 2 浏览器工作原理——CSS计算
### 2.1 收集CSS规则
1. 遇到style标签，把css规则保存起来(暂不考虑link标签中的样式表)
2. 为简化实现难度，使用node的css库中的CSS Parser来解析CSS规则
3. 注意css库分析CSS规则的格式

### 2.2 添加CSS计算调用
1. 当创建一个元素后，立即计算CSS（CSS设计的一条潜规则是CSS的所有选择器会尽量保证在startTag进入时判断是否匹配）
2. 理论上，当分析一个元素时，所有CSS规则已经收集完毕（为简化实现，html标签的内联样式暂不考虑）
3. 在真实浏览器中，可能遇到写在body中的style标签，需重新计算CSS，暂不考虑

### 2.3 获取父元素
1. 在computeCSS函数中，必须知道元素的所有父元素才能判断元素与规则是否匹配
2. 在解析HTML生成DOM树步骤中的stack，可以获取当前元素的所有父元素
3. 因为首先获取和处理的是“当前元素”，所以获得和计算父元素匹配的顺序是从内向外（div div #myid)

### 2.4 选择器与元素匹配
1. 选择器也要从当前元素向外排列
2. 复杂选择器拆成单个元素的选择器，用循环匹配父元素队列

### 2.5 计算选择器与元素匹配
1. 根据选择器的类型和元素属性，计算当前元素是否与规则匹配
2. 视频教程中仅实现了三种简单选择器（元素选择器、类选择器和id选择器），实际还有更复杂的复合选择器、复杂选择器等
3. 作业：跟上课程进度，实现复合选择器和支持空格的class选择器(使用正则)

### 2.6 生成computed属性
1. 对于元素匹配到的规则，为元素生成相应的计算属性

### 2.7 specificity的计算逻辑
specificity被译作优先级或特定度，用来确定多条CSS规则作用于同一元素时的覆盖顺序
1. CSS规则是根据specificity和后来优先规则覆盖
2. specificity用一个四元组(inline, id, class, tag)表示，越左边权重越高
3. 一个CSS规则的specificity根据包含的简单选择器相加而成
例如：
`div div #myId `的specificity: (0, 1, 0, 2)小于`.cls #myId`的specificity: (0, 1, 1, 0)
