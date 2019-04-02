<template>
  <div style="width: 100%;min-height: 100%;background: rgb(241, 241, 241)">
    <loading :show="isLoading" :style="{background:'red'}"></loading>
    <alert v-model="showAlert" title="提示" @on-hide="onHideAlert">
      <el-alert type="warning" :show-icon="true" :closable="false">
        <strong>没有更多的题目了</strong>
      </el-alert>
    </alert>
    <x-header :left-options="{backText:''}"/>
    <div class="container">
      <div class="title">{{question.title+question.id}}</div>
      <div class="job-level">
        <div>{{question.job}}</div>
        <div>{{question.level}}</div>
      </div>
      <div class="avatar">
        <img alt="" :src="question.interviewer.avatar"/>
      </div>
      <div>
        <audio src="../../../../static/1.mp3" ></audio>
      </div>
      <div class="answer">{{question.answer}}
      </div>
      <br>
      <div>
        <checker v-model="score" class="checker" default-item-class="dic ic" selected-item-class="sic ic">
          <checker-item :value="2">优秀</checker-item>
          <checker-item :value="1">良好</checker-item>
          <checker-item :value="0">差</checker-item>
        </checker>
      </div>
      <br>
      <div class="btn-group">
        <div>
          <el-button @click="modifyLast">修改上一题</el-button>
          <el-button @click="nextQuestion" :disabled="isNotScored">进入下一题</el-button>
        </div>
      </div>
      <!--<div>{{this.timeRemaining}}</div>-->
      <!--<div>{{this.timeout}}</div>-->
      <br><br>
    </div>
  </div>
</template>

<script>
  import {XHeader, Checker, CheckerItem, Loading, Alert} from 'vux'
  
  import {markQuestion, getQuestion} from '../../../util/api'
  
  export default {
    name: 'Mark',
    components: {XHeader, Checker, CheckerItem, Loading, Alert},
    data () {
      return {
        question: {},
        score: -1,
        isLoading: false,
        showAlert: false,
        timeout: 60,
        timeRemaining: 30,
        timerOfTimeout: null,
        timerOfRemaining: null
      }
    },
    beforeMount () {
      this.score = undefined
      let question = this.$store.state.mark.currentQuestion
      if (question === null || question === undefined) {
        this.gotoHome()
      } else {
        console.log('--------', question)
        this.question = question
        this.score = question.score
      }
    },
    mounted () {
      this.timerOfTimeout = setInterval(() => {
        this.timeout--
        if (this.timeout === 0) {
          clearTimeout(this.timerOfTimeout)
          this.gotoHome()
        }
      }, 1000)
      this.timerOfRemaining = setInterval(() => {
        this.timeRemaining--
        if (this.timeRemaining === 0) {
          clearTimeout(this.timerOfRemaining)
          // 设置修改上一题不可用
        }
      }, 1000)
    },
    computed: {
      isNotScored () {
        return this.score === '' || this.score < 0
      }
    },
    watch: {
      '$route' (newRoute) {
        const qid = parseInt(newRoute.params.qid)
        this.question = this.$store.getters.getQuestionById(qid)
        this.score = this.question.score
        this.timeout = 60
        this.timeRemaining = 30
      }
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    beforeRouteLeave (to, from, next) {
      next()
    },
    methods: {
      gotoHome () {
        this.$router.push({name: 'home'})
      },
      onHideAlert () {
        this.gotoHome()
      },
      modifyLast () {
        const last = this.$store.state.mark.lastQuestion
        if (last) {
          this.isLoading = true
          let timer = setTimeout(() => {
            this.isLoading = false
            this.$router.replace({name: 'mark', params: {qid: last.id}})
            clearInterval(timer)
          }, 300)
        }
      },
      nextQuestion () {
        this.isLoading = true
        let auth = JSON.parse(sessionStorage.getItem('auth'))
        this.$http.post(markQuestion, {qid: this.question.id, score: this.score, marked_by: auth.id}).then(res => {
          if (res.data.result) {
            this.question.score = this.score
            this.$http.get(getQuestion).then(res => {
              this.isLoading = false
              if (res.data.result) {
                let question = res.data.question
                this.$store.commit('saveLastQuestion', this.question)
                this.$store.commit('saveCurrentQuestion', question)
                this.$router.replace({name: 'mark', params: {qid: `${question.id}`}})
              } else {
                this.showAlert = true
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .ic {
    width: 75px;
    height: 35px;
    line-height: 35px;
    border-radius: 20px;
    text-align: center;
    border: 1.5px solid;
  }
  
  .dic {
    border-color: #FF4682;
  }
  
  .sic {
    background-color: springgreen;
    color: white;
  }
  
  .checker {
    width: 250px;
    margin: 0 auto;
  }
  
  .container {
    position: relative;
    
    .title {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 35px;
      line-height: 35px;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
    }
    
    .job-level {
      padding: 5px;
      position: absolute;
      top: 100px;
      left: 0;
      /*width: 80px;*/
      background: rgba(0, 0, 0, 0.28);
    }
    
    .avatar {
      width: 100%;
      height: 200px;
      background: rgba(0, 0, 0, 0.28);
      text-align: center;
      
      img {
        height: 100%;
      }
    }
    
    .answer {
      padding: 5px;
      word-wrap: break-word;
      word-break: break-all;
    }
    
    .btn-group {
      display: flex;
      justify-content: center;
    }
  }
</style>
