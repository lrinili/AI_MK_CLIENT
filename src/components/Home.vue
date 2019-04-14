<template>
  <div>
    <div :style="homeStyle">
      <component :is="currentComponent"></component>
    </div>
    <div style="height: 51px"></div>
    <tabbar style="position: fixed" @on-index-change="onTabbarIndexChange" v-model="currentTabbar">
      <tabbar-item v-for="(layout,i) in currentLayout " :key="i">
        <img slot="icon" alt="" :src="require(`../assets/home/${4*(4-currentLayout.length)+i}.png`)">
        <img slot="icon-active" alt="" :src="require(`../assets/home/${4*(4-currentLayout.length)+i}-${4*(4-currentLayout.length)+i}.png`)">
        <span slot="label">{{layout.title}}</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {Tabbar, TabbarItem} from 'vux'
  import Start from '../components/marker/start/Start'
  import Marked from '../components/marker/marked/Marked'
  import Statistics from '../components/marker/statistics/Statistics'
  import My from './common/My'
  import Mentor from './mentor/Mentor'
  import Customers from './mentor/Customers'
  
  export default {
    components: {TabbarItem, Tabbar},
    data () {
      return {
        homeStyle: {
          width: '100%',
          minHeight: (document.body.clientHeight - 51) + 'px',
          background: 'rgb(241, 241, 241)'
        },
        currentLayout: [],
        layouts: {
          marker: [
            {component: Start, title: '开始',},
            {component: Marked, title: '已标注',},
            {component: Statistics, title: '统计表',},
            {component: My, title: '我的'},
          ],
          mentor: [
            {component: Mentor, title: '首页',},
            {component: Customers, title: '辅导客户',},
            {component: My, title: '我的'},
          ],
        },
        currentTabbar: 0,
        flag: true
      }
    },
    mounted () {
      console.log('auth=', JSON.parse(sessionStorage.getItem('auth')))
      let loginType = parseInt(JSON.parse(sessionStorage.getItem('auth')).loginType)
      console.log('loginType=', loginType)
      if (isNaN(loginType)) {
      } else {
        console.log('loginTye=', loginType)
        if (loginType === 1) {
          this.currentLayout = this.layouts.marker
        } else {
          this.currentLayout = this.layouts.mentor
        }
      }
      console.log({
        1: '标注师',
        2: '面试辅导师',
        3: '简历辅导师'
      })
    },
    methods: {
      onTabbarIndexChange (newIndex) {
        let hash = newIndex
        if (this.flag) {
          hash = this.$route.hash === '' ? 0 : parseInt(this.$route.hash.substring(1))
        }
        this.currentTabbar = hash
        document.title = this.currentLayout.length === 0 ? '' : this.currentLayout[hash].title
        this.$router.replace({name: 'home', hash: '#' + hash})
        this.flag = false
      }
    },
    computed: {
      currentComponent () {
        console.log('currentComponent', this.currentLayout[this.currentTabbar])
        if (this.currentLayout.length !== 0) {
          return this.currentLayout[this.currentTabbar].component
        }
        return null
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
