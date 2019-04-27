<template xmlns="http://www.w3.org/1999/html">
  <div style="width: 100%;min-height: 100%;background: rgb(241, 241, 241)">
    <loading :show="isLoading" :style="{background:'red'}"></loading>
    <alert v-model="showAlert" title="提示" @on-hide="onHideAlert">
      <el-alert type="warning" :show-icon="true" :closable="false">
        <strong>没有更多的题目了</strong>
      </el-alert>
    </alert>
    <x-header :left-options="{backText:''}"/>
    <div class="container">
      <div class="top">
        <div>
          <p><span>职位类别：</span><span>{{currentQuestion?currentQuestion['question']['domain']:''}}</span></p>
          <p><span>层级：</span><span>{{currentQuestion?currentQuestion['question']['grade']:''}}</span></p>
        </div>
        <div class="time">{{currentQuestion?currentQuestion['interviewResult']['ansTime']:''}}</div>
      </div>
      <AudioPlayer :audio-url="audioUrl"/>
      <div class="title">
        <span>问题：</span><span>{{currentQuestion?currentQuestion['question']['questionContent']:''}}</span>
      </div>
      <div class="answer">{{currentQuestion?currentQuestion['interviewResult']['ansContent']:''}}</div>
      <div class="rate" v-for="(rt,i) in ratetemplate" :key="i">
        <div class="item">{{rt.text}}</div>
        <div class="check">
          <checker v-model="rt.rate" class="checker" default-item-class="dic" selected-item-class="sic">
            <checker-item v-for="(item,k) in rt.items" :key="k" :value="(k)">
              {{item}}
            </checker-item>
          </checker>
          <div class="line"></div>
        </div>
      </div>
      <div>
        <div style="padding: 0 10px;">
          <div style="text-align: center;">
            <span style="padding: 0 25px;background: #f1f1f1">综合评分</span>
          </div>
          <div style="height: 1px;background: black;margin-top: -12.5px;"></div>
        </div>
        <br>
        <checker v-model="markResult" class="checker2" selected-item-class="sic">
          <checker-item :value="2">优秀</checker-item>
          <checker-item :value="1">良好</checker-item>
          <checker-item :value="0">差</checker-item>
        </checker>
      </div>
      <br>
      <div class="btn-group">
        <div>
          <el-button @click="modifyLast" :disabled="!cantModifyLast">修改上一题</el-button>
          <el-button @click="nextQuestion" :disabled="!canGotoNext">进入下一题</el-button>
        </div>
      </div>
      <br><br>
      <!--      <div>{{this.remainingTimeOfModify}}</div>-->
      <!--      <div>{{this.remainingTimeOfMark}}</div>-->
    </div>
  </div>
</template>

