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
    debugger
    body = Buffer.concat(body).toString() 
    //body = body.join("")
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
          body {
            background-color: black;
          }
          .container {
            width: 500px;
            height: 300px;
            display: flex;
            background-color: rgb(255, 255, 255);
            align-items: center;
          }
          .pText {
            width: 200px;
          }
          p.text {
            display: none;
          }
          p.text#name {
            font-size: 20px;
            color: red;
            background-color: blue;
          }
          body div #myImg {
            flex: 1;
            height: 200px;
            background-color: rgb(255, 0, 0);
          }
          body div #hisImg2 {
            flex: 2;
            height: 300px;
            background-color: rgb(0, 255, 0);
          }
       /*   .classImg {
            margin: 10px;
          }
          .myClass {
            border: 2px;
          } */
        </style>
      </head>
      <body>
        <div class="container">
          <div class="pText">
            <p class="text">Hello world</p>
            <p class="text" id="name">My name is blateyang</p>
          </div>
          <img src="viewport.jpg" id="myImg" class="classImg  myClass"/>
          <div id="hisImg2" class="classImg  myClass"></div>
        </div>
      </body>
    </html>`
    )
  })// 标签中不能含义type，否则解析会出错
}).listen(8080)

console.log("server started")