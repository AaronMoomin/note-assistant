<template>
  <el-container
    class="forget-pwd"
    direction="vertical"
  >
    <el-form
      :model="alterForm"
      ref="alterForm"
      :rules="rules"
    >
      <div class="avatar mb-3">
        <el-avatar :size="130">
          <img :src="avatar" />
        </el-avatar>
      </div>
      <el-form-item prop="phone">
        <el-input
          v-model="alterForm.phone"
          :readonly="true"
        >
          <icon-font
            iconCode="icon-shouji1"
            slot="prefix"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="alterForm.password"
          auto-complete="new-password"
          placeholder="请输入旧密码"
          show-password
        >
          <icon-font
            iconCode="icon-mima1"
            slot="prefix"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input
          v-model="alterForm.newPassword"
          auto-complete="new-password"
          placeholder="请输入新密码"
          show-password
        >
          <icon-font
            iconCode="icon-mima1"
            slot="prefix"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input
          v-model="alterForm.checkPassword"
          auto-complete="new-password"
          placeholder="请再次输入密码"
          show-password
        >
          <icon-font
            iconCode="icon-mima1"
            slot="prefix"
          />
        </el-input>
      </el-form-item>
      <el-form-item class="alter-buttons">
        <el-button @click="resetForm('alterForm')">清空</el-button>
        <el-button
          type="primary"
          @click="submitForm('alterForm')"
        >修改密码</el-button>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
import avatar from '@/assets/images/account/avatar.png'

export default {
  name: 'ForgetPwd',
  data () {
    let validatePass = (rule, value, callback) => {
      if (this.alterForm.checkPassword !== this.alterForm.newPassword || this.alterForm.checkPassword === '') {
        callback(new Error('两次输入密码不一致!'))
      } else if (this.alterForm.checkPassword === this.alterForm.newPassword) {
        callback()
      }
    }
    return {
      alterForm: {
        phone: '',
        password: '',
        newPassword: '',
        checkPassword: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入您的手机号', trigger: 'change' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: '请输入您的密码', trigger: 'change' },
          { min: 5, max: 32, message: '请输入正确的密码', trigger: 'change' }
        ],
        checkPassword: [
          { required: true, validator: validatePass, trigger: 'change' },
        ]
      },
      avatar: avatar
    }
  },
  methods: {
    resetForm (formName) {
      this[formName].password = this[formName].newPassword = this[formName].checkPassword = ''
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
    // 发送数据
    async sendData (formName) {
      let { password, newPassword } = JSON.parse(JSON.stringify(this[formName]))
      let data = {
        newPassword: newPassword,
        oldPassword: password
      }
      delete data.checkPassword
      let resData = await this.axios.put('/v1/changePwd', data)
      if (resData.data.status) {
        this.$message({
          message: '修改成功,请重新登录',
          type: 'success'
        })
        this.$router.replace({
          path: '/'
        })
      } else {
        this.$message({
          message: resData.data.data,
          type: 'error'
        })
      }
    },
  },
  mounted () {
    let payload = localStorage.getItem('token').split('.')[1]
    let decodedPayload = window.atob(payload)
    let phone = JSON.parse(decodedPayload).phone
    this.alterForm.phone = phone
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.forget-pwd
  text-align center
  background-color $whiteColor
  box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  border-radius 4px
  .el-form
    padding 3rem
    .el-input
      svg
        color $darkBlueColor
        font-size 2.2rem
    .alter-buttons
      padding-top 15px
</style>
