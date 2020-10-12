<template>
  <el-container
    class="tool-bar"
    direction="horizontal"
  >
    <!-- 左边图标 -->
    <router-link to="/index">
      <icon-font iconCode="icon-fanhui" />
    </router-link>
    <!-- 中间标题 -->
    <el-input
      :readonly="isRead"
      class="title title-md"
      v-model="title"
      autocomplete="off"
    >
    </el-input>
    <!-- 右边图标 -->
    <!-- 保存 -->
    <icon-font
      iconCode="icon-baocun1"
      v-show="!isRead"
      @click.native="save"
    />
    <!-- 分享 -->
    <icon-font
      iconCode="icon-fenxiang_2"
      v-show="isRead"
      :data-clipboard-text="shareMsg"
      class="share-btn"
      @click.native="share"
    />
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
  svg
    font-size 2rem
    color $darkBlueColor
    &:hover
      color $blueColor
</style>
