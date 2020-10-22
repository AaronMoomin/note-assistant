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
import ForgetPwd from './components/ForgetPwd'
import About from './components/About'
import Bar from '@/components/Bar'

export default {
  name: 'User',
  components: {
    ToolBar,
    Functions,
    ForgetPwd,
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
    height 50px !important
    margin-bottom 15px
</style>
