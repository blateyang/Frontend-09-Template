<template>
  <p>{{ greeting }}</p>
</template>

<script>
// import defineComponent from "vue"
export default {
  data: function(){
    return {
      greeting: 'Hello Vue!'
    }
  }
}
</script>

<style scoped>
  div {
    border: solid 2px black;
    width: 200px;
    height: 200px;
  }
</style>