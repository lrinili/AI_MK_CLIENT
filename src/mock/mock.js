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
  user: function () {
    return this.pick(database.users)
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
  'users|3': [
    {
      'id|+1': 0,
      'name': Random.cname(),
      'phone_no': /(13|14|15|17|18|19)[0-9]{9}/,
      'avatar': Random.image('120x120')
    }
  ]
})

console.log('---DB---=', database)

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

MockJs.mock(/(.*)\/api\/get_phone/, 'get', function () {
  return {
    phone_no: Random.user().phone_no
  }
})

let captcha = ''
MockJs.mock(/(.*)\/api\/send_captcha(.*)/, 'get', function (req) {
  let params = parseurl(req.url)
  captcha = MockJs.mock(/\d{6}/)
  return MockJs.mock({
    result: true,
    phone_no: params.phone_no,
    'code': captcha
  })
})

MockJs.mock(/(.*)\/api\/user_login/, 'post', function (req) {
  let body = JSON.parse(req.body)
  console.log(body)
  if (body.phone_no === body.phone_no && body.code === captcha) {
    return MockJs.mock({
      result: true,
      user_info: {
        token: Random.uuid(),
        ...database.users.find(item => {
          return item.phone_no === body.phone_no
        })
      }
    })
  } else {
    return {
      result: false,
      user_info: {}
    }
  }
})

MockJs.mock(/(.*)\/api\/get_question/, 'get', function (req) {
  console.log(req)
  let question = database.questions.find((item) => {
    return item.score === -1
  })
  if (question) {
    return {
      result: true,
      message: '',
      question: {
        ...question,
        interviewer: database.interviewers.filter(iw => {
          return iw.id === parseInt(question.interviewer_id)
        })[0]
      }
    }
  } else {
    return {
      result: false,
      message: '暂时没有更多题目了',
      question: {}
    }
  }
})

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

MockJs.mock(/(.*)\/api\/get_marked_list(.*)/, 'get', function (req) {
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
