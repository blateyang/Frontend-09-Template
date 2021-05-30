学习笔记
## 1  重学HTML
### 1.1 HTML定义：XML和SGML
HTML来源于SGML(Standard General Marked Language)和XML，三者的出现时间顺序依次是SGML,XML,HTML。XML是SGML的子集，HTML早期也是HTML的子集，通过SGML的DTD进行定义。后面W3C试图对HTML进行XML化，又出现了XHTML（基于XML的HTML），但是在发展到XHTML2是由于过于严苛的约束不被社区接受而停止。而HTML随着H5的出现走出了一条独立发展的路。
#### 1.1.1 DTD中的文本实体
文本实体用`&#一串数字;`或者`&符号名;`书写，代表网页中一些特殊的字符，如`&#160;`或`&nbsp;`表示nbsp（no-break space)。以前人们常用nbsp显示多个空格，但因为这个空格在语义上是不会将单词分隔开，因此不建议使用，可以通过css的white-space属性去让多个空格显示出来。
- 四个必须要记住的文本实体
  1. `&quot;`：引号，在HTML标签的属性值中可用来表示引号
  ```html
  <div id="myDiv&quot;a&quot;">a</div> <!--<div id="myDiv"a"">a</div>-->
  ```
  2. `&amp;`：显示&，对&符号进行转义
  3. `&lt;`：显示<
  4. `&gt;`：显示>
