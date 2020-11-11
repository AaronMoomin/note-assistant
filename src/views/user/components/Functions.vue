<template>
  <el-container
    class="functions"
    direction="vertical"
  >
    <div class="personal">
      <el-avatar :size="70">
        <img :src="avatar" />
      </el-avatar>
      <div class="name text-md">
        {{username}}
      </div>
    </div>
    <ul>
      <li @click="changeUsername">
        <div class="left">
          <icon-font iconCode="icon-yonghuming" />
          <span>更改用户名</span>
        </div>
        <div class="right">
          <icon-font iconCode="icon-youjiantou" />
        </div>
      </li>
      <li @click="changContent('alterPwd')">
        <div class="left">
          <icon-font iconCode="icon-anquan_active" />
          <span>修改密码</span>
        </div>
        <div class="right">
          <icon-font iconCode="icon-youjiantou" />
        </div>
      </li>
      <li @click="changContent('about')">
        <div class="left">
          <icon-font iconCode="icon-guanyu" />
          <span>关于</span>
        </div>
        <div class="right">
          <icon-font iconCode="icon-youjiantou" />
        </div>
      </li>
      <router-link to="/">
        <li>
          <div class="left">
            <icon-font iconCode="icon-tuichudenglu" />
            <span>退出登录</span>
          </div>
          <div class="right">
            <icon-font iconCode="icon-youjiantou" />
          </div>
        </li>
      </router-link>
    </ul>
  </el-container>
</template>

<script>
import avatar from '@/assets/images/account/avatar.png'

export default {
  name: 'Functions',
  data () {
    return {
      avatar: avatar,
      username: ''
    }
  },
  methods: {
    changContent (data) {
      this.$emit("changContent", data)
    },
    // 更改用户名
    changeUsername () {
      this.$prompt('请输入新用户名', '更改用户名', {
        confirmButtonText: '更改',
        cancelButtonText: '取消',
        inputPattern: /^[a-zA-Z0-9_-]{4,16}$/,
        inputErrorMessage: '用户名仅支持英文、数字和下划线'
      }).then(async ({ value }) => {
        let resData = await this.axios.put(`/v1/changeName?newUsername=${value}`)
        if (resData.data.status) {
          this.username = value
          this.$message({
            type: 'success',
            message: '您的新用户名是: ' + value
          })
          this.$router.replace({
            path: '/'
          })
        } else {
          this.$message({
            type: 'error',
            message: resData.data.data
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    }
  },
  mounted () {
    let payload = localStorage.getItem('token').split('.')[1]
    let decodedPayload = window.atob(payload)
    let username = JSON.parse(decodedPayload).sub
    this.username = username
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.functions
  .personal, li
    display flex
    justify-content space-between
    align-items center
    background-color $whiteColor
    box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    border-radius 4px
  .personal
    padding 8px 10px
    padding-right 20px
    margin-bottom 15px
  ul
    width 100%
    li
      padding 12px 10px
      margin-bottom 10px
    .left
      svg
        font-size 2rem
        padding-right 5px
      span
        font-size 1.6rem
    .right
      svg
        font-size 1.6rem
</style>