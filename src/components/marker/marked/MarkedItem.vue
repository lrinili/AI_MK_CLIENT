<template>
  <div class="item">
    <div class="container" @click="viewDetail(dataDetail.interviewResultId)">
      <div class="top">
        <div class="job-domain">
          <div><span>职位类别：</span><span>{{dataDetail.domain}}</span></div>
          <div><span>层级：</span><span>{{dataDetail.grade}}</span></div>
        </div>
        <div class="time">{{dataDetail.time}}</div>
        <div class="result">{{dataDetail.result ===0?'差':dataDetail.result===1?'良好':'优秀'}}</div>
      </div>
      <div class="qt">
        <div class="mask">
          <div class="title"><span>问题：</span>{{dataDetail.question}}</div>
          <p class="content">{{dataDetail.content}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MarkedItem',
    props: {
      dataDetail: {
        type: Object, required: true
      }
    },
    data () {
      return {}
    },
    mounted () {
      // console.log(this.dataDetail)
    },
    methods: {
      viewDetail (qid) {
        // console.log(qid)
        // this.$store.commit('saveMarkedDeatil', this.dataDetail)
        this.$router.push({name: 'marked', params: {qid}})
      }
    }
  }
</script>

<style scoped lang="less">
  .item {
    padding-bottom: 18px;
    font-size: 12px;
    
    .container {
      padding: 0;
      cursor: pointer;
      border-bottom:  1px solid gray;
      .top {
        height: 52px;
        background: black;
        color: white;
        display: flex;
        
        > div {
          flex: auto;
        }
        
        .job-domain {
          padding-left: 8px;
          
          > div {
            height: 26px;
            line-height: 26px;
          }
        }
        
        .time, .result {
          height: 52px;
          line-height: 52px;
          text-align: center;
        }
        
        .result {
          background: #46FFB7;
          width: 55px;
        }
      }
      
      .qt {
        background: url("../../../assets/marker/marked/bg.png");
        background-size: 100% 100%;
        color: white;
        
        .mask {
          min-height: 80px;
          padding: 8px;
          background: rgba(0, 0, 0, 0.2);
        }
        
        .title {
          height: 35px;
          line-height: 35px;
        }
        
        .content {
          text-indent: 2em;
          line-height: 28px;
          width: 100%;
          word-break: break-all;
        }
      }
    }
  }
</style>
