<template>
  <el-container
    class="read-bar"
    direction="horizontal"
  >
    <i class="iconfont read" @click="changMode">&#xe64b;</i>
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
    changMode(){
      this.$emit("changMode","editor")
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.read
  font-size 6rem
  color $blueColor
</style>
