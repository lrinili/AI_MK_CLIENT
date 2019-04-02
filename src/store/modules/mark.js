export default {
  state: {
    lastQuestion: null,
    currentQuestion: null
  },
  mutations: {
    saveCurrentQuestion (state, payload) {
      state.currentQuestion = payload
    },
    saveLastQuestion (state, payload) {
      state.lastQuestion = payload
    }
  },
  actions: {},
  getters: {
    // getQuestionById: (state) => (id) => {
    //   return state.lastQuestion.id === id ? state.lastQuestion : state.currentQuestion
    // }
    getQuestionById (state) {
      return function (id) {
        return state.lastQuestion.id === id ? state.lastQuestion : state.currentQuestion
      }
    }
  }
}
