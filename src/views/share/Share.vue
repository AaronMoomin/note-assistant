<template>
  <el-container
    class="editor"
    direction="vertical"
  >
    <el-header>
      <tool-bar
        :title="noteData.title"
      />
    </el-header>
    <el-main>
      <contents :noteData="noteData" />
    </el-main>
  </el-container>
</template>

<script>
import ToolBar from './components/ToolBar'
import Contents from './components/Contents'

export default {
  name: 'Share',
  components: {
    ToolBar,
    Contents
  },
  data () {
    return {
      noteData: {
        id: null,
        title: '',
        data: [],
        favorite: false,
        date: null
      }
    }
  },
  methods: {
    init () {
      let noteId = this.$route.params.id
      this.getData(noteId)
    },
    async getData (noteId) {
      let data = {
        params: {
          shareKey: noteId
        }
      }
      let resData = await this.axios.get(`/v1/getNoteByShare`, data)
      if (resData.data.status) {
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
    .el-form-item__content
      line-height 0px
    .el-form-item
      margin-bottom 10px
</style>
