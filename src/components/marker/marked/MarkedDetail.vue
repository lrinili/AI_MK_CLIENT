<template>
  <div style="width: 100%;min-height: 100%;background: rgb(241, 241, 241)">
    <x-header :left-options="{backText:''}"/>
    <ResultTemplate :question="question" :is-mark-detail="true"/>
    
    <!--    <div class="container">-->
    <!--      <div style="background: url(/src/assets/marker/marked/bg.png);margin-bottom: 15px;background-size: 100% 100%">-->
    <!--        <div class="top">-->
    <!--          <div>-->
    <!--            <p><span>职位类别：</span><span>{{dataDetail.domain}}</span></p>-->
    <!--            <p><span>层级：</span><span>{{dataDetail.grade}}</span></p>-->
    <!--          </div>-->
    <!--          <div class="time">{{dataDetail.time}}</div>-->
    <!--        </div>-->
    <!--        <div class="title">-->
    <!--          <span>问题：</span><span>{{dataDetail.question}}</span>-->
    <!--        </div>-->
    <!--        <div class="answer">{{dataDetail.content}}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="rate" v-for="(rt,i) in ratetemplate" :key="i">-->
    <!--        <div class="item">{{rt.text}}</div>-->
    <!--        <div class="check">-->
    <!--          <checker v-model="rt.rate" class="checker" default-item-class="dic" selected-item-class="sic">-->
    <!--            <checker-item v-for="(item,k) in rt.items" :key="k" :value="(k)">-->
    <!--              {{item}}-->
    <!--            </checker-item>-->
    <!--          </checker>-->
    <!--          <div class="line"></div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <div style="padding: 0 10px;">-->
    <!--          <div style="text-align: center;">-->
    <!--            <span style="padding: 0 25px;background: #f1f1f1">综合评分</span>-->
    <!--          </div>-->
    <!--          <div style="height: 1px;background: black;margin-top: -12.5px;"></div>-->
    <!--        </div>-->
    <!--        <br>-->
    <!--        <checker class="checker2" selected-item-class="sic" v-model="dataDetail.result">-->
    <!--          <checker-item :value="2">优秀</checker-item>-->
    <!--          <checker-item :value="1">良好</checker-item>-->
    <!--          <checker-item :value="0">差</checker-item>-->
    <!--        </checker>-->
    <!--      </div>-->
    <!--      <br><br>-->
    <!--    </div>-->
  </div>
</template>

<script>
  import {XHeader, Checker, CheckerItem} from 'vux'
  import ResultTemplate from '../../common/ResultTemplate'
  
  export default {
    name: 'MarkedDetail',
    components: {XHeader, Checker, CheckerItem, ResultTemplate},
    data () {
      return {
        question: {}
        // ratetemplate: {
        //   speed: {
        //     text: '语速',
        //     items: ['太慢', '慢', '适中', '快', '太快'],
        //     rate: -1,
        //   },
        //   volume: {
        //     text: '音量',
        //     items: ['强', '适中', '弱',],
        //     rate: -1,
        //   },
        //   tone: {
        //     text: '音调',
        //     items: ['紧张', '适中', '过平',],
        //     rate: -1,
        //   },
        //   nervous: {
        //     text: '紧张',
        //     items: ['不紧张', '紧张',],
        //     rate: -1,
        //   },
        //   expression: {
        //     text: '流畅', items: ['流畅', '不流畅'],
        //     rate: -1,
        //   },
        // },
        // dataDetail: {}
      }
    },
    beforeMount () {
      console.log(this.$route.params)
      this.question = {
        id: this.$route.params.qid
      }
    },
    mounted () {
      // let datail = this.$store.state.markedDetail.markedDetail
      // if (datail) {
      //   this.dataDetail = datail
      //   console.log('detail=', this.dataDetail)
      //   Object.keys(this.ratetemplate).forEach(key => {
      //     this.ratetemplate[key].rate = datail[key]
      //   })
      // } else {
      //   this.$router.push({name:'home',hash:'#1'})
      // }
    },
    methods: {}
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
      height: 60px;
      text-align: center;
      color: white;
      display: flex;
      font-size: 12px;
      
      > div {
        flex: 1;
      }
      
      > div.time {
        height: 60px;
        line-height: 60px;
        text-align: right;
        padding-right: 8px;
      }
      
      p {
        height: 30px;
        line-height: 30px;
        text-align: left;
        padding-left: 8px;
      }
    }
    
    .title {
      text-align: center;
      font-weight: bold;
      padding: 5px 0;
      font-size: 13px;
    }
    
    .answer {
      padding: 5px 10px;
      word-wrap: break-word;
      word-break: break-all;
      text-indent: 2em;
      font-size: 12px;
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
  }
</style>

