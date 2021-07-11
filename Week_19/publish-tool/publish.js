const http = require("http")
const fs = require("fs")
const archiver = require("archiver")
let child_process = require("child_process")

// 1. 打开 https://github.com/login/oauth/authorize
// child_process.exec(`curl https://github.com/login/oauth/authorize?client_id=Iv1.28dda5cca6020d5e`)
// 3. 创建server，接受token，然后点击发布
http.createServer((req, res)=>{
  let query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1])
  console.log(query)
  publish(query.token)
}).listen(8083)

function publish(token) {
  let request = http.request({
    //  hostname: "192.168.43.145",
      hostname: "127.0.0.1",
      port: 8082,
      method: "POST",
      path: "/publish?token="+token,
      headers: {
        "Content-Type": "application/octet-stream",
      }
    }, response =>{
      console.log(response)
    })
    
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })
    archive.directory('./resources', false);
    archive.finalize() // 为压缩工具填好了压缩的内容
    archive.pipe(request)
}
/*
let request = http.request({
//  hostname: "192.168.43.145",
  hostname: "127.0.0.1",
  port: 8082,
  method: "POST",
  headers: {
    "Content-Type": "application/octet-stream"
  }
}, response =>{
  console.log(response)
})

const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
})
archive.directory('./resources', false);
archive.finalize() // 为压缩工具填好了压缩的内容
archive.pipe(request)
/*
let file = fs.createReadStream("index.html")
file.pipe(request)
// file.on("data", chunk=>{
// //  console.log(chunk.toString())
//   request.write(chunk)
// })

file.on("close", chunk=>{
  request.end(chunk)
})
*/