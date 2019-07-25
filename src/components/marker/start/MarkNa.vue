<template>
<div style="min-height: 100%;background: rgb(241, 241, 241)">
  <div class="container" v-if="question.id">
    <div v-if="question.problemAnswerMethod === 1" class="top-video">
      <div class="com-pos">
        <div>公司名称：{{question.companyName}}</div>
        <div>职位名称：{{question.jobtitle}}</div>
        <div>面试者：{{question.name}}</div>
        <div>手机号：{{question.phone}}</div>
      </div>
      <div class="video">
        <video-player :v-if="videoSource.length>0" :options="playerOptions" :playsinline="true" class="vjs-big-play-centered"></video-player>
      </div>
    </div>
    <div v-if="question.problemAnswerMethod === 0" style="padding-left:15px;">
      <div :style="{padding:'15px 0'}">
        <h3>公司名称：{{question.companyName}}</h3>
        <h4>职位名称：{{question.jobtitle}}</h4>
        <h4>面试者：{{question.name}}</h4>
        <h4>手机号：{{question.phone}}</h4>
      </div>
    </div>
    <div :style="{padding:'5px 15px'}">
      <h3 v-html="question.problem" style="padding-top:15px;">{{question.problem}}</h3>
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
      question: {},
      isBeta: true,
      ratedAll: false,
    };
  },
  mounted() {
    // this.getNewAnswer()
    this.$vux.confirm.show({
      title: '标注打分',
      content: '请选择正式区或者测试区？',
      confirmText: '正式区',
      cancelText: '测试区',
      onConfirm: () => {
        this.isBeta = false
        document.title = '正式区'
        this.getNewAnswer()
      },
      onCancel: () => {
        this.isBeta = true
        document.title = '测试区'
        this.getNewAnswer()
      }
    })
  },
  methods: {
    getNewAnswer() {
      this.$httpClient.getNewAnswer(this.isBeta).then(res => {
        if (res.data.status === "200") {
          console.log('getNewAnswer', res.data)
          if (res.data.result) {
            let question = res.data.result
            let problem = question.problem
            let videoTags = problem.match(/\<video(.*?)\>/gi)
            if (!videoTags) {
              videoTags = []
            }
            let w = document.body.clientWidth - 48 + 'px'
            let newVideoTags = videoTags.map(tag => {
              return tag
                .replace(/width="(.*?)\"/gi, 'width="' + w + '"')
                .replace(/height="(.*?)\"/gi, 'height="340px"')
            })
            newVideoTags.forEach((tag, i) => {
              problem = problem.replace(videoTags[i], tag)
            })
            this.question = {
              ...question,
              problem
            }
            this.videoSource = this.question.problemVideoList.map(v => {
              return {
                type: 'video/mp4',
                src: v.videoUrl
              }
            })
          } else {
            this.$vux.alert.show({
              title: '提示',
              content: '没有更多的题目了',
              onShow() {},
              onHide() {
                window.location.href = 'https://aimianshiguan.com/'
              }
            })
          }
        }
      }).catch(e => {
        this.$notify.error({
          title: 'Error',
          message: e.message
        })
      })
    },
    gonext() {
      console.log('gonext', this.question)
      for (let k in this.ratetemplate) {
        console.log(k, this.ratetemplate[k].rate)
      }
      let form = {
        "id": this.question.id,
        "score": this.markResult,
        "speechRateScore": isNaN(parseInt(this.ratetemplate['speed'].rate)) ? 0 : parseInt(this.ratetemplate['speed'].rate),
        "speechVolumeScore": isNaN(parseInt(this.ratetemplate['volume'].rate)) ? 0 : parseInt(this.ratetemplate['volume'].rate),
        "speechIntonationScore": isNaN(parseInt(this.ratetemplate['tone'].rate)) ? 0 : parseInt(this.ratetemplate['tone'].rate),
        "speechNervousScore": isNaN(parseInt(this.ratetemplate['nervous'].rate)) ? 0 : parseInt(this.ratetemplate['nervous'].rate),
        "speechFluencyScore": isNaN(parseInt(this.ratetemplate['expression'].rate)) ? 0 : parseInt(this.ratetemplate['expression'].rate),
      }
      console.log(form)
      this.$httpClient.updateNewAnswer(form, this.isBeta).then(res => {
        console.log(res.data)
        if (res.data.status === "200") {
          for (let k in this.ratetemplate) {
            this.ratetemplate[k].rate = null
          }
          this.markResult = -1
          this.getNewAnswer()
        } else {
          return Promise.reject(new Error(res.data.message))
        }
      }).catch(e => {
        this.$notify.error({
          title: 'Error',
          message: e.message
        })
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
        width: document.body.clientWidth - 22,
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

  .com-pos {
    position: absolute;
    top: 5px;
    left: 0;
    right: 0;
    padding: 10px 25px 25px 25px;
    color: white;
    z-index: 99;
  }

  .video {
    margin: 0 auto;
    width: calc(100%);
    height: 285px;
  }
}

.rate {
  display: flex;
  height: 55px;

  .item {
    width: 55px;
    min-width: 55px;
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
      min-width: calc(100vw - 55px);
      display: flex;
      justify-content: flex-start;
      margin-left: 8px;

      >div {
        width: 40px;
        height: 40px;
        background: #f1f1f1;
        margin-right: 8px;
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
