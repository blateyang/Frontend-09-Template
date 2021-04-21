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
            p.text#name {
              font-size: 20px,
              color: red,
              background-color: blue
            }
            body div img {
              width: 30px,
              background-color: #ffffff
            }
            body div #myImg {
              height: 30px
            }
            .classImg {
              margin: 10px
            }
            .myClass {
              border: 2px
            }
          </style>
        </head>
        <body>
          <div>
            <p class="text">Hello world</p>
            <img id="myImg" src="xx" class="classImg  myClass"/>
            <p class="text" id="name">My name is blateyang</p>
          </div>
        </body>
      </html>`
    )
  })// 标签中不能含义type，否则解析会出错
}).listen(8080)

console.log("server started")