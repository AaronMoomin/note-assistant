<template>
  <el-container
    class="editor"
    direction="vertical"
  >
    <el-header>
      <tool-bar
        :title="noteData.title"
        :isRead="modeState"
        :isFavorite="noteData.favorite"
        :nId="noteData.id"
        @changMode="changMode"
        @changeTitle="changeTitle"
      />
    </el-header>
    <el-main>
      <contents
        :isRead="modeState"
        :noteData="noteData"
        v-loading="loading"
        element-loading-text="拼命加载中"
      />
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
      mode: 'read',
      noteData: {
        id: null,
        title: '',
        data: [],
        favorite: false,
        date: null
      },
      loading: false
    }
  },
  computed: {
    modeState () {
      let isRead = this.mode === 'read'
      return isRead
    }
  },
  methods: {
    init () {
      let noteId = this.$route.params.id
      noteId ? this.getData(noteId) : this.noteData.title = '笔记标题'
    },
    async getData (noteId) {
      this.loading = true
      let data = {
        params: {
          id: noteId
        }
      }
      let resData = await this.axios.get(`/v1/getNote`, data)
      if (resData.data.status) {
        this.loading = false
        let data = resData.data.data
        this.noteData.id = data.id
        this.noteData.title = data.title
        this.noteData.data = JSON.parse(data.data)
        this.noteData.favorite = data.favorite
        this.noteData.date = data.date
      } else {
        this.$message({
          message: '获取笔记失败',
          type: 'error'
        })
      }
    },
    changMode (data) {
      this.mode = data
    },
    changeTitle (data) {
      this.noteData.title = data
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus">
.editor
  height 100%
  .el-header
    padding-left 0
    padding-right 0
    margin-bottom 10px
    padding-top 0
  .el-main
    height 100%
    .el-form-item__content
      line-height 0px
    .el-form-item
      margin-bottom 10px
  .el-footer
    z-index 2001
  .el-footer.read
    height 0
    position fixed
    bottom 0
    right 0
    padding-bottom 16px
.el-popover.recording-popover
  border-radius 30px
  transition top 0.2s ease-in-out 0ms
</style>
