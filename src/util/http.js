import axios from 'axios'

console.log(process.env)
const env = process.env.NODE_ENV
const host = env === 'development' ? '/api' : '/aimk/rest'

// axios.defaults.baseURL = 'https://aiqnmsg.cn/aimk/rest/wx'
// axios.defaults.headers.common['Authorization'] = 'AUTHORIZATION_TOKEN'
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// axios.interceptors.request.use(config => {
//   config.data = JSON.stringify(config.data)
//   config.headers = {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   }
//   return config
// }, error => {
//   return Promise.reject(error)
// })

class HttpClient {
  constructor () {
    this.axios = axios
    this.host = host
  }

  fetch (method, url, params = {}, config = {}) {
    method = method.toLowerCase()
    url = this.host + url
    console.log('fetch =', method, url)
    switch (method) {
      case 'get': {
        return this.axios.get(url, { ...config, params: { ...params } })
      }
      case 'post': {
        return this.axios.post(url, params, config)
      }
    }
  }

  sendCaptcha (phone) {
    return this.fetch('get', '/loginPass/getVerification', { phone })
  }

  authLogin (form = {}) {
    return this.fetch(
      'POST',
      '/wx/emLogin/getToken',
      {
        ...form
      },
      {}
    )
  }

  getQuestion () {
    return this.fetch('GET', '/wx/marker/getAInterviewResult')
  }

  mark (form = {}, remark = false) {
    let url = remark
      ? '/wx/marker/modMarkInterview'
      : '/wx/marker/markInterviewResult'
    return this.fetch('POST', url, {
      ...form
    })
  }

  getMarkedList (markerId = undefined) {
    return this.fetch('GET', '/wx/marker/getMarkedRecordList', { markerId })
  }

  getStatistics (markerId) {
    return this.fetch('GET', '/wx/marker/getStatistics', { markerId })
  }

  getUserInfo (id, type) {
    let url = ''
    let params = { id }
    if (type === 1) {
      url = '/wx/marker/getMarkerInfo'
      params = { markerId: id }
    } else if (type === 2) {
      url = '/wx/vipinterview/detail'
    } else if (type === 3) {
      url = '/wx/vipresume/detail'
    }
    return this.fetch('GET', url, params)
  }

  getConsumptions (instructorType, instructorId) {
    return this.fetch('GET', '/wx/consumption/getConsumptionList', {
      instructorId,
      instructorType
    })
  }

  getInterviewItems (interviewerId) {
    return this.fetch('GET', '/wx/interview/getInterviewItemByUser', {
      interviewerId
    })
  }

  getInterviewResults (mkInterviewItemId) {
    return this.fetch('GET', '/wx/interview/getInterviewResultByItemId', {
      mkInterviewItemId
    })
  }

  getInterviewResultDetail (mkInterviewResultId) {
    return this.fetch('GET', '/wx/interview/getInterviewResultDetail', {
      mkInterviewResultId
    })
  }

  // updateUserInfo (form = {}) {
  //   return this.fetch('POST', '/common/userInfo/updateInfo', {
  //     ...form
  //   })
  // }

  getNewAnswer (isBeta = true) {
    let baseUrl = isBeta ? 'https://aiqnmsg.cn' : 'https://aimianshiguan.com'
    return this.axios.post(baseUrl + '/znzp/wxchatbot/queryNewAnswer.shtml')
  }
  updateNewAnswer (form, isBeta = true) {
    let baseUrl = isBeta ? 'https://aiqnmsg.cn' : 'https://aimianshiguan.com'
    return this.axios.post(baseUrl + '/znzp/wxchatbot/updateNewAnswer.shtml', {
      ...form
    })
  }
}

export const h = new HttpClient()

export default {
  install (Vue) {
    Vue.prototype.$httpClient = h
    Vue.httpClient = h
  },
  $httpClient: h
}