<script>
  import {XHeader, Checker, CheckerItem, Loading, Alert} from 'vux'
  import AudioPlayer from './AudioPlayer'
  
  export default {
    name: 'Mark',
    components: {AudioPlayer, XHeader, Checker, CheckerItem, Loading, Alert},
    data () {
      return {
        audioUrl: '',
        interviewResultId: '',
        currentQuestion: undefined,
        ratetemplate: {
          speed: {
            text: '语速',
            items: ['太慢', '慢', '适中', '快', '太快'],
            rate: -1,
          },
          volume: {
            text: '音量',
            items: ['强', '适中', '弱',],
            rate: -1,
          },
          tone: {
            text: '音调',
            items: ['紧张', '适中', '过平',],
            rate: -1,
          },
          nervous: {
            text: '紧张',
            items: ['不紧张', '紧张',],
            rate: -1,
          },
          expression: {
            text: '流畅',
            items: ['流畅', '不流畅'],
            rate: -1,
          },
        },
        
        markResult: -1,
        ratedAll: false,
        remark: false,
        
        isLoading: false,
        showAlert: false,
        
        timeOfModify: 300,
        timeOfMark: 900,
        remainingTimeOfModify: 0,   // 剩余可修改时间
        remainingTimeOfMark: 0,     // 剩余标注时间
        timer1: null,
        timer2: null
      }
    },
    beforeMount () {
      console.log('currentQuestion=', this.$store.state.mark.currentQuestion)
      this.currentQuestion = this.$store.state.mark.currentQuestion
      if (this.currentQuestion === null || this.currentQuestion === undefined) {
        this.goHome()
      } else {
        let {interviewResult} = this.currentQuestion
        this.audioUrl = interviewResult['ansSpeechUrl'] || ''
        this.interviewResultId = interviewResult.id
      }
    },
    mounted () {
      this.setTimer()
    },
    computed: {
      canGotoNext () {
        return parseInt(this.markResult) === this.markResult && this.markResult >= 0 && this.ratedAll
      },
      cantModifyLast () {
        let last = this.$store.state.mark.lastQuestion
        let current = this.currentQuestion
        let cannot = last === null || last === undefined || last.remarked || last === current
        return !cannot && this.remainingTimeOfModify > 0
      }
    },
    watch: {
      ratetemplate: {
        handler (newRt) {
          this.ratedAll = Object.keys(newRt).every(key => {
            let rate = newRt[key].rate
            return parseInt(rate) === rate && rate >= 0
          })
        },
        deep: true,
      },
      '$route' (newRoute) {
        console.log('route change', newRoute)
        let qid = newRoute.params.qid
        console.log('qid=', qid)
        this.currentQuestion = this.$store.getters.getQuestionById(qid)
        console.log('currentQuestion', this.currentQuestion)
        this.audioUrl = this.currentQuestion.interviewResult['ansSpeechUrl'] || ''
        let {interviewResult, ratetemplate} = this.currentQuestion
        this.interviewResultId = interviewResult.id
        
        Object.keys(this.ratetemplate).forEach(key => {
          this.ratetemplate[key].rate = ratetemplate[key]
        })
        this.markResult = ratetemplate.markResult
        this.remark = false
        this.setTimer()
      }
    },
    methods: {
      setTimer () {
        clearInterval(this.timer1)
        clearInterval(this.timer2)
        this.remainingTimeOfModify = this.timeOfModify
        this.remainingTimeOfMark = this.timeOfMark
        this.timer1 = setInterval(() => {
          this.remainingTimeOfModify--
          if (this.remainingTimeOfModify === 0) {
            clearInterval(this.timer1)
          }
        }, 1000)
        this.timer2 = setInterval(() => {
          this.remainingTimeOfMark--
          if (this.remainingTimeOfMark === 0) {
            clearInterval(this.timer2)
            this.goHome()
          }
        }, 1000)
      },
      goHome () {
        this.$router.push({name: 'home'})
        clearInterval(this.timer1)
        clearInterval(this.timer2)
      },
      onHideAlert () {
        this.goHome()
      },
      modifyLast () {
        const last = this.$store.state.mark.lastQuestion
        console.log('modifylast=', last)
        if (last) {
          this.isLoading = true
          let timer = setTimeout(() => {
            this.isLoading = false
            this.$router.replace({name: 'mark', params: {qid: last['interviewResult'].id}})
            clearInterval(timer)
          }, 300)
        }
      },
      nextQuestion () {
        this.isLoading = true
        let auth = JSON.parse(sessionStorage.getItem('auth'))
        let markerId = auth['userId']
        console.log('markedId=', markerId)
        if (this.currentQuestion === this.$store.state.mark.lastQuestion) {
          console.log('remark')
          this.remark = true
          this.$store.commit('saveLastQuestion', {
            ...this.currentQuestion,
            ratetemplate: {
              markResult: this.markResult,
              speed: this.ratetemplate.speed.rate,
              volume: this.ratetemplate.volume.rate,
              tone: this.ratetemplate.tone.rate,
              nervous: this.ratetemplate.nervous.rate,
              expression: this.ratetemplate.expression.rate,
            },
            remarked: true,
          })
          // 重新标注
          console.log('重新标注本题', markerId, this.interviewResultId)
          this.markCurrent(markerId, true)
        } else {
          // 直接标注
          console.log('标注本题', markerId, this.interviewResultId)
          this.markCurrent(markerId, false)
        }
      },
      // remarkCurrent (markerId) {
      //   //
      //   // console.log('模拟重新标注成功')
      //   // this.getNext()
      // },
      markCurrent (markerId, remark) {
        this.$httpClient.mark({
          interviewResultId: this.interviewResultId,
          markerId,
          markResult: this.markResult,
          speed: this.ratetemplate.speed.rate + 1,
          volume: this.ratetemplate.volume.rate + 1,
          tone: this.ratetemplate.tone.rate + 1,
          nervous: this.ratetemplate.nervous.rate + 1,
          expression: this.ratetemplate.expression.rate + 1,
        }, remark).then(res => {
          console.log('mark result=', res.data)
          if (res.data.resultCode === '200') {  // || res.data.resultCode === '处理成功'
            this.getNext()
          } else if (res.data.resultCode === '204') {
            console.warn('本题已经别标注过了,联系浩然处理')
            this.isLoading = false
            // this.getNext()
          } else {
            this.isLoading = false
            alert('标注失败，请稍后再试')
            this.goHome()
          }
        }).catch(() => {
          console.log('标注接口错误')
          this.isLoading = false
        })
      },
      getNext () {
        this.$httpClient.getQuestion().then((res) => {
          console.log('获得下一题=', res.data)
          if (res.data.resultCode === '200') {
            this.isLoading = false
            let result = res.data.content
            this.$store.commit('saveLastQuestion', {
              ...this.currentQuestion,
              ratetemplate: {
                markResult: this.markResult,
                speed: this.ratetemplate.speed.rate,
                volume: this.ratetemplate.volume.rate,
                tone: this.ratetemplate.tone.rate,
                nervous: this.ratetemplate.nervous.rate,
                expression: this.ratetemplate.expression.rate,
              },
              remarked: this.remark,
            })
            this.$store.commit('saveCurrentQuestion', {
              ...result,
              ratetemplate: {
                speed: -1,
                volume: -1,
                tone: -1,
                nervous: -1,
                expression: -1,
                markResult: -1,
              },
              remarked: false,
            })
            this.$router.replace({name: 'mark', params: {qid: `${result['interviewResult'].id}`}})
          } else {
            alert('没有更多题目了')
            this.isLoading = false
            this.goHome()
          }
        }).catch(() => {
          console.log('获取题目接口错误')
          this.isLoading = false
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  
  .sic {
    background: #36F6A1 !important;
    border: 1.5px solid red !important;
  }
  
  .rate {
    display: flex;
    height: 55px;
    
    .item {
      width: 55px;
      height: 55px;
      line-height: 55px;
      text-align: center;
      font-weight: bold;
    }
    
    .check {
      flex: auto;
      padding: 6px;
      
      .line {
        width: 100%;
        height: 2px;
        background: #e6e1e1;
        margin-top: -22.5px;
      }
      
      .checker {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        margin-left: 8px;
        
        > div {
          width: 40px;
          height: 40px;
          background: #f1f1f1;
          margin-right: 18px;
          font-weight: normal;
          font-size: 12px;
          line-height: 40px;
          border-radius: 40px;
          text-align: center;
          border: 1.5px solid;
        }
      }
    }
  }
  
  .container {
    position: relative;
    
    .top {
      width: 100%;
      height: 50px;
      text-align: center;
      background: black;
      color: white;
      display: flex;
      
      > div {
        flex: 1;
      }
      
      > div.time {
        height: 50px;
        line-height: 50px;
        text-align: right;
        padding-right: 8px;
        font-size: 12px;
      }
      
      p {
        height: 25px;
        line-height: 25px;
        text-align: left;
        padding-left: 8px;
        font-size: 12px;
      }
    }
    
    .title {
      text-align: center;
      font-weight: bold;
      padding: 5px 0;
    }
    
    .answer {
      padding: 5px 10px;
      word-wrap: break-word;
      word-break: break-all;
      text-indent: 2em;
    }
    
    .checker2 {
      width: 250px;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      
      > div {
        width: 65px;
        height: 35px;
        line-height: 35px;
        border: 1.5px solid black;
        border-radius: 35px;
        text-align: center;
      }
    }
    
    .btn-group {
      display: flex;
      justify-content: center;
    }
  }
</style>
