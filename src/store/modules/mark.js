export default {
  state: {
    lastQuestion: null,
    currentQuestion: null,
  },
  mutations: {
    saveCurrentQuestion (state, payload) {
      state.currentQuestion = payload
    },
    saveLastQuestion (state, payload) {
      state.lastQuestion = payload
    },
  },
  actions: {},
  getters: {
    getQuestionById (state) {
      return function (id) {
        return state.lastQuestion['interviewResult'].id === id ? state.lastQuestion : state.currentQuestion
      }
    }
  }
}
