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
    <span class="title-md">智能云笔记</span>
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
  display flex
  align-items center
  padding 0 20px
  background-color $blueColor
  svg
    color $whiteColor
    margin-right 10px
    font-size 2rem
  .title-md
    color $whiteColor
</style>