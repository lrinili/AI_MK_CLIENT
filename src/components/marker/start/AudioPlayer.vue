<template>
  <div class="player">
    <audio id="audioctx"
           :src="url"
           @play="onplay"
           @pause="onpause"
           @playing="onplaying"
           @loadedmetadata="onloadedmetadata"
           @error="onerror"
           @ended="onended"
           @load="onload"
           @waiting="onwaiting"
           @timeupdate="ontimeupdate"
    ></audio>
    <div class="voice">
      <canvas id="ctx" style="width: 100%;height: 100px;"></canvas>
    </div>
    <div class="play-control">
      <div class="play">
        <div id="playcontrol" class="play-pause" :style="audio.playing?pausebtn:playbtn" @click="playOrPause"></div>
      </div>
      <div class="control">
        <el-slider v-model="sliderTime" :min="0" :max="100" @change="changetime"/>
      </div>
    </div>
  </div>
</template>

<script>
  
  export default {
    name: 'AudioPlayer',
    components: {},
    props: {
      audioUrl: {type: String, required: true}
    },
    data () {
      return {
        url: '',
        audioEl: null,
        playbtn: {
          background: 'url("/static/play.png")',
          backgroundSize: '100% 100%'
        },
        pausebtn: {
          background: 'url("/static/pause.png")',
          backgroundSize: '100% 100%'
        },
        sliderTime: 0,
        audio: {
          canplay: false,
          currentTime: 0,
          maxTime: 0,
          playing: false,
          muted: false,
          speed: 1,
          waiting: true,
          preload: 'auto'
        },
      }
    },
    beforeMount () {
      this.url = this.audioUrl
    },
    mounted () {
      this.audioEl = document.getElementById('audioctx')
      // let audio = document.getElementById('audioctx')
      // let ctx = new AudioContext()
      // let analyser = ctx.createAnalyser()
      // let src = ctx.createMediaElementSource(audio)
      // src.connect(analyser)
      // analyser.fftSize = 128
      // analyser.connect(ctx.destination)
      //
      // console.log(src,analyser)
    },
    computed: {},
    watch: {
      'audioUrl' (newUrl) {
        this.url = newUrl
        this.audio.playing = false
      }
    },
    methods: {
      playOrPause () {
        console.log(this.audioEl)
        if (this.audio.playing) {
          this.audioEl.pause()
        } else {
          this.audioEl.play()
        }
        this.audio.playing = !this.audio.playing
      },
      onload (res) {
        console.log('onload', res)
      },
      onplay (res) {
        console.log('onplay', res)
        this.audio.playing = true
        this.audioEl.volume = 1
      },
      onpause (res) {
        console.log('onpause', res)
      },
      onplaying (res) {
        console.log('onplaying', res)
      },
      onwaiting () {
        console.log('onwatting')
      },
      ontimeupdate (res) {
        // console.log('ontimeupdate', res.target.currentTime)
        this.audio.currentTime = res.target.currentTime
        this.sliderTime = this.audio.currentTime / this.audio.maxTime * 100
      },
      onloadedmetadata (res) {
        console.log('onloadedmetadata', res.target.duration)
        this.audio.maxTime = res.target.duration
      },
      onerror () {
        console.log('onerror')
      },
      onended () {
        console.log('onended')
        this.audio.playing = false
        this.audio.currentTime = 0
        this.sliderTime = 0
      },
      changetime (time) {
        this.audioEl.currentTime = time / 100 * this.audio.maxTime
        if (!this.audio.playing) {
          this.playOrPause()
        }
      }
    }
  }
</script>

<style lang="less">
  .play-control {
    width: 100%;
    height: 32px;
    display: flex;
    
    .play {
      width: 32px;
      height: 32px;
    }
    
    .control {
      flex: auto;
      padding: 0 8px;
    }
  }
  
  .play-control .el-slider__runway {
    height: 1px;
    border-radius: 1px;
    background: #646464;
  }
  
  .play-control .el-slider__bar {
    height: 2px;
    background: white;
  }
  
  .play-control .el-slider__button-wrapper {
    width: 9px;
    height: 9px;
    top: -12px;
  }
  
  .play-control .el-slider__button {
    width: 9px;
    height: 9px;
    border: none;
    background: white;
  }
</style>

<style lang="less" scoped>
  .player {
    background: black;
    
    .voice {
      background: url("/static/voice.png");
      background-size: 100% 100%;
    }
    
    .play-pause {
      width: 32px;
      height: 32px;
      background-size: 100% 100%;
    }
  }
</style>
