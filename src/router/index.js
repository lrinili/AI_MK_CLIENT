import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Mark from '../components/marker/start/Mark'
import MarkedDetail from '../components/marker/marked/MarkedDetail'
import CustomerDetail from '../components/mentor/CustomerDetail'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {requireAuth: true}
    },
    {
      path: '/mark/:qid',
      name: 'mark',
      component: Mark,
      meta: {requireAuth: true}
    },
    {
      path: '/marked/:qid',
      name: 'marked',
      component: MarkedDetail,
      meta: {requireAuth: true}
    },
    {
      path: '/customer/:cid',
      name: 'customer',
      component: CustomerDetail,
      meta: {requireAuth: true}
    }
  ]
})

router.beforeEach(function (to, from, next) {
  // 如果当前路由是登录路由并且已经登录，直接跳转到主页面
  let auth = JSON.parse(sessionStorage.getItem('auth')) || {token: ''}
  console.log(auth)
  // next()
  if (to.name === 'login' && auth.token.length === 32) {
    next({name: 'home'})
  } else {
    // 其他路由，如果匹配到的有任何一个要求用户登录，跳转到登录界面
    if (to.matched.some(function (record) {
      return record.meta.requireAuth
    })) {
      // 如果用户未登录，跳转到登录页面
      if (auth.token.length !== 32) {
        next({
          path: '/login'
        })
      } else {
        // 用户已登录，直接进入
        next()
      }
    } else {
      // 不需要用户登录，直接进入
      next()
    }
  }
})

export default router
