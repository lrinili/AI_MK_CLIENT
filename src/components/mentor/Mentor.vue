<template>
  <div :style="mainStyle" class="home">
    <div class="avatar">
      <img :src="avatar" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    
    data () {
      return {
        mainStyle: {
          height: (document.body.clientHeight - 51) + 'px'
        },
        avatar: ''
      }
    },
    mounted () {
      let auth = JSON.parse(sessionStorage.getItem('auth'))
      console.log(auth)
      this.avatar = 'https://aiqnmsg.cn/aimk/rest/wx/download/getImage?imgType=avatar&fileName='+ auth.userInfo['avatar']
    },
    methods: {},
    computed: {}
  }
</script>
<style lang="less" scoped>
  .home {
    display: flex;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    
    .avatar {
      height: 360px;
      width: 360px;
      
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
