<template>
<div class="bg">
  <div class="login-container">
    <el-form ref="login-form" :model="form">
      <div class="logo">
        <img src="../assets/login/logo.png" alt="">
      </div>
      <div class="login-type">
        <el-select v-model="form.loginType" :value="1" placeholder="登录角色">
          <el-option :value="1" label="标注师" />
          <el-option :value="2" label="面试辅导师" />
          <el-option :value="3" label="简历辅导师" />
        </el-select>
      </div>
      <br>
      <div class="input_phone">
        <el-input v-model="form.phoneNo" placeholder="手机号码" />
      </div>
      <br>
      <div class="input_code">
        <div class="code">
          <el-input v-model="form.captcha" placeholder="验证码" />
        </div>
        <div class="send">
          <el-button :disabled="!isRightPhone" @click="getCode" :style="[send_btn,isRightPhone?active:inactive]">{{code_text}}</el-button>
        </div>
      </div>
      <br>
      <div class="btn_login">
        <el-button :disabled="!canLogin" @click="submitLogin" :style="[login_btn,canLogin?active:inactive]">登录
        </el-button>
      </div>
    </el-form>
  </div>
  <alert v-model="showError" title="错误提示"> {{ this.errorMsg}}</alert>
</div>
</template>

<script>
import {
  PopupRadio,
  Group,
  Alert
} from 'vux'
import ElSelectDropdown from 'element-ui/packages/select/src/select-dropdown'

export default {
  name: 'Login',
  components: {
    ElSelectDropdown,
    PopupRadio,
    Group,
    Alert
  },
  data() {
    return {
      form: {
        phoneNo: '',
        captcha: '',
        loginType: 1,
      },
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
      waittingTime: 60,
      showError: false,
      errorMsg: ''
    }
  },
  beforeMount() {},
  mounted() {
    document.title = 'Login'
    console.log(this.$httpClient)
  },
  computed: {
    code_text() {
      return this.remainingTime === 0 ? '发送验证码' : this.remainingTime + 's 后再试'
    },
    isRightPhone() {
      return /(13|14|15|17|18|19)[0-9]{9}/.test(this.form.phoneNo) && this.form.phoneNo.length === 11 && this.remainingTime === 0
    },
    isCaptchaFilled() {
      let captcha = this.form.captcha
      return /[0-9]{4}/.test(captcha) && captcha.length === 4
    },
    canLogin() {
      return this.isCaptchaFilled && Number.isInteger(this.form.loginType)
    }
  },
  methods: {
    getCode() {
      this.remainingTime = this.waittingTime
      let timer = setInterval(() => {
        this.remainingTime--
        if (this.remainingTime === 0) {
          clearInterval(timer)
        }
      }, 1000)
      this.$httpClient.sendCaptcha(this.form.phoneNo).then(res => {
        console.log(res.data)
        if (res.data.resultCode !== '200') {
          this.errorMsg = res.data.resultDesc
          this.showError = true
          this.remainingTime = 0
          clearInterval(timer)
        }
      }).catch(() => {
        this.errorMsg = '服务器繁忙，稍后重试'
        this.showError = true
        this.remainingTime = 0
        clearInterval(timer)
      })
    },
    submitLogin() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let testlogin = false

      if (testlogin) {
        loading.close()
        sessionStorage.setItem('auth', JSON.stringify({
          loginType: this.form.loginType,
          token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          userId: '60115272-89ed-4bcd-b355-7925c96e2b0e',
          userInfo: {
            avatar: 'user1.jpg'
          }
        }))
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$httpClient.authLogin({
          phoneNo: this.form.phoneNo,
          tempPass: this.form.captcha,
          loginType: parseInt(this.form.loginType)
        }).then(res => {
          console.log(res.data)
          loading.close()
          if (res.data.resultCode === '200') {
            let content = res.data.content
            console.log(content)
            sessionStorage.setItem('auth', JSON.stringify({
              ...content,
              loginType: this.form.loginType,
              token: content['mkToken'],
            }))
            console.log(this.$route)
            if (this.$route.query.redirect) {
              this.$router.push({
                path: this.$route.query.redirect
              })
            } else {
              this.$router.push({
                name: 'home'
              })
            }
          } else {
            this.errorMsg = res.data.resultDesc
            this.showError = true
          }
        }).catch(e => {
          console.log(e)
          loading.close()
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.bg {
  background: url('../assets/login/bg2.jpg') repeat-y center;
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
    background: url("../assets/login/tp.png") no-repeat;
    background-size: 100% 100%;
    padding: 4px 0;
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

  .login-type {
    .el-select {
      width: 100%;

      input {
        padding-left: 85px;
      }
    }
  }
}

.el-select-dropdown {
  .popper__arrow {
    left: 83px !important;
  }
}
</style>
