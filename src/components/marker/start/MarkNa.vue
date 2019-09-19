<template>
  <div class="wrapper" style="min-height: 100%;background: rgb(241, 241, 241)">
    <div class="container" v-if="question.id">
      <div v-if="question.problemAnswerMethod === 1" class="top-video">
        <div class="com-pos">
          <div>Company Name：{{ question.companyName }}</div>
          <div>Job Title：{{ question.jobtitle }}</div>
          <div>Interviewer：{{ question.name }}</div>
          <div>Mobile Number：{{ question.phone }}</div>
          <div>Interview Channel：{{ question.interviewChannel }}</div>
        </div>
        <div class="video">
          <video-player
            v-if="videoSource.length > 0"
            :options="playerOptions"
            :playsinline="true"
            class="vjs-big-play-centered"
          ></video-player>
          <div v-else class="no-video">No Video</div>
        </div>
        <div class="video-list" v-if="videoSource.length > 1">
          <div
            v-for="(video, i) in videoSource"
            :key="i"
            @click="changeVideo(i)"
            :class="getclass(i)"
          >
            <a>{{ `Video ${i}` }}</a>
          </div>
        </div>
      </div>
      <div v-if="question.problemAnswerMethod === 0" style="padding-left:15px;">
        <div :style="{ padding: '15px 0' }">
          <h3>Company Name：{{ question.companyName }}</h3>
          <h4>Job Title：{{ question.jobtitle }}</h4>
          <h4>Interviewer：{{ question.name }}</h4>
          <h4>Mobile Number：{{ question.phone }}</h4>
          <h4>Interview Channel：{{ question.interviewChannel }}</h4>
        </div>
      </div>
      <div :style="{ padding: '5px 15px' }">
        <h3 v-html="question.problem" style="padding-top:15px;">
          {{ question.problem }}
        </h3>
        <div class="answercontent">
          <div>
            <br />
            <span>Answer：</span>
            <p
              style="line-heigt:25px;text-indent:2em;"
              v-html="question.answer"
            >
              {{ question.answer }}
            </p>
          </div>
        </div>
      </div>
      <br />
      <div v-if="question.problemAnswerMethod === 1">
        <div class="rate" v-for="(rt, i) in ratetemplate" :key="i">
          <div class="item">{{ rt.text }}</div>
          <div class="check">
            <checker
              v-model="rt.rate"
              class="checker"
              default-item-class="dic"
              selected-item-class="sic"
            >
              <checker-item
                v-for="(item, k) in rt.items"
                :key="k"
                :value="item.value"
              >
                {{ item.name }}
              </checker-item>
            </checker>
            <!-- <div class="line"></div> -->
          </div>
        </div>
      </div>
      <br />
      <div v-if="false">
        <div style="padding: 0 10px;">
          <div style="text-align: left;padding-left: 75px;">
            <span v-show="true" style="padding: 0 25px;background: #f1f1f1"
              >Comprehensive Score</span
            >
          </div>
          <div style="height: 1px;background: black;margin-top: -12.5px;"></div>
        </div>
        <br />
        <checker
          v-show="true"
          v-model="markResult"
          class="checker2"
          selected-item-class="sic"
        >
          <checker-item :value="2">Excellent</checker-item>
          <checker-item :value="1">Good</checker-item>
          <checker-item :value="0">Bad</checker-item>
        </checker>
      </div>
      <br />
      <div class="btn-group">
        <div>
          <el-button @click="gonext" :disabled="!canGotoNext" type="primary"
            >Next</el-button
          >
        </div>
      </div>
      <br /><br />
    </div>
    <actionsheet
      v-model="showActionsheet"
      :menus="markServerList"
      theme="android"
      @on-click-menu="selectServer"
      :close-on-clicking-mask="false"
    ></actionsheet>
  </div>
</template>

<script>
import { Checker, CheckerItem, Actionsheet } from "vux";

