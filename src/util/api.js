const env = process.env.NODE_ENV
const host = env === 'development' ? '' : 'https://www.aimk.com/api'

// module.exports = {
//   sendCaptcha: host + '/api/send_captcha',
//   userLogin: host + '/api/user_login',
//   getQuestion: host + '/api/get_question',
//   markQuestion: host + '/api/mark_question',
//   getMarkedList: host + '/api/get_marked_list'
// }
