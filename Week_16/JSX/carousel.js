import {Component, STATE, ATTRIBUTE} from "./framework.js"
import {enableGesture} from "./gesture.js"
import {Timeline, Animation} from "./animation"
import {ease} from "./ease.js"

export {STATE, ATTRIBUTE} from "./framework.js" // 导出供组件使用者使用

export class Carousel extends Component{
  constructor() {
    super()
  }
  render() {
    this.root = document.createElement("div")
    this.root.classList.add("carousel")
    for(let item of this[ATTRIBUTE].src) {
      let img = document.createElement("div")
      img.style.backgroundImage = `url(${item.img})`
      this.root.appendChild(img)
    }

    // 给根元素添加手势组件
    enableGesture(this.root)

    this[STATE].position = 0 // 当前图序号
    let time = 3000
    let that = this
    let children = that.root.children

    // 自动轮播
    let tl = new Timeline()
    tl.start()

    let ax = 0 //在进行手势操作前动画的位移
    let handler = null  

    let nextPicture = ()=>{
      let children = this.root.children
      let nextIdx = (this[STATE].position + 1) % children.length
      let current = children[this[STATE].position]
      let next = children[nextIdx]

      tl.add(new Animation(current.style, "transform", -this[STATE].position*500, -500-this[STATE].position*500, 500, 0, ease, v=>`translateX(${v}px)`))
      tl.add(new Animation(next.style, "transform", 500 - nextIdx*500, -nextIdx*500, 500, 0, ease, v=>`translateX(${v}px)`))

      this[STATE].position = nextIdx
      this.triggerEvent("change", {position: this[STATE].position})

    }
    handler = setInterval(nextPicture, time)
    
    // 手动控制轮播
    this.root.addEventListener("start", (event)=>{
      console.log("start")
      tl.pause()
      clearInterval(handler)
      let progress = tl.getAnimeRunTime() / 500
      ax = ease(progress) * 500 - 500
    })

    this.root.addEventListener("tap", (event)=>{
      this.triggerEvent("click", {
        data: this[ATTRIBUTE].src[this[STATE].position],
        position: this[STATE].position
      })
    })

    this.root.addEventListener("pan", (event)=>{
      console.log("pan")
      let x = event.clientX - event.startX - ax
      let current = this[STATE].position - ((x-x%500)/500) // x - x % 500的值一定是500的倍数（自己把自己多余的给减去）
      for(let offset of [-1, 0, 1]) {
        let pos = current + offset
        pos = (pos%children.length + children.length) % children.length // pos可能是负很多，需要转换到[0, children.length)，如将索引-1变为3
        children[pos].style.transition = "none"
        children[pos].style.transform = `translateX(${-pos*500 + offset*500 + x%500}px)`
      }
    })

      this.root.addEventListener('panend', (event) => {        
        // 与时间线结合时基于pan的逻辑修改，原先的逻辑因为偷懒，结构不好调整
        console.log("panend")
        tl.reset()
        tl.start()
        handler = setInterval(nextPicture, time)
        let x = event.clientX - event.startX - ax
        let direction = Math.round((x%500)/500)
        if(event.isFlick) {
          console.log(event.velocity)
          if(direction > 0) {
            direction = Math.ceil((x%500)/500)
          }else if(direction < 0) {
            direction = Math.floor((x%500)/500)
          }
        }
        
        let current = this[STATE].position - ((x-x%500)/500) // x - x % 500的值一定是500的倍数（自己把自己多余的给减去）
        for(let offset of [-1, 0, 1]) {
          let pos = current + offset
          pos = (pos%children.length + children.length) % children.length // pos可能是负很多，需要转换到[0, children.length)，如将索引-1变为3
          children[pos].style.transition = "none"
          //children[pos].style.transform = `translateX(${-pos*500 + offset*500 + x%500}px)`
          tl.add(new Animation(children[pos].style, "transform", 
                -pos*500 + offset*500 + x%500,  
                -pos*500 + offset*500 + direction*500,
                500, 0, ease, v=>`translateX(${v}px)`))// 动画从pan结束处开始
        }
        
        this[STATE].position = current - direction
        this[STATE].position = (this[STATE].position%children.length + children.length) % children.length 
        this.triggerEvent("change", {position: this[STATE].position})

      })


    return this.root

  }


}