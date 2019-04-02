import axios from 'axios'
const env = process.env.NODE_ENV
const host = env === 'development' ? '' : 'https://http://aimkdev.aimianshiguan.com/aimi/rest'
console.log(process.env)
class HttpClient {
  
  constructor () {
    this.http = axios
    this.host = host
  }
  
  getQuestion () {
    return this.fetch('/api/get_question')
  }
  
  fetch (url, params, config = {}, method = 'get',) {
    method = method.toLowerCase()
    url = this.host + url
    console.log(method, url)
    switch (method) {
      case 'get': {
        return this.http.get(url, {...config, ...params})
      }
      case 'post': {
        return this.http.post(url, params, config)
      }
    }
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
