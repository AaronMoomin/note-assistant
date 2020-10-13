import Vue from 'vue'
import axios from 'axios'
import Element, { Message } from 'element-ui'
import './assets/styles/theme/index.css'
import IconFont from './components/Iconfont'
import App from './App.vue'
import router from './router'
import md5 from 'js-md5'
import CryptoJS from 'crypto-js'

Vue.prototype.$md5 = md5
Vue.prototype.$cryptoJS = CryptoJS

let message = options => {
  Message({
    ...options,
    center: true,
    showClose: true
  })
}

Vue.use(Element)

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.$message = message;
Vue.component('IconFont', IconFont)

Vue.prototype.$bus = new Vue()

new Vue({
  IconFont,
  router,
  render: h => h(App)
}).$mount('#app')
