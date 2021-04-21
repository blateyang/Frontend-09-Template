const css = require("css")
let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = [{type: "document", children: []}] // 利用数组模拟栈（只在数组的一端操作）

let rules = []
function addCSSRules(text) {
  var ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

function computeCSS(element) {
  var elements = stack.slice().reverse()
  console.log("compute css for element", element)
}
function emit(token) {
  // console.log(token)
  let top = stack[stack.length-1]
  if(token.type == "startTag") {
    // 为开始标签创建节点
    let element = {
      type: "element",
      tagName: token.tagName,
      attributes: [],
      children: [],
      parent: top
    }
    for(let key in token) {
      if(key !== "type" && key !== "tagName" && key !== "isSelfClosing") {
        element.attributes.push({key: token[key]})
      }
    }
    computeCSS(element) // 在遇到startTag时就开始计算CSS
    if(!token.isSelfClosing) {
      stack.push(element) // 开始标签入栈
    }
    top.children.push(element)
  }else if(token.type == "endTag") {
    // 将结束标签出栈
    if(token.tagName !== top.tagName) {
      console.log(token.tagName + " doesn't match top element of stack!")
      return 
    }else{
      // 获取CSS规则
      if(token.tagName === "style") {
        addCSSRules(top.children[0].content)
      }
      stack.pop()
    }
  }else if(token.type == "text") {
      currentTextNode = {
        type: "text",
        content: token.content,
        parent: top
      }
    top.children.push(currentTextNode)
  }
}

const EOF = Symbol('EOF')

function data(c) {
  if(c == "<") {
    return tagOpen
  }else if(c == EOF) {
    return 
  }else{
    currentToken = {
      type: "text",
      content: ""
    }
    return textNode(c)
  }
}

function textNode(c) {
  if(c != "<"){
    currentToken.content += c
    return textNode
  }else{
    emit(currentToken)
    return tagOpen
  }
}

function tagOpen(c) {
  if(c == '/') {
    return endTagOpen
  }else if(c.match(/^[a-zA-Z]$/)){
    currentToken = {
      type: "startTag",
      tagName: ""
    }
    return tagName(c)
  }else if(c == '!'){
    return doctypeCommentTag
  }else{
    return // 非法html
  }
}

function doctypeCommentTag(c) {
  if(c == ' ') {
    return tagOpen
  }else if(c.match(/[DOCTYPE]/)){
    return doctypeCommentTag
  }else{
    return data
  }
}

function endTagOpen(c) {
  if(c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: ""
    }
    return tagName(c)
  }else{
    return // 非法html
  }
}

function tagName(c) {
  if(c.match(/[\t\n\f ]/)) {
    return beforeAttributeName
  }else if(c.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += c
    return tagName
  }else if(c == '/') {
    return selfClosingStartTag
  }else if(c == '>'){
    emit(currentToken)
    return data
  }else{
    return // 非法html
  }
}

function beforeAttributeName(c) {
  if(c.match(/[\t\n\f ]/)) {
    return beforeAttributeName
  }else if(c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c)
  }else if(c == '='){
    // 非法
  }else{
    // 获取属性
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(c)
  }
}

function afterAttributeName(c) {
  if(c == '/'){
    return selfClosingStartTag
  }else if(c == '>') {
    emit(currentToken)
    return data
  }else if(c == '='){
    return beforeAttributeValue
  }else if(c.match(/[\t\n\f ]/)){
    return afterAttributeName
  }else{ // EOF
    return 
  }
}

function attributeName(c) {
  if(c == '=') {
    return beforeAttributeValue
  }else if(c.match(/[\t\n\f ]/) || c == '/' || c == '>' || c == EOF) {
    return afterAttributeName(c)
  }else if(c == '\u0000' || c == '\"' || c == '\'' || c == '<') {
    // 非法
  }else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if(c.match(/[\t\n\f ]/)) {
    return beforeAttributeValue
  }else if(c == '\"') {
    return doubleQuotedAttributeValue
  }else if(c == '\'') {
    return singleQuotedAttributeValue
  }else if(c == '/' || c == '>' || c == EOF) {
    // 非法
  }else{
    return unquotedAttributeValue
  }
}

function doubleQuotedAttributeValue(c) {
  if(c == '\"') {// 解析完一个属性
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  }else if(c == '\u0000' || c == EOF) {
    // 非法
  }else{
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if(c == '\'') {// 解析完一个属性
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  }else if(c == '\u0000' || c == EOF) {
    // 非法
  }else{
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }  
}

function afterQuotedAttributeValue(c) {
  if(c.match(/[\t\n\f ]/)) {
    return beforeAttributeName
  }else if(c == '/') {
    return selfClosingStartTag
  }else if(c == '>') {
    // 下面的currentAttribute.name可能是在跳转到beforeAttributeName后转移过来的，不能省略
    currentToken[currentAttribute.name] = currentAttribute.value 
    emit(currentToken)
    return data
  }else if(c == EOF) {
    // 非法
  }else{
    currentAttribute.value += c
    // 此处针对的是属性值“后立即跟一个普通字符的情况，这时认为属性值还未结束（为何不回到singleQuotedAttributeValue状态）
    return doubleQuotedAttributeValue 
  }
}

function unquotedAttributeValue(c) {
  if(c.match(/[\t\n\f ]/)) {
    return beforeAttributeName
  }else if(c == '/') {
    return selfClosingStartTag
  }else if(c == '>') {
    // 下面的currentAttribute.name可能是在跳转到beforeAttributeName后转移过来的，不能省略
    currentToken[currentAttribute.name] = currentAttribute.value 
    emit(currentToken)
    return data
  }else if(c == '\u0000' || c == '\"' || c == '\'' || c == '<' || c == EOF || c == '=') {
    // 非法
  }else{
    currentAttribute.vlaue += c
    return unquotedAttributeValue 
  }
}
function selfClosingStartTag(c) {
  if(c == '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  }else{
    return // 非法html
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data
  for(let c of html) {
    state = state(c)
  }
  state = state(EOF) // 添加文件终结符，强制状态机结束
  return stack.pop()
}