<template>
  <el-container
    class="tool-bar"
    direction="horizontal"
  >
    <!-- 左边图标 -->
    <router-link to="/index">
      <i class="iconfont">&#xe611;</i>
    </router-link>
    <!-- 中间标题 -->
    <el-input
      :readonly="isRead"
      class="title"
      v-model="title"
      autocomplete="off"
    >
    </el-input>
    <!-- 右边图标 -->
    <!-- 保存 -->
    <i
      class="iconfont"
      v-show="!isRead"
      @click="save"
    >&#xe60c;</i>
    <!-- 分享 -->
    <i
      class="share-btn iconfont"
      v-show="isRead"
      :data-clipboard-text="shareMsg"
      @click="share"
    >&#xe600;</i>
  </el-container>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  name: 'ToolBar',
  props: {
    isRead: Boolean
  },
  data () {
    return {
      title: '笔记标题',
      shareMsg: window.location.href
    }
  },
  methods: {
    changMode () {
      this.$emit("changMode", "read")
    },
    // 保存
    save () {
      this.$message({
        message: '保存成功',
        type: 'success'
      })
      this.changMode()
    },
    // 分享
    share () {
      let _this = this
      let clipboard = new Clipboard(".share-btn")
      clipboard.on('success', function () {
        _this.$message({
          message: '链接复制成功！',
          type: 'success'
        })
      })
      clipboard.on('error', function () {
        _this.$message({
          message: '链接复制失败!',
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.tool-bar
  justify-content space-between
  align-items center
  .title
    width auto
  i
    font-size 2rem
    color $darkBlueColor
    &:hover
      color $blueColor
</style>
