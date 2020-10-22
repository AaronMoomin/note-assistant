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
        Samuel Zheng
      </div>
    </div>
    <ul>
      <li @click="changContent('forgetPwd')">
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
      avatar: avatar
    }
  },
  methods: {
    changContent (data) {
      this.$emit("changContent", data)
    }
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