学习笔记
## 1 字符串算法总论
常用字符串分析算法：
1. Trie字典树：适用于大量高重复字符串的分析和处理，如判断某字符串是否出现在大型词库中或求海量字符串中出现次数最多的字符串
2. KMP算法：适用于在长字符串中找模式，如在abcdabce中找abce
3. Willcard: 匹配带通配符的字符串模式，如判断abcdabce是否匹配a?\*d\*ce
4. 正则：字符串通用模式匹配，参见Week_03的LLparser.html代码
5. 有限状态机：通用的字符串分析，参见Week_03的LLparser.html代码
6. LL和LR：字符串多层级结构分析，如构建抽象语法树AST
## 2 Trie字典树
Trie字典树是哈希树在字符串中应用的特例，常用的操作包括节点插入和查找以及查找出现次数最多或最少的字符串
## 3 KMP算法
KMP算法是由三位计算机科学家共同发明的字符串模式查找算法，它利用了模式串可能存在的自重复特性构建跳转表格，在原串与模式串不匹配时，原串的指针不用回退，而只将模式串的指针根据跳转表格回退，从而加速匹配。
```js
function kmp(source, pattern) {
  if(pattern.length === 0)
    return 0 
  // 构建跳转表格
  let table = new Array(pattern.length).fill(0)
  {
    let i=1, j=0
    while(i < pattern.length) {
      if(pattern[i] === pattern[j]) {
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
      if(source[i] === pattern[j]) {
        i++, j++
      }else{
        if(j > 0) 
          j = table[j]
        else
          i++
      }
      if(j === pattern.length) 
        return i-pattern.length
    }
    return -1
  }
}
```
## 4 Willcard算法
该算法比KMP算法要难一些，因为增加了\*和?通配符，\*表示匹配任意个字符，?表示匹配任意字符，当字符串中含有多个\*,应当将最后一个\*视为尽可能多地匹配字符，而将其余*视为尽可能少匹配字符。winter老师提供了两种思路：1. 将除最后一个\*的其它\*xxx视作子模式串利用正则和原串依次匹配； 2. 将除最后一个\*的其它\*xxx视作子模式串利用带？号的KMP算法和原串依次匹配

第一种正则匹配思路的大致步骤是：
1. 统计*出现的次数记为starCount
2. 当starCount=0时，正常逐字符匹配并返回结果
3. 匹配第一个*号前的子串
4. 将前starCount-1个以*开头的模式子串通过正则依次与原串进行全局匹配
5. 对最后一个*开头的模式子串，从后往前与原串逐字符匹配

第二种带？号KMP思路的大致步骤与正则匹配思路的步骤类似，只是第4步是使用带?号KMP算法进行匹配，至于带？的KMP算法日后有机会补充