<template>
  <div>
    <div class="header">
      <div>
        <div class="l">
          <div>
            <div>{{monthlyIncome}}</div>
            <div>本月收入(元)</div>
          </div>
        </div>
        <div class="c">
          <div>
            <div>{{totalIncome}}</div>
            <div>总收入(元)</div>
          </div>
        </div>
        <div class="r">
          <div>
            <div>{{monthlyMarkCount}}</div>
            <div>本月接单量(单)</div>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div id="statistics" style="width: 100%;height: 300px;"></div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  
  export default {
    name: 'Statistics',
    data () {
      return {
        echart: null,
        monthlyIncome: 0,
        monthlyMarkCount: 0,
        totalIncome: 0,
      }
    },
    beforeMount () {
    },
    mounted () {
      this.echart = echarts.init(document.getElementById('statistics'))
      let option = {
        color: 'black',
        title: {
          text: (new Date()).getFullYear() + '年标记统计表',
          left: 'center'
        },
        xAxis: {
          name: 'M',
          type: 'category',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        yAxis: {
          type: 'value',
          name: 'C'
        },
        series: [{
          name: '每月统计量',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'insideTop'
            }
          },
          //data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }]
      }
      this.echart.setOption(option)
      let auth = JSON.parse(sessionStorage.getItem('auth'))
      this.$httpClient.getStatistics(auth.userId).then(res => {
        if (res.data.resultCode === '200') {
          console.log(res.data)
          this.monthlyIncome = res.data.content['monthlyIncome']
          this.monthlyMarkCount = res.data.content['monthlyMarkCount']
          this.totalIncome = res.data.content['totalIncome']
          let dataArr = []
          if(res.data.content['yearlyMarkCount']){
            dataArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
              return res.data.content['yearlyMarkCount'][m]
            })
          }
          console.log(dataArr)
          this.echart.setOption({
            series: [{
              name: '每月统计量',
              type: 'bar',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              data: dataArr
            }]
          })
        } else {
          console.warn('返回错误', res.data.resultDesc)
        }
      })
      .catch((res) => {
        console.error('服务器错误',res)
      })
      
      window.onresize = () => {
        this.echart.resize()
      }
    }
  }
</script>

<style scoped lang="less">
  .header {
    width: 100%;
    height: 180px;
    background: url("../../../assets/marker/statistics/bg.png");
    background-size: 100% 100%;
    color: white;
    
    > div {
      display: flex;
      width: 100%;
      height: 100%;
      
      > div {
        flex: 1;
        display: flex;
      }
      
      .l, .r {
        display: flex;
        flex-direction: row-reverse;
        align-items: flex-end;
        padding-bottom: 15px;
        
        > div {
          width: 100%;
          text-align: center;
        }
      }
      
      .c {
        justify-content: center;
        align-content: center;
        align-items: center;
        
        > div {
          width: 100px;
          height: 100px;
          border: 1px solid white;
          border-radius: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          
          > div {
            width: 100%;
            text-align: center;
          }
        }
      }
    }
  }
</style>
