<template>
  <el-container
    class="user"
    direction="vertical"
  >
    <el-header>
      <tool-bar />
    </el-header>
    <el-main>
      <alter />
    </el-main>
    <el-footer>
      <bar />
    </el-footer>
  </el-container>
</template>

<script>
import ToolBar from './components/ToolBar'
import Alter from './components/Alter'
import Bar from '@/components/Bar'

export default {
  name: 'User',
  components: {
    ToolBar,
    Alter,
    Bar
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
.user
  height 100%
</style>
