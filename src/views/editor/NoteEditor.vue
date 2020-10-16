<template>
  <el-container
    class="editor"
    direction="vertical"
  >
    <el-header>
      <tool-bar
        :isRead="modeState"
        @changMode="changMode"
      />
    </el-header>
    <el-main>
      <contents :isRead="modeState" />
    </el-main>
    <el-footer :class="mode">
      <component
        :is="mode"
        @changMode="changMode"
      />
    </el-footer>
  </el-container>
</template>

<script>
import ToolBar from './components/ToolBar'
import Contents from './components/Contents'
import Editor from './components/EditorBar'
import Read from './components/ReadBar'

export default {
  name: 'NoteEditor',
  components: {
    ToolBar,
    Contents,
    Editor,
    Read
  },
  data () {
    return {
      // 查看 --- read
      // 编辑 --- editor
      mode: 'read'
    }
  },
  computed: {
    modeState () {
      let isRead = this.mode === 'read'
      return isRead
    }
  },
  methods: {
    changMode (data) {
      this.mode = data
    }
  }
}
</script>

<style lang="stylus">
.editor
  height 100%
  .el-header
    margin-bottom 2px
    padding-top 0
    padding-top 5px
    padding-bottom 5px
  .el-main
    .el-form-item__content
      line-height 0px
    .el-form-item
      margin-bottom 10px
  .el-footer.read
    height 0
    position fixed
    bottom 0
    right 0
    padding-bottom 16px
.el-popover.recording-popover
  border-radius 30px
  transition top .2s ease-in-out 0ms
</style>
