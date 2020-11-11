import Vue from 'vue'

import VueRouter from 'vue-router'
import Account from '@/views/account/Account'
import Register from '@/views/account/components/Register'
import Index from '@/views/index/Index'
import NoteEditor from '@/views/editor/NoteEditor'
import User from '@/views/user/User'
import Share from '@/views/share/Share'

import Test from '@/views/test/Test'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Account',
    component: Account
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
    meta: { requiresAuth: true }
  },
  {
    path: '/editor',
    name: 'NoteEditor',
    component: NoteEditor,
    meta: { requiresAuth: true }
  },
  {
    path: '/editor/:id?',
    name: 'NoteEditor',
    component: NoteEditor,
    meta: { requiresAuth: true }
  },
  {
    path: '/user',
    name: 'User',
    component: User,
    meta: { requiresAuth: true }
  },
  {
    path:'/share/:id?',
    name: 'Share',
    component: Share,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test
  }
]


const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('token')) {
      next()
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
