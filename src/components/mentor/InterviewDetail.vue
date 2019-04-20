<template>
  <div>
    <x-header :left-options="{backText:''}"/>
    <ResultTemplate v-for="(question,i) in questions" :key="i" :question="question" :isMarkDetail="false"/>
  </div>
</template>

<script>
  import {XHeader} from 'vux'
  import ResultTemplate from '../common/ResultTemplate'
  
  export default {
    name: 'InterviewDetail',
    components: {XHeader, ResultTemplate},
    props: {},
    data () {
      return {
        questions: [],
      }
    },
    beforeMount () {
      let id = this.$route.params.id
      this.$httpClient.getInterviewResults(id).then((res) => {
        if (res.data.resultCode === '200') {
          console.log(res.data.content)
          this.questions = res.data.content
        } else {
          console.warn('getInterviewResults', res.data.resultDesc)
        }
      }).catch(() => {
        console.log('getInterviewResults 服务器错误')
      })
    },
    mounted () {
    },
  }
</script>

<style scoped>

</style>
