<template>
  <el-container
    class="editor-bar"
    direction="horizontal"
  >

    <icon-font
      iconCode="icon-tupian"
      class="image"
      @click.native="image"
    />
    <icon-font
      iconCode="icon-yuyin1"
      class="recording"
    />
    <icon-font
      iconCode="icon-bianjiqianbixieshuru2"
      class="text"
      @click.native="text"
    />
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
  </el-container>
</template>

<script>
export default {
  name: 'Editor',
  data () {
    return {
      domain: 'http://qhyxeywtp.hn-bkt.clouddn.com/',
      param: {
        token: 'N8T7FT9RZ5syAB0AOTSIuiJxlXRfgEv_r5WEnaxf:feROH3U2hwPlheQg3n3afBEqwW8=:eyJzY29wZSI6InN6aWl0LW5vdGVzLWFzc2lzdGFudCIsImRlYWRsaW5lIjoxNjAyNDk4MzY0fQ=='
      },
      drawer: false,
      actionPath: 'https://upload-z2.qiniup.com'
    }
  },
  methods: {
    changMode () {
      this.$emit("changMode", "editor")
    },
    // 图像
    image () {
      this.drawer = true
      this.$nextTick(() => {
        let cameraUpload = document.querySelector('.camera-upload>.el-upload>input')
        cameraUpload.setAttribute('capture', 'capture')
        cameraUpload.setAttribute('accept', 'image/*')
        let albumUpload = document.querySelector('.album-upload>.el-upload>input')
        albumUpload.setAttribute('accept', 'image/*')
      })
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
    recording () {

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
