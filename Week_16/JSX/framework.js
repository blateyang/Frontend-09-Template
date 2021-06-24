
export function createElement(type, attributes, ...children) {
  let element
  if(typeof type === "string")
    element = new ElementWrapper(type)
  else 
    element = new type()
  for(let attr in attributes) {
    element.setAttribute(attr, attributes[attr])
  }
  let processChildren = (children) => {
      for(let child of children) {
        if((typeof child === "object") && (Object.prototype.toString.call(child) === "[object Array]")) {
          processChildren(child)
          continue
        }
        if(typeof child === "string") {
          child = new TextWrapper(child)
        }
        console.log(child)
        element.appendChild(child);
      }
  }
  processChildren(children)
  return element
}

export const STATE = Symbol("state")
export const ATTRIBUTE = Symbol("attribute")
export class Component {
  constructor(type) {
    // this.root = this.render()
    this[ATTRIBUTE] = Object.create(null) // 创建空对象接收src属性
    this[STATE] = Object.create(null)
  }
  render() {
    return this.root
  }
  setAttribute(name, value) { 
    this[ATTRIBUTE][name] = value
  }
  appendChild(child) {
        child.mountTo(this.root);
  }
  mountTo(parent) {
    if(!this.root) this.render()
    parent.appendChild(this.root)
  }
  triggerEvent(type, args) {
    this[ATTRIBUTE]["on"+ type.replace(/^[\s\S]/, x=>x.toUpperCase())](new CustomEvent(type, {detail: args})) // eventCallback(event)
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super()
    this.root = document.createElement(type)
  }
  setAttribute(name, value) { 
    this.root.setAttribute(name, value)
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super()
    this.root = document.createTextNode(content)
  }
}
