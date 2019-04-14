import axios from 'axios'

// const env = process.env.NODE_ENV
// const host = env === 'development' ? '' : 'https://aiqnmsg.cn/aimk/rest/wx'
// console.log(process.env)

const host = '/api'

class HttpClient {
  
  constructor () {
    this.http = axios
    this.host = host
  }
  
  fetch (method, url, params = {}, config = {}) {
    method = method.toLowerCase()
    url = this.host + url
    console.log('fetch =', method, url)
    switch (method) {
      case 'get': {
        return this.http.get(url, {...config, params: {...params}})
      }
      case 'post': {
        return this.http.post(url, params, config)
      }
    }
  }
  
  sendCaptcha (phone) {
    return this.fetch('get', '/loginPass/getVerification', {phone})
  }
  
  authLogin (form = {}) {
    return this.fetch('POST', '/wx/emLogin/getToken', {
      ...form
    }, {})
  }
  
  getQuestion () {
    return this.fetch('GET', '/wx/marker/getAInterviewResult')
  }
  
  mark (form = {}) {
    return this.fetch('POST', '/wx/marker/markInterviewResult', {
      ...form
    })
  }
  
  getMarkedList (markerId = undefined) {
    return this.fetch('GET', '/wx/marker/getMarkedRecordList', {markerId})
  }
  
  getUserInfo (markerId) {
    return this.fetch('GET', '/wx/marker/getMarkerInfo', {markerId})
  }
  
  getConsumptions (instructorType, instructorId) {
    return this.fetch('GET', '/wx/consumption/getConsumptionList',
      {
        instructorId, instructorType
      })
  }
  
  updateUserInfo (form = {}) {
    return this.fetch('POST', '/common/userInfo/updateInfo', {
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
