import Vue from 'vue'
import VueRouter from 'vue-router'
import Account from '@/views/account/Account'
// import Register from ''
import Index from '@/views/index/Index'
import NoteEditor from '@/views/editor/NoteEditor'
import User from '@/views/user/User'

import Test from '@/views/test/Test'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Account',
    component: Account
  },
  // {
  //   path: '/register',
  //   name: 'Register',
  //   component: Register
  // },
  {
    path: '/index',
    name: 'Index',
    component: Index
  },
  {
    path: '/editor',
    name: 'NoteEditor',
    component: NoteEditor
  },
  {
    path: '/user',
    name: 'User',
    component: User
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

export default router
