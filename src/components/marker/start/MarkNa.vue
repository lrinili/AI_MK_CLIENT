<template>
<div style="min-height: 100%;background: rgb(241, 241, 241)">
  <div class="container">
    <div v-if="question.problemAnswerMethod === 1" class="top-video">
      <div class="com-pos">
        <div>公司名称：{{question.companyName}}</div>
        <div>职位名称：{{question.jobtitle}}</div>
      </div>
      <div class="video">
        <video-player :v-if="videoSource.length>0" :options="playerOptions" :playsinline="true"></video-player>
      </div>
    </div>
    <div v-if="question.problemAnswerMethod === 0" style="padding-left:35px;">
      <div :style="{padding:'15px 0'}">
        <h3>公司名称：{{question.companyName}}</h3>
        <h4>职位名称：{{question.jobtitle}}</h4>
      </div>
    </div>
    <div :style="{padding:'5px 15px'}">
      <h3 v-html="question.problem">{{question.problem}}</h3>
      <div class="answercontent">
        <div>
          <br>
          <span>回答：</span>
          <p style="line-heigt:25px;text-indent:2em;" v-html="question.answer">
            {{question.answer}}
          </p>
        </div>
      </div>
    </div>
    <br>
    <div v-if="question.problemAnswerMethod === 1">
      <div class="rate" v-for="(rt,i) in ratetemplate" :key="i">
        <div class="item">{{rt.text}}</div>
        <div class="check">
          <checker v-model="rt.rate" class="checker" default-item-class="dic" selected-item-class="sic">
            <checker-item v-for="(item,k) in rt.items" :key="k" :value="(item.value)">
              {{item.name}}
            </checker-item>
          </checker>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <br>
    <div>
      <div style="padding: 0 10px;">
        <div style="text-align: left;padding-left: 75px;">
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
        <el-button @click="gonext" :disabled="!canGotoNext" type="primary">进入下一题</el-button>
      </div>
    </div>
    <br><br>
  </div>
</div>
</template>

<script>
import {
  Checker,
  CheckerItem,
} from 'vux'

export default {
  components: {
    Checker,
    CheckerItem
  },
  data() {
    return {
      ratetemplate: {
        speed: {
          text: '语速',
          items: [{
              name: '无效',
              value: 0
            },
            {
              name: '过慢',
              value: '-'
            },
            {
              name: '适中',
              value: 1
            },
            {
              name: '过快',
              value: '--'
            },
          ],
          rate: null,
        },
        volume: {
          text: '音量',
          items: [{
              name: '无效',
              value: 0
            },
            {
              name: '适合',
              value: 1
            },
            {
              name: '太大',
              value: '-'
            },
          ],
          rate: null,
        },
        tone: {
          text: '音调',
          items: [{
              name: '无效',
              value: 0
            },
            {
              name: '过平缓',
              value: '-'
            },
            {
              name: '适中',
              value: 1
            },
            {
              name: '过起伏',
              value: '--'
            },
          ],
          rate: null,
        },
        nervous: {
          text: '紧张',
          items: [{
              name: '无效',
              value: 0
            },
            {
              name: '紧张',
              value: '-'
            },
            {
              name: '不紧张',
              value: 1
            },
          ],
          rate: null,
        },
        expression: {
          text: '流畅',
          items: [{
              name: '无效',
              value: 0
            },
            {
              name: '不流畅',
              value: '-'
            },
            {
              name: '流畅',
              value: 1
            },
            {
              name: '很流畅',
              value: 2
            },
          ],
          rate: null,
        },
      },
      videoSource: [],
      markResult: -1,
      question: {}
    };
  },
  mounted() {
    this.getgetNewAnswer()
  },
  methods: {
    getgetNewAnswer() {
      this.$httpClient.getNewAnswer().then(res => {
        if (res.data.status === "200") {
          console.log(res.data)
          this.question = res.data.result
          this.videoSource = this.question.problemVideoList.map(v => {
            return {
              type: 'video/mp4',
              src: v.videoUrl
            }
          })
          // this.videoSource = [{
          //   type: 'video/mp4',
          //   src: 'http://1256823714.vod2.myqcloud.com/1e24fee6vodgzp1256823714/48d12b925285890781571068058/f0.mp4'
          // }]
        }
      }).catch(e => {

      })
    },
    gonext() {
      console.log(this.question)
      this.$httpClient.updateNewAnswer({
        "id": this.question.id,
        "score": this.markResult,
        "speechRateScore": this.ratetemplate['speed'].rate,
        "speechVolumeScore": this.ratetemplate['volume'].rate,
        "speechIntonationScore": this.ratetemplate['tone'].rate,
        "speechNervousScore": this.ratetemplate['nervous'].rate,
        "speechFluencyScore": this.ratetemplate['expression'].rate,
      }).then(res => {
        console.log(res)
        for (let k in this.ratetemplate) {
          this.ratetemplate[k].rate = null
        }
        this.markResult = -1
        this.getgetNewAnswer()
      }).catch(e => {
        console.log(e)
      })
    }
  },
  computed: {
    canGotoNext() {
      let flag = parseInt(this.markResult) === this.markResult && this.markResult >= 0
      return this.question.problemAnswerMethod === 0 ? flag :
        flag && this.ratedAll
    },
    playerOptions() {
      return {
        width: 480,
        height: 285,
        muted: false,
        preload: 'auto',
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: this.videoSource,
      }
    }
  },
  watch: {
    ratetemplate: {
      handler(newRt) {
        this.ratedAll = Object.keys(newRt).every(key => {
          let rate = newRt[key].rate
          return (parseInt(rate) === rate && rate >= 0) || rate === '-' || rate === '--'
        })
      },
      deep: true,
    },
    '$route'(newRoute) {

    }
  }
}
</script>

<style lang="less" scoped>
.sic {
  background: #36F6A1 !important;
  border: 1.5px solid red !important;
}

.top-video {
  width: 100%;
  background: black;
  position: relative;
  color: white;

  .title {
    position: absolute;
    left: 0;
    right: 0;
    top: 15px;
    z-index: 99;
  }

  .com-pos {
    position: absolute;
    top: 35px;
    left: 0;
    right: 0;
    padding: 25px;
  }

  .video {
    margin: 0 auto;
    width: 480px;
    height: 285px;
  }
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
      min-width: 480px;
      display: flex;
      justify-content: flex-start;
      margin-left: 8px;

      >div {
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

.checker2 {
  width: 250px;
  /*margin: 0 auto;*/
  padding-left: 15px;
  display: flex;
  justify-content: space-around;

  >div {
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
  padding-left: 15px;
  /*justify-content: center;*/
}
</style>
