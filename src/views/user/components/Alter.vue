<template>
  <el-container
    class="alter"
    direction="vertical"
  >
    <el-form
      :model="alterForm"
      ref="alterForm"
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
          v-model="alterForm.phone"
          readonly="true"
        >
          <i
            slot="prefix"
            class="iconfont"
          >&#xe722;</i>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="alterForm.password"
          auto-complete="new-password"
          placeholder="请输入旧密码"
          show-password
        >
          <i
            slot="prefix"
            class="iconfont"
          >&#xe67b;</i>
        </el-input>
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input
          v-model="alterForm.newPassword"
          auto-complete="new-password"
          placeholder="请输入新密码"
          show-password
        >
          <i
            slot="prefix"
            class="iconfont"
          >&#xe67b;</i>
        </el-input>
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input
          v-model="alterForm.checkPassword"
          auto-complete="new-password"
          placeholder="请再次输入密码"
          show-password
        >
          <i
            slot="prefix"
            class="iconfont"
          >&#xe67b;</i>
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
  name: 'Alter',
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
        phone: '13713552233',
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
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.alter
  text-align center
  background-color $whiteColor
  box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  border-radius 4px
  .el-form
    padding 3rem
    .el-input
      i
        color $darkBlueColor
        font-size 2.2rem
    .alter-buttons
      padding-top 15px
</style>
