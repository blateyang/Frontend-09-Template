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
#### 1.1.3 
排版的准备工作：
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