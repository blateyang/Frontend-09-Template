学习笔记

## 1 CSS总论
### 1.1 CSS语法的研究
建立知识体系，比较好的方法是找到一个权威的标准作为线索去研究，如果是语言的知识体系，可以将语法作为建立知识体系的线索。

CSS的标准比较散乱，相对完整的标准是CSS2.1，它规定了CSS的基本语法结构：
- @charset
- @import
- rules
  - @media
  - @page
  - rule
### 1.2 @规则的研究
- at-rules
  - @charset：指定字符集，https://www.w3.org/TR/css-syntax-3/
  - @import：引入外部样式表，https://www.w3.org/TR/css-cascade-4/
  - **@media**：媒体查询，https://www.w3.org/TR/css3-conditional/
  - @page：分页媒体，与打印相关，https://www.w3.org/TR/css-page-3/
  - @counter-style：列表计数器样式，https://www.w3.org/TR/css-counter-styles-3/
  - **@keyframes**：定义动画关键帧，https://www.w3.org/TR/css-animations-1/
  - **@fontface**：定义字体，https://www.w3.org/TR/css-fonts-3/
  - @support：检查是否支持某些CSS功能，https://www.w3.org/TR/css3-conditional/
  - @namespace：指定命名空间，https://www.w3.org/TR/css-namespaces-3/
### 1.3 CSS规则的结构
- rule
  - Selector（https://www.w3.org/TR/selectors-3,https://www.w3.org/TR/selectors-4）
    - selector-group
    - selector
      - >
      - <sp>
      - ~
      - +
    - simple-selector
      - *
      - element
      - #
      - .
      - :
      - ::
      - []
      - :not()
  - Declaration
    - Key
      - Properties
      - Variables:以`--`开头，https://www.w3.org/TR/css-variables-1/
    - Value(https://www.w3.org/TR/css-values-4/)
      - number
      - length
      - calc
      - ...
### 1.4 利用爬虫收集标准
CSS的规则比较散乱，可以利用爬虫去W3C网站(https://www.w3.org/TR)爬取相关标准并进行过滤和进一步处理
1. 获取所有的CSS标准名称和相应链接，序列化为字符串保存起来
```js
var standards = ([].slice.call(document.getElementById("container").children)).filter(e=>e.getAttribute("data-tag").match(/css/)).map(e => ({name:e.children[1].children[0].innerText, url:e.children[1].children[0].href})) // map中箭头函数的({})等效于{return {}}
```
2. 针对获取的数据逐条进行分析处理
为了避免访问各链接进行处理时出现跨域问题，可以在同源页面创建一个iframe，加载相关链接进行分析处理
```js
let iframe = document.createElement("iframe")
document.body.innerHTML = ""
document.body.appendChild(iframe)

// 监听页面加载，完成后再移除监听
function happen(element, event) {
  return new Promise((resolve) => {
    let handler = () => {
      element.removeEventListener(element, handler)
      resolve()
    }
    element.addEventListener(element, handler)
  }).catch(err => {
    console.log(err)
  })
}

void async function() {
  for(let standard of standards) {
    iframe.src = standard.url
    console.log(standard)
    await happen(iframe, "load")
  }
}()
```
## 2 CSS选择器
### 2.1 选择器语法
1. 简单选择器
  - 全局选择器*
  - 元素选择器: div、svg|a
  - 类选择器: .cls
  - id选择器：#id
  - 属性选择器： [attr=value]
  - 伪类选择器：:hover
  - 伪元素选择器：::before
2. 复合选择器(comband)
  - <简单选择器><简单选择器><简单选择器>（与的关系）
  - *或者元素标签必须写在最前面，伪类和伪元素写在最后面
3. 复杂选择器
  - <复合选择器><sp><复合选择器>
  - <复合选择器>">"<复合选择器>
  - <复合选择器>"~"<复合选择器>
  - <复合选择器>"+"<复合选择器>
  - <复合选择器>"||"<复合选择器>(在表格中选中列中的td)
### 2.2 选择器的优先级
用4位N进制数(a, b, c, d)表示(为避免优先级重复，N通常取较大的数),specificity = a\*N^3+b\*N^2+C\*N+d
- 元素和伪元素选择器对应d位的1，可累加
- 类和伪类以及属性选择器对应c位的1，可累加
- id选择器对应b位的1，可累加
- 内联样式的优先级对应a位的1
- :not()本身不参与优先级计算，但其内部参与
- *不参与优先级计算

练习：
- div#a.b .c[id=x]：(1, 3, 1)
- #a:not(#b)：(2, 0, 0)
- *.a：(0, 1, 0)
- div.a: (0, 1, 1)

### 2.3 伪类
- 链接/行为
  - :any-link（选中所有的链接）
  - :link（未访问的） :visited（已访问的）
  - :hover
  - :active
  - :focus
  - :target：用于a标签，链接到当前目标（其id与以#标识的当前URL片段匹配，即id和点击的a链接中#后的内容匹配）
- 树结构
  - :empty（选中子节点为空的元素）
  - :nth-child(even|odd|An+B)
  - :nth-last-child()
  - :first-child, :last-child, :only-child
  
ps: empty,last-child,only-child和nth-last-child是无法在startTag进入时计算出来的，需要分析完后面的token才知道，在浏览器实现或性能上不太好，应尽量避免使用
- 逻辑型
  - :not伪类
建议：选择器不应写得过于复杂，会影响性能，可通过在HTML中增加class等方法规避过于复杂的选择器的使用

### 2.4 伪元素
- 无中生有型(需要在声明列表中指定content属性)
  - ::before
  - ::after
- 生成包含结构型
  - ::first-line：选中排版后相关元素的首行，可设置的属性包括font系列、color系列、background系列、word-spacing、letter-spacing、text-decoration、text-transform、line-height
  - ::first-letter：选中排版后相关元素的首字母（应用：段落首字母大写），可设置的属性除了::first-line可设置的，还有float、vertical-align、盒模型系列（margin,padding,border）


## 疑问
1. 为何第4小节“CSS总论：收集标准”的代码运行时加载完第一个standard，遇到GET 404就停止打印了，不像视频教程中会持续打印
```javascript
var standards = JSON.stringify(([].slice.call(document.getElementById("container").children)).filter(e=>e.getAttribute("data-tag").match(/css/)).map(e => ({name:e.children[1].children[0].innerText, url:e.children[1].children[0].href}))) // map中箭头函数的({})等效于{return {}}
let iframe = document.createElement("iframe")
document.body.innerHTML = ""
document.body.appendChild(iframe)

// 监听页面加载，完成后再移除监听
function happen(element, event) {
  return new Promise((resolve) => {
    let handler = () => {
      element.removeEventListener(element, handler)
      resolve()
    }
    element.addEventListener(element, handler)
  }).catch(err => {
    console.log(err)
  })
}

void async function() {
  for(let standard of standards) {
    iframe.src = standard.url
    console.log(standard)
    await happen(iframe, "load")
  }
}()
```
答：通过console.log发现standard打印出来的是[，原因是多用了JSON.stringify()，把它去掉就行了