export default {
  components: {
    Checker,
    CheckerItem,
    Actionsheet
  },
  data() {
    return {
      oldRate: {
        speechRateScore: null,
        speechVolumeScore: null,
        speechIntonationScore: null,
        speechNervousScore: null,
        speechFluencyScore: null
      },
      ratetemplate: {
        speed: {
          text: "Speed",
          items: [
            {
              name: "Invalid",
              value: 0
            },
            {
              name: "Too Slow",
              value: "-"
            },
            {
              name: "Just Right",
              value: 1
            },
            {
              name: "Too Fast",
              value: "--"
            }
          ],
          rate: null
        },
        volume: {
          text: "Volume",
          items: [
            {
              name: "Invalid",
              value: 0
            },
            {
              name: "Too Loud",
              value: "--"
            },
            {
              name: "Just Right",
              value: 1
            },
            {
              name: "Too Soft",
              value: "-"
            }
          ],
          rate: null
        },
        tone: {
          text: "Vocal Variety",
          items: [
            {
              name: "Invalid",
              value: 0
            },
            {
              name: "Mostly Flat",
              value: "-"
            },
            {
              name: "Just Right",
              value: 1
            },
            {
              name: "Overly Varied",
              value: "--"
            }
          ],
          rate: null
        },
        nervous: {
          text: "Degree of Nervousness",
          items: [
            {
              name: "Invalid",
              value: 0
            },
            {
              name: "Nervous",
              value: "-"
            },
            {
              name: "Not Nervous",
              value: 1
            }
          ],
          rate: null
        },
        expression: {
          text: "Degree of Fluency",
          items: [
            {
              name: "Invalid",
              value: 0
            },
            {
              name: "Not Fluent",
              value: "-"
            },
            {
              name: "Fluent",
              value: 1
            }
          ],
          rate: null
        }
      },
      videoSource: [],
      markResult: -1,
      question: {},
      isBeta: true,
      ratedAll: false,
      videoUrl: "",
      autoplay: false,
      index: 0,
      showActionsheet: true,
      markServerList: {
        beta: "测试区"
        // publish: '正式区',
        // publishEn: '正式区-英文(空客)',
        //akspublish: "Acadsoc"
        // aksbeta: 'Acadsoc(Test)',
      },
      serverMap: {
        beta: {
          query: "https://aiqnmsg.cn/znzp/marker/queryspeechanswer.shtml",
          update: "https://aiqnmsg.cn/znzp/marker/remarkspeechanswer.shtml"
        },
        publish: {
          query:
            "https://aimianshiguan.com/znzp/marker/queryspeechanswer.shtml",
          update:
            "https://aimianshiguan.com/znzp/marker/remarkspeechanswer.shtml"
        },
        publishEn: {
          query: "https://en.aiqnmsg.com/znzp/marker/queryspeechanswer.shtml",
          update: "https://en.aiqnmsg.com/znzp/marker/remarkspeechanswer.shtml"
        },
        aksbeta: {
          query: "https://test.aiqnmsg.com/znzp/marker/queryspeechanswer.shtml",
          update:
            "https://test.aiqnmsg.com/znzp/marker/remarkspeechanswer.shtml"
        },
        akspublish: {
          query: "https://aks.aiqnmsg.com/znzp/marker/queryspeechanswer.shtml",
          update: "https://aks.aiqnmsg.com/znzp/marker/remarkspeechanswer.shtml"
        }
      },
      queryUrl: "",
      updateUrl: ""
    };
  },
  mounted() {},
  methods: {
    selectServer(server) {
      console.log(server);
      this.queryUrl = this.serverMap[server].query;
      this.updateUrl = this.serverMap[server].update;
      console.log(this.queryUrl);
      console.log(this.updateUrl);
      this.getNewAnswer();
    },
    changeVideo(i) {
      // this.autoplay = true
      this.index = i;
      this.videoUrl = this.videoSource[i].videoUrl;
    },
    getclass(i) {
      if (i === this.index) {
        return "active";
      }
    },
    getNewAnswer() {
      this.$httpClient
        .getNewAnswer(this.queryUrl)
        .then(res => {
          if (res.data.status === "200") {
            console.log("getNewAnswer", res.data);
            if (res.data.result) {
              let question = res.data.result;
              let problem = question.problem;
              let videoTags = problem.match(/\<video(.*?)\>/gi);
              if (!videoTags) {
                videoTags = [];
              }
              let w = document.body.clientWidth - 30 + "px";
              let newVideoTags = videoTags.map(tag => {
                return tag
                  .replace(/width="(.*?)\"/gi, 'width="' + w + '"')
                  .replace(/height="(.*?)\"/gi, 'height="340px"');
              });
              newVideoTags.forEach((tag, i) => {
                problem = problem.replace(videoTags[i], tag);
              });
              this.question = {
                ...question,
                problem
              };
              this.videoSource = this.question.problemVideoList;
              /**
               * 保存原先分数
               */
              this.oldRate.speechFluencyScore =
                res.data.result.speechFluencyScore;
              this.oldRate.speechIntonationScore =
                res.data.result.speechIntonationScore;
              this.oldRate.speechNervousScore =
                res.data.result.speechNervousScore;
              this.oldRate.speechRateScore = res.data.result.speechRateScore;
              this.oldRate.speechVolumeScore =
                res.data.result.speechVolumeScore;
              /**
               * 赋值
               */
              this.ratetemplate.speed.rate = res.data.result.speechFluencyScore;
              this.ratetemplate.volume.rate =
                res.data.result.speechIntonationScore;
              this.ratetemplate.tone.rate = res.data.result.speechNervousScore;
              this.ratetemplate.nervous.rate = res.data.result.speechRateScore;
              this.ratetemplate.expression.rate =
                res.data.result.speechVolumeScore;

              // .map(v => {
              //   return {
              //     type: 'video/mp4',
              //     src: v.videoUrl
              //   }
              // })
              if (this.videoSource.length > 0) {
                console.log(
                  this.videoSource.length,
                  this.videoSource[0].videoUrl
                );
                this.videoUrl = this.videoSource[0].videoUrl;
              }
              this.autoplay = false;
            } else {
              // this.question = {
              //   id: 2,
              //   problemAnswerMethod: 1,
              // }
              this.$vux.alert.show({
                title: "Notice",
                content: "No More Question",
                buttonText: "OK",
                onShow() {},
                onHide: () => {
                  console.log(this);
                  this.showActionsheet = true;
                  // window.location.href = 'https://aimianshiguan.com/'
                }
              });
            }
          }
        })
        .catch(e => {
          this.$notify.error({
            title: "Error",
            message: e.message
          });
        });
    },
    gonext() {
      console.log("gonext", this.question);
      for (let k in this.ratetemplate) {
        console.log(k, this.ratetemplate[k].rate);
      }
      let id = this.question.id;
      let NewForm = {
        speechRateScore: isNaN(parseInt(this.ratetemplate["speed"].rate))
          ? 0
          : parseInt(this.ratetemplate["speed"].rate),
        speechVolumeScore: isNaN(parseInt(this.ratetemplate["volume"].rate))
          ? 0
          : parseInt(this.ratetemplate["volume"].rate),
        speechIntonationScore: isNaN(parseInt(this.ratetemplate["tone"].rate))
          ? 0
          : parseInt(this.ratetemplate["tone"].rate),
        speechNervousScore: isNaN(parseInt(this.ratetemplate["nervous"].rate))
          ? 0
          : parseInt(this.ratetemplate["nervous"].rate),
        speechFluencyScore: isNaN(
          parseInt(this.ratetemplate["expression"].rate)
        )
          ? 0
          : parseInt(this.ratetemplate["expression"].rate)
      };
      let oldForm = Object.assign({}, this.oldRate);
      let obj = {};
      obj.problemId = this.question.id;
      obj.orginMark = oldForm;
      obj.newMark = Object.assign({}, NewForm);
      // console.log(form);
      this.$httpClient
        .updateNewAnswer(obj, this.updateUrl)
        .then(res => {
          console.log(res.data);
          if (res.data.status === "200") {
            for (let k in this.ratetemplate) {
              this.ratetemplate[k].rate = null;
            }
            this.markResult = -1;
            this.getNewAnswer();
          } else {
            return Promise.reject(new Error(res.data.message));
          }
        })
        .catch(e => {
          this.$notify.error({
            title: "Error",
            message: e.message
          });
        });
    }
  },
  computed: {
    canGotoNext() {
      // let flag =
      //   parseInt(this.markResult) === this.markResult && this.markResult >= 0;
      // return this.question.problemAnswerMethod === 0
      //   ? flag
      //   : flag && this.ratedAll;
      return this.ratedAll;
    },
    playerOptions() {
      return {
        width: document.body.clientWidth,
        height: 285,
        muted: false,
        preload: "auto",
        language: "en",
        autoplay: this.autoplay,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            src: this.videoUrl
          }
        ]
      };
    }
  },
  watch: {
    ratetemplate: {
      handler(newRt) {
        this.ratedAll = Object.keys(newRt).every(key => {
          let rate = newRt[key].rate;
          return (
            (parseInt(rate) === rate && rate >= 0) ||
            rate === "-" ||
            rate === "--"
          );
        });
      },
      deep: true
    },
    $route(newRoute) {}
  }
};
</script>

