import {createElement} from "./framework.js"
import {Carousel} from "./Carousel.js"
import {Button} from "./Button.js"
import {List} from "./List.js"


// let a = <Div id="a">
//   <span>a</span>
//   <span>b</span>
//   <span>c</span>
// </Div>

let d = [
  {
    img: 'https://res.devcloud.huaweicloud.com/obsdevui/diploma/8.1.17.002/banner-8.d14241daf518717981c6.jpg',
    url: 'https://time.geekbang.org/',
    title: "标题1"
  },
  {
    img: 'https://res.devcloud.huaweicloud.com/obsdevui/diploma/8.1.17.002/banner-1.fdbf82d4c2ca7fad3225.jpg',
    url: 'https://time.geekbang.org/',
    title: "标题2"
  },
  {
    img: 'https://res.devcloud.huaweicloud.com/obsdevui/diploma/8.1.17.002/banner-2.64b1407e7a8db89d6cf2.jpg',
    url: 'https://time.geekbang.org/',
    title: "标题3"
  },
  {
    img: 'https://res.devcloud.huaweicloud.com/obsdevui/diploma/8.1.17.002/banner-3.ce76c93c7a8a149ce2a2.jpg',
    url: 'https://time.geekbang.org/',
    title: "标题4"
  },
]
let a = <Carousel src={d} 
                  onChange={event=>console.log(event.detail.position)}
                  onClick={event=>window.location.href=event.detail.data.url}/>
a.mountTo(document.body)

// let b = <Button>
//   content
// </Button>
// b.mountTo(document.body)

// let c = <List data={d}>
//   {(record)=>
//     <div>
//       <img src={record.img}/>
//       <a href={record.url}>{record.title}</a>
//     </div>
//   }
// </List>
// c.mountTo(document.body)
// let tl = new Timeline()
// tl.add(new Animation({set a(v) {console.log(v)}}, "a", 0, 100, 1000, null))
// tl.start()
// window.animation = new Animation({set a(v) {console.log(v)}}, "a", 0, 100, 1000, null)
// window.tl = new Timeline()