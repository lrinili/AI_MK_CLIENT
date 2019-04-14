<template>
  <div style="padding-bottom: 10px;">
    <div class="container">
      <div class="top">
        <div><span>职位类别：</span><span>{{'管理'}}</span></div>
        <div><span>层次：</span><span>{{'应届生'}}</span></div>
        <div class="time">2019 06 08</div>
      </div>
      <div style="height: 120px">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InterviewItem',
    mounted () {
      console.warn('缺少面试ID')
    }
  }
</script>

<style scoped lang="less">
.container{
  border: 1px solid black;
  border-radius: 5px;
  overflow: hidden;
  .top{
    display: flex;
    background: black;
    padding: 5px;
    >div{
      flex: 1;
      color: white;
    }
    .time{
      text-align: right;
    }
  }
}
</style>
