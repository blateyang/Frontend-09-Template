学习笔记
## 1 JS表达式（Expression）
表达式是由运算符和Atom级的identifier、literal组合而成
### 1.1 运算符和表达式
1. 语法角度Grammer Tree vs Priority

运算符的优先级会影响语法树的构成，而运算符的优先级在语法上对应的就是表达式的优先级，下面将各表达式按照优先级由低到高结构由小到大列出
- Member Exp：
  - a.b
  - a[b]
  - super.b
  - super['b']
  - f\`string\`
  - new Foo() e.g. new Foo()()的结合顺序
- New Exp：
  - new Foo e.g. new new Foo()的结合顺序
- Call Exp：
  - foo()
  - foo()['b'] 注意Call Exp后跟Member Exp时Member Exp优先级会被拉低，所以new a()['b']中a()先与new结合表示new出一个a对象再访问其'b'属性
  - foo().b
  - foo()\`abc\` 
- Left Handside & Right Handside
  - Left Handside：能够放在=左边的表达式，上面三种都是，如a.b = c中的a.b
  - Right Handside：不能放在=左边的表达式，如a+b，从下面开始都是右值表达式
- Update Exp: a++, ++a, a--, --a
- Unary Exp：
  - delete a.b
  - void foo()
  - typeof a
  - +a
  - -a
  - ~a
  - !a 常用!!a将任意类型转换成布尔类型
  - await a
- Exponental Exp: **js中唯一的右结合运算符
- Multiplicative Exp: * / %
- Additive Exp: + -
- Shift Exp: >> << >>>
- Relational Exp：< << >> > instanceof in
- Equality Exp: == != === !==
- Bitwise Exp: & | ^
- Logical Exp: && || 有短路逻辑
- Conditional Exp: ? : 有短路逻辑
2. 运行时角度的Reference类型
Reference并非js语言中的类型而是标准规定的在运行时中的类型，它由object和key共同组成，在对对象属性进行assign、delete等操作时，通过Refence类型实现。

### 1.2 类型转换
|        | Number | String | Boolean | Undefined | Null | Object | Symbol |
|-| - | - | - | - | - | - | - |
| Number | -      |         | 0 false| x | x | 装箱| x |
| String |       |  -       | "" false| x | x | 装箱| x |
| Boolean| true 1,false 0| 'true','false' | - | x | x| 装箱| x|
|Undefined| NaN | 'Undefined' | false | - | x | x | x|
|Null| 0 | 'null' | false | x | - | x | x|
|Object| valueOf | toString,valueOf | true | x | x | - | x|
|Symbol| x | x | x | x | x | 装箱 | -|

**装箱转换**：运行时中Number,String,Boolean,Symbol类型的值会根据需要转换成对象类型
- Number 1 在必要时会自动装箱成new Number(1) 
- String "x" 在必要时会自动装箱成new String("xxx")
- Boolean true 在必要时会自动装箱成new Boolean(true)
- Symbol("xxx") 在必要时会自动装箱成new Object(Symbol("xxx"))

可以利用typeof区分是原生类型还是装箱后的对象类型

**拆箱转换**：Object在运算时自动根据情况变成Primitive类型,会优先调用[Symbol.toPrimitive()]方法，其次根据情形选择先调用valueOf还是toString
e.g. 
```js
var o = {
  toString() {return "2"},
  valueOf() {return 1},
  [Symbol.toPrimitive]() {return 3}
}
var v = {}
v[o] = 1 // 调用顺序[Symbol.toPrimitive],toString,valueOf
console.log("x"+o) //调用顺序[Symbol.toPrimitive],valueOf,toString
```

### 1.3 练习 StringToNumber & NumberToString
```js
function StringToNumber(str) {
  str = str.trim()
  let signed = 1
  let result = 0
  if(str[0] === '+' || str[0] === '-') {
    signed = -1
    str = str.substring(1)
  }
  // 小数字符串转十进制数
  function str2decimal(s, base) { // s:.xxxx
    let res = 0
    for(let i=1; i<s.length; ++i) {
      if(s[i].match(/[0-9a-zA-Z]/))
        res += parseInt(s[i], base) * base**(-i)
      else
        break
    }
    return res
  }

  let prefix = str.substr(0, 2).toLowerCase()
  if(prefix == "0b" || prefix == "0o" || prefix == "0x") {
    let base = 10
    if(prefix == "ob")
      base = 2
    else if(prefix == "0o")
      base = 8
    else
      base = 16
    result = parseInt(str.substring(2), base)
    if(str.indexOf(".") !=-1) // 加上小数部分
      result += str2decimal(str.substring(str.indexOf(".")), base)
  }else{
    result = parseFloat(str)
  }
  return signed*result
}

// testcase
let n = NumberToString(-2.3e-2, 16) // 换成8,2或者不填第二个参数
StringToNumber(n)
n = NumberToString(12., 16) // 第一个参数依次换成.12,12.12，第二个参数换成8,2或者不填
StringToNumber(n)
```
需要用到parseInt和parseFloat，相关介绍参考[MDN的parseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)和[MDN的parseFloat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)
```js
function NumberToString(num, radix) {
  let str = num.toString(radix)
  if(radix === 2)
    return num<0 ? str[0]+"0b"+str.substring(1) : "0b"+str
  else if(radix === 8)
    return num<0 ? str[0]+"0o"+str.substring(1) : "0o"+str
  else if(radix === 16)
    return num<0 ? str[0]+"0x"+str.substring(1) : "0x"+str
  else
    return num.toString(radix)
}

