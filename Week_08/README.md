学习笔记
## 1 浏览器工作原理概述
熟悉浏览器工作原理的意义：让我们知道浏览器是如何一步步将一个URL转换成我们看到的网页图片的，对涉及浏览器的一些术语（重绘、重排）和CSS的某些布局和渲染特性的理解有帮助

浏览器的主要作用就是将请求的网址转换为网页图片，按照顺序大致可分为以下几个阶段：
![渲染流程](https://img-blog.csdnimg.cn/20210414193221829.png#pic_center)
首先浏览器将用户输入的URL作为请求依据HTTP协议发送出去，服务器接收到请求后返回相应的HTML文档和资源文件，浏览器收到服务器响应后对响应数据流进行解析得到DOM树，在解析DOM树各节点时会同时计算CSS，得到带样式的DOM树，然后经过布局排版环节得到带位置信息的DOM树，最后通过对DOM树进行递归渲染得到位图。

## 2 基础知识：有限状态机（FSM)
在解析HTML的过程中需要用到编译原理的相关知识对HTML字符流进行词法和语法分析，使用到的方法是有限状态机（Finite State Machine)，下面对有限状态机作简要介绍。

### 2.1 什么是有限状态机
- 有限状态机的每一个状态都是一个机器
  - 在每个机器里可以独立地进行计算、存储和输出
  - 所有这些机器接收的输入是一致的
  - 状态机的每一个机器本身没有状态（原子性），如果用函数表示，应该是[纯函数（无副作用，函数的执行对外部不会产生影响）](https://blog.csdn.net/c_kite/article/details/79138814))
- 每一个机器知道下一个状态
  - 每个机器都有确定的下一个状态（Moore型)
  - 每个机器根据输入决定下一个状态（Mealy型)