#### 1.1.2 HTML的命名空间
1. xhtml namespace: [https://www.w3.org/1999/xhtml](https://www.w3.org/1999/xhtml)
2. SVG namespace
3. MathML namespace
### 1.2 HTML标签语义
1. 常见的一些语义标签
- header
- main
  - article
  - section
- aside
- footer
2. em和strong标签的区别
  - em表现为斜体，用来加强语气
  - strong表现为加粗，用来强调内容的重点
### 1.3 HTML语法
合法元素
- Element: <tagname>...</tagname>
- Text: text
- Comment: <!-- comments -->
- DocumentType: <!DOCTYPE html>
- ProcessingInstruction: <?a 1?>
- CDATA:<![CDATA[]]>,[]括号里面也是文本，只是不需要考虑转义

## 2 浏览器API
### 2.1 DOM API
DOM API是对HTML文档的一个抽象化对象描述
1. 四部分：
- Node部分
  - Element: 元素型节点，跟标签相对应
    - HTMLElement
      - HTMLAnchorElement
      - HTMLAreaElement
      - HTMLBodyElement
      - ...
    - SVGElement
      - SVGAElement
      - ...
  - Document：文档根节点
  - CharacterData：字符数据
    - Text：文本节点
      - CDATASection:CDATA节点
    - Comment：注释节点
    - ProcessingInstruction：预处理信息
  - DocumentFragment：文档片段
  - DocumentType：文档类型
- 事件部分
- Range部分：相比节点部分，能更精确的操作DOM，但相对复杂
- traversal类：用于遍历DOM节点，不常用

2. 节点操作
- 查找Node
  - parentNode
  - childNodes
  - firstChild
  - lastChild
  - nextSibling
  - previousSibling
- 查找Element
  - parentElement:与parentNode代表的是同一个节点（有子节点的一定是Element节点）
  - children
  - firstElementChild
  - lastElementChild
  - nextElementSibling
  - previousElementSibling
- 修改操作
  - appendChild
  - insertBefore
  - removeChild
  - replaceChild

ps: 为何没有insertAfter？（最小化设计原则，insertAfter可以由appendChild和insertBefore实现）

- 高级操作
  - `compareDocumentPosition`：比较两个节点关系
  - `contains`：检查一个节点中是否包含另一个节点
  - `isEqualNode`：检查两个节点是否完全相等（类型、属性、[定义特征](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/isEqualNode)）
  - `cloneNode`：复制一个节点，如果传入true参数，则会连同子元素进行深拷贝

### 2.3 事件API
1. addEventListener
用法：
- EventTarget.addEventListener(event, handler[, useCapture])：useCapture表示是否在浏览器捕获阶段监听，默认为false
- EventTarget.addEventListener(event, handler[, options])：options为配置json对象，有三个bool参数可设置，capture、once、passive，默认都是false。参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)，关于passive的作用如看不懂MDN可参考[CSDN](https://blog.csdn.net/hhlljj0828/article/details/79497734)

2. 浏览器的事件机制
先由外向内捕获（定位触发的节点）再由内向外冒泡（进行呈现）
```html
  <div id="a" style="width: 100px; height: 100px; background-color: red;">
    <div id="b" style="width: 50px; height: 50px; background-color: green;"></div>
  </div>
```
```js
    var a = document.getElementById("a")
    var b = document.getElementById("b")
    a.addEventListener("click", ()=>{console.log("a")})
    b.addEventListener("click", ()=>{console.log("b")})
    a.addEventListener("click", ()=>{console.log("a1")}, true)
    b.addEventListener("click", ()=>{console.log("b1")}, true) // 点击b区域会依次打印a1,b1,b,a
```

### 2.4 Range API
Range API适合用在需要对DOM树进行精细或批量操作的场景，功能非常强大，但也相对要复杂一些
1. 选取Range操作
- var range = new Range()
- range.setStart(element, offset)
- range.setEnd(element, offset)
- var range = document.getSelection().getRangeAt(0):获取鼠标选区的range
- range.setStartBefore(element)
- range.setStartAfter(element)
- range.setEndBefore(element)
- range.setEndAfter(element)
- range.selectNode(element)
- range.selectNodeContents(element)
2. 增删操作
- range.insertNode(document.createTextNode("xxx"))
- var fragment = range.extractContents(): 将range中的DOM取出得到fragment,fragment相当于内存中的虚拟DOM
3. 
面试题：对一个元素的所有子元素逆序
```html
<body>
  <div id="a">
    <div>1</div>
    <p>2</p>
    <p>3</p>
    <span>4</span>
  </div>
</body>
```
- 初级解法：利用DOM API的appendChild，需要操作5次，引起5次重绘和重排
```js
let element = document.getElementById("c")
let children = [].slice.call(element.children) // 将子节点转换成数组便于操作
children.reverse()
element.innerHTML = "" 
for(let child of children) {
  element.appendChild(child)
}
```
- 中级解法：利用DOM节点的living content特性（搬移节点会自动更新显示）就地操作，会引起3次重绘和重排
```js
let element = document.getElementById("c")
let idx = element.children.length-1
while((--idx) > -1) {
  element.appendChild(element.children[idx])
}
```
- 高级解法：利用RangeAPI先取出待操作的DOM范围，操作完后再添加回去，只会引起2次重绘和重排
```js
let element = document.getElementById("c")
let range = new Range()
range.selectNodeContents(element)
let fragment = range.extractContents()
let idx = fragment.children.length-1
while((--idx) > -1) {
  fragment.appendChild(fragment.children[idx])
}
element.appendChild(fragment)
```

### 2.5 CSSOM API
CSSOM是对CSS文档的抽象化对象描述，主要通过document.styleSheets获取
1. Rules操作
- document.styleSheets[0].cssRules
- document.styleSheets[0].insertRule("p {color:pink;}", 0) // 0代表插入的位置
- document.styleSheets[0].removeRule(0)
2. 获取各个Rule
- CSSStyleRule
- CSSCharsetRule
- CSSImortRule
- ...
3. getComputedStyle获取元素最终计算出的CSS规则
- window.getComputedStyle(element[, pseudoElement])
  - element想要获取的元素
  - pseudoElement 可选，伪元素字符串
ps:这个API比较有用，既可以批量获取和修改CSS样式也可以获取伪元素的样式
4. CSSOM API View部分  
- Window
  - **window.innerHeight, windwo.innerWidth**：网页窗口(viewport)的宽高
  - window.outerHeight, window.outerWidth：浏览器窗口的宽高
  - **window.DevicePixelRatio**：设备像素比
  - window.screen
    - window.screen.width
    - window.screen.height
    - window.screen.availWidth：当手机存在虚拟Home键时有意义
    - window.screen.availHeight
- Window API
  - window.open("about:blank", "_blank", "width=100,height=100,left=100,top=100")
  - window.moveBy(x,y)
  - window.moveTo(x,y)
  - window.resizeBy(x,y)
  - window.resizeTo(x,y)
- Scroll
  - Element
    - scrollTop
    - scrollLeft
    - scrollWidth：可滚动时的宽度
    - scrollHeight：可滚动时的高度
    - scroll(x,y)
    - scrollBy(x,y)
    - scrollIntoView()：滚动到视图中央
  - window
    - scrollX
    - scrollY
    - scroll(x,y)
    - scrollBy(x,y)
- layout
  - getClientRects()：获取元素的所有盒（包括伪元素的盒）
  - getBoundingClientRect()：获取元素的包围盒
ps: 这两个API常用于获取元素和其父元素的相对位置

### 2.6 其它浏览器API
1. Web相关的标准化组织
- khronos
  - WebGL
- ECMA
  - ECMAScript
- WHATWG
  - HTML
- W3C(ComunityGroup/WorkingGroup)
  - webaudio

2. 作业：全部API的分类和整理
利用getOwnPropertyNames获取window对象所有属性名称，再以此为线索，边整理边过滤API（通常同类API以相同名字开头）