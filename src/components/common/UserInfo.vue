<template>
  <div class="container">
    <div class="header">
      <div class="ae">
        <div class="avatar">
          <img src="../../assets/avatar.png" alt="">
        </div>
        <div class="edit">
          <el-button :style="editBtn">修改质料</el-button>
        </div>
      </div>
      <!--<div class="changebg">-->
        <!--<el-upload action="" style="color: white"><span>更换背景<i class="el-icon-plus"></i></span></el-upload>-->
      <!--</div>-->
    </div>
    <div class="user-info">
      <div class="base">
        <div class="name"><span>姓名：</span><span>张云云</span></div>
        <div class="gender"><span>性别：</span><span>Male</span></div>
        <div class="birthday"><span>出生年月：</span><span>1990-01-01</span></div>
      </div>
      <div class="others">
        <div>
          <div>身份：</div>
          <div>在校生</div>
        </div>
        <div>
          <div>所在城市：</div>
          <div>上海-浦东新区</div>
        </div>
        <div>
          <div>毕业(所在)院校：</div>
          <div>北京大学</div>
        </div>
        <div>
          <div>专业：</div>
          <div>计算机</div>
        </div>
        <div>
          <div>年级/工作年限：</div>
          <div>3年</div>
        </div>
      </div>
      <div class="bio">
        <div>个人简介：</div>
        <p>
          1993年参加工作一直在河南省新乡市红旗区和平路小学任教，2011年任和平小学教导处主任，2014年任红旗区小店镇中心校副校长。国际二级心理咨询师；国家高级家庭教育指导师；国家首届幸福力讲师；河南省国培讲师；新乡市积极心理学幸福教育委员会秘书长。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  // import {} from 'vux'
  export default {
    name: 'UserInfo',
    data () {
      return {
        editBtn: {
          width: '95%',
          borderRadius: '20px',
          color: 'white',
          height: '30px',
          padding: '0',
          background: 'rgba(0,0,0,0.25)'
        }
      }
    },
    methods: {
      // changeBg(){
      //   alert('bg')
      // }
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
        height: 100%;
        margin: 0 auto;
        padding-top: 15px;
        
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
        
        .edit {
          padding-top: 12px;
          text-align: center;
        }
      }
      
      .changebg {
        position: absolute;
        width: 80px;
        height: 30px;
        right: 0;
        bottom: 5px;
        background: rgba(0, 0, 0, 0.5);
        line-height: 30px;
        padding-right: 5px;
        text-align: right;
        color: white;
        cursor: pointer;
        font-size: 14px;
      }
    }
    
    .user-info {
      padding: 10px;
      
      .base {
        display: flex;
        padding: 5px 0;

        .name {
          /*width: 120px;*/
          flex: auto;
        }
        
        .gender {
          /*width: 100px;*/
          flex: auto;
          
        }
        
        .birthday {
          width: 170px;
          text-align: right;
        }
      }
      
      .others {
        > div {
          display: flex;
          padding: 5px 0;
          
          > div:nth-child(2) {
            flex: auto;
            border-bottom: 1px solid cadetblue;
            text-align: center;
            margin-left: 5px;
          }
        }
      }
      .bio{
        p{
          text-indent: 2em;
          line-height: 28px;
        }
      }
    }
  }
</style>
