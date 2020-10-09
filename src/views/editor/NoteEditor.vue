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
      ></component>
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
  height 100vh
  .el-header
    line-height 40px
    margin-bottom 2px
  .el-footer.read
    height 0
    position fixed
    bottom 0
    right 0
    padding-bottom 16px
</style>
