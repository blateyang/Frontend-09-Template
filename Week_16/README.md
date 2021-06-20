学习笔记
## 1 手势动画应用
### 1.1 将14周手动轮播实现替换成通过手势组件实现

### 1.2 将14周自动轮播实现替换成通过动画组件实现
遇到问题，轮播图会跑飞，相邻两张轮播图移动的距离本应该相同，但实际运行结果却相差了500px，百思不得其解

通过参照其它同学提交的代码，现象消失了，原因还是未知

### 1.3 将自动轮播和手动轮播利用时间线结合起来
1. 在start的回调函数中，停止自动轮播的时间线并清除自动轮播定时器
2. 在pan的回调函数中，为了能从自动轮播自然过渡到手动轮播，需要加上自动轮播的偏移量
3. 在panend的回调函数中，原有的取巧处理不适合结合时间线，基于pan的回调函数逻辑进行处理

其中多次用到2个取余技巧：
1. 对某数取整：(x-x%500)/500
2. 将任意数取余转换到[0, n)区间：(pos%children.length + children.length) % children.length

## 2 为组件添加更多属性
### 2.1 将carousel类与父类重复的方法抽取到父类中
### 2.2 将position属性和attribute属性利用Symbol抽象到父类中
### 2.3 给组件添加onChange事件获取position的状态改变
### 2.4 给组件添加onClick事件跳转到图片链接的网站
### 2.5 给组件加入children机制
1. 内容型children：组件内所写字符串即代表了children，见Button示例
```js
let b = <Button>
  content
</Button>
b.mountTo(document.body)
```
2. 模板型children：通过模板函数去生成，如列表项，见List示例
```js
let c = <List data={d}>
  {(record)=>
    <div>
      <img src={record.img}/>
      <a href={record.url}>{record.title}</a>
    </div>
  }
</List>
c.mountTo(document.body)
```
## 3 问题
1. 2.3中Component类中的triggerEvent方法的写法不理解
```js
  triggerEvent(type, args) {
    this[ATTRIBUTE]["on"+type](new CustomEvent(type, {detail: args}))
  }
```