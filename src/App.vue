<template>
  <div id="app">
    <router-view v-transition></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {

      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  
  #app {
    margin: 0 auto;
    height: 100vh;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
</style>
