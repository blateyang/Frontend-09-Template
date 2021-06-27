import HelloVue from "./HelloVue.vue"
import Vue from "Vue"

var app = new Vue({
  el: '#app',
  render: h=>h(HelloVue)
})