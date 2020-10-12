<template>
  <el-container
    class="read-bar"
    direction="horizontal"
  >
    <icon-font
      iconCode="icon-xiugai1"
      @click.native="changMode"
    />
  </el-container>
</template>

<script>
export default {
  name: 'Read',
  data () {
    return {
    }
  },
  methods: {
    changMode () {
      this.$emit("changMode", "editor")
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.read-bar svg
  font-size 6rem
  color $blueColor
  margin-bottom 4px
</style>
