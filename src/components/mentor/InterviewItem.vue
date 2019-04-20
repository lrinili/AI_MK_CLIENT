<template>
  <div style="padding-bottom: 10px;">
    <div class="container" >
      <div class="top">
        <div><span>职位：</span><span>{{interviewItem.domain}}</span></div>
        <div><span>层次：</span><span>{{interviewItem.grade}}</span></div>
        <div class="time">{{interviewItem.time}}</div>
      </div>
      <div class="bottom">
        <div><span>面试状态：</span><span>{{interviewItem.isFinished ===1?'已完成':'未完成'}}</span></div>
        <div class="btn">
          <el-button
            style="background: black;border-radius: 0;color: white;"
            @click="viewInterviewDedail(interviewItem.itemId)"
          >查看详情
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InterviewItem',
    props: {
      interviewItem: {type: Object, required: true}
    },
    mounted () {

    },
    methods: {
      viewInterviewDedail (id) {
        console.log(id)
        this.$router.push({name:'detail',params:{id}})
      }
    }
  }
</script>

<style scoped lang="less">
  .container {
    border: 1px solid black;
    border-radius: 5px;
    overflow: hidden;
    font-size: 12px;
    
    .top {
      display: flex;
      background: black;
      padding: 10px;
      
      > div {
        flex: auto;
        color: white;
      }
      
      .time {
        text-align: right;
      }
    }
    
    .bottom {
      height: 60px;
      display: flex;
      
      > div {
        height: 40px;
        flex: 1;
        line-height: 40px;
        padding: 10px;
      }
      
      .btn {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>
