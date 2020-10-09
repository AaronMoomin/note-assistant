<template>
  <el-container
    class="login"
    direction="vertical"
  >
    <el-form
      :model="loginForm"
      ref="loginForm"
      :rules="rules"
    >
      <div class="avatar mb-3">
        <el-avatar
          :size="130"
          @error="errorHandler"
        >
          <img :src="avatar" />
        </el-avatar>
      </div>
      <el-form-item prop="phone">
        <el-input
          v-model="loginForm.phone"
          autocomplete="off"
        >
          <i
            slot="prefix"
            class="iconfont"
          >&#xe722;</i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          @keyup.enter.native="submitForm('loginForm')"
          show-password
          autocomplete="off"
        >
          <i
            slot="prefix"
            class="iconfont"
          >&#xe67b;</i>
        </el-input>
      </el-form-item>
      <div class="forget-password">
        <el-link
          type="info"
          :underline="false"
          class="text-sm mb-1"
        >忘记密码?</el-link>
      </div>
      <el-form-item>
        <router-link to="/index">
          <el-button
            class="btn btn-lg"
            type="primary"
          >登录</el-button>
        </router-link>
      </el-form-item>
      <div class="register">
        <div class="text-sm mt-2">没有账号?快加入我们吧!</div>
        <router-link to="/register">
          <el-link
            type="primary"
            :underline="false"
            class="text-md mt-1"
          >注 册</el-link>
        </router-link>
      </div>
    </el-form>
  </el-container>
</template>

<script>
import avatar from '@/assets/images/account/avatar.png'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入您的手机号', trigger: 'change' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入您的密码', trigger: 'change' },
          { min: 5, max: 32, message: '请输入正确的密码', trigger: 'change' }
        ]
      },
      avatar: avatar
    }
  },
  methods: {
    errorHandler () {
      return true
    },
    async sendData (data) {
      this.axios
        .post('/lfc/login/sysadminlogin', data)
        .then(res => {
          if (res.data.status === 1) {
            localStorage.setItem('userId', res.data.data.userId)
            this.$router.push({
              path: ''
            })
            this.$message({
              showClose: true,
              message: res.data.info,
              type: 'success'
            })
          } else {
            this.$message.error({
              message: res.data.info,
              showClose: true
            })
            this.loginForm.password = ''
          }
        })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendData(this.qs.stringify(this[formName]))
        } else {
          return false
        }
      })
    }
  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.login
  height 100vh
  text-align center
  .el-form
    padding 7rem 4rem
    .el-input
      i
        color $darkBlueColor
        font-size 2.2rem
    .btn-lg
      margin-top 2rem
      color $whiteColor
    .forget-password
      line-height 5px
      text-align right
    .register
      .text-sm
        color $darkBlueColor
</style>
