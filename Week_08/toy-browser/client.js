class Request {
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

  send() {
    return new Promise((resolve, reject)=> {

    })
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
  
  console.log(response)
}() // 立即调用函数