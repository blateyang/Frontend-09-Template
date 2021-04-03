学习笔记
## 1 Proxy API
Proxy API是ES6提供的强大但危险的API，它能代理对象的读写行为，是Vue3的响应式reactive API的实现原理，但同时也增加了对象读写行为的不可预测性，其使用示例如下
```js
let obj = {name: "obj"}
let objProxy = new Proxy(obj, {
  set(obj, prop, val) {
    console.log(`set:${prop} =` + val)
  },
  get(obj, prop) {
    console.log(`get:${prop}`)
    return obj.prop
  }
})

objProxy.name = "foo" 
console.log(objProxy.name)
```

- Proxy与Object.defineProperty区别：
  - Object.defineProperty的get和set只能对对象已有的属性进行拦截，而Proxy的get和set对对象没有的属性也能拦截
  - Proxy不仅可以拦截get和set，还能拦截改变很多内置或原生的操作，例如handler.apply,handler.defineProperty
## 2 Vue3 reactive 响应式API
### 2.1 原理
将操作对象属性的函数用effect函数注册（执行函数并将函数添加到相关对象属性的回调列表中），利用Proxy在读取对象属性时收集对象属性，在设置对象属性时执行用到了该对象属性的回调函数
### 2.2 解决级联访问属性时的监听问题
1. 遇到引用型属性用reactive()再进行一次代理
2. 每次用reactive代理都会返回一个新的proxy对象，为避免在级联访问属性时重复生成proxy对象，可设置一个Map全局缓存
### 2.3 Vue3双向绑定的原理
1. 首先基于reactive API实现数据的响应式更新
```js
po = reactie(obj)
doucment.getElementById("xxx").value = po.prop
```
双向绑定实现可交互调色板的例子表明通过双向绑定可以较容易地实现低代码的可交互式应用

2. 再对视图input元素添加事件监听
```js
document.getElementById("xxx").addEventListener("input", event => po.prop = event.target.value)
```
## 3 使用Range API实现DOM精确操作
### 3.1 Range API简介及用法
Range API可用于实现DOM精细操作，包括局部范围的节点和文本
1. 创建range: `document.createRange()`
2. 设置range的起点：`range.setStart(startContainer, startOffset)`
3. 设置range的终点：`range.setEnd(endContainer, endOffset)`,range的范围是左闭右开区间[startOffset, endOffset)
4. 往range中插入节点（同DOM节点插入）： `range.insertNode()`
更多细节参考https://developer.mozilla.org/zh-CN/docs/Web/API/Range
### 3.2 拖拽功能的典型写法
```js
 let dragable = document.getElementById("dragable")
  let baseX = 0, baseY = 0
  dragable.addEventListener("mousedown", (event)=>{
    // 在目标的mousedown事件后监听mousemove和mouseup事件
    let startX = event.clientX, startY = event.clientY // 获取鼠标点下时的位置
    let up = (event) => {
      // 更新目标的基位置
      baseX = baseX + event.clientX - startX 
      baseY = baseY + event.clientY - startY
      document.removeEventListener("mousemove", move)
      document.removeEventListener("mouseup", up)      
    }
    let move = (event) => {
      dragable.style.transform = `translate(${baseX + event.clientX-startX}px, ${baseY + event.clientY-startY}px)`
    }
    document.addEventListener("mousemove", move)
    document.addEventListener("mouseup", up)
  })
```
### 3.3 CSSOM的getBoundingClientRect()
Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。详细参考https://developer.mozilla.org/zh-CN/docs/web/api/element/getboundingclientrect
