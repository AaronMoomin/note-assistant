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
      v-model="noteTitle"
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
          command="favorite"
          @click="favorite"
        >
          <icon-font
            iconCode="icon-shoucang1"
            :class="favoriteStatus?'favorite':''"
          />
          <span>收 藏</span>
        </el-dropdown-item>
        <el-dropdown-item command="delNote">
          <icon-font iconCode="icon-icon-test" />
          <span>删 除</span>
        </el-dropdown-item>
        <el-dropdown-item command="doc">
          <icon-font iconCode="icon-doc" />
          <span>DOC</span>
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
    isFavorite: Boolean,
    nId: Number
  },
  data () {
    return {
      noteId: null,
      noteTitle: this.title,
      shareMsg: window.location.href,
      favoriteStatus: this.isFavorite
    }
  },
  watch: {
    title () {
      this.noteTitle = this.title
    },
    isFavorite () {
      this.favoriteStatus = this.isFavorite
    },
    noteTitle () {
      this.$emit("changeTitle", this.noteTitle)
    }
  },
  methods: {
    changMode () {
      this.$emit("changMode", "read")
    },
    // 保存
    save () {
      this.$bus.$emit('sendData')
      this.changMode()
    },
    // 下拉菜单指令集
    handleCommand (command) {
      this[command]()
    },
    // 分享
    async share () {
      let _this = this
      let noteId = this.nId ? this.nId : this.noteId
      let resData = await this.axios.post(`/v1/getShareKey?nId=${noteId}`)
      let shareId = resData.data.data.shareId
      let shareUrl = `${window.location.hostname}/share/${shareId}`
      // 判断是否为微信
      let isWeiXin = () => { return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1 }
      if (isWeiXin()) {
        this.$notify({
          title: '分享成功,请长按复制分享链接',
          message: shareUrl,
          type: 'success',
          duration: 0
        })
      } else {
        let fakeElement = document.createElement('button')
        let clipboard = new Clipboard(fakeElement, {
          text: function () {
            return shareUrl
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
      }
    },
    // 收藏/取消收藏
    async favorite () {
      let url = 'changeFavState'
      this.favoriteStatus = !this.favoriteStatus
      let data = {
        id: this.nId,
        favorite: this.favoriteStatus
      }
      let resData = await this.axios.put(`/v1/${url}`, data)
      if (resData.data.status) {
        this.$message({
          message: '收藏成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '收藏失败',
          type: 'error'
        })
      }
    },
    // 删除
    async delNote () {
      let url = "delNote"
      let noteId = this.nId ? this.nId : this.noteId
      let data = {
        params: {
          nId: noteId
        }
      }
      let resData = await this.axios.delete(`/v1/${url}`, data)
      if (resData.data.status) {
        this.$router.push({
          path: '/index'
        })
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '删除失败',
          type: 'error'
        })
      }
    }
  },
  mounted () {
    // 监听事件
    this.$bus.$on("addNoteId", data => {
      this.noteId = data
    })
  },
  beforeDestroy () {
    this.$bus.$off('sendData')
  },
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.tool-bar
  padding 5px 20px
  // background-color $blueColor
  background-image linear-gradient(to right, #61D1F7, #55B7F8, #50A2F8)
  justify-content space-between
  align-items center
  .title
    width auto
  svg
    font-size 2rem
    color $whiteColor
    &:hover
      color $greyColor
.favorite
  color $orangeColor
.pdf-text
  letterSpacing(0.15rem)
</style>
