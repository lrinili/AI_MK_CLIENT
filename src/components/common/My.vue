<template>
  <div>
    <UserInfo :user-info="userInfo"></UserInfo>
  </div>
</template>

<script>
  import UserInfo from './UserInfo'
  
  export default {
    name: 'My',
    components: {UserInfo},
    data () {
      return {
        userInfo: {}
      }
    },
    beforeMount () {
    },
    mounted () {
      let auth = JSON.parse(sessionStorage.getItem('auth'))
      let type = auth.loginType
      console.log('logintype=', type)
      this.$httpClient.getUserInfo(auth['userId'], type).then((res) => {
        console.log('用户信息获取成功');
        if (res.data.resultCode === '200') {
          this.userInfo = res.data.content
        } else {
          console.warn(res.data.resultDesc)
        }
      }).catch(() => {
        console.error('服务器错误')
      })
    }
  }
</script>

<style scoped>

</style>
