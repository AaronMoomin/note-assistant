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
          clearable
        >
          <icon-font
            iconCode="icon-shouji1"
            slot="prefix"
            class="phone"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          @keyup.enter.native="submitForm('loginForm')"
          show-password
          autocomplete="off"
        >
          <icon-font
            iconCode="icon-mima1"
            slot="prefix"
            class="password"
          />
        </el-input>
      </el-form-item>
      <div class="forget-password">
        <el-link
          type="info"
          :underline="false"
          class="text-sm mb-1"
          disabled
        >忘记密码?</el-link>
      </div>
      <el-form-item>
        <el-button
          class="btn btn-lg"
          type="primary"
          @click="submitForm('loginForm')"
        >登录</el-button>
      </el-form-item>
      <div class="register">
        <div class="text-sm mt-2">没有账号?快加入我们吧!</div>
        <el-link
          type="primary"
          :underline="false"
          class="text-md mt-1"
          @click="changMode"
        >注 册</el-link>
      </div>
    </el-form>
  </el-container>
</template>

<script>
// import JSEncrypt from 'jsencrypt'
import avatar from '@/assets/images/account/avatar.png'

export default {
  name: 'Login',
  data () {
    return {
      // pubkey: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4AHCyzGYb5P37Otg7pCUFMqpI
      //       ef5puEcXatDrUuk9bp91In1Q7RA57+QJbnS2aqf6SPwNy8MmId6xwp28ny4mIbTw
      //       z2h3hW5wsoQMA4vVoiX8fXBUg5gt6hYM6oZHapSw1rIRkLiKI5yK6csUiIQ9k5s8
      //       XTAxVjLWINSZ74+yuQIDAQAB`,
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
    changMode () {
      this.$emit("changMode", "register")
    },
    errorHandler () {
      return true
    },
    // 提交按钮
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendData(formName)
        } else {
          return false
        }
      })
    },
    // 账号密码加密
    // async encrypt (formName) {
    //   let encrypt = new JSEncrypt()
    //   encrypt.setPublicKey(this.pubkey)
    //   let encryptPwd = encrypt.encrypt(this[formName].password)
    //   return encryptPwd
    // },
    // 发送数据
    async sendData (formName) {
      let data = JSON.parse(JSON.stringify(this[formName]))
      // data.password = await this.encrypt(formName)
      let resData = await this.axios.post('/v1/login', data)
      if (resData.data.status) {
        localStorage.setItem('token', resData.data.data.token)
        this.$router.push({
          path: '/index'
        })
        this.$message({
          message: '登陆成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '账号或密码错误',
          type: 'error'
        })
        this.loginForm.password = ''
      }
    },
  },
  created () {
    localStorage.removeItem('token')
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.login
  height 100%
  text-align center
  .el-form
    padding 7rem 4rem
    .el-input
      .phone, .password
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
