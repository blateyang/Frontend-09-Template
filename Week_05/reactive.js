let useReactives = []
let callbacks = new Map()
let reactives = new Map()
let obj = {
  a: {b: 'a.b'},
  b: 2
}

function effect(callback) {
  useReactives = []
  callback()
  for(let reactive of useReactives) {
    if(!callbacks.has(reactive[0])) 
    callbacks.set(reactive[0], new Map())
    if(!callbacks.get(reactive[0]).has(reactive[1])) 
      callbacks.get(reactive[0]).set(reactive[1], [])
    // 将回调函数添加到相关对象属性的回调列表中
    callbacks.get(reactive[0]).get(reactive[1]).push(callback)
  }
}

function reactive(obj) {
  if(reactives.has(obj)) //返回已缓存的代理对象
    return reactives.get(obj)
  let proxy = new Proxy(obj, {
    set(obj, prop, val) {
      obj[prop] = val
      if(callbacks.has(obj) && callbacks.get(obj).has(prop)) {
        for(let callback of callbacks.get(obj).get(prop)) {
          callback() // 执行对象属性的回调列表，注意如何避免重复执行相同的回调
        }
      }
      return obj[prop]
    },
    get(obj, prop) {
      useReactives.push([obj, prop]) // 搜集对象属性,注意如何避免重复收集
      if(typeof obj[prop] == "object")
        return reactive(obj[prop])
      return obj[prop]
    }
  })
  reactives.set(obj, proxy)
  return proxy
}

po = reactive(obj)

// 注册属性打印函数
effect(()=>{
  console.log(po.a)
})

po.a = {c:"a.c"}