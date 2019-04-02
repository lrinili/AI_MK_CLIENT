<template>
  <div>
    <MarkedItem v-for="(item,i) in markedList" :key="i" :question="item"></MarkedItem>
  </div>
</template>

<script>
  import MarkedItem from './MarkedItem'
  import {getMarkedList} from '../../../util/api'
  
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
      this.$http.get(getMarkedList, {params: {uid: auth.id}}).then(res => {
        console.log(res)
        if (res.data.result) {
          this.markedList = res.data.questions
        }
      })
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style scoped>

</style>
