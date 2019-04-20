<template>
  <div>
    <MarkedItem v-for="(item,i) in markedList" :key="i" :dataDetail="item"/>
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
        if (res.data.resultCode === '200') {
          console.log(res.data.content)
          this.markedList = res.data.content.sort((a, b) => {
            let t1 = Date.parse(a['markTime'])
            let t2 = Date.parse(b['markTime'])
            if (t1 >= t2) {
              return -1
            } else {
              return 1
            }
          }).map((item) => {
            return {
              interviewResultId: item['mkInterviewResultId'],
              interviewRecordId: item['mkInterviewRecordId'],
              markerId: item['mkMarkId'],
              domain: item['domain'],
              grade: item['grade'],
              time: item['markTime'].substring(0, 10),
              result: parseInt(item['markResult']),
              question: item['questionsContent'],
              content: item['answerContent'],
              speed: parseInt(item['speed']) - 1,
              volume: parseInt(item['volume']) - 1,
              tone: parseInt(item['tone']) - 1,
              nervous: parseInt(item['nervous']) - 1,
              expression: parseInt(item['expression']) - 1,
            }
          })
        } else {
          console.log('暂无数据')
          console.log(res.data)
        }
      }).catch(() => {
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
