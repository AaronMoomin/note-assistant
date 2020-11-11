<template>
  <el-container
    class="tool-bar"
    direction="horizontal"
  >
    <!-- 中间标题 -->
    <el-input
      class="title title-md"
      v-model="title"
      autocomplete="off"
    >
    </el-input>
  </el-container>
</template>

<script>

export default {
  name: 'ToolBar',
  props: {
    title: String,
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.tool-bar
  padding 5px 20px
  background-image linear-gradient(to right, #61D1F7, #55B7F8, #50A2F8)
  justify-content center
  align-items center
  .title
    width auto

</style>
