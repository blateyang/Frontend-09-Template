const http = require("http")

http.createServer((request, response)=>{
  let body = []
  request.on("error", (err)=>{
    console.error(err)
  })
  request.on("data", (chunk)=>{
    body.push(chunk) // 此处若是chunk.toString(),下面的Buffer.concat(body).toString()会报错，因为body非Buffer类型，可改成body.join("")
  })
  request.on("end", ()=>{
    body = Buffer.concat(body).toString() 
    // body = body.join("")
    console.log("body:"+body)
    response.writeHead(200, {"Content-Type": "text/html"})
    //  response.end("Hello world!\n")
    response.end(
      `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="./foo.js"></script>
          <title>Document</title>
          <style>
            p {
              font-size: 20px,
              color: red,
              background-color: blue
            }
            body div img {
              width: 30px,
              background-color: #ffffff
            }
          </style>
        </head>
        <body>
          <div><p>Hello world</p></div>
          <img src="" />
        </body>
      </html>`
    )
  })// 标签中不能含义type，否则解析会出错
}).listen(8080)

console.log("server started")