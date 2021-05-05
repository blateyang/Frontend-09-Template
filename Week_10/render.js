const images = require("images")

function render(viewport, element) {
  if(element.style) {
    let img = images(element.style.width, element.style.height)
    let color = element.style["background-color"]
    if(color) {
      let pattern = /rgb\((\d+), (\d+), (\d+)\)/
      color.match(pattern)
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
      viewport.draw(img, element.style.left||0, element.style.top||0)
    }
  }
  if(element.children) {
    for(let child of element.children) {
      render(viewport, child)
    }
  }
}
module.exports = render