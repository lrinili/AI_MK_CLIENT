<template>
  <div>
    <ListItem v-for="(item,i) in consumptions" :key="i" :data="item"/>
  </div>
</template>

<script>
  import ListItem from '../common/ListItem'
  
  export default {
    name: 'Customers',
    components: {ListItem},
    data () {
      return {
        consumptions: []
      }
    },
    beforeMount () {
    },
    mounted () {
      let auth = JSON.parse(sessionStorage.getItem('auth'))
      console.log('loginType=', auth.loginType)
      let type = parseInt(auth.loginType) === 2 ? 2 : 1
      this.$httpClient.getConsumptions(type, auth['userId']).then((res) => {
        if (res.data.resultCode === '200') {
          console.log('consumptions=', res.data.content)
          res.data.content.forEach(item => {
            this.consumptions.push({
              avatar: item['avatarUrl'],
              name:item['name'] || item['nickName'],
              publishTime:item['cunsumTime'].substring(0,10),
              id:item['mkInterviewerId']
            })
          })
        } else {
          console.warn(res.data.resultDesc)
        }
      }).catch(() => {
        console.log('getConsumptions', '服务器错误')
      })
    },
    methods: {},
    computed: {}
  }
</script>

<style scoped>

</style>
