<template>
  <el-container
    class="index"
    direction="vertical"
  >
    <el-header>
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
  height 100vh
</style>
