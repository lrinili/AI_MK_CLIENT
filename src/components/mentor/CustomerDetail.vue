<template>
  <div class="container">
    <x-header :left-options="{backText:''}"/>
    <div class="header">
      <div style="background: rgba(0,0,0,0.5);height: calc(100% - 8)">
        <div class="ae">
          <div class="avatar">
            <img :src="form.avatar" alt="">
          </div>
        </div>
        <div class="contact">
          <span>手机号：</span><span>{{''}}</span>
          <span>邮箱：</span><span>{{''}}</span>
        </div>
      </div>
    </div>
    <div class="inerviews">
      <div style="padding:10px 15px;"><span style="border-bottom: 1px solid black;">模 拟 面 试 记 录</span></div>
      <div style="padding: 5px 15px;">
        <InterviewItem v-for="i in 5" :key="i"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {XHeader} from 'vux'
  import InterviewItem from './InterviewItem'
  
  export default {
    name: 'CustomerDetail',
    components: {InterviewItem, XHeader},
    data () {
      return {
        form: {}
      }
    },
    mounted () {
      let cid = this.$route.params.cid
      console.log('当前客户ID=', cid, '根据此ID获取用户面试记录,面试详情')
    }
  }
</script>

<style scoped lang="less">
  .container {
    width: 100%;
    
    .header {
      height: 180px;
      background: url("../../assets/userinfo/bg.png");
      background-size: 100% 100%;
      position: relative;
      
      .ae {
        width: 120px;
        height: 120px;
        margin: 0 auto;
        padding-top: 30px;
        
        .avatar {
          margin: 0 auto;
          width: 100px;
          height: 100px;
          border-radius: 60px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      
      .contact {
        text-align: center;
        color: white;
        /*height: 30px;*/
      }
    }
  }
</style>
