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
    <el-dropdown
      v-show="isRead"
      trigger="click"
      @command="handleCommand"
    >
      <span>
        <icon-font
          iconCode="icon-list"
          v-show="isRead"
          :data-clipboard-text="shareMsg"
        />
      </span>
      <el-dropdown-menu slot="dropdown">
        <!-- 分享 -->
        <el-dropdown-item
          command="share"
          @click="share"
        >
          <icon-font iconCode="icon-fenxiang_2" />
          <span>分 享</span>
        </el-dropdown-item>
        <el-dropdown-item
          command="favorites"
          @click="favorites"
        >
          <icon-font
            iconCode="icon-shoucang1"
            :class="isFavorite?'favorites':''"
          />
          <span>收 藏</span>
        </el-dropdown-item>
        <el-dropdown-item command="doc">
          <icon-font iconCode="icon-doc" />
          <span >DOC</span>
        </el-dropdown-item>
        <el-dropdown-item command="pdf">
          <icon-font iconCode="icon-pdf" />
          <span class="pdf-text">PDF</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-container>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  name: 'ToolBar',
  props: {
    title: String,
    isRead: Boolean,
    isFavorite: Boolean
  },
  data () {
    return {
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
    // 下拉菜单指令集
    handleCommand (command) {
      this[command]()
    },
    // 分享
    share () {
      let _this = this
      let fakeElement = document.createElement('button')
      let clipboard = new Clipboard(fakeElement, {
        text: function () {
          return '测试复制功能'
        },
        action: function () {
          return 'copy'
        }
      })
      clipboard.on('success', function () {
        clipboard.destroy()
        _this.$message({
          message: '链接复制成功！',
          type: 'success'
        })
      })
      clipboard.on('error', function () {
        clipboard.destroy()
        _this.$message({
          message: '链接复制失败!',
          type: 'warning'
        })
      })
      fakeElement.click()
    },
    // 收藏/取消收藏
    async favorites () {
      let url = 'changeFavState'
      let data = {
        params: {
          favoriteState: !this.isFavorite
        }
      }
      let resData = await this.axios.get(`/v1/${url}`, data)
      if (resData.data.status) {
        this.$message({
          message: resData.data.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: resData.data.msg,
          type: 'error'
        })
      }
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
.favorites
  color $orangeColor
.pdf-text
  letterSpacing(.15rem)
</style>