```
## 2 JS语句（Statement）
### 2.1 运行时相关概念
1. Completion Record：运行时中的一种类型，用来记录语句的完成状态
- [[type]]: normal, break, continue, return, throw
- [[value]]: 基本类型
- [[target]]: label(可用于break,continue跳转)
### 2.2 简单语句和复杂语句
1. 简单语句
- 表达式语句:表达式;
- 空语句:;
- Debugger语句:debugger;用于断点调试
- Throw语句
- Continue语句
- Break语句
- Return语句
2. 组合语句：多用于控制简单语句的执行顺序
- 块语句BlockStatement：{...}
- If语句
- Switch语句
- 循环语句：
    - while循环
    - do while循环
    - for(;;)
    - for of
    - for in
- LabelledStatement：`label: 语句` 相当于给语句起了个名字，常和循环语句以及break，continue语句结合使用
- try语句：注意在try中使用return语句，finally中的代码依然会执行，这是try语法规定的
```js
try{

}catch(){

}finally{

}
```
- With语句
### 2.3 声明Declaration
#### 2.3.1 声明的类型
1. 函数声明
- Function声明
- Generator声明
- AsyncFunction声明
- AsyncGenerator声明
2. Variable声明
3. Class声明
4. Lexical声明：let/const
#### 2.3.2 运行时中声明相关的概念：作用域
声明的变量所起作用的范围，var声明的变量作用域是函数（局部）作用域，Lexical声明的变量作用域是块级作用域，实践中为避免在使用Lexical声明同名变量相互产生干扰，可用{}限定作用域
#### 2.3.3 声明的预处理机制
JS引擎在执行时会对声明语句提前进行处理以确定其含义，所有声明都存在预处理机制。
- 函数声明和Variable声明的预处理机制类似，属于旧的声明体系，函数声明会将预处理的创建和初始化（为undefined）阶段提升到全局作用域开头，将赋值阶段提升到当前作用域开头，而var声明会将预处理的创建和初始化（为undefined）提升到当前作用域开头
- Class声明和Lexical声明的预处理机制类似，属于新的声明体系，在声明之前使用被声明的变量均会报错，更规范推荐使用。Lexical声明会将预处理的创建阶段提升到当前作用域开头，而Class声明在全局作用域没有预处理，在非全局作用域和Lexical声明一样，将创建阶段提前。
e.g.
```js
var a = 2;
void function() {
  a = 1;
  return;
  var a;
}(); // IIFE立即执行的函数
console.log(a) // 2

void function() {
  a = 1;
  return;
  const a=3;
}(); // 抛错Uncaught SyntaxError: Missing initializer in const declaration，说明const有预处理
console.log(a) // 还是2
```
## 3 JS结构化
### 3.1 宏任务和微任务
1. JS在运行时的执行粒度（大-》小）
- 宏任务(MacroTask)：按jsc（js的一种引擎）的标准由浏览器发起交给js引擎的任务
- 微任务（MicroTask,如Promise)：由js引擎发起的任务，也称job
- 函数调用（Execution Context)
- 语句/声明（Completion Record)
- 表达式（Reference)
- 直接量、变量、this
2. 事件循环
js引擎不断循环“等待-》获取代码-》执行代码”的过程，node中也有

### 3.2 JS函数调用
1. 执行上下文Execution Context可能包含的内容
- code evaluation state：用于恢复代码执行位置
- Function：执行函数任务时正在被执行的函数
- Script or Module：执行脚本或模块任务时正在执行的代码
- Generator：执行生成器时的当前生成器
- Lexical Environment：词法环境，当获取变量或this值时使用
- Variable Environment：变量环境，当声明变量时使用
- Realm：保存所使用的内置对象的领域，如{},[]以及装箱对象的原型对象
2. 函数调用的执行上下文栈
函数在调用的时候JS引擎会将它的执行上下文保存到执行上下文栈中，而栈顶是正在运行的执行上下文（Running Execution Context)
e.g.
test.js
```js
import {foo} from "foo.js"
var i=0;
function test() {
  console.log(i);
  foo();
  console.log(i);
  i++;
}
test();
```
foo.js
```js
import {foo2} from "foo2.js"
var x=1;
export function foo() {
  console.log(x);
  console.log(i); // 会报错，无法访问到i，因为i不在foo函数的执行上下文中
  foo2();
  console.log(x);
}
```
foo2.js
```js
var y=2;
export function foo2() {
  console.log(y);
}

```
上述代码的执行上下文栈如下：
test Execution Context(i:0) | foo Execution Context(x:1) | foo2 Execution Context(y:2)
------------------------------------------------------------------------------------->
                              Execution Context Stack

3. 函数闭包(closure)和作用域链（scope chain)
- js的函数都有闭包，闭包包含两个部分：代码部分和环境部分
```js
var y=2; // 环境部分，Environment Record
export function foo2() {
  console.log(y) // 代码部分
}
```
- 作用域链
作用域链决定了各级上下文中的代码在访问变量和函数时的顺序，每个上下文都有一个关联的变量对象（保存了对应上下文中定义的所有变量和函数），代码正在执行的上下文的变量对象位于作用域链的最前端，作用域链中下一个变量对象来自包含上下文，以此类推直到全局上下文，解析标识符时会沿着作用域链逐级向上搜索。
```js
var y=2; 
export function foo2() {
  var z =3;
  return ()=>{
    console.log(z, y)
  }
}
var foo3 = foo2();
export foo3;
```
foo3的闭包
- 环境部分：z:3, 箭头函数引入的this:global => foo2的环境部分 y:2
- 代码部分： console.log(z, y) （沿着作用域链可访问到y）

### 3.3 作业：找出Realm中可以使用的js内置对象
参考built-in-visualization.html
