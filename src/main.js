// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import store from './store'
import vueg from 'vueg'
import App from './App'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import HttpClient from './util/http.js'
import AudioCreator from './util/AudioHelper'

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

import { ConfirmPlugin, AlertPlugin } from 'vux'
Vue.use(ConfirmPlugin)
Vue.use(AlertPlugin)

if (process.env.NODE_ENV === 'development') {
  require('./mock/mock')
}

const option = {
  map: {
    home: {
      enter: ['mark', 'marked', 'customer']
    },
    login: {
      enter: ['home']
    },
    customer: {
      enter: ['detail']
    }
  }
}

FastClick.attach(document.body)
Vue.config.productionTip = false
Vue.use(vueg, router, option)
Vue.use(HttpClient)
Vue.use(AudioCreator)
Vue.use(element)
// Vue.use(AudioVisual)
Vue.use(VueVideoPlayer)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
