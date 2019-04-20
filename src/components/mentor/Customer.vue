<template>
  <div class="container">
    <x-header :left-options="{backText:''}"/>
    <div class="header">
      <div style="background: rgba(0,0,0,0.5);height: calc(100% - 8)">
        <div class="ae">
          <div class="avatar">
            <img :src="avatar" alt="">
          </div>
        </div>
        <div class="contact">
          <span>手机号：</span><span>{{phone}}</span>
          <span>邮箱：</span><span>{{email}}</span>
        </div>
      </div>
    </div>
    <div class="inerviews">
      <div style="padding:10px 15px;"><span style="border-bottom: 1px solid black;">模 拟 面 试 记 录</span></div>
      <div style="padding: 5px 15px;">
        <InterviewItem v-for="(item,i) in interviews" :key="i" :interviewItem="item"/>
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
        avatar: '',
        phone: '',
        email: '',
        interviews: []
      }
    },
    mounted () {
      let cid = this.$route.params.cid
      console.log(this.$route.params, this.$route.query)
      this.avatar = this.$route.query.avatar
      this.phone = this.$route.query.phone
      this.email = this.$route.query.email
      this.$httpClient.getInterviewItems(cid).then(res => {
        if (res.data.resultCode === '200') {
          console.log(res.data.content)
          this.interviews = res.data.content.map(item => {
            return {
              domain: item['DOMAIN_TITLE'],
              grade: item['INTERVIEW_GRADE'],
              isFinished: item['ISFINISHED'],
              time: item['INTERVIEW_TIME'].substring(0, 10),
              interviewerId: item['MK_INTERVIEWER_ID'],
              itemId: item['MK_INTERVIEW_ITEM_ID'],
            }
          })
        } else {
          console.warn(res.data.resultDesc)
        }
      }).catch(() => {
        console.error('getInterviewItems 服务器错误')
      })
    }
  }
</script>

<style scoped lang="less">
  .container {
    width: 100%;
    background:rgb(241, 241, 241);
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
        font-size: 12px;
        /*height: 30px;*/
      }
    }
  }
</style>
