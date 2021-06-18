import {Component} from "./framework.js"

export class Carousel extends Component{
  constructor() {
    super()
    this.attributes = Object.create(null) // 创建空对象接收src属性
  }

  setAttribute(name, value) { // 重写基类的方法，以便将src设置到组件中
    this.attributes[name] = value
  }

  render() {
//    console.log(this.attributes.src)
    this.root = document.createElement("div")
    this.root.classList.add("carousel")
    for(let item of this.attributes.src) {
      let img = document.createElement("div")
      img.style.backgroundImage = `url(${item})`
      // img.style.backgroundColor = "blue"
      this.root.appendChild(img)
    }
    // 拷贝第一张图片用于自然过渡
    let img = document.createElement("div")
    img.style.backgroundImage = `url(${this.attributes.src[0]})`
    // img.style.backgroundColor = "blue"
    this.root.appendChild(img)


    let currentIdx = 0
    let time = 3000
    let that = this

    // 自动轮播
    let children = this.root.children
    let timer = setInterval( swiper
    // // 视频教程所用方法，第一轮播放过后轮播顺序是反的
    // let timer = setInterval(()=> {
    //   let nextIdx = (currentIdx + 1) % children.length

    //   // next快速移入viewport的后一个位置
    //   next.style.transition = "none"
    //   next.style.transform = `translationX(${100 - nextIdx*100}%)`

    //   setTimeout(()=>{// 实现current移出viewport,next移入viewport且next快速切换到current
    //     next.style.transition = "" // 恢复样式表中的transition设置
    //     current.style.transform = `translateX(${-100 - currentIdx*100}%)`
    //     next.style.transform = `translateX(${-nextIdx*100}%)`
    //     currentIdx = nextIdx
    //   }, 16)    
    // }
    , time)

    function swiper() {
      let children = that.root.children
      currentIdx++
      children[currentIdx-1].style.transform = `translateX(${-100*currentIdx}%)`
      children[currentIdx%children.length].style.transform = `translateX(${-100*currentIdx}%)`
      // for(let child of children) {
      //   child.style.transform = `translateX(${-100*currentIdx}%)` // 注意transition是相对于初始样式而非每次移动后的样式的
      // }
      if(currentIdx === children.length) {
        currentIdx = 0
        // 关闭过渡动画，重置各图片位置
        for(let child of children) {
          child.style.transition = "none"
          child.style.transform = `translateX(0)`
        }
        // 在下一帧恢复过渡动画
        setTimeout(()=>{
          for(let child of children) {
            child.style.transition = ""
          }
        }, 16)

          clearInterval(timer)
          timer = setInterval(swiper, 100) // 让最后一张和第一张短暂过渡
      }else if(currentIdx === 1) {
        clearInterval(timer)
        timer = setInterval(swiper, time)
      }
    }
 
    // 手动控制轮播
    let position = 0
    this.root.addEventListener("mousedown", (event) => {
      let children = that.root.children
      let childrenLen = children.length-1
      let startX = event.clientX
      console.log("mousedown")
      let move = (event)=>{
        console.log("mousemove")
        let x = event.clientX - startX
        let current = position
        for(let offset of [-1, 0, 1]) {
          let pos = current + offset
          pos = (pos + childrenLen) % childrenLen // 将索引-1变为3
          children[pos].style.transition = "none"
          children[pos].style.transform = `translateX(${-pos*500 + offset*500 + x}px)`
        }
        // for(let child of children) {
        //   child.style.transition = "none" // 拖拽时关闭过渡动画
        //   child.style.transform =  `translateX(${-position*500 + x}px)` // -position*500为每次拖动时各图片相对于初始位置的偏移
        // }
      }
      let up = (event) => {
        let x = event.clientX - startX
        position = position - Math.round(x/500) // 获取松手时就近的帧索引
        for(let offset of [0, Math.sign(Math.abs(x)>250 ? x:-x)]) { 
          // 拖动距离大于视口的一半，当前图片和下一张图片跟着移动，否则当前图片和上一张图片跟着移动
          let pos = position + offset
          pos = (pos + childrenLen) % childrenLen // 将索引-1变为3
          children[pos].style.transition = ""
          children[pos].style.transform = `translateX(${-pos*500 + offset*500}px)`
        }
        // position = position - Math.round(x/500) // 获取松手时就近的帧索引
        // for(let child of children) {
        //   child.style.transition = ""
        //   child.style.transform =  `translateX(${-position*500}px)`
        // }
        console.log("mouseup")
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", up)
      }
      // 在document上监听可以防止移出图片区域无法响应监听事件
      document.addEventListener("mousemove", move)
      document.addEventListener("mouseup", up)
    })

    return this.root
  }

  mountTo(parent) {
    parent.appendChild(this.render())
  }
}