<style lang="less" scoped>
.sic {
  background: #36f6a1 !important;
  border: 1.5px solid red !important;
}

.wrapper {
  /deep/ .weui-actionsheet__cell {
    cursor: pointer;

    &:hover {
      background: #d8d7d7;
    }
  }
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
    padding-top: 10px;
    padding-left: 25px;
    color: white;
    z-index: 99;
  }

  .video {
    margin: 0 auto;
    width: calc(100%);
    height: 285px;

    .no-video {
      text-align: center;
      line-height: 285px;
    }
  }

  .video-list {
    position: absolute;
    right: 10px;
    bottom: 30px;
    z-index: 99;

    .active {
      color: blue;
    }

    > div {
      cursor: pointer;

      a {
        border-bottom: 1px solid steelblue;
      }
    }
  }
}

.rate {
  display: flex;
  // height: 55px;
  border-bottom: 1px solid #c7c2c2;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 110px;
    min-width: 110px;
    text-align: center;

    font-weight: bold;
  }

  .check {
    flex: auto;
    padding: 6px;

    // .line {
    //   width: 100%;
    //   height: 2px;
    //   background: #e6e1e1;
    //   margin-top: -22.5px;
    // }

    .checker {
      min-width: calc(100vw - 55px);
      margin-left: 8px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      > div {
        min-width: 80px;
        height: 40px;
        background: #f1f1f1;
        margin-right: 8px;
        margin-bottom: 8px;
        font-weight: normal;
        font-size: 12px;
        line-height: 40px;
        border-radius: 4px;
        text-align: center;
        border: 1.5px solid;
      }
    }
  }
}

.checker2 {
  width: 300px;
  /*margin: 0 auto;*/
  padding-left: 15px;
  display: flex;
  justify-content: space-around;

  > div {
    min-width: 90px;
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
