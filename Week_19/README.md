学习笔记
# 1 发布系统
## 1.1 实现一个线上Web服务
### 1.1.1 发布系统的组成
1. 线上服务系统：Web服务器
2. 发布系统：用于将项目发布到线上服务系统中
3. 发布工具：和发布系统相连接的发布工具

### 1.1.2 初始化Server
找一台服务器（可以是真实的或者利用虚拟机代替）依次安装上node,npm,express等环境

## 1.1.2 利用Express框架编写服务器
1. 初始化express项目: `npx express-generator`
2. 安装依赖:`npm install`
3. 将项目代码远程拷贝到server，然后执行`npm start`，注意利用scp将项目代码拷贝到虚拟机服务器时需要设置端口虚拟机的端口转发
  
## 1.2 实现一个发布系统
### 1.2.1 用node.js启动一个简单的server
```js
const http = require("http")

http.createServer((req, res)=>{
  console.log(req)
  res.end("Hello world")
}).listen("8082")
```

### 1.2.3 编写简单的发送请求功能
```js
const http = require("http")
const { response } = require("../server/app")

let request = http.request({
  hostname: "127.0.0.1",
  port: 8082
}, response =>{
  console.log(response)
})

request.end()
```

### 1.2.4 了解Node.js流
1. readableStream
  - fs.createReadStream()：创建可读的文件流
  - Event:"data"，可读流有数据可读
  - Event:"end"，可读流数据已读完
  - Event:"close"，可读流数据被关闭
```js
let file = fs.createReadStream("package.json")
file.on("data", chunk=>{
  console.log(chunk.toString())
})
file.on("close", ()=>{
  console.log("read finished")
})
```
2. writableStream
  - fs.createWriteStream(): 创建可写的文件流。
  - writable.write(chunk[,encoding][,callback])
  - writable.end()

### 1.2.5 改造server
1. publish-server与线上服务系统server部署在同一台服务器上，用于接收publish-tool的文件上传请求并存储到线上服务系统server项目路径下
2. publish-server和server都可以配置一个`npm run publish`命令，用于将本地代码拷贝到远端

### 1.2.6 实现多文件发布
1. 利用流的pipe方法将输入流和输出流相连接简化代码
2. 利用archiver和unzipper包实现多文件的压缩上传和接收解压
   - 上传部分关键代码
```js
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
})
archive.directory('./resources', false);
archive.finalize() // 为压缩工具填好了压缩的内容
archive.pipe(request)
```
  - 接收解压
```js
  req.pipe(unzipper.Extract({ path: '../server/public/resources' }))
```

### 1.2.7 用github OAuth做一个登录实例
目的是为了实现发布系统的鉴权功能
1. 创建github app获取client-id,client-secret
2. 在publish-tool端，打开https://github.com/login/oauth/authorize
3. 在publish-server端，auth路由：接受code,用code+client_id+client_secret换token
4. 在publish-tool端，创建server，接受token，然后点击发布
5. 在publish-server端，publish路由：用token获取用户信息，检查权限，接受发布
