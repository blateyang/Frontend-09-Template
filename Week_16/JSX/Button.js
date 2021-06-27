import {Component, createElement} from "./framework.js"
export class Button extends Component{
  constructor() {
    super()
  }
  render() {
 //   this.childContainer = <span/>
    this.root = (<div>{this.childContainer}</div>).render()
    // debugger
    return this.root
  }
  appendChild(child) {
    // debugger，参考createElement，appendChild会先于render执行
    // if(!this.childContainer)
    //   this.render()
    // this.childContainer.appendChild(child)
    this.childContainer = child
    this.render()
  }
}