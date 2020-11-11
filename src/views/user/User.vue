<template>
  <el-container
    class="user"
    direction="vertical"
  >
    <el-header>
      <tool-bar
        :content="content"
        @changContent="changContent"
      />
    </el-header>
    <el-main>
      <component
        :is="content"
        @changContent="changContent"
      />
    </el-main>
    <el-footer>
      <bar />
    </el-footer>
  </el-container>
</template>

<script>
import ToolBar from './components/ToolBar'
import Functions from './components/Functions'
import AlterPwd from './components/AlterPwd'
import About from './components/About'
import Bar from '@/components/Bar'

export default {
  name: 'User',
  components: {
    ToolBar,
    Functions,
    AlterPwd,
    About,
    Bar
  },
  data () {
    return {
      content: 'functions'
    }
  },
  methods: {
    changContent (data) {
      this.content = data
    }
  }
}
</script>

<style lang="stylus">
.user
  height 100%
  .el-header
    padding 0
    margin-bottom 15px
    background-image linear-gradient(to right, #61D1F7, #55B7F8, #50A2F8)
  .el-main
    z-index 2
</style>
