import Vue from 'vue'
import Vuex from 'vuex'
import mark from './modules/mark'
import markedDetail from './modules/markedDetail'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    mark, markedDetail
  }
})
