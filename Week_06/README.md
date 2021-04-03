学习笔记
## 1 JS语言通识
### 1.1 泛用语言分类方法
[乔姆斯基谱系](https://baike.baidu.com/item/%E4%B9%94%E5%A7%86%E6%96%AF%E5%9F%BA%E8%B0%B1%E7%B3%BB/9880643?fr=aladdin)是计算机科学中用于刻画形式文法表达能力的一个分类谱系,1956年由乔姆斯基提出。（自顶向下是包含的关系）
- 0型 无限制文法：?::=? （该类型的文法能够产生所有可被图灵机识别的语言，也被称为递归可枚举语言）
- 1型 上下文相关文法： ? \<A\> ?' ::= ? \<B\> ?'
- 2型 上下文无关: \<A\> ::= ? (大多数编程语言符合的范式)
- 3型 正则文法：\<A\> ::= \<A\>?
严格意义上讲js属于1型上下文相关语法，因为
```js
{
  get a() {return "a"}, // get为关键字
  get: 1 // get为属性，get的含义和上下文相关
}
```
### 1.2 符号和产生式
#### 1.2.1 符号（Symbol)
- 终结符Terminal Symbol：符号的基本元素，不可再分
- 非终结符NonTerminal Symbol: 可由终结符构成
#### 1.2.2 产生式
产生语言的书写规则，包括BNF(巴克斯-诺尔范式)和EBNF（扩展的BNF）下面以四则运算举例

终结符：
- 数字
- 四则运算符

非终结符：
- 加法算式
- 乘法算式

- BNF写法

  <加法算式> ::= <乘法算式> | <加法算式> ('+'|'-') <乘法算式>

  <乘法算式> ::= <数字> | <乘法算式> ('*'|'/') <数字>

- EBNF写法

  加法算式 ::= 乘法算式 | 加法算式 ('+'|'-') 乘法算式

  乘法算式 ::= 数字 | 乘法算式 ('*'|'/') 数字

#### 1.2.3 第2小节课后练习-带括号的四则运算产生式(EBNF范式)
- 终结符： 数字、四则运算符和左右括号
- 非终结符： 括号算式，加法算式，乘法算式
```
  括号算式 ::= 加法算式 | 括号算式 + '(' 加法算式 ')' | 括号算式 - '(' 加法算式 ')' | 括号算式 * '(' 加法算式 ')' | 括号算式 / '(' 加法算式 ')'

  加法算式 ::= 乘法算式 | 加法算式 '+' 乘法算式 | 加法算式 '-' 乘法算式

  乘法算式 ::= 数字 | 乘法算式 '*' 数字 | 乘法算式 '/' 数字


```
### 1.3 现代语言的分类
1. 非形式语言（无法用形式化的定义描述的语言）：如汉语、英语等人类语言
2. 形式语言：如编程语言
（第四小节作业）
  - 形式语言按用途分
    - 数据描述语言：xml,json,html,xhtml,SQL,css等
    - 编程语言:C,C++,Java,python,javascript,Lisp等
  - 形式语言按表达方式分
    - 声明式语言：数据描述语言、函数式语言如Lisp
    - 命令式语言：编程语言中的非函数式语言，如C,C++,Java,python,javascript

### 1.4 编程语言的性质
1. 图灵完备性：所有可计算的问题都可用来描述的（能等效成图灵机）
  - 命令式——图灵机（可用来解决任何可计算问题的抽象机器，类似无限存储空间的算盘）
    - goto
    - if和while
  - 声明式——lambda
    - 递归

相关参考-什么是图灵完备？ - 知乎用户的回答 - 知乎
https://www.zhihu.com/question/20115374/answer/288346717

2. 动态&静态
  - 动态
    - 在用户设备上&在线服务器上
    - 产品实际运行时
    - Runtime
  - 静态
    - 在程序员的设备上
    - 产品开发时
    - Compiletime
3. 类型系统
  - 动态类型系统和静态类型系统（依据在用户还是开发者设备上能否找到划分）
    - 动态类型系统：在用户设备上能找到类型的系统，如JS
    - 静态类型系统：在程序员设备上产品开发时能找到类型的系统，如C++（Java属于半静态和半动态，因为反射机制可以在运行时获取类型信息）
  - 弱类型和强类型（类型转换发生的形式）
    - 弱类型：类型转换自动发生（隐式转换），如JS的String+Number
    - 强类型：类型转换不会自动发生，如C++
  - 复合类型：如结构体
  - 子类型：如C++中的子类
  - 泛型
    - 协变：凡是能用Array<Parent\>的地方都能用Array<Child\>，子类可以转换成父类
    - 逆变：凡是能用Function<Child\>的地方都能用Function<Parent\>，父类可以转换成子类
### 1.5 一般命令式编程语言的设计方式
1. Atom原子级
  - Identifier
  - Literal
2. Expression表达式级
  - Atom
  - Operator
  - Punctuator
3. Statement声明语句级
  - Expression
  - Keyword
  - Punctuator
4. Structure
  - Function
  - Class
  - Namespace
  - ...
5. Program
  - Program
  - Module
  - Package
  - Library
## 2 JS的类型
### 2.1 Number
#### 2.1.1 表示方法——IEEE754双精度浮点数
采用的是IEEE754双精度64位浮点数标准，由1位符号位，11位指数偏移位（决定了数的表示范围）和52位精度位(fraction或叫尾数位，决定了数的表示精度)组成，能准确表示的数的范围是-(2^53-1)~(2^53-1)，但要注意四点：
1. 使用浮点数参与运算可能会产生精度误差，这是由于使用IEEE754标准进行浮点数运算可能会产生精度损失，详细参考[https://zhuanlan.zhihu.com/p/28162086](https://zhuanlan.zhihu.com/p/28162086)
2. 通过使用js能表示的最大数并非2^53-1，而是Number.MAX_VALUE，2^53-1只是能准确表示的最大安全整数
3. Number.MIN_VALUE表示的也并非最小的数，而是最小的正数
4. 三个特殊数字：
  - Infinity无穷大
  - -Infinity负无穷大
  - NaN: Not a Num
#### 2.1.2 Number语法
- 十进制字面量:支持前后小数点和科学计数法
  - 0
  - 0.
  - .2
  - 1e3
- 二进制整数字面量
  - 0b111
- 八进制整数字面量
  - 0o10
- 十六进制整数字面量
  - 0xFF

案例：0.toString()和0 .toString()

### 2.2 String
#### 2.2.1 String的表示
- Character
- Code Point
  - ASCII: 最早的编码集，用0~127表示最常用的字符
  - Unicode：万国码集，用两个字节编码表示字符
  - GB:中文编码集
    - GB2312
    - GBK(GB13000)
    - GB18030
  - ISO-8859：东欧国家的编码集
- Encoding
  - UTF: 基于Unicode的编码方式，包括UTF8和UTF16
#### 2.2.2 第8小节课后练习：字符串UTF8编码
```js
// 输入任意字符串，输出UTF8编码
/* UTF8编码规则：
如果只有一个字节则最高二进制位为0；如果是多字节，其第一个字节从最高位开始，连续的二进制位值为1的个数决定了编码字节数，
其余各字节均以10开头
*/
function UTF8_Encoding(str) {
  let res = ""
  let utf8 = ""
  for(let i=0; i<str.length; i++) {
    let utf16Code = str.charCodeAt(i) // charCodeAt()返回的是UTF16编码
    utf8 = utf16Code.toString(2)
    if(utf16Code < 128){ // bit数0~7，兼容ASCII
      while(utf8.length < 7)
        utf8 = "0" + utf8
      utf8 = "0" + utf8
    }else if(utf16Code < 2**12){ // bit数8~11
      while(utf8.length < 11)
        utf8 = "0" + utf8
      utf8 = "110"+ utf8.substr(0, 5) + "10" + utf8.substr(5, 6)
    }else if(utf16Code < 2**17) { // bit数12~16
      while(utf8.length < 16) 
        utf8 = "0" + utf8
      utf8 = "1110" + utf8.substr(0, 4) + "10" + utf8.substr(4, 6) + "10" + utf8.substr(10, 6)
    }else{
      utf8 = "超过3字节"
    }
    res += utf8
  }
  return res
}
```
#### 2.2.3 String语法
- "xxx"
- 'xxx'
- `xx${xx}x`：使用反引号的字符串模板
  - 特殊用法——函数名后跟字符串模板(将被`${}`分隔的字符串作为字符串数组，与`${}`中的变量一同作为参数传入函数并执行)

### 2.3 Null和Undefined
- Undefined类型表示未定义，值为undefined，是一个全局变量，在局部作用域可被重新赋值，为避免出错，建议用void 0代替使用
- Null类型表示定义了但值为空null

### 2.4  对象的基础知识
#### 2.4.1 面向对象的三要素
- identifier唯一标识性
- state状态
- behavior行为：用来改变对象的状态
#### 2.4.2 面向对象设计范式
1. 基于class的：动物分类
2. 基于原型prototype的：照猫画虎
#### 2.4.3 第10小节课后练习——“狗咬人”行为如何使用对象抽象
错误思路(bite方法没有改变狗的状态)
```js
class Dog {
  bite(human) {
    //...
  }
}
```
正确思路(遵循行为改变状态的面向对象基本原则，否则设计出的对象会失去内聚性)
```js
class Human {
  hurt(damage) {
    //...
  }
}
```
### 2.5 JS中的对象
JS中对象的属性既可以描述状态也可以描述行为（将函数作为属性），而唯一标识性则通过唯一内存地址保证。
#### 2.5.1 JS的原型链机制
JS的每个对象都有一个原型对象，在访问对象属性时如果对象自身没有则会到它的原型对象中去找，而原型对象也有它自己的原型对象，由此构成一个链式结构，即为原型链，原型链保证了每个对象只需要描述自己和原型的区别即可。
#### 2.5.2 JS对象的属性
1. 键key
  - String
  - Symbol:具有唯一性
2. 值value
  - 数据属性：一般用于描述状态，包括[[value]], writable, enumerable, configurable特征值
  - 访问器属性：一般用于描述行为，包括get, set, enumerable, configurable特征值

ps: [[]]双括号括起来的属性是无法在JS中无法访问到但在运行时中又能看到的特殊私有属性

3. JS对象的API和语法
  - 基本面向对象能力：{}/./[]/Object.defineProperty
  - 基于原型的描述对象的API：Object.create/Object.setPrototypeOf/Object.getPrototypeOf
  - 基于分类方式描述对象的API： new/class/extends
  - 上一种的低层实现：new/function/prototype
4. JS的一种特殊对象——Function函数对象

函数对象可通过function关键字、箭头函数、Function构造器创建，除了具有一般对象的属性和行为，还具有一个特殊的行为[[call]],当用类似f()的语法把对象当作函数调用时会访问到[[call]]行为。

5. 第11小节课后作业：找出JS标准里面所有具有特殊行为的对象
参考[重学前端-JavaScript对象：你知道全部的对象分类吗](https://time.geekbang.org/column/article/80011)中具有特殊行为的对象
个人认为具有[[]]特殊行为的对象都属于，如
- Function对象（[[call]]）