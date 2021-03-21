/*
Notes: willcard含义：字符串模式中含有通配符*（匹配任意个字符）和？（匹配任意字符）,判断某一字符串是否符合该模式, e.g. ab*cd*abc*a?d
两种解题思路：1. 将除最后一个*之外的以*开头的子字符串利用正则分别与原串进行匹配
              2. 将除最后一个*之外的以*开头的子字符串利用带?号的KMP算法与原串匹配
*/

function find(source, pattern) {
  // 先统计模式串中*号的数量
  let starCount = 0
  for(let c of pattern) {
    if(c === "*")
      starCount++
  }
  // 没有*号的边界情况
  if(starCount === 0) {
    for(let i=0; i<source.length; i++) {
      if(source[i] != pattern[i] && pattern[i] != "?") 
        return false
    }
    return true
  }
  // 匹配第一个*前的子串
  let lastIndex = 0
  for(; pattern[lastIndex] != "*"; lastIndex++) {
    if(source[lastIndex] != pattern[lastIndex] && pattern[lastIndex] != "?") 
      return false
  }
  // 对*开头的子模式（除最后一个）用正则进行匹配
  for(let i=0; i<starCount-1; i++) {
    let subPattern = pattern.split("*")[i+1]
    let reg = new RegExp((subPattern.replace("?", "[\\s\\S]")), "g") // 全局匹配（会一直匹配到最后一个结果）
    if(!reg.exec(source)) // 返回null表示未匹配上
      return false
    lastIndex = reg.lastIndex
    // // 使用带?的KMP算法实现
    // let matchIndex = kmpWithQuestion(source.substring(lastIndex, source.length), subPattern)
    // if(matchIndex < 0)
    //   return false
    // lastIndex += matchIndex + subPattern.length
  }
  // 从后往前对最后一个*开头的子模式进行匹配
  for(let j=0; j<=pattern.split("*")[starCount].length; j++) {
    if(source[source.length-j] != pattern[pattern.length-j] && pattern[pattern.length-j] != "?") 
      return false
  }
  return true
}

// 带？号的kmp算法，当pattern=“ab?b?xc"，在建立跳转表格时还有问题
function kmpWithQuestion(source, pattern) { 
  if(pattern === "")
    return 0
  // 构建跳转表格
  let table = new Array(pattern.length).fill(0)
  {
    let i=1, j=0
    while(i < pattern.length) {
      if(pattern[i] === pattern[j]|| pattern[i] === "?") {
        i++, j++
        table[i] = j
      }else{
        if(j > 0) 
          j = table[j]
        else
          i++
      }
    }
  }

  // 进行模式匹配
  {
    let i=0, j=0
    while(i < source.length) {
      if(source[i] === pattern[j] || pattern[j] === "?") {
        i++, j++
      }else{
        if(j > 0){
          // if(pattern[table[j]]!="?") 
            j = table[j]
          // else{ // 因为前面的"?"已经使用过，所以当source[i] !== pattern[j] && pattern[j] !== "?"，匹配失败，模式串要从头开始匹配
          //   j = 0
          //   i++
          // }
        } 
        else
          i++
      }
      if(j === pattern.length) 
        return i-pattern.length
    }
    return -1
  }
}
// test case

console.log(find("abc", "ab?")) // true
console.log(find("abc", "ac?")) // false
console.log(find("ab", "ab*"))  // false
console.log(find("ab", "aa*"))  // true
console.log(find("abcabcabxaac", "a*b?*bx*c")) // true
console.log(find("abcabcabxaac", "a*b?*b?x*c")) // false