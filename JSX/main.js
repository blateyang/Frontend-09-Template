import {Component, createElement} from "./framework.js"
import {Carousel} from "./carousel.js"
import {Timeline, Animation} from "./animation.js"


// let a = <Div id="a">
//   <span>a</span>
//   <span>b</span>
//   <span>c</span>
// </Div>
let d = [
  'https://res.devcloud.huaweicloud.com/obsdevui/diploma/8.1.17.002/banner-8.d14241daf518717981c6.jpg',
  'https://res.devcloud.huaweicloud.com/obsdevui/diploma/8.1.17.002/banner-1.fdbf82d4c2ca7fad3225.jpg',
  'https://res.devcloud.huaweicloud.com/obsdevui/diploma/8.1.17.002/banner-2.64b1407e7a8db89d6cf2.jpg',
  'https://res.devcloud.huaweicloud.com/obsdevui/diploma/8.1.17.002/banner-3.ce76c93c7a8a149ce2a2.jpg'
]
let a = <Carousel src={d}/>

// document.body.appendChild(a)
a.mountTo(document.body)
// let tl = new Timeline()
// tl.add(new Animation({set a(v) {console.log(v)}}, "a", 0, 100, 1000, null))
// tl.start()
window.animation = new Animation({set a(v) {console.log(v)}}, "a", 0, 100, 1000, null)
window.tl = new Timeline()