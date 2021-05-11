## 1 浏览器工作原理——排版生成带位置的DOM
### 1.1 根据浏览器属性进行排版
#### 1.1.1 css的几代布局演变
1. 传统布局
  - 正常流
  - float浮动
  - position定位
2. flex弹性布局
3. grid网格布局
#### 1.1.2 flex网格布局相关属性
- flex-direction: row(水平排布)
  - Main（排版时元素的延伸方向）: width, x, left, right
  - Cross: height, y, top, bottom
- flex-direction: column（垂直排布）
  - Main: height, y, top, bottom
  - Cross: width, x, left, right
使用主轴和交叉轴的概念对排版方向进行抽象，以便能够适应多种书写方式。
#### 1.1.3 排版的准备工作
1. 设定flex相关属性(flexDirection, justifyContent, alignContent, alignItems, flexWrap)的默认值
2. 根据flexDirection和flexWrap的值设定抽象的mainSize,mainStart,mainEnd,mainSign,mainBase等变量，方便后续代码的编写

### 1.2 收集元素进行
1. 根据主轴尺寸将元素排进行
2. 如果设置了nowrap属性，所有元素强行分配进第一行

### 1.3 计算主轴方向
1. 如果主轴的剩余空间小于0，将所有flex项的mainBase设为0，然后将剩余元素等比例缩小并确定位置
2. 如果主轴的剩余空间大于0, 循环处理每个flexLine
  1. 统计每个flexLine的所有flex项
  2. 如果flex项数量大于0，将所有flex项的mainBase按flex比例分配主轴剩余空间，依次确定主轴位置
  3. 否则根据justifyContent确定flexLine中各元素的位置

### 1.4 计算交叉轴方向
1. 根据一行中最大元素尺寸计算行高
2. 根据alignContent和各行行高确定各行的基准位置和间隔
3. 根据alignItems确定行内元素具体位置

## 2 浏览器工作原理——渲染
### 2.1 绘制单个元素
1. 绘制需要依赖一个图形环境，课程采用npm的images库
2. 绘制在一个viewport上进行
3. 与绘制相关的属性，background-color,border,background-image等

### 2.2 绘制dom树
1. 递归调用子元素的绘制方法即可完成整个dom树的绘制
2. 实际浏览器中，文字绘制是难点，需要依赖字体库，课程中忽略
3. 实际浏览器中，还会对一些图层做compositing，课程中也予以忽略

## 3 最终渲染结果
利用我们编写的toy-browser程序，下面html文档的最终渲染结果为
![toy-browser渲染结果](https://img-blog.csdnimg.cn/20210511222653526.jpg)
```html
<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="./foo.js"></script>
          <title>Document</title>
          <style>
            body {
              background-color: black;
            }
            .container {
              width: 500px;
              height: 300px;
              display: flex;
              background-color: rgb(255, 255, 255);
              align-items: center;
            }
            .pText {
              width: 200px;
            }
            p.text {
              display: none;
            }
            p.text#name {
              font-size: 20px;
              color: red;
              background-color: blue;
            }
            body div #myImg {
              flex: 1;
              height: 200px;
              background-color: rgb(255, 0, 0);
            }
            body div #hisImg2 {
              flex: 2;
              height: 300px;
              background-color: rgb(0, 255, 0);
            }
         /*   .classImg {
              margin: 10px;
            }
            .myClass {
              border: 2px;
            } */
          </style>
        </head>
        <body>
          <div class="container">
            <div class="pText">
              <p class="text">Hello world</p>
              <p class="text" id="name">My name is blateyang</p>
            </div>
            <div id="myImg" class="classImg  myClass"></div>
            <div id="hisImg2" class="classImg  myClass"></div>
          </div>
        </body>
      </html>
```

## 4 toy-browser总结
通过三周的学习和实践，我们对浏览器的工作原理有了较为清晰深入地认识。知道了如何利用有限状态机对HTML文档进行词法和语法分析将其转换成一颗DOM树，CSS规则又是在何时被添加到DOM节点中以及如何与节点进行匹配的，如何根据flex属性对DOM节点进行弹性布局生成带位置信息的DOM树，如何将带位置信息和样式信息的DOM树渲染成网页位图。当然上述流程是对浏览器工作流程的一个简化，实际的浏览器工作流程还包括在发送请求时对请求的分析处理（是否跨域、是否发送预检请求）、生成网页位图后因执行js代码引发的重绘和回流等其它工作，布局排版的实现也仅仅是实现了基本的flex布局，还有很多可以扩展完善的地方，比如在flex布局中增加对margin、padding、border等属性的支持。本文的主要目的是通过实现一个简易的toy-browser，加深对浏览器工作原理的认识和理解，有兴趣的朋友可以在此基础上继续完善。

## 5 第三次答疑问题
1. 解析HTML时afterQuotedAttributeValue状态函数的最后一个判断分支为什么是回到doubleQuotedAttributeValue状态
```js
function afterQuotedAttributeValue(c) {
  if(c.match(/[\t\n\f ]/)) {
    return beforeAttributeName
  }else if(c == '/') {
    return selfClosingStartTag
  }else if(c == '>') {
    // 下面的currentAttribute.name可能是在跳转到beforeAttributeName后转移过来的，不能省略
    currentToken[currentAttribute.name] = currentAttribute.value 
    emit(currentToken)
    return data
  }else if(c == EOF) {
    // 非法
  }else{
    currentAttribute.value += c
    // 此处针对的是属性值“后立即跟一个普通字符的情况，这时认为属性值还未结束（为何不回到singleQuotedAttributeValue状态）
    return doubleQuotedAttributeValue 
  }
}
```

2. flex布局的实现中如果flex item中含有img元素，从浏览器的真实渲染结果看其设置的flex值并未生效，是为什么？