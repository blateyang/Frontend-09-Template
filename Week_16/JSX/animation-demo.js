import {Timeline, Animation} from "./animation.js"
import {ease} from "./ease.js"

let tl = new Timeline()
// tl.add(new Animation({set a(v) {console.log(v)}}, "a", 0, 100, 1000, 0, null, v=>v))
let anime = new Animation(document.querySelector("#el").style, "transform", 0, 300, 2000, 0, ease, v=>`translateX(${v}px)`)
tl.add(anime)
let anime2 = new Animation(document.querySelector("#el2").style, "transform", 100, 400, 2000, 0, ease, v=>`translateX(${v}px)`)
tl.add(anime2)
document.querySelector("#el3").style.transition = "2s ease"
document.querySelector("#el3").style.transform = "translateX(600px)"
document.querySelector("#pause-btn").addEventListener("click", ()=>tl.pause())
document.querySelector("#resume-btn").addEventListener("click", ()=>tl.resume())
document.querySelector("#reset-btn").addEventListener("click", ()=>{tl.reset();tl.add(anime),tl.add(anime2);tl.start()})
tl.start()