function getStyle(element) {
  if(!element.style) {
    element.style = {}
  }
  for(let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value
    // 带px的样式值转成像素值
    if(element.style[prop].toString().match(/(px)$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
    // 数值型样式值转数值
    if(element.style[prop].toString().match(/^[0-9]+(\.[0-9]+)?$/)) {
      element.style[prop] = parseFloat(element.style[prop])
    }
  }
  return element.style
}

function layout(element) {
  if(!element.computedStyle) {
    return
  }
  var elementStyle = getStyle(element)
  if(elementStyle.display !== "flex") {
    return // 暂时只处理flex布局
  }
  var items = element.children.filter(item => {return item.type === "element"}) // 将文本节点滤除
  items.sort((a, b) => {// 按order升序排序?
    return (a.order || 0) - (b.order || 0)
  })

  var style = elementStyle
  ;["width", "height"].forEach(size => {// 宽高缺失值的处理
    if(style[size] === "auto" || style[size] === "") {
      style[size] = null
    }
  })

  // 给flex的各属性设置默认值
  if(!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row"
  }
  if(!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start"
  }
  if(!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "flex-start"
  }
  if(!style.alignItems || style.alignItems === "auto") {
    style.alignItems = "stretch"
  }
  if(!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowrap"
  }

  // 根据flexDirection和flexWrap的值设置相关抽象参数
  let mainSize, mainStart, mainEnd, mainBase, mainSign, 
      crossSize, crossStart, crossEnd, crossBase, crossSign
  if(style.flexDirection === "row") {
    mainSize = "width"
    mainStart = "left"
    mainEnd = "right"
    mainSign = +1
    mainBase = 0

    crossSize = "height"
    crossStart = "top"
    crossEnd = "bottom"
  }else if(style.flexDirection === "row-reverse") {
    mainSize = "width"
    mainStart = "right"
    mainEnd = "left"
    mainSign = -1
    mainBase = style.width

    crossSize = "height"
    crossStart = "top"
    crossEnd = "bottom"
  }else if(style.flexDirection === "column") {
    mainSize = "height"
    mainStart = "top"
    mainEnd = "bottom"
    mainSign = +1
    mainBase = 0

    crossSize = "width"
    crossStart = "left"
    crossEnd = "right"
  }else if(style.flexDirection === "column-reverse") {
    mainSize = "height"
    mainStart = "bottom"
    mainEnd = "top"
    mainSign = -1
    mainBase = style.height

    crossSize = "width"
    crossStart = "left"
    crossEnd = "right"
  }
  if(style.flexWrap === "wrap-reverse") {
    var tmp = crossStart 
    crossStart = crossEnd
    crossEnd = tmp
    crossSign = -1
    crossBase = crossSize === "width" ? style.width : style.height
  }else{
    crossSign = +1
    crossBase = 0
  }

  // 未设置mainSize，进行auto sizing，计算所有子元素排进一行的mainSize
  let isAutoMainSize = false
  if(!style[mainSize]) {
    style[mainSize] = 0
    for(let item of element.children) {
      let itemStyle = getStyle(item)
      if(itemStyle[mainSize] !== null && itemStyle[mainSize] !== void(0)) {
        style[mainSize] += itemStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  // flex的分行算法
  let flexLine = []
  let flexLines = [flexLine]
  let mainSpace = style[mainSize]
  let crossSpace = 0
  // 将元素排进行
  for(let item of items) {
    let itemStyle = getStyle(item)
    if(itemStyle[mainSize] === null || itemStyle[mainSize] === void(0)) {
      itemStyle[mainSize] = 0
    }
    if(itemStyle[crossSize] === null || itemStyle[crossSize] === void(0)) {
      itemStyle[crossSize] = 0
    }
    if(itemStyle.flex) {// 元素具有flex属性，可伸缩，一定能放进当前行
      flexLine.push(item)
    }else if(style.flexWrap === "nowrap" && isAutoMainSize) {//不换行且mainSize已计算出,元素依次排入一行
      mainSpace -= itemStyle[mainSize]
      if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== void(0)) {
        crossSpace = Math.max(itemStyle[crossSize], crossSpace)
      }
      flexLine.push(item)
    }else{// 排入多行
      if(itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }
      if(mainSpace < itemStyle[mainSize]) {// 主轴剩余空间放不下当前元素，结束当前行，另起一行
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLines.push(flexLine)

        flexLine = [item]
        mainSpace = element[mainSize]
        crossSpace = 0
      }else{
        flexLine.push(item)
      }
      // 更新主轴剩余空间和交叉轴空间
      mainSpace -= itemStyle[mainSize]
      if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== void(0)) {
        crossSpace = Math.max(itemStyle[crossSize], crossSpace)
      }
    }
  }
  flexLine.mainSpace = mainSpace
  if(style.flexWrap === "nowrap" || isAutoMainSize) {
    // 如果style（即elementStyle）定义了crossSize，将其直接作为flexLine的crossSpace
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
  }else{
    flexLine.crossSpace = crossSpace
  }

  // 计算主轴方向
  if(mainSpace < 0) {
    // 排不下，将所有flex元素的mainSize设为0，非flex元素等比例压缩
    let scale =  style[mainSize]/ (style[mainSize] - mainSpace)
    let currentBase = mainBase
    flexLine.forEach((item)=> {
      let itemStyle = getStyle(item)
      if(itemStyle.flex) {
        itemStyle[mainSize] = 0
      }
      itemStyle[mainSize] *= scale
      itemStyle[mainStart] = currentBase
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign*itemStyle[mainSize]
      currentBase = itemStyle[mainEnd]
    })
  }else{
    // 排得下，遍历flexLines，根据flexLine的flex项数量决定使用按flex比例排版还是依据justifyContent排版
    flexLines.forEach(items=>{
      let mainSpace = items.mainSpace
      let flexTotal = 0
      for(let i=0; i<items.length; i++) {
        let item = items[i]
        let itemStyle = getStyle(item)
        if(itemStyle.flex) {
          flexTotal += itemStyle.flex
        }
      }
      let currentBase = mainBase
      if(flexTotal > 0) {
        for(let i=0; i<items.length; i++) {
          let item = items[i]
          let itemStyle = getStyle(item)
          itemStyle[mainStart] = currentBase
          if(itemStyle.flex) {
            // 将mainSpace空间按flex比例分配
            itemStyle[mainSize] = mainSpace * itemStyle.flex / flexTotal
          }
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign*itemStyle[mainSize] 
          currentBase = itemStyle[mainEnd]
        }
      }else{
        // 根据justifyContent确定currentBase和step,实现非flex元素的排版
        let step = 0 // 间距
        if(items.justifyContent === "flex-end") {
          currentBase = mainSpace*mainSign + mainBase
        }
        if(items.justifyContent === "center") {
          currentBase = mainSpace/2*mainSign + mainBase
        }
        if(items.justifyContent === "space-between") {
          step = mainSign*mainSpace/(items.length-1)
        }
        if(items.justifyContent === "space-around") {
          step = mainSign*mainSpace/items.length
          currentBase = mainBase + step/2
        }
        for(let i=0; i<items.length; i++) {
          let item = items[i]
          let itemStyle = getStyle(item)
          itemStyle[mainStart] = currentBase
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign*itemStyle[mainSize]
          currentBase = itemStyle[mainEnd] + step
        }
      }
    })
  }

  // 计算交叉轴方向
  if(!style[crossSize]) { // 未定义交叉轴尺寸，累加各行得到elementStyle[crossSize]
    crossSpace = 0
    style[crossSize] = 0
    for(let i=0; i<flexLines.length; i++) {
      style[crossSize] +=  flexLines[i][crossSpace]
    }
  }else{// 已定义交叉轴尺寸，减去各行剩余空间得到整个剩余空间
    crossSpace = style[crossSize]
    for(let i=0; i<flexLines.length; i++) {
      crossSpace -= flexLines[i][crossSpace]
    }
  }

  if(style.flexWrap === "wrap-reverse") {
    crossBase = style[crossSize]
  }else{
    crossBase = 0
  }
//  let lineHeight = style[crossSize] / flexLines.length
  // 根据alignContent属性确定crossBase和step
  let step 
  if(style.alignContent === "flex-start") {
    crossBase += 0
    step = 0
  }
  if(style.alignContent === "flex-end") {
    crossBase += crossSpace*crossSign
    step = 0
  }
  if(style.alignContent === "center") {
    crossBase += (crossSpace/2)*crossSign
    step = 0
  }
  if(style.alignContent === "space-between") {
    step = (crossBase/ (flexLines.length-1))*crossSign
    crossBase += 0
  }
  if(style.alignContent === "space-around") {
    step = (crossBase/ flexLines.length)*crossSign
    crossBase += step/2
  }
  if(style.alignContent === "stretch") {
    crossBase += 0
    step = 0
  }
  // 对flexLine进行交叉轴排版
  flexLines.forEach(items => {
    let lineCrossSize = style.alignContent === "stretch" ? 
                        items.crossSpace + crossSpace/items.length : // 将剩余空间平均分配给每行
                        items.crossSpace // 每行的交叉轴空间
    // 对行内元素进行交叉轴排版                     
    for(let i=0; i<items.length; i++) {
      let item = items[i]
      let itemStyle = getStyle(item)
      let align = itemStyle.alignSelf || style.alignItems
      if(item === null) {
        itemStyle[crossSize] = (align === "stretch") ? lineCrossSize : 0
      }
      if(align === "flex-start") {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign*itemStyle[crossSize]
      }
      if(align === "flex-end") {
        itemStyle[crossEnd] = crossBase + crossSign*lineCrossSize
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign*itemStyle[crossSize]
      }
      if(align === "center") {
        itemStyle[crossStart] = crossBase + crossSign*(lineCrossSize - itemStyle[crossSize])/2
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign*itemStyle[crossSize]
      }
      if(align === "stretch") {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = crossBase + crossSign*lineCrossSize // 此处与视频不同
        itemStyle[crossSize] = crossSign*lineCrossSize
      }
    }
    crossBase  += crossSign*(lineCrossSize+step)
    console.log(items)
  })
}

module.exports = layout