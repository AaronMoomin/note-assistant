import Vue from 'vue'
import axios from 'axios'

import VueRouter from 'vue-router'
// import Account from '@/views/account/Account'
import Register from '@/views/account/components/Register'
import Index from '@/views/index/Index'
import NoteEditor from '@/views/editor/NoteEditor'
import User from '@/views/user/User'

import Test from '@/views/test/Test'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'User',
    component: User
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/index',
    name: 'Index',
    component: Index,
    meta: { requiresAuth: false }
  },
  {
    path: '/editor',
    name: 'NoteEditor',
    component: NoteEditor,
    meta: { requiresAuth: false }
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: { requiresAuth: false }
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  }
]


const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token')) {
      let result = await axios.get('/api/admin')
      if (result.data.state === 1) {
        next({
          path: '/',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router
