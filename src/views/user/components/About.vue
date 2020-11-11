<template>
  <el-container
    class="about"
    direction="vertical"
  >
    <div class="title-md">项目介绍</div>
    <div class="content">
      本项目针对市场的迫切需求,研发一个方便用户用文字、特别是语音和照片记录笔记并将语音和照片笔记转换为文字的软件-“智能云笔记”,该软件比市面上现有产品具有更理想的的拒识率和更高的识
      别率,提供全平台的笔记云端保存和编辑功能,可以生成并下载word版(或pdf版)笔记和分享笔记
      到社交平台。
    </div>
  </el-container>
</template>

<script>

export default {
  name: 'About',
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.about
  background-color $whiteColor
  box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  border-radius 4px
  padding 12px 10px
  .title-md
    padding-bottom 5px
  .content
    font-size 14px
</style>