<template>
  <el-container
    class="tool-bar"
    direction="horizontal"
  >
    <icon-font
      v-show="content !== 'functions'"
      iconCode="icon-fanhui"
      @click.native="changContent"
    />
    <span class="title">智能云笔记</span>
  </el-container>
</template>

<script>
export default {
  name: 'ToolBar',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  methods: {
    changContent () {
      this.$emit("changContent", 'functions')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.tool-bar
  height 100%
  justify-content center
  align-items center
  z-index 1
  svg
    position absolute
    left 20px
    color $whiteColor
    margin-right 10px
    font-size 2rem
    z-index 1
  .title
    font-size 2.2rem
    color $whiteColor
    letterSpacing 0.7rem
    z-index 1
  #radian
    position absolute
    left 0
    z-index 0
</style>