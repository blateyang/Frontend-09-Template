const http = require("http")
const fs = require("fs")
const unzipper = require("unzipper")
const querystring = require("querystring")
const https = require("https")

function auth(req, res) {
  let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1])
  getToken(query.code, function(info){
    console.log(info)
    //res.write(JSON.stringify(info))
    res.write(`<a href='http://localhost:8083/?token=${info.access_token}>publish</a>`)
    res.end()
  })
}

function getToken(code, callback) {
  let request = https.request({
    hostname: "github.com",
    path: `/login/oauth/access_token?code=${code}&client_id=Iv1.28dda5cca6020d5e&client_secret=394ae94b88c4b165c1fadfef1b10a06012a9a366`,
    port: 443,
    method: "POST",
  }, function(response){
    let body = ""
    response.on("data", chunk => {
      body += chunk.toString()
    })
    response.on("end", chunk => {
      callback(querystring.parse(body))
    })
  })
  request.end() // 将请求发出
}

function getUser(token, callback) {
  let request = https.request({
    hostname: "api.github.com",
    path: `/user`,
    port: 443,
    method: "GET",
    headers: {
      Authorization: `token ${token}`, 
      "User-Agent": "blateyang-toy-publish-auth"
    }
  }, function(response){
    let body = ""
    response.on("data", chunk => {
      body += chunk.toString()
    })
    response.on("end", chunk => {
      console.log(body)
      callback(JSON.stringify(body))
    })
  })
  request.end() // 将请求发出
}

function publish(req, res) {
  let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1])
  getUser(query.token, info=>{
    if(info.login === "blateyang") {
      req.pipe(unzipper.Extract({ path: '../server/public/resources' }))
      req.on("end", function(){
        res.end("success!")
      })
    }
  })
}

http.createServer((req, res)=>{
//  console.log(req)
  // 2. auth路由：接受code,用code+client_id+client_secret换token
  if(req.url.match(/^\/auth\?/))
    return auth(req, res)
  // 4. publish路由：用token获取用户信息，检查权限，接受发布
  if(req.url.match(/^\/publish\?/)) 
    return publish(req, res)
// req.pipe(unzipper.Extract({ path: '../server/public/resources' }))
/*  let outFile = fs.createWriteStream("../server/public/index.html")
  // req.on("data", chunk=>{
  //   console.log(chunk.toString())
  //   outFile.write(chunk)
  // })
  req.pipe(outFile)
  req.on("end", chunk=>{
    console.log("receive finished")
    outFile.end()
    res.end("Success")
  })
*/

}).listen("8082")