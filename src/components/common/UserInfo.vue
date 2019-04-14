<template>
  <div class="container">
    <div class="header">
      <div class="ae">
        <div class="avatar">
          <img :src="form.avatar" alt="">
        </div>
      </div>
    </div>
    <popup v-model="showPopup" height="100%">
      <div class="popup1">
        <x-header :left-options="{backText:'',preventGoBack:true}" @on-click-back="showPopup=false">
          <div slot="right" @click="confirmModify">确定</div>
        </x-header>
        <br>
        <div style="padding: 2px 5px;background: white">
          <div v-if="modifyFlag==='description'">
            <x-textarea style="padding: 0" title="" placeholder=" "
                        v-model="modifyedValue"
                        :autosize="true"
                        :max="maxlength"
                        :rows="10"
            ></x-textarea>
          </div>
          <div v-else>
            <x-input style="padding: 0;height: 38px" title="" placeholder=" "
                     v-model="modifyedValue"
                     :autosize="true"
                     :max="maxlength"
            ></x-input>
          </div>
        </div>
      </div>
    </popup>
    <div class="user-info">
      <div>
        <group style="background: transparent">
          <cell title="姓名" v-model="form.name" @click.native="modify('name')"/>
          <!--          <popup-radio title="性别" :options="genders" v-model="form.gender"></popup-radio>-->
          <cell title="性别" v-model="form.gender"/>
          <cell title="出生年月" v-model="form.birthday"/>
          <!--          <datetime title="出生年月" :min-year="1900" v-model="form.birthday"></datetime>-->
          <cell title="身份" v-model="form.position"></cell>
          <!--          <x-address title="所在城市" v-model="form.city" :list="addressData" placeholder="未选择"-->
          <!--                     :popup-style="{zIndex: 502}"-->
          <!--          ></x-address>-->
          <cell title="所在城市" v-model="form.city"></cell>
          <cell title="毕业(所在)学校" primary="content" align-items="center" v-model="form.school"
                @click.native="modify('school')"
          ></cell>
          <cell title="专业" primary="content" align-items="center" v-model="form.major"
                @click.native="modify('major')"
          ></cell>
          <cell title="年级/工作年限" v-model="form.years" @click.native="modify('year')"></cell>
          <cell title="个人简介" v-model="form.description" primary="content" align-items="center"
                @click.native="modify('description')"
          ></cell>
        </group>
      </div>
    </div>
  </div>
</template>

<script>
  import {Cell, Group, Datetime, PopupRadio, XAddress, ChinaAddressData, Popup, PopupHeader, XInput, XTextarea, XHeader} from 'vux'
  
  export default {
    props: {
      userInfo: {type: Object, required: true}
    },
    name: 'UserInfo',
    components: {XInput, XTextarea, Cell, Group, Datetime, PopupRadio, XAddress, Popup, PopupHeader, XHeader},
    data () {
      return {
        showPopup: false,
        maxlength: 0,
        modifyFlag: '',
        modifyedValue: '',
        addressData: ChinaAddressData,
        genders: [
          {key: 0, value: '男'},
          {key: 1, value: '女'},
          {key: 2, value: '不公开'},
        ],
        form: {
          avatar: '',
          name: '',
          gender: 0,
          birthday: '',
          position: '',
          city: [],
          school: '',
          major: '',
          years: 0,
          description: ''
        },
      }
    },
    beforeMount () {
    },
    mounted () {
    },
    watch: {
      userInfo: {
        handler (info) {
          let auth = JSON.parse(sessionStorage.getItem('auth'))
          this.form = {
            avatar: 'https://aiqnmsg.cn/aimk/rest/wx/download/getImage?imgType=avatar&fileName='+ info['avatar'],
            name: info['name'],
            gender: info['gender'] === 0 ? '男' : '女',
            birthday: info['birthDate'].substring(0, 10),
            position: auth.loginType === 1 ? '标注师' : auth.loginType === 2 ? '面试辅导师' : '简历辅导师',
            city: info['address'],
            school: info['school'],
            major: info['major'],
            years: info['years'],
            description: info['description']
          }
        },
        deep: true
      },
      form: {
        handler (newForm, oldForm) {
        },
        deep: true
      }
    },
    methods: {
      modify (flag) {
        // this.showPopup = true
        // this.modifyedValue = this.form[flag]
        // this.modifyFlag = flag
        // if (flag === 'name') {
        //   this.maxlength = 15
        // }
        // if (flag === 'school') {
        //   this.maxlength = 25
        // }
        // if (flag === 'major') {
        //   this.maxlength = 25
        // }
        // if (flag === 'year') {
        //   this.maxlength = 2
        // }
        // if (flag === 'description') {
        //   this.maxlength = 300
        // }
      }
      ,
      confirmModify () {
        this.showPopup = false
        console.log(this.modifyFlag)
        if (this.modifyFlag === 'year') {
          console.log(this.modifyedValue, parseInt(this.modifyedValue))
          this.modifyedValue = /[0-9]{1,2}/.test(this.modifyedValue) ? this.modifyedValue : 0
        }
        this.form[this.modifyFlag] = this.modifyedValue
      }
    }
  }
</script>

<style scoped lang="less">
  .popup-header {
    text-align: center;
    padding: 8px 0;
    color: #888;
  }
  
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
    }
    
    .user-info {
      .bio {
        padding: 10px;
        
        p {
          text-indent: 2em;
          line-height: 28px;
        }
      }
    }
  }
</style>
