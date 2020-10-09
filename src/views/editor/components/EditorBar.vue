<template>
  <el-container
    class="editor-bar"
    direction="horizontal"
  >
    <i
      class="iconfont image"
      @click="image"
    >&#xe60d;</i>
    <i
      class="iconfont recording"
      @click="recording"
    >&#xe68a;</i>
    <i
      class="iconfont text"
      @click="text"
    >&#xe7c9;</i>
  </el-container>
</template>

<script>
export default {
  name: 'Editor',
  data () {
    return {
    }
  },
  methods: {
    changMode () {
      this.$emit("changMode", "editor")
    },
    text () {
      this.$bus.$emit('addText')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.editor-bar
  justify-content space-around
  align-items center
  background-color $whiteColor
  padding 1rem 0
  border-radius 30px
  .image, .text, .recording
    font-size 2rem
    color $darkBlueColor
    &:hover
      color $blueColor
</style>
