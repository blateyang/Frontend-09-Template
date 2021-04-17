// 自己写的，借助了系统函数parseInt,parseFloat
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

/*
 训练营给出的参考答案，没有借助系统函数
 字符串转数字：利用正则表达式识别字符后通过字符的位置和所表示的数字完成转换
 数字转字符串：根据数字的基数进行编码然后将编码后的字符拼接起来，对于小数转字符串，因js不能精确表示小数，需要进行相应的数值分析（误差足够小后停止）
*/

function str2num(str) {
  const decimalPattern = /^([\+\-])?(\d+)?(?:\.(\d*))?(?:e([\+\-]?)(\d+))?$/i // $:表示忽略当前的匹配组, /i表示忽略大小写
  const binaryPattern = /^([\+\-])?0b([0-1]+)$/i
  const octalPattern = /^([\+\-])?0o([0-7]+)$/i
  const hexaPattern = /^([\+\-])?0x([0-9a-f]+)$/i
  const charMapping = {
    '0': 0, '1': 1, '2': 2, '3': 3, 
    '4': 4, '5': 5, '6': 6, '7': 7,
    '8': 8, '9': 9, 'a': 10, 'b': 11, 
    'c': 12, 'd': 13, 'e':14, 'f': 15
  }
  // 采用幂的累积和方式转换数字字符串，fractionFlag用来表示数字字符串是整数部分还是小数部分（决定幂的指数是正还是负）
  const decodeNumber = function(numberStr, radix, fractionFlag) {
    let result = 0
    numberStr = numberStr.toLowerCase()
    for(let offset=0; offset<numberStr.length; ++offset) {
      let exponent = fractionFlag ? -1*(offset + 1) : numberStr.length-(offset+1)
      result += charMapping[numberStr[offset]] * Math.pow(radix, exponent) // Math.pow(10, -1)*3不是严格的0.3, 会存在精度问题
    }
    return result
  }

  if(typeof str !== 'string') {
    return NaN
  }
  
  let radix, matches, sign, integer = '',  fraction = '', exponentSign = 1, exponent = '', result = 0
  if(matches = str.match(decimalPattern)) {
    radix = 10
    fraction = matches[3] || ''
    exponentSign = matches[4] === '-' ? -1:1
    exponent = matches[5] || ''
  }else if(matches = str.match(hexaPattern)) {
    radix = 16
  }else if(matches = str.match(octalPattern)) {
    radix = 8
  }else if(matches = str.match(binaryPattern)) {
    radix = 2
  }else {
    return NaN
  }

  sign = matches[1] === '-' ? -1:1
  integer = matches[2]

  result += decodeNumber(integer, radix, false)
  result += decodeNumber(fraction, radix, true)
  return exponentSign > 0 
    ? sign*result*Math.pow(radix, decodeNumber(exponent, radix, false))
    : sign*result/Math.pow(radix, decodeNumber(exponent, radix, false))
}

function num2str(number, radix) {
  const encodeDictionary = '0123456789abcedf'
  // 使用辗转相除法
  const encodeNumberInteger = function(input, radix) {
    let result = ''
    while(input > 0) {
      let encodeNumber = input % radix
      result = encodeDictionary[encodeNumber] + result
      input = Math.floor(input/radix)
    }
    return result
  }
  // 使用辗转相乘法，注意用数值分析解决js不能精确表示小数的问题
  const encodeNumberFraction = function(input, radix) {
    let result = ''
    let errorFactor = 1
    if(Math.log2(input)%1) {
      errorFactor = number // 十进制的errorFactor为number，不太理解
    }
    while(true) {
      // 与0或1的距离小于精度
      if(input <= Number.EPSILON*errorFactor*Math.pow(radix, result.length+1) || 
        input >= 1-Number.EPSILON*errorFactor*Math.pow(radix, result.length+1)) {
          break
        }
      input = input *radix
      let encodeNumber = Math.floor(input)
      input = input % 1
      if(input >= 1-Number.EPSILON*errorFactor*Math.pow(radix, result.length+1)) {
        encodeNumber++ // 接近1时达到精度直接向上取整
      }
      result += encodeDictionary[encodeNumber]
    }
    return result
  }

  if(typeof number !== 'number' || typeof radix !== 'number'){
    return null
  }

  if(radix > encodeDictionary.length || radix <=1) {
    return null
  }

  let sign = number < 0 ? -1:1
  number *= sign // 转成正数处理
  let integer = Math.floor(number)
  let fraction = number%1

  let integerString = encodeNumberInteger(integer, radix)

  let fractionString = encodeNumberFraction(fraction, radix)
  let result = ''
  result += integerString.length > 0 ? integerString : '0'
  result += fractionString.length > 0 ? '.'+fractionString : ''

  return sign === -1 ? '-'+result : result
}