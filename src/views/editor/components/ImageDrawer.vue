<template>
  <el-drawer
    direction='btt'
    :show-close="false"
    :with-header="false"
    :visible.sync="drawer"
    size='165px'
  >
    <div class="title">
      选择一种方式...
    </div>
    <div class="content">
      <div class="camera mb-2">
        <div class="left">
          <icon-font iconCode="icon-xiangji1" />
          <span class="text-lg">相机</span>
        </div>
        <el-upload
          ref="cameraUpload"
          class="camera-upload"
          :action="actionPath"
          :data="param"
          :multiple="false"
          :limit="1"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
          :on-progress="handleImageProgress"
          :on-success="handleImageSuccess"
        >
          <el-button
            type="primary"
            size="medium"
            round
          >拍照</el-button>
        </el-upload>
      </div>
      <div class="album">
        <div class="left">
          <icon-font iconCode="icon-zhaopian" />
          <span class="text-lg">相册</span>
        </div>
        <el-upload
          ref="albumUpload"
          class="album-upload"
          :action="actionPath"
          :data="param"
          :multiple="false"
          :limit="1"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
          :on-progress="handleImageProgress"
          :on-success="handleImageSuccess"
        >
          <el-button
            size="medium"
            round
          >打开</el-button>
        </el-upload>
      </div>
    </div>
  </el-drawer>
</template>
   
<script>

export default {
  name: "ImageDrawer",
  data () {
    return {
      drawer: false,
      domain: 'http://qhyxeywtp.hn-bkt.clouddn.com/',
      actionPath: 'https://upload-z2.qiniup.com',
      param: {
        token: 'N8T7FT9RZ5syAB0AOTSIuiJxlXRfgEv_r5WEnaxf:2osPHWcK_Cl6SW6uvM2eF9vpFM4=:eyJzY29wZSI6InN6aWl0LW5vdGVzLWFzc2lzdGFudCIsImRlYWRsaW5lIjoxNjAyODUzNTIwfQ=='
      }
    }
  },
  methods: {
    // 改变抽屉状态
    changeDrawerState () {
      this.drawer = true
    },
    // 图片上传前操作---待定
    beforeImageUpload () {
    },
    // 图片上传中的钩子
    handleImageProgress () {
      this.drawer = false
    },
    // 图片上传成功钩子
    handleImageSuccess (res) {
      let imgWidth = document.querySelector('.content>.el-form').clientWidth
      let imgUrl = this.domain + res.key + `?imageMogr2/auto-orient/thumbnail/${imgWidth}x/format/jpg/blur/1x0/quality/75`
      this.$bus.$emit('addImg', imgUrl)
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
      this.$refs.cameraUpload.clearFiles()
      this.$refs.albumUpload.clearFiles()
    },
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.el-drawer
  .title
    text-align center
    font-size 18px
    padding 15px 0
    border-bottom 1px solid $lightBlueColor
  .content
    padding 12px 0
    .left>span
      padding-left 8px
      vertical-align super
    .album>.el-button
      border-color $blueColor
      color $blackColor
    svg
      font-size 3.8rem
    >div
      display flex
      justify-content space-between
      align-items center
</style>