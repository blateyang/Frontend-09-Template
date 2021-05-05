const net = require("net")
const images = require("images")
const parser = require("./parser")
const layout = require("./layout")
const render = require("./render")

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

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => key+': '+this.headers[key]).join('\r\n')}\r
\r
${this.bodyText}`
  }
}

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
  // console.log(dom)
  layout(dom)
  // 绘制dom元素
  let viewport = images(800, 600)
//  render(viewport, dom.children[0].children[3].children[1].children[5])
  render(viewport, dom)
  viewport.save("Frontend-09-Template\\Week_10\\viewport.jpg")
  // console.log(response)
}() // 立即调用函数