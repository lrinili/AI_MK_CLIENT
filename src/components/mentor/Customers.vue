<template>
  <div>
    <CustomerItem v-for="(item,i) in consumptions" :key="i" :info="item"/>
  </div>
</template>

<script>
  
  
  import CustomerItem from './CustomerItem'
  
  export default {
    name: 'Customers',
    components: {CustomerItem},
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
              name: item['name'] || item['nickName'],
              publishTime: item['cunsumTime'].substring(0, 10),
              cid: item['mkInterviewerId'],
              phone: item['phoneNo'],
              email: item['emailAddress'],
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