更多参考[FSM的wiki](https://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)，FSM是一个数学计算模型，被广泛用于建模应用行为、硬件电路系统设计、软件工程，编译器等，在工程中的典型应用是分析各种字符流。
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
### 2.3 有限状态机的优势如何体现？

**Example 1:** 在一个字符串中找到字符 'a'。

常规思路：

```js
function match(string) {
    for(let c of string) {
        if(c === 'a') return true;
    }
    return false;
}

match("I am a groot")
```

**Example 2:** 在一个字符串中找到字符 'ab'（不能使用正则表达式）

```js
function match(string) {
    let foundA = false;
    for(let c of string) {
        if(c === 'a')
            foundA = true;
        else if(foundA && c === 'b')
            return true;
        else
            foundA = false;
    }
    return false;
}

console.log(match("I acbm groot"));
```

**Example 3:** 在一个字符串中找到字符 'abcdef'（不能使用正则表达式）

```js
function match(string) {
    let foundA = false;
    let foundB = false;
    let foundC = false;
    let foundD = false;
    let foundE = false;
    for(let c of string) {
        if(c === 'a') 
            foundA = true;
        else if(foundA && c === 'b') {
            if(!foundB) foundB = true;
            else {
                foundA = false;
                foundB = false;
            }
        }
        else if(foundB && c === 'c') {
            if(!foundC) foundC = true;
            else {
                foundA = false;
                foundB = false;
                foundC = false;
            }
        }
        else if(foundC && c === 'd') {
            if(!foundD) foundD = true;
            else {
                foundA = false;
                foundB = false;
                foundC = false;
                foundD = false;
            }
        }
        else if(foundD && c === 'e') {
            if(!foundE) foundE = true;
            else {
                foundA = false;
                foundB = false;
                foundC = false;
                foundD = false;
                foundE = false;
            }
        }
        else if(foundE && c === 'f')
            return true;
        else {
            foundA = false;
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false;
        }
    }
  return false;
}

console.log('abbcdef');
```

可以看到，用常规解法到这里代码已经不太容易阅读。

如何使用状态机解 Example 3？其实每找到一个字符，就可以认为状态发生了一次改变，下次处理的逻辑是独立的。可以将代码修改为如下形式：

```js
function match(string) {
    let state = start;
    for(let c of string) {
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if(c === 'a')
        return foundA;
    else
        return start;
}

// trap
function end(c) {
    return end;
}

function foundA(c) {
    if(c === 'b')
        return foundB;
    else
        // reconsume，重新从此位开始判断
        return start(c);
}

function foundB(c) {
    if(c === 'c')
        return foundC;
    else
        return start(c);
}

function foundC(c) {
    if(c === 'd')
        return foundD;
    else
        return start(c);
}

function foundD(c) {
    if(c === 'e')
        return foundE;
    else
        return start(c);
}

function foundE(c) {
    if(c === 'f')
        return end;
    else
        return start(c);
}

console.log(match('aabcdef'));
```

**Example 4：**在一个字符串中找到字符 'abcabx'

```js
function match(string) {
    let state = start;
    for(let c of string) {
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if(c === 'a')
        return foundA;
    else
        return start;
}

// trap
function end(c) {
    return end;
}

function foundA(c) {
    if(c === 'b')
        return foundB;
    else
        return start(c);
}

function foundB(c) {
    if(c === 'c')
        return foundC;
    else
        return start(c);
}

function foundC(c) {
    if(c === 'a')
        return foundABCA;
    else
        return start(c);
}

function foundABCA(c) {
    if(c === 'b') 
        return foundABCAB;
    else
        return start(c);
}

function foundABCAB(c) {
    if(c === 'x') 
        return end;
    else
        return foundB(c); // reconsume
}


console.log(match('abcabcabx'));
```

### 2.4 作业:用FSM完成字符串abababx的查找
参见fsm.js


## 3 浏览器工作原理——解析响应
### 3.0 HTTP基础知识
#### 3.0.1 网络分层模型

![网络模型](https://img-blog.csdnimg.cn/20210415205039640.png#pic_center)

#### 3.0.2 TCP 与 IP

- 流（无明显分割单位，只考虑前后顺序）
- 端口（应用对应端口）
- node使用网络库：require('net')
- libnet/libpcap，node 调用的两个底层库（c++），libnet 负责构造 IP 包并发送，labpcap 负责从网卡抓所有的 IP 包

#### 3.0.3 HTTP Request

HTTP 是文本型协议（与二进制协议相对），所有内容都是字符，会被用 Unicode 编码值传递。也就是传输 HTTP 时 TCP 里的内容都是字符。

一个 HTTP 请求包括如下内容：

- request line，如`GET url HTTP/1.1`
- headers，如Content-Type

- body，与headers用一个空行隔开，由 Content-Type 决定格式，常见的有application/x-www-form-urlencoded,application/json

#### 3.0.4 HTTP Response

- status line，如 `HTTP/1.1 200 OK`
- headers，同 request

- body，与headers用一个空行隔开，格式由 Content-Type 决定。node 默认为 trunked body，如

```html
26 // 16 进制字符，每一行前都有，表示 trunk 长度，用于切分 body 内容
<html><body>Hello World<body></html>
0 // 16 进制 0，表示结束
```

### 3.1 Step1：HTTP请求
1. 从使用的角度设计一个HTTP请求的类，需要有一个配置对象和一个异步send函数
2. Content-Type是必需字段，要有默认值
3. body是KV对
4. 不同的Content-Type影响body格式，常见的有application/x-www-form-urlencoded,application/json
```js
class Request {
  // 复制配置对象并添加必要的头
  constructor(options) {
    this.method = options.method || "GET"
    this.host = options.host
    this.port = options.port || "80"
    this.path = options.path || '/'
    this.headers = options.headers || {}
    this.body = options.body || {}
    if(!this.headers["Content-Type"]) { // 必需请求头
      this.headers["Content-Type"] = "application/x-www-form-urlencoded"
    }
    if(this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body)
    }
    else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      // encodeURIComponent对字符串进行uri组件编码（与encodeURI的区别参见https://www.runoob.com/jsref/jsref-encodeuri.html）
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join("&") 
    }

    this.headers["Content-Length"] = this.bodyText.length
  }

    // TODO:send函数
}
```
### 3.2 Step2：编写异步的send函数
1. 将send函数设计成返回一个Promise
2. 通过node的net module的connection API将请求发送出去
3. 监听connection的data事件，收到数据传给parser，解析收到的响应，resovle Promise并关闭连接
4. 监听connection的error事件，reject Promise并关闭连接
```js
// 在Request类中添加异步send函数
  // 将请求发送到服务器，因为是异步过程所以要使用Promise
  send(connection) {
    return new Promise((resolve, reject)=> {
      const parser = new ResponseParser()
      // 将请求写入connection连接发送出去
      if(connection) {
        connection.write(this.toString())
      }else{
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, ()=>{
          connection.write(this.toString())
        })
      }
      // 收到响应传给parse解析
      connection.on("data", (data)=>{
        console.log(data.toString())
        parser.receive(data.toString())
        if(parser.isFinished) {
          resolve(parser.response)
          connection.end()
        }
      })
      
      connection.on("error", (err)=>{
        reject(err)
        connection.end()
      })

    }).catch(reason=>{
      console.log(reason)
    })
  }

  toString() {//按照HTTP请求格式拼装请求
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => key+': '+this.headers[key]).join('\r\n')}\r
\r
${this.bodyText}`
  }
```
### 3.3 Step3：ResponseParser总结
1. Response必须分段构造，所以要有一个ResponseParser来解析“装配”
2. ResponseParser分段处理responseText，需要用状态机来分析文本结构，在编写状态机代码前最好画出状态转移图帮助分析
3. 状态机的状态可用常量定义，也可用函数定义，使用函数实现状态机时注意this的指向
4. 解析完response后将得到的statusCode,statusText,headers,body装配成对象保存
```js
class ResponseParser {
  constructor() {
    this.statusLine = ""
    this.headers = {}
    this.headerName = ""
    this.headerValue = ""
    this.bodyParser = null
  }

  receive(string) {
    let state = this.parseChar
    for(let c of string) {
      state = state.call(this, c) // 直接使用state(c)会丢失this的上下文环境
    }
    // if(this.isFinished) {
    //   console.log(this.response)
    // }
  }
  // 利用状态机解析收到的响应中的字符
  parseChar(c) {
    let that = this
    return waitingStatusLine(c)

    function waitingStatusLine(c) {
      if(c !== '\r') {
        that.statusLine += c
        return waitingStatusLine
      }else{
        return waitingStatusLineEnd
      }
    }

    function waitingStatusLineEnd(c) {
      if(c === '\n') {
        return waitingHeaderName
      }else{
        return waitingStatusLineEnd
      }
    }

    function waitingHeaderName(c) {
      if(c === ':') {
        return waitingHeaderSpace
      }else if(c === '\r') {
        return waitingHeaderBlockEnd
      }else{
        that.headerName += c
        return waitingHeaderName
      }
    }

    function waitingHeaderSpace(c) {
      if(c === ' ') {
        return waitingHeaderValue
      }else{
        return waitingHeaderSpace
      }
    }

    function waitingHeaderValue(c) {
      if(c !== '\r') {
        that.headerValue += c
        return waitingHeaderValue
      }else{
        return waitingHeaderLineEnd
      }
    }

    function waitingHeaderLineEnd(c) {
      if(c === '\n') {
        that.headers[that.headerName] = that.headerValue
        that.headerName = ''
        that.headerValue = ''
        return waitingHeaderName
      }else{
        return waitingHeaderLineEnd
      }
    }

    function waitingHeaderBlockEnd(c) {
      if(c === '\n') {
        return waitingBody
      }else{
        return waitingHeaderBlockEnd
      }
    }

    function waitingBody(c) {
      that.bodyParser = new ChunkedBodyParser()
      return that.bodyParser.parseChar(c)
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }
}

void async function() {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8080",
    path: '/',
    headers: {
      customed: "customed"
    },
    body: {
      name: "ygj"
    }
  })
  
  let response = await request.send()
  let dom = parser.parseHTML(response.body)
  console.log(dom)
  // console.log(response)
}() // 立即调用函数
```
### 3.4 Step4：BodyParser总结
1. Response的body可能根据Contetn-Type有不同的结构，采用子Parser的结构解决
2. 典型的对于node服务器返回的chunked数据创建ChunkedBodyParser，同样使用状态机来分析处理
```js
class ChunkedBodyParser {
    constructor() {
      this.lineLen = 0
      this.content = []
      this.isFinished = false
    }

    parseChar(c) {
      let that = this
      return waitingLengthLine(c)
      function waitingLengthLine(c) {
        if(c === '\r') {
          if(that.lineLen === 0) {
            that.isFinished = true
          }
          return waitingLengthLineEnd 
        }else{
          that.lineLen = that.lineLen*16 + parseInt(c, 16) // ChunkedBody的lineLength是用16进制表示的
          return waitingLengthLine
        }
      }
      function waitingLengthLineEnd(c) {
        if(c === '\n') {
          return readingChunked
        }else{
          return waitingLengthLineEnd
        }
      }
      function readingChunked(c) {
        if(that.lineLen === 0) {
          return waitingNewLine
        }else{
          that.content.push(c)
          that.lineLen--
          return readingChunked
        }
      }
      function waitingNewLine(c) {
        if(c === '\r') {
          return waitingNewLineEnd
        }else{
          return waitingNewLine
        }
      }
      function waitingNewLineEnd(c) {
        if(c === '\n') {
          return waitingLengthLine
        }else{
          return waitingNewLineEnd
        }
      }
    }
}

```
### 3.5 本节代码github地址
如需查看完整代码，请移步[github](https://github.com/blateyang/Frontend-09-Template/tree/main/Week_08)
