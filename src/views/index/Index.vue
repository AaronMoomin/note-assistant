<template>
  <el-container
    class="index"
    direction="vertical"
  >
    <el-header style="height: 95px;">
      <tool-bar />
    </el-header>
    <el-main>
      <contents />
    </el-main>
    <el-footer>
      <bar />
    </el-footer>
  </el-container>
</template>

<script>
import ToolBar from './components/ToolBar'
import Contents from './components/Contents'
import Bar from '@/components/Bar'

export default {
  name: 'Index',
  components: {
    ToolBar,
    Contents,
    Bar
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">
.index
  height 100%
  .el-header
    padding-top 16px
    background-image linear-gradient(to right, #61D1F7, #55B7F8, #50A2F8)
  .el-main
    z-index 1
    padding-top 10px
  .el-footer
    z-index 1
    position absolute
    bottom 0
    width 100%
</style>
