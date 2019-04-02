import Vue from 'vue'
import Vuex from 'vuex'
import mark from './modules/mark'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mark
  }
})
