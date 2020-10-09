<template>
  <el-container
    class="content"
    direction="vertical"
  >
    <router-link to="/editor">
      <el-card>
        <div class="card-header">
          测试
        </div>
        <div class="card-content">
          这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字
        </div>
        <div class="card-footer">
          <span class="date">2020-10-05</span>
          <span class="time">下午6:36</span>
        </div>
      </el-card>
    </router-link>
  </el-container>
</template>

<script>
export default {
  name: 'Content',
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
.el-card
  margin-bottom 8px
  .card-header
    font-size 1.6rem
    font-weight 700
    padding-bottom 2px
  .card-content
    font-size 1.2rem
    padding-bottom 2px
    color $darkGreyColor
  .card-footer
    display flex
    justify-content space-between
    font-size 1rem
    color $lightGreyColor
</style>
