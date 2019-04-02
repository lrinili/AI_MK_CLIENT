<template>
  <div>
    <div :style="homeStyle">
      <component :is="currentComponent"></component>
    </div>
    <div style="height: 51px"></div>
    <tabbar style="position: fixed" @on-index-change="onTabbarIndexChange">
      <tabbar-item selected>
        <img slot="icon" src="" alt="">
        <img slot="icon-active" src="" alt="">
        <span slot="label">开始</span>
      </tabbar-item>
      <tabbar-item>
        <img slot="icon" src="" alt="">
        <img slot="icon-active" src="" alt="">
        <span slot="label">辅导客户</span>
      </tabbar-item>
      <tabbar-item>
        <img slot="icon" src="" alt="">
        <img slot="icon-active" src="" alt="">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {Tabbar, TabbarItem} from 'vux'
  
  export default {
    components: {TabbarItem, Tabbar},
    data () {
      return {
        homeStyle: {
          width: '100%',
          minHeight: (document.body.clientHeight - 51) + 'px',
          background: 'rgb(241, 241, 241)'
        },
        components: [],
        currentTabbar: 0,
        titles: ['首页', '辅导客户', '我的']
      }
    },
    mounted () {
    },
    methods: {
      onTabbarIndexChange (newIndex) {
        this.currentTabbar = newIndex
        document.title = this.titles[newIndex]
        this.$router.replace({name: 'home', hash: '#' + newIndex})
      }
    },
    computed: {
      currentComponent () {
        return this.components[this.currentTabbar]
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
