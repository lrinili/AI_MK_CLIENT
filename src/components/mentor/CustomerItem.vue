<template>
  <div class="item">
    <div class="container">
      <div class="head">
        <div>
          <img alt="" :src="info.avatar"/>
        </div>
      </div>
      <div class="center">
        <div class="name">
          <div><span></span><span>{{info.name}}</span></div>
        </div>
      </div>
      <div class="tail">
        <div style="height: 50px;line-height: 50px">{{info.publishTime}}</div>
        <div style="height: 70px;line-height: 70px;">
          <el-button
            :style="viewBtn"
            @click="viewDetail(info.cid)">查看
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CustomerItem',
    props: {
      info: {
        type: Object, required: true
      }
    },
    data () {
      return {
        viewBtn: {background: '#141124', borderRadius: 0, width: '100px', color: 'white'}
      }
    },
    mounted () {
    
    },
    methods: {
      viewDetail (cid) {
        console.log('info=', this.info)
        this.$router.push({
          name: 'customer', params: {
            cid,
          },
          query: {
            avatar: this.info.avatar,
            phone: this.info.phone,
            email: this.info.email,
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .item {
    padding-bottom: 2px;
    
    .container {
      display: flex;
      height: 120px;
      padding: 0;
      border-bottom: 1px solid cadetblue;
      
      .head {
        width: 100px;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        
        div {
          width: 90px;
          height: 90px;
          border-radius: 45px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      
      .center {
        flex: auto;
        display: flex;
        flex-direction: column;
        padding-left: 3px;
        
        > div {
          flex: 1;
          padding: 2px;
          color: black;
        }
        
        .name {
          div {
            width: 100%;
            height: 116px;
            line-height: 117px;
            border-bottom: 1px solid white;
          }
        }
        
        .job, .level {
          div {
            width: 100%;
            border-bottom: 1px solid white;
          }
        }
      }
      
      .tail {
        width: 120px;
        height: 100%;
        text-align: center;
      }
    }
  }
</style>
