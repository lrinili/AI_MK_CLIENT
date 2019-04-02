<template>
  <div class="start">
    <div class="start-btn">
      <el-button style="width: 120px;height: 120px;border-radius: 60px" @click="startMark">开始标注</el-button>
    </div>
    
    <alert v-model="showAlert" title="业务提示" @on-hide="onHideAlert">
      <el-alert type="warning" :show-icon="true" :closable="false">
        如果标注师选择标注后<strong>15分钟</strong>内还未标注完成,将自动返回登录界面。
      </el-alert>
    </alert>
    <alert v-model="showNoMore" title="提示">
      <el-alert type="warning" :show-icon="true" :closable="false">
        <strong>没有更多题目了</strong>
      </el-alert>
    </alert>
    <!--<loading :show="isLoading" text=""></loading>-->
  </div>
</template>

<script>
  import {Alert, Loading} from 'vux'
  
  export default {
    name: 'Wait',
    components: {Alert, Loading},
    data () {
      return {
        showAlert: false,
        isLoading: false,
        showNoMore: false
      }
    },
    mounted () {
    
    },
    computed: {},
    methods: {
      onHideAlert () {
        // this.isLoading = true
        this.$httpClient.getQuestion().then((res) => {
          // this.isLoading = false
          if (res.data.result) {
            let question = res.data.question
            this.$store.commit('saveCurrentQuestion', question)
            this.$router.push({name: 'mark', params: {qid: `${question.id}`}})
          } else {
            this.showNoMore = true
          }
        })
      },
      startMark () {
        this.showAlert = true
      }
    }
  }
</script>

<style scoped lang="less">
  .start {
    display: flex;
    justify-content: center;
    align-items: center;
    /*height: calc(100vh);*/
    
    .start-btn {
      /*margin-top: -25px;*/
    }
  }
</style>
