<template>
  <div>
    <div class="header">
      <div>
        <div class="l">
          <div>
            <div>500</div>
            <div>本月收入(元)</div>
          </div>
        </div>
        <div class="c">
          <div>
            <div>13142</div>
            <div>总收入(元)</div>
          </div>
        </div>
        <div class="r">
          <div>
            <div>90</div>
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
        echart: null
      }
    },
    beforeMount () {
    },
    mounted () {
      this.echart = echarts.init(document.getElementById('statistics'))
      let option = {
        color: 'black',
        title: {
          text: '2019年标记统计表',
          left: 'center'
        },
        xAxis: {
          name: '月份',
          type: 'category',
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        yAxis: {
          type: 'value',
          name: ''
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
          data: [120, 200, 150, 80, 70, 110, 130, 200, 150, 80, 70, 110]
        }]
      }
      this.echart.setOption(option)
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
