<template>
  <el-container
    class="tool-bar"
    direction="vertical"
  >
    <!-- <div class="top">
      <span>智 能 云 笔 记</span>
    </div> -->
    <div class="bottom">
      <el-input
        v-model="search"
        autocomplete="off"
        clearable
      >
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
        ></i>
      </el-input>
      <el-button
        size="mini"
        circle
      >
        <i class="iconfont">&#xe632;</i>
      </el-button>
      <el-button
        size="mini"
        circle
      >
        <i class="iconfont">&#xe603;</i>
      </el-button>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'ToolBar',
  data () {
    return {
      search: ''
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.top
  text-align center
  font-size 2.2rem
  padding-bottom 5px
.bottom
  display flex
  .el-button
    margin-left 5px
    color $darkGreyColor
    &:hover
      color $blueColor
</style>
