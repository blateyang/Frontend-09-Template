import {foo2} from "./foo2.js"
var x=1;
export function foo() {
  console.log(x);
  console.log("i:"+i) // Uncaught ReferenceError: i is not defined
  foo2();
  console.log(x);
}

let nativeObjects = [Array,    Date,    RegExp,    Promise,    Proxy,    Map,    WeakMap,    Set,    WeakSet,    Function,    Boolean,    String,    Number,    Symbol,    Object,    Error,    EvalError,    RangeError,    ReferenceError,    SyntaxError,    TypeError,    URIError,    ArrayBuffer,    SharedArrayBuffer,    DataView,    Float32Array,    Float64Array,    Int8Array,    Int16Array,    Int32Array,    Uint8Array,    Uint16Array,    Uint32Array,    Uint8ClampedArray]
let intrinsicObjects = [eval,    isFinite,    isNaN,    parseFloat,    parseInt,    decodeURI,    decodeURIComponent,    encodeURI,    encodeURIComponent, Atomics,    JSON,    Math,    Reflect]
let objects = nativeObjects.concat(...intrinsicObjects)
let jsonData = {
  "id": "built-in objects",
  "children": [
    {
      "id": "nativeObjects",
      "children": [

      ]
    },
    {
      "id": "intrinsicObjects",
      "children": [

      ]
    }
  ]
}
// let set = new Set()
// objects.forEach(o => set.add(o))
for(let i=0; i<objects.length; ++i) {
  let o = objects[i]
  // 生成json数据用于Antv G6可视化
  if(nativeObjects.includes(o))
    jsonData.children[0].children.push({"id": o.name === undefined ? o.toString() : o.name})
  else
    jsonData.children[1].children.push({"id": o.name === undefined ? o.toString() : o.name})

  let proterties = Object.getOwnPropertyNames(o)
  for(let p of proterties) {
    let d = Object.getOwnPropertyDescriptor(o, p)
    if(d.value !== null && typeof d.value === "object" || typeof d.value === "function") {
//      if(!set.has(d.value)) {
      if(!objects.includes(d.value)) {
        // set.add(d.value)
        objects.push(d.value)
      }
    }
    if(d.get && !objects.includes(d.get)) 
      objects.push(d.get)
    if(d.set && !objects.includes(d.set)) 
      objects.push(d.set)
  }
}
console.log(JSON.stringify(jsonData))