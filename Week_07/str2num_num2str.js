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