<template>
  <div style="width: 100%;min-height: 100%;background: rgb(241, 241, 241)">
    <x-header :left-options="{backText:''}" @on-click-more="showMenus = true"/>
    <div class="container">
      <div class="left">
        <div class="avatar">
          <img src="../../../assets/avatar.png" alt="">
        </div>
        <div class="name">zeno</div>
      </div>
      <div class="right">
        <div class="job-level">职位类别：dasda</div>
        <div class="content">
          <div class="ta">
            <div>问题：dsada</div>
            <div>回答：大撒旦撒旦撒多所</div>
          </div>
          <div class="score">优秀</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {XHeader} from 'vux'
  
  export default {
    name: 'MarkedDetail',
    components: {XHeader},
    data () {
      return {
        questions: []
      }
    },
    beforeMount () {
    },
    mounted () {
    },
    methods: {}
  }
</script>

<style scoped lang="less">
  .container {
    display: flex;
    height: 160px;
    padding-bottom: 2px;
    border-bottom: 1px solid cadetblue;
    color: white;
    
    .left {
      width: 120px;
      position: relative;
      
      .avatar {
        width: 100%;
        height: 100%;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
        }
      }
      
      .name {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: rgba(0, 0, 0, 0.5);
      }
    }
    
    .right {
      flex: auto;
      display: flex;
      flex-direction: column;
      
      .job-level {
        height: 40px;
        background: black;
        line-height: 40px;
      }
      
      .content {
        flex: auto;
        display: flex;
        
        .ta {
          flex: auto;
          background: #443538;
        }
        
        .score {
          width: 45px;
          background: #46FFB7;
          text-align: center;
          line-height: 45px;
          writing-mode: tb-rl;
        }
      }
    }
  }
</style>
