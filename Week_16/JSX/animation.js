const TICK = Symbol("tick")
const TICK_HANDLER = Symbol("tick-handler")
const ANIMATIONS = Symbol("animations")
const START_TIME = Symbol("start-time")
const PAUSE_START = Symbol("pause-start")
const PAUSE_TIME = Symbol("pause-time")

export class Timeline {
  constructor() {
    this[ANIMATIONS] = new Set() //使用Symbol作为属性可以防止外部私自访问
    this[START_TIME] = new Map()
    this.state = "inited"
    this.animeRunTime = 0 // 时间线中动画的有效运行时间
  }

  add(animation) {
    this[ANIMATIONS].add(animation)
    this[START_TIME].set(animation, Date.now()+animation.delay)
  }

  start() {
    if(this.state !== "inited")
      return // start前必须为intied状态，否则不处理
    this.state = "started"
    let startTime = Date.now()
    this[PAUSE_TIME] = 0
    this[TICK] = () => {
      // console.log("tick")
      let now = Date.now()
//      let t = Date.now() - startTime
      for(let animation of this[ANIMATIONS]) {
        let t
        // 确定时间流逝的参照系
        if(this[START_TIME].get(animation) < startTime)
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        else
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
        if(animation.duration < t) {
          this[ANIMATIONS].delete(animation)
          t = animation.duration
        }
        this.animeRunTime = t;
        if(t > 0)
          animation.receive(t)
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }

    getAnimeRunTime(){ 
        return this.animeRunTime
    }
  pause() {
    if(this.state !== "started") 
      return 
    this.state = "paused"
    this[PAUSE_START] = Date.now()
    if(this[TICK_HANDLER])
      cancelAnimationFrame(this[TICK_HANDLER])
  }

  resume() {
    if(this.state !== "paused")
      return 
    this.state = "started"
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START] // 注意是累加，否则第二次以后会有跳变现象
    this[TICK]()
  }

  reset() {
    this.pause()
    this.state = "inited"
    this.time = 0
    this[PAUSE_TIME] = 0
    this[PAUSE_START] = 0
    this[ANIMATIONS] = new Set() //使用Symbol作为属性可以防止外部私自访问
    this[START_TIME] = new Map()
    this[TICK_HANDLER] = null
  }
}

export class Animation{
  constructor(object, property, startVal, endVal, duration, delay, timingFunction, template) {
    this.timingFunction = timingFunction || (v=>v)
    this.template = template || (v=>v)
    this.object = object
    this.property = property
    this.startVal = startVal
    this.endVal = endVal
    this.duration = duration
    this.delay = delay
  }

  // 执行属性根据时间变化
  receive(time) {
    let progress = this.timingFunction(time/ this.duration)
    let range = this.endVal - this.startVal
//    console.log("obj:"+this.object.backgroundImage,"startVal:"+this.startVal, "endVal:"+this.endVal)
    this.object[this.property] = this.template(this.startVal + range*progress)
  }
}