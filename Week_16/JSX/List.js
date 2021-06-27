import {Component, createElement, ATTRIBUTE} from "./framework.js"
export class List extends Component{
  constructor() {
    super()
  }
  render() {
    this.root = (<div>{this.children}</div>).render() // 要在createElement中加入递归处理数组的逻辑
    return this.root
  }
  appendChild(child) {
    this.template = (child)
    this.children = this[ATTRIBUTE].data.map(this.template) // template是传入的模板回调函数
    this.render()
  }
}