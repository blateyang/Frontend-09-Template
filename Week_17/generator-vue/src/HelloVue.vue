<template>
  <div id="app">
  {{ message }}
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      message: 'Hello Vue!'
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