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
          accept="image/jpg,image/png,image/jpeg"
          :action="uploadSettings.detail.action"
          :data="{token:this.uploadSettings.detail.token}"
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
          accept="image/jpg,image/png,image/jpeg"
          :action="uploadSettings.detail.action"
          :http-request="uploadImages"
          :before-upload="beforeImageUpload"
          :multiple="this.isMultiple"
          :limit="this.isMultiple?undefined:1"
          :show-file-list="false"
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
  props: {
    isMultiple: Boolean
  },
  data () {
    return {
      routerName: '',
      drawer: false,
      uploadSettings: {
        detail: {
          // 上传地址
          action: 'https://upload-z2.qiniup.com',
          domain: 'https://notes.cdn.librejo.cn/',
          token: '',
          // 文件上传格式
          fileType: ['image/png', 'image/jpg', 'image/jpeg'],
          // 文件上传大小 单位M
          fileSzie: 5,
        },
        error: {
          fileType: '请上传格式为png/jpg/jpeg的图片',
          fileSzie: '图片大得于5M 请重新上传'
        }
      }
    }
  },
  methods: {
    // 获取上传token
    async getToken () {
      let resData = await this.axios.post('/v1/getToken')
      this.uploadSettings.detail.token = resData.data.data
    },
    // 改变抽屉状态
    changeDrawerState () {
      this.drawer = true
    },
    // 图片上传前操作
    async beforeImageUpload (file) {
      // 待优化
      let settings = this.uploadSettings
      let isFileType = settings.detail.fileType.includes(file.type)
      let isFileSzie = file.size / 1024 / 1024 < settings.detail.fileSzie
      let state = isFileType && isFileType

      if (!isFileType) {
        this.$message({
          message: settings.error.fileType,
          type: 'error'
        })
      }
      if (!isFileSzie) {
        this.$message({
          message: settings.error.fileSzie,
          type: 'error'
        })
      }
      if (state) {
        await this.getToken()
      }
      return state
    },
    // 图片上传中的钩子
    handleImageProgress () {
      this.drawer = false
    },
    // 图片上传成功钩子
    handleImageSuccess (res) {
      let imgWidth = this.$route.name === 'Index' ? document.querySelector('.content').clientWidth : document.querySelector('.content>.el-form').clientWidth
      let imgUrl = this.uploadSettings.detail.domain + res.key + `?imageMogr2/auto-orient/thumbnail/${imgWidth}x/format/jpg/blur/1x0/quality/75`
      if (this.$route.name === 'Index') {
        this.$bus.$emit('ocrImg', imgUrl)
      } else {
        this.$bus.$emit('addImg', imgUrl)
      }
      this.$message({
        message: '图片上传成功',
        type: 'success'
      })
      this.$refs.cameraUpload.clearFiles()
      this.$refs.albumUpload.clearFiles()
    },
    // 多图片上传
    async uploadImages (req) {
      let uploadData = new FormData
      uploadData.append('token', this.uploadSettings.detail.token)
      uploadData.append('file', req.file)
      this.handleImageProgress()
      let resData = await this.axios.post(this.uploadSettings.detail.action, uploadData)
      this.handleImageSuccess(resData.data)
    }
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