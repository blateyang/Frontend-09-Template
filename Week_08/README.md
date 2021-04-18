学习笔记
## 1 浏览器工作原理概述
熟悉浏览器工作原理的意义：对前端性能优化和CSS的某些布局和渲染特性的理解有帮助

浏览器的主要作用就是将请求的网址转换为网页图片，按照顺序大致可分为以下几个阶段：
URL --http--> HTML --parse--> DOM --css computing-->DOM with CSS--layout-->DOM with position--render-->Bitmap

## 2 基础知识：有限状态机（FSM)
### 2.1 什么是有限状态机
- 有限状态机的每一个状态都是一个机器
  - 在每个机器里可以独立地进行计算、存储和输出
  - 所有这些机器接收的输入是一致的
  - 状态机的每一个机器本身没有状态（原子性），如果用函数表示，应该是[纯函数（无副作用）](https://zh.wikipedia.org/wiki/%E5%89%AF%E4%BD%9C%E7%94%A8_(%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6))
- 每一个机器知道下一个状态
  - 每个机器都有确定的下一个状态（Moore型)
  - 每个机器根据输入决定下一个状态（Mealy型)
更多参考[FSM的wiki](https://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)，FSM是一个数学计算模型，被广泛用于建模应用行为、硬件电路系统设计、软件工程，编译器等
### 2.2 JS中的有限状态机(Mealy)
```js
// 每个函数是一个状态
function state(input) {// 函数的参数作为输入 
  // 在函数内可以自由编码处理每个状态的逻辑，注意当前被处理的输入可能因不符合某条件转回之前的状态时输入被”吞掉“，
  // 可使用reconsume技巧将当前输入重新作为之前状态的入参
  return next // 返回值作为下一个状态
}

// FSM的调用
while(true) {
  // 获取输入
  state = state(input) //把状态机的返回值作为下一个状态
}
```

### 2.3 作业:用FSM完成字符串abababx的查找
参见fsm.js

## 3 浏览器工作原理——解析响应
### 3.1 Step1：HTTP请求
1. 从使用的角度设计一个HTTP请求的类，需要有一个配置对象和一个异步send函数
2. Content-Type是必需字段，要有默认值
3. body是KV对
4. 不同的Content-Type影响body格式，常见的有application/x-www-form-urlencoded,application/json

### 3.2 Step2：编写异步的send函数
1. 将send函数设计成返回一个Promise
2. 通过node的net module的connection API将请求发送出去
3. 监听connection的data事件，收到数据传给parser，解析收到的响应，resovle Promise并关闭连接
4. 监听connection的error事件，reject Promise并关闭连接

### 3.3 Step3：ResponseParser总结
1. Response必须分段构造，所以要有一个ResponseParser来解析“装配”
2. ResponseParser分段处理responseText，需要用状态机来分析文本结构，在编写状态机代码前最好画出状态转移图帮助分析
3. 状态机的状态可用常量定义，也可用函数定义，使用函数实现状态机时注意this的指向
4. 解析完response后将得到的statusCode,statusText,headers,body装配成对象保存

### 3.4 Step4：BodyParser总结
1. Response的body可能根据Contetn-Type有不同的结构，采用子Parser的结构解决
2. 典型的对于node服务器返回的chunked数据创建ChunkedBodyParser，同样使用状态机来分析处理