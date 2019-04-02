<template>
  <div class="bg">
    <div class="login-container">
      <el-form ref="login-form" :model="form">
        <div class="logo">
          <img src="../assets/login/logo.png" alt="">
        </div>
        <div class="login-type">
          <popup-radio title="登陆角色" :options="loginTypes" v-model="form.login_type" placeholder="请选择"/>
        </div>
        <br>
        <div class="input_phone">
          <el-input v-model="form.phone_no" placeholder="手机号码"/>
        </div>
        <br>
        <div class="input_code">
          <div class="code">
            <el-input v-model="form.code" placeholder="验证码"/>
          </div>
          <div class="send">
            <el-button :disabled="!isRightPhone" @click="getCode" :style="[send_btn,isRightPhone?active:inactive]">{{code_text}}</el-button>
          </div>
        </div>
        <br>
        <div class="btn_login">
          <el-button :disabled="!canLogin"
                     @click="submitLogin"
                     :style="[login_btn,canLogin?active:inactive]">登录
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {PopupRadio, Group} from 'vux'
  import {sendCaptcha, userLogin} from '../util/api'
  
  export default {
    name: 'Login',
    components: {PopupRadio, Group},
    data () {
      return {
        form: {
          phone_no: '',
          code: '',
          login_type: ''
        },
        loginTypes: [
          {key: 0, value: '标注师'},
          {key: 1, value: '简历辅导师'},
          {key: 2, value: '面试辅导师'}
        ],
        send_btn: {
          border: 'none',
          height: '46.5px',
          width: '110px',
          borderTopRightRadius: '46.5px',
          borderBottomRightRadius: '46.5px'
        },
        login_btn: {
          border: 'none',
          width: '100%',
          height: '48px',
          borderRadius: '48px'
        },
        active: {
          background: '#4189FF',
          color: 'white'
        },
        inactive: {
          background: '#aecfff',
          color: 'gray'
        },
        remainingTime: 0,
        waittingTime: 60
      }
    },
    beforeMount () {
    },
    mounted () {
      document.title = 'Login'
      this.$http.get('/api/get_phone').then(res => {
        this.form.phone_no = res.data.phone_no
      })
    },
    computed: {
      code_text () {
        return this.remainingTime === 0 ? '发送验证码' : this.remainingTime + 's 后再试'
      },
      isRightPhone () {
        return /(13|14|15|17|18|19)[0-9]{9}/.test(this.form.phone_no) && this.form.phone_no.length === 11 && this.remainingTime === 0
      },
      isCaptchaFilled () {
        let code = this.form.code
        return code.length === 4 || code.length === 6
      },
      canLogin () {
        return this.isCaptchaFilled && Number.isInteger(this.form.login_type)
      }
    },
    methods: {
      getCode () {
        this.remainingTime = this.waittingTime
        let timer = setInterval(() => {
          this.remainingTime--
          if (this.remainingTime === 0) {
            clearInterval(timer)
          }
        }, 1000)
        this.$http.get(sendCaptcha, {params: {phone_no: this.form.phone_no}}).then(res => {
          console.log(res)
          if (res.data.result) {
            this.form.code = '' + res.data.code
          }
        })
      },
      submitLogin () {
        this.$http.post(userLogin, this.form).then(res => {
          if (res.data.result) {
            let userInfo = res.data.user_info
            console.log(userInfo)
            sessionStorage.setItem('auth', JSON.stringify(userInfo))
            this.$router.push({name: 'home'})
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .bg {
    background: url('../assets/login/bg.jpg') repeat-y center;
    background-size: 100% 100%;
    min-height: 100%;
    width: 100%;
  }
  
  .login-container {
    box-sizing: border-box;
    width: 360px;
    padding: 30px 8px;
    margin: 0 auto;
    
    .logo {
      width: 50%;
      margin: 0 auto;
      
      img {
        width: 100%;
      }
    }
    
    .login-type {
      background: red;
    }
    
    .input_phone {
      height: 40px;
      background: url("../assets/login/input_phone.png") no-repeat;
      background-size: 100% 100%;
      padding: 4px 30px 4px 65px;
    }
    
    .input_code {
      height: 48px;
      background: url("../assets/login/input_code.png") no-repeat;
      background-size: calc(225px) 100%;
      padding: 0 5px 0 65px;
      display: flex;
      
      .code {
        margin-top: 4px;
      }
      
      .send {
        width: 110px;
        height: 48px;
        padding-top: 1px;
      }
    }
    
    .btn_login {
      width: 240px;
      margin: 0 auto;
    }
  }
</style>
<style lang="less">
  .login-container {
    .el-input {
      input {
        background-color: transparent;
        border: none;
        color: white;
      }
    }
  }
</style>
