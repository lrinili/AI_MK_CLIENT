<template>
  <div :style="startStyle" class="start">
    <div class="bg"></div>
    <div class="start-btn">
      <div>
        <el-button :style="startBtn" @click="startMark">开始标注</el-button>
      </div>
    </div>
    <br>
    <alert v-model="showAlert" title="业务提示" @on-hide="onHideAlert">
      <el-alert type="warning" :show-icon="true" :closable="false">
        每题将有<strong>15分钟</strong>分钟标记时间,如果<strong>15分钟</strong>内还未标注完成,将自动退出标记页面。
      </el-alert>
    </alert>
    <alert v-model="showNoMore" title="提示">
      <el-alert type="warning" :show-icon="true" :closable="false">
        <strong>没有更多题目了</strong>
      </el-alert>
    </alert>
  </div>
</template>

<script>
  import {Alert, Loading} from 'vux'
  import AudioPlayer from './AudioPlayer'
  
  export default {
    name: 'Wait',
    components: {AudioPlayer, Alert, Loading},
    data () {
      return {
        startStyle: {
          width: '100%',
          minHeight: (document.body.clientHeight - 51) + 'px',
        },
        startBtn: {
          width: '160px',
          height: '40px',
          borderRadius: '0',
          background: 'black',
          color: 'white',
          border: 'none'
        },
        showAlert: false,
        isLoading: false,
        showNoMore: false
      }
    },
    mounted () {
      // document.addEventListener('touchstart', () => {
      //   document.getElementById('testaudio').play()
      // })
    },
    computed: {},
    methods: {
      onHideAlert () {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.$httpClient.getQuestion().then((res) => {
          loading.close()
          console.log(res.data)
          if (res.data.resultCode === '200') {
            let result = res.data.content
            this.$store.commit('saveCurrentQuestion', {
              ...result,
              ratetemplate: {
                speed: -1,
                volume: -1,
                tone: -1,
                nervous: -1,
                expression: -1,
                markResult: -1,
              },
              remarked: false,
            })
            this.$router.push({name: 'mark', params: {qid: `${result['interviewResult'].id}`}})
          } else {
            this.showNoMore = true
          }
        }).catch(() => {
          loading.close()
        })
      },
      startMark () {
        this.showAlert = true
      }
    }
  }
</script>

<style scoped lang="less">
  .start {
    .bg {
      height: 180px;
      width: 100%;
      background: url("../../../assets/start/start-bg.png");
      background-size: 100% 100%;
    }
    
    .alert {
      padding: 30px;
    }
    
    .start-btn {
      padding-top: 25px;
      
      > div {
        margin: 0 auto;
        width: 160px;
      }
    }
  }
</style>
