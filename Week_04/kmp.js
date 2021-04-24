/**
 * KMP算法：快速寻找字符串中的模式子串，时间复杂度为O(m+n)
 * 分两步：1. 计算模式串的自重复子串长度表格table 2. 根据自重复表格指导原串和模式串的匹配
 * @param {String} source 
 * @param {String} pattern 
 */
function kmp(source, pattern) {
//  if(pattern == "") return 0
  let table = new Array(pattern.length+1).fill(0) // +1避免数组越界，如模式串为aa
  // 计算模式串的自重复子串长度表格，指针i一直向前，时间复杂度O(m)
  {
    let i=1, j=0
    while(i < pattern.length) { 
      if(pattern[i] === pattern[j]) {
        i++, j++
        table[i] = j
      }else{
        if(j > 0) 
          j = table[j] // 不匹配时将j往前回退到table[j]
        else
          i++
      }
    }
  }
  // console.log(table)
  // 进行KMP匹配，过程与计算table类似，时间复杂度O(n)
  {
    let i=0, j=0
    while(i < source.length) {
      if(source[i] === pattern[j]) {
        i++, j++
      }else{
        if(j > 0) 
          j = table[j] // 不匹配时将j往前回退到table[j]
        else
          i++
      }
      if(j === pattern.length) {
        return true
        // return i-pattern.length
      }
    }
    return false
    // return -1
  }
}

console.log(kmp("abcdabcdabce", "abcdabce"))
console.log(kmp("abc", "abc"))
console.log(kmp("abc", "abe"))
console.log(kmp("abc", ""))
console.log(kmp("mississippi", "issip"))