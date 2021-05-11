const css = require("css")
const layout = require("./layout.js")
let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = [{type: "document", children: []}] // 利用数组模拟栈（只在数组的一端操作）

let rules = []
function addCSSRules(text) {
  var ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

// selector:复合选择器 #myImg 或 p.text#name
function match(element, selector) {
  if(!selector || !element.attributes) {// 无attributes的文本节点不处理
    return false
  }
  let regMatches = selector.match(/(^[a-z][a-z0-9]+)|(.[a-z][a-z0-9]+)|(#[a-z][a-z0-9]+)/gi) // i忽略大小写
  for(let subSelector of regMatches) {
    let attr = ''
    if(subSelector.charAt(0) == "#") {// id选择器
      attr = element.attributes.filter(attr => attr.name === "id")[0]
      if(!attr || attr.value !== subSelector.substring(1)) {
        return false
      }
    }else if(subSelector.charAt(0) == ".") {// class选择器
      attr = element.attributes.filter(attr => attr.name === "class")[0]
      if(!attr || !attr.value.split(/[\t ]+/).includes(subSelector.substring(1))) {
        return false
      }
    }else if(subSelector !== element.tagName) {// 元素选择器
      return false
    }
  }
  return true
  // let attr = ''
  // if(selector.charAt(0) == "#") {// id选择器
  //   attr = element.attributes.filter(attr => attr.name === "id")[0]
  //   if(attr && attr.value === selector.substring(1)) {
  //     return true
  //   }
  // }
  // if(selector.charAt(0) == ".") {// class选择器
  //   attr = element.attributes.filter(attr => attr.name === "class")[0]
  //   if(attr && attr.value.split(/[\t ]+/).includes(selector.substring(1))) {
  //     return true
  //   }
  // }
  // if(selector == element.tagName) {// 元素选择器
  //   return true
  // }
  // return false
}

/*
计算css规则的specificity
*/
function computeSpecificity(selector) {
  let spec = [0, 0, 0, 0]
  let compSelectors = selector.split(" ") 
  for(let compSelector of compSelectors) {//compSelector:复合选择器 #myImg 或 p.text#name
    let regMatches = compSelector.match(/([a-zA-Z]+)|(.[a-zA-Z]+)|(#[a-zA-Z]+)/g)
    for(let subSelector of regMatches) {
      if(subSelector.charAt(0) == "#") {
        spec[1]++
      }else if(subSelector.charAt(0) == ".") {
        spec[2]++
      }else if(subSelector.match(/^[a-zA-Z]+/)) {
        spec[3]++
      }
    }
  }
  return spec
}


function compareSpecificity(spec1, spec2) {
  if(spec1[0] != spec2[0]) {
    return spec1[0] - spec2[0]
  }else if(spec1[1] != spec2[1]) {
    return spec1[1] - spec2[1]
  }else if(spec1[2] != spec2[2]) {
    return spec1[2] - spec2[2]
  }
  return spec1[3]-spec2[3]
}

function computeCSS(element) {
  // 深拷贝一份当前栈（包含当前元素的所有父元素）并由内向外排列
  var elements = stack.slice().reverse() 
  console.log("compute css for element", element)

  let matched = false
  for(let rule of rules){
    //CSS规则也由内向外，简单起见不考虑选择器列表和复杂选择器
    if(rule.type === "comment") {
      continue
    }
    let selectorPaths = rule.selectors[0].split(" ").reverse() 
    if(!match(element, selectorPaths[0])) {
      continue
    }
    // 由内向外循环遍历父元素队列，判断当前元素是否能匹配当前规则
    let j=1
    for(let i=0; i<elements.length; ++i) {
      if(match(elements[i], selectorPaths[j])) {
        ++j
      }
    }
    if(j >= selectorPaths.length) {
      matched = true
    }

    if(matched) {
      console.log("Element", element, "matched rule", rule)
      if(!element.computedStyle) {
        element.computedStyle = {}
      }
      let sp = computeSpecificity(rule.selectors[0])
      // if(!element.computedStyle.specificity) {
      //   element.computedStyle.specificity = sp
      //   for(let declaration of rule.declarations) {
      //     if(!element.computedStyle[declaration.property]) {
      //       element.computedStyle[declaration.property] = {}
      //     }
      //     element.computedStyle[declaration.property].value = declaration.value
      //   }
      // }else{
        for(let declaration of rule.declarations) {
          if(!element.computedStyle[declaration.property]) {
            element.computedStyle[declaration.property] = {}
          }
          if(!element.computedStyle[declaration.property].specificity) {
            element.computedStyle[declaration.property].value = declaration.value
            element.computedStyle[declaration.property].specificity = sp
          }
          if(compareSpecificity(element.computedStyle[declaration.property].specificity, sp) < 0){
            element.computedStyle[declaration.property].value = declaration.value
            element.computedStyle[declaration.property].specificity = sp
          }
        }

      // }
    }
  }
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
        element.attributes.push({name: key, value: token[key]}) // 原写法{key, token[key]}错误
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
      layout(top) // 进行布局排版需要知道所有子节点，因此要在标签结束并获得css规则后进行布局排版
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
  if(c == '>') {
    return data
  }else{
    // 忽略<!DOCTYPE xxx>和<!-- xxx -->节点
    return doctypeCommentTag
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
    return selfClosingTag
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
    return selfClosingTag
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
    return singleQuotedAttributeValue
  }  
}

function afterQuotedAttributeValue(c) {
  if(c.match(/[\t\n\f ]/)) {
    return beforeAttributeName
  }else if(c == '/') {
    return selfClosingTag
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
    return selfClosingTag
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
function selfClosingTag(c) {
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