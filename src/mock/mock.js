const MockJs = require('mockjs')
MockJs.setup({
  timeout: '300-500'
})
const Random = MockJs.Random

Random.extend({
  question: function () {
    return this.pick(database.questions)
  },
  interviewer: function () {
    return this.pick(database.interviewers)
  },
  marker: function () {
    return this.pick(database.markers)
  }
})

let database = MockJs.mock({
  'questions|5': [
    {
      'id|+1': 0,
      'title': Random.ctitle(10, 20),
      'job|2-4': Random.cword(),
      'level|3-6': Random.cword(),
      'answer': Random.cparagraph(),
      'interviewer_id': /[0-4]{1}/,
      'score': -1,
      'marked_by': -1
    }
  ],
  'interviewers|5': [
    {
      'id|+1': 0,
      'name': Random.cname(),
      'description': Random.cparagraph(),
      'avatar': Random.image('120x120')
    }
  ],
  'markers|10': [
    {
      'mkMarkerId': Random.uuid(),
      'name': Random.cname(),
      'nickName': Random.cname(),
      'phoneNo': /(13|14|15|17|18|19)[0-9]{9}/,
      'avatar': Random.image('120x120'),
      'birthDate': Random.date(),
      'gender': 1,
      'address': '安徽省 安庆市 太湖县',
      'identify': 1,
      'school': '北京大学',
      'major': 1,
      'years': 3,
      'description': '1993年参加工作一直在河南省新乡市红旗区和平路小学任教，2011年任和平小学教导处主任，2014年任红旗区小店镇中心校副校长。'
    },
  ]
})

// console.log('---DB---=', database)

function parseurl (url) {
  let search = url.split('?')
  let hash = {}
  if (search.length === 2) {
    search = search[1]
    let params = search.split('&')
    params.forEach(function (item) {
      let pos = item.split('=')
      hash[pos[0]] = pos[1]
    })
  }
  return hash
}

MockJs.mock(/(.*)\/common\/authLogin\/getMockPhoneNo/, 'get', function () {
  return {
    resultCode: '200',
    resultDesc: 'MOCK随机手机号获取成功',
    content: {
      phoneNo: Random.marker().phoneNo,
    }
  }
})

let captcha = ''
MockJs.mock(/(.*)\/common\/authLogin\/sendCaptcha(.*)/, 'get', function (req) {
  let params = parseurl(req.url)
  captcha = MockJs.mock(/\d{6}/)
  return MockJs.mock({
    resultCode: '200',
    resultDesc: '验证码发送成功',
    content: {
      phoneNo: params.phoneNo,
      captcha
    }
  })
})

MockJs.mock(/(.*)\/common\/authLogin\/login/, 'post', function (req) {
  console.log('this in mock.js = ',this)
  let body = JSON.parse(req.body)
  console.log(body, captcha)
  if (body.phoneNo === body.phoneNo && body.captcha === captcha) {
    console.log('validate true')
    return MockJs.mock({
      resultCode: '200',
      resultDesc: '验证成功',
      content: {
        ...database.markers.find(item => {
          return item.phoneNo === body.phoneNo
        }),
        mkMarkerId: '7e4abc16-5204-4a02-83b5-7c5448849e79',
      }
    })
  } else {
    console.log('validate false')
    return {
      result: false,
      user_info: {}
    }
  }
})

// MockJs.mock(/(.*)\/marker\/mark\/getAInterviewResult(.*)/, 'get', function (req) {
//   console.log(req)
//   let question = database.questions.find((item) => {
//     return item.score === -1
//   })
//   if (question) {
//     return {
//       result: true,
//       message: '',
//       question: {
//         ...question,
//         interviewer: database.interviewers.filter(iw => {
//           return iw.id === parseInt(question.interviewer_id)
//         })[0]
//       }
//     }
//   } else {
//     return {
//       result: false,
//       message: '暂时没有更多题目了',
//       question: {}
//     }
//   }
// })

MockJs.mock(/(.*)\/api\/mark_question/, 'post', function (req) {
  console.log(database.questions)
  console.log(req)
  let body = JSON.parse(req.body)
  let qid = parseInt(body.qid)
  database.questions[qid].score = parseInt(body.score)
  database.questions[qid].marked_by = parseInt(body.marked_by)
  console.log(database.questions)
  return {
    result: true
  }
})

MockJs.mock(/(.*)\/marker\/mark\/getMarkedList(.*)/, 'get', function (req) {
  let params = parseurl(req.url)
  console.log(params)
  let list = database.questions.filter((item) => {
    return item.marked_by === parseInt(params.uid)
  })
  list = list.map(item => {
    return {
      ...item,
      interviewer: database.interviewers.filter(iw => {
        return iw.id === parseInt(item.interviewer_id)
      })[0],
      marker: database.users.filter(ur => {
        return ur.id === item.marked_by
      })[0]
    }
  })
  return {
    result: true,
    questions: list
  }
})
