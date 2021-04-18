const http = require("http")

http.createServer((request, response)=>{
  let body = []
  request.on("error", (err)=>{
    console.error(err)
  })
  request.on("data", (chunk)=>{
    body.push(chunk.toString())
  })
  request.on("end", ()=>{
   body = Buffer.concat([Buffer.from(body.toString())]).toString() // 视频中的写法Buffer.concat(body).toString()会报错
   console.log("body:"+body)
   response.writeHead(200, {"Content-Type": "text/html"})
   response.end("Hello world!\n")
  })
}).listen(8080)

console.log("server started")