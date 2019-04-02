<template>
  <div>
    <div :style="homeStyle">
      <component :is="currentComponent"></component>
    </div>
    <div style="height: 51px"></div>
    <tabbar style="position: fixed" @on-index-change="onTabbarIndexChange">
      <tabbar-item selected>
        <img slot="icon" src="../assets/home/5.png" alt="">
        <img slot="icon-active" src="../assets/home/4.png" alt="">
        <span slot="label">开始</span>
      </tabbar-item>
      <tabbar-item>
        <img slot="icon" src="../assets/home/7.png" alt="">
        <img slot="icon-active" src="../assets/home/6.png" alt="">
        <span slot="label">已标注</span>
      </tabbar-item>
      <tabbar-item>
        <img slot="icon" src="../assets/home/9.png" alt="">
        <img slot="icon-active" src="../assets/home/8.png" alt="">
        <span slot="label">统计表</span>
      </tabbar-item>
      <tabbar-item>
        <img slot="icon" src="../assets/home/3.png" alt="">
        <img slot="icon-active" src="../assets/home/2.png" alt="">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {Tabbar, TabbarItem} from 'vux'
  import Start from '../components/marker/start/Start'
  import Marked from '../components/marker/marked/Marked'
  import Statistics from '../components/marker/statistics/Statistics'
  import My from '../components/marker/my/My'
  
  export default {
    components: {TabbarItem, Tabbar},
    data () {
      return {
        homeStyle: {
          width: '100%',
          minHeight: (document.body.clientHeight - 51) + 'px',
          background: 'rgb(241, 241, 241)'
        },
        components: [Start, Marked, Statistics, My],
        currentTabbar: 0,
        titles: ['开始', '已标注', '统计表', '个人中心']
      }
    },
    mounted () {
      // console.log(this.$route,parseInt(this.$route.hash.substring(1)))
      // this.currentTabbar = this.$route.hash === '' ? 0 : parseInt(this.$route.hash.substring(1))
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
