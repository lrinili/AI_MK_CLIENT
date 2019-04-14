<template>
  <div>
    <MarkedItem v-for="(i) in 10" :key="i" :question="{}"></MarkedItem>
  </div>
</template>

<script>
  import MarkedItem from './MarkedItem'
  
  export default {
    name: 'Marked',
    components: {MarkedItem},
    data () {
      return {
        markedList: []
      }
    },
    beforeMount () {
      let auth = JSON.parse(sessionStorage.getItem('auth'))
      console.log(auth)
      this.$httpClient.getMarkedList(auth.userId).then(res => {
        console.log(res)
        if (res.data.resultCode === "200") {
          this.markedList = res.data.content.map((item) => {
            return {
            
            }
          })
        }
        else{
          console.warn(res.data)
        }
      }).catch(()=>{
        console.log('服务器错误')
      })
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style scoped>

</style>
