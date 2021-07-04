import HelloVue from "./HelloVue.vue"
import {createApp} from "vue"

// var app = new Vue({
//   el: '#app',
//   render: h=>h(HelloVue)
// })
createApp(HelloVue).mount("#app")