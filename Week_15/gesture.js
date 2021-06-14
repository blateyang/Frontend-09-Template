//let element = document.documentElement



// let startX, startY
// let handler = null
// let isTap = false, isPan = false, isPress = false



export class Dispatcher{
  constructor(element) {
    this.element = element
  }

  dispatch(type, properties) {
    let event = new Event(type)
    for(let name in properties) {
      event[name] = properties[name]
    }
    this.element.dispatchEvent(event) // 给DOM元素派发事件
  }
} 

export class Listener {
  constructor(element, recognizer) {
    this.element = element
    let contexts = new Map()
    let isListeningMouse = false
    // 鼠标操作
    element.addEventListener("mousedown", event=>{
    let context = Object.create(null) //{startX: null, startY: null, handler: null, isTap: false, isPan: false, isPress: false, isFlick: false, points: null}
    contexts.set("mouse" + (1<<event.button), context)  // button->2^button
    recognizer.start(event, context)
  
    let mousemove = event => {
      let button = 1
      while(button <= event.buttons) {// event.buttons保存了鼠标移动时所有按下的键，是二进制掩码0bxxxxx的形式
        // event.buttons 0b00010 represents event.button 4 while event.buttons 0b00100 represents event.button 2
        let key
        if(button === 2) {
          key = 4
        }else if(button === 4) {
          key = 2
        }else{
          key = button
        }
        if(button & event.buttons) { // 判断button是否包含于当前鼠标按键（可能有多个）中
          recognizer.move(event, contexts.get("mouse"+ key))
        }
        button = button<<1
      }
    //    console.log(event.clientX, event.clientY)
    }
    let mouseup = event => {
      recognizer.end(event, contexts.get("mouse"+ (1<<event.button)))
      contexts.delete(contexts.get("mouse"+ (1<<event.button)))
      if(event.buttons === 0) { // 当没有键按下时才取消监听
        document.removeEventListener("mousemove", mousemove)
        document.removeEventListener("mouseup", mouseup)
        isListeningMouse = false
      }
    }
    if(!isListeningMouse) {
      document.addEventListener("mousemove", mousemove)
      document.addEventListener("mouseup", mouseup)
      isListeningMouse = true
    }
    })
    // 触摸操作
    element.addEventListener("touchstart", event=>{
      for(let touch of event.changedTouches) {
        // console.log("touchstart")
        let context = Object.create(null) //{startX: null, startY: null, handler: null, isTap: false, isPan: false, isPress: false, isFlick: false, points: null}
        contexts.set(touch.identifier, context)
        recognizer.start(touch, context)
      }
    })
    
    element.addEventListener("touchmove", event=>{
      for(let touch of event.changedTouches) {
    //    console.log(touch.clientX, touch.clientY)
      recognizer.move(touch, contexts.get(touch.identifier))
      }
    })
    
    element.addEventListener("touchend", event=>{
      for(let touch of event.changedTouches) {
    //    console.log("touchend")
        recognizer.end(touch, contexts.get(touch.identifier))
        contexts.delete(touch.identifier)
      }
    })
    
    element.addEventListener("touchcancel", event=>{
      for(let touch of event.changedTouches) {
        // console.log("touchcancel")
        recognizer.cancel(touch, contexts.get(touch.identifier))
        contexts.delete(touch.identifier)
      }
    })
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher
  }

  start(point, context) {
    context.startX = point.clientX
    context.startY = point.clientY
    context.startTime = Date.now()
    context.isTap = true
    context.isPress = false
    context.isPan = false
    context.isFlick = false
    context.handler = setTimeout(()=>{
      context.isPress = true
      context.isTap = false
      context.isPan = false
      // console.log("press")
      this.dispatcher.dispatch("press", {"startTime": context.startTime})
    }, 500)
    context.points= [{
      "time": Date.now(),
      "pointX": point.clientX,
      "pointY": point.clientY
    }]
  //  console.log("start", point.clientX, point.clientY)
  }
  
  move(point, context) {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY
    if(!context.isPan && dx**2 + dy**2 > 100) {
      clearTimeout(context.handler)
      context.isPan = true
      context.isTap = false
      context.isPress = false
      context.handler = null 
      context.isVertical = Math.abs(dy) > Math.abs(dx)
      //console.log("panstart")
      this.dispatcher.dispatch("panstart", {
        startTime: context.startTime,
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      })
    }
    if(context.isPan) {
      //console.log("pan")
      this.dispatcher.dispatch("pan", {
        startTime: context.startTime,
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical    
      })
    }
    context.points = context.points.filter(point => Date.now()-point.time<500) // 仅保留最近半秒内的点记录
    context.points.push({
      "time": Date.now(),
      "pointX": point.clientX,
      "pointY": point.clientY
    })
  //  console.log("move", point.clientX, point.clientY)
  }
  
  end(point, context) {
    clearTimeout(context.handler)
  
    if(context.isTap) 
      // console.log("tap")
      this.dispatcher.dispatch("tap", {}) // 派发事件
    if(context.isPress) 
      //console.log("pressend")
      this.dispatcher.dispatch("pressend", {"duration": Date.now()-context.startTime})
    let d = Math.sqrt((point.clientX - context.points[0].pointX)**2 + (point.clientY - context.points[0].pointY)**2)
    let v = d / (Date.now() - context.points[0].time) // px/ms
    if(v > 1.5) {
      //console.log("flick")
      context.isFlick = true
      this.dispatcher.dispatch("flick", {
        startTime: context.startTime,
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isFlick: context.isFlick,
        velocity: v
      })
    }else{
      context.isFlick = false
    }
    if(context.isPan) {
      //console.log("panend")
      this.dispatcher.dispatch("panend", {
        startTime: context.startTime,
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isFlick: context.isFlick, // 在pan中需要确定是否是flick
        isVertical: context.isVertical
      })
    }
    context.isTap = false
    context.isPan = false
    context.isPress = false
  
  //  console.log("end", point.clientX, point.clientY)
  }
  
  cancel(point, context) {
    clearTimeout(context.handler)
    context.isTap = false
    context.isPan = false
    context.isPress = false
    // console.log("cancel")
    this.dispatcher.dispatch("cancel", {})
  //  console.log("cancel", point.clientX, point.clientY)
  }
}

export class Gesture{
  constructor(element) {
    new Listener(element, new Recognizer(new Dispatcher(element)))
  }
}