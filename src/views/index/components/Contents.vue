<template>
  <el-container
    class="content"
    direction="vertical"
    v-infinite-scroll="lazyLoad"
    infinite-scroll-distance="100"
    infinite-scroll-delay="400"
    :infinite-scroll-disabled="lazyLoadDisabled"
  >
    <div class="function">
      <div
        class="images"
        @click="ocrDialog('image')"
      >
        <icon-font iconCode="icon-tupian2" />
        <span>图像识别</span>
      </div>
      <div
        class="recording"
        @click="ocrDialog('recording')"
      >
        <span>语音识别</span>
        <icon-font iconCode="icon-maikefeng" />
      </div>

    </div>
    <div
      class="note-content"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <router-link
        v-for="item in data"
        :key="item.id"
        :to="'/editor/'+item.id"
      >
        <el-card shadow="never">
          <div class="card-header">
            <div class="title">
              {{item.title}}
            </div>
            <div
              v-if="item.favorite"
              class="favorite"
            >
              <icon-font iconCode="icon-shoucang1" />
            </div>
          </div>
          <div class="card-content">
            {{item.summary}}
          </div>
          <div class="card-footer">
            <span class="date">{{formatDate(item.date)}}</span>
            <span class="time">{{formatTime(item.date)}}</span>
          </div>
        </el-card>
      </router-link>
    </div>
    <div
      class="message"
      v-show="data.length >=10"
    >
      {{lazyLoadDisabled?'没有更多了':'加载中...'}}
    </div>
    <image-drawer
      ref="imageDrawer"
      :isMultiple="false"
    />
    <el-dialog
      class="ocr-dialog"
      :title="ocrDialogDetail[ocrDialogDetail.mode].title"
      :visible.sync="ocrDialogDetail.visible"
      @close="dialogClose"
    >
      <el-image
        v-if="ocrDialogDetail.mode === 'image'"
        :src="ocrDialogDetail.image.imgUrl"
      >
        <div
          slot="placeholder"
          class="image-slot"
        >
          加载中<span class="dot">...</span>
        </div>
        <div
          slot="error"
          class="image-slot"
        >
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
      <el-input
        type="textarea"
        :autosize="{ minRows: 6}"
        :placeholder="ocrDialogDetail.textPlaceholder"
        v-model="ocrDialogDetail.ocrText"
      />
      <recording-popover
        v-if="ocrDialogDetail.mode === 'recording'"
        ref="rcordingPopover"
      >
        <icon-font
          slot="down"
          iconCode="icon-maikefeng"
          class="recording"
          v-longpress="recording"
        />
      </recording-popover>
    </el-dialog>
  </el-container>
</template>

<script>
import ImageDrawer from '@/components/ImageDrawer'
import RecordingPopover from '@/components/RecordingPopover'

export default {
  name: 'Content',
  components: {
    ImageDrawer,
    RecordingPopover
  },
  directives: {
    // 长按指令
    longpress: {
      bind: function (el, binding, vnode) {
        let pressTimer = null
        let countdown
        // 创建计时器
        let start = (e) => {
          if (e.type === 'click' && e.button !== 0) return false
          if (pressTimer === null) {
            pressTimer = setTimeout((e) => {
              binding.value(e)
              countdown = setTimeout(() => {
                vnode.context.$refs.rcordingPopover.overtimeMessage()
                cancel()
              }, 1000 * 60)

            }, 200)
          }
        }

        // 取消计时器
        let cancel = () => {
          // 检查是否有正在运行的计时器
          if (pressTimer !== null) {
            if (vnode.context.recPermission) {
              vnode.context.recStop()
            }
            vnode.context.$refs.rcordingPopover.changePopoverState(false)
            clearTimeout(countdown)
            clearTimeout(pressTimer)
            pressTimer = null
          }
        }




        // 添加事件监听器
        el.addEventListener("mousedown", start)
        el.addEventListener("touchstart", start)

        // 取消计时器
        el.addEventListener("click", cancel)
        el.addEventListener("mouseout", cancel)
        el.addEventListener("touchend", cancel)
        el.addEventListener("touchcancel", cancel)
      }

    }
  },
  data () {
    return {
      loading: true,
      ocrDialogDetail: {
        visible: false,
        mode: 'image',
        ocrText: '',
        textPlaceholder: '',
        image: {
          title: '图像识别',
          imgUrl: ''
        },
        recording: {
          title: '语音识别',
          recordingUrl: ''
        }
      },
      searchKey: '',
      currentPage: 1,
      noteCount: 0,
      index: 0,
      currentGetUrl: '',
      data: [],
      noteList: {
        method: 'get',
        url: {
          asc: 'getNoteList',
          desc: 'getNoteListDesc'
        }
      },
      favoriteNoteList: {
        method: 'get',
        url: {
          asc: 'getFavoriteNote',
          desc: 'getFavoriteNoteDesc'
        }
      },
      searchNoteList: {
        method: 'post',
        url: {
          asc: 'searchNote'
        }
      },
      lazyLoadDisabled: false
    }
  },
  methods: {
    // 初始化
    init () {
      this.getDataList()
    },
    async getDataList (url = this.noteList.url.asc, page = 1, searchKey = this.searchKey) {
      let method = searchKey.length === 0 ? 'get' : 'post'
      let data
      searchKey.length === 0 ? data = {
        params: {
          page: page
        }
      } : data = {
        title: searchKey,
        page: page
      }
      let resData = await this.axios[method](`/v1/${url}`, data)
      if (resData.data.status) {
        let data = resData.data.data
        data.length !== 10 ? this.lazyLoadDisabled = true : this.lazyLoadDisabled = false
        if (page === 1) {
          this.data = data
        } else {
          this.data = this.data.concat(data)
        }
        this.loading = false
      } else {
        this.$message({
          message: resData.data.msg,
          type: 'error'
        })
      }
    },
    lazyLoad () {
      let url
      if (this.data.length) {
        this.currentGetUrl.length === 0 ? url = this.noteList.url.asc : url = this.currentGetUrl
        this.getDataList(url, this.currentPage + 1)
      }
    },
    formatDate (timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month = new Date(timeStamp).getMonth() + 1
      let day = new Date(timeStamp).getDate() < 10 ? `0${new Date(timeStamp).getDate()}` : new Date(timeStamp).getDate()
      return `${year}-${month}-${day}`
    },
    formatTime (timeStamp) {
      let hours = new Date(timeStamp).getHours()
      let minutes = new Date(timeStamp).getMinutes() < 10 ? `0${new Date(timeStamp).getMinutes()}` : new Date(timeStamp).getMinutes()
      return `${hours}:${minutes}`
    },
    ocrDialog (mode) {
      this.ocrDialogDetail.mode = mode
      if (mode === 'image') {
        this.$refs.imageDrawer.changeDrawerState()
        this.$nextTick(() => {
          let cameraUpload = document.querySelector('.camera-upload>.el-upload>input')
          cameraUpload.setAttribute('capture', 'capture')
          cameraUpload.setAttribute('accept', 'image/*')
          let albumUpload = document.querySelector('.album-upload>.el-upload>input')
          albumUpload.setAttribute('accept', 'image/*')
        })
      } else if (mode === 'recording') {
        this.ocrDialogDetail.visible = true
      }
    },
    // 图像url转base64(去头部)
    imageToBase64 (url) {
      return new Promise((resolve) => {
        let canvas, ctx, img
        canvas = document.createElement('canvas')
        ctx = canvas.getContext('2d')
        img = new Image
        img.crossOrigin = 'Anonymous'
        img.src = url
        img.onload = () => {
          canvas.height = img.height
          canvas.width = img.width
          ctx.drawImage(img, 0, 0)
          let formData = new FormData()
          let dataUrl = encodeURI(canvas.toDataURL('image/jpeg').replace(/^data:image\/\w+;base64,/, ""))
          formData.append('image', dataUrl)
          resolve(formData)
        }
      })
    },
    // 录音
    recording () {
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }
      // 获取录音权限
      this.$refs.rcordingPopover.changePopoverState(true)
      this.ocrDialogDetail.textPlaceholder = '识别中...'
    },
    dialogClose () {
      this.ocrDialogDetail.ocrText = ''
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 收藏
    this.$bus.$on("getFavoriteNote", (data) => {
      let url = null
      data.favorite ? url = this.favoriteNoteList.url.asc : url = this.noteList.url.asc
      this.currentGetUrl = url
      this.currentPage = 1
      this.getDataList(url)
    })
    // 排序
    this.$bus.$on("getNoteListDesc", (data) => {
      let url = null
      if (data.sort) {
        data.favorite ? url = this.favoriteNoteList.url.desc : url = this.noteList.url.desc
      } else {
        data.favorite ? url = this.favoriteNoteList.url.asc : url = this.noteList.url.asc
      }
      this.currentGetUrl = url
      this.currentPage = 1
      this.getDataList(url)
    })
    // 搜索
    this.$bus.$on("getSearchNote", (data) => {
      let url = null
      this.searchKey = data ? data : ''
      data ? url = this.searchNoteList.url.asc : url = this.noteList.url.asc
      this.currentGetUrl = url
      this.currentPage = 1
      this.getDataList(url, this.currentPage, data)
    })
    this.$bus.$on("ocrImg", async (data) => {
      this.ocrDialogDetail.visible = true
      this.ocrDialogDetail.image.imgUrl = data
      let sendData = await this.imageToBase64(data)
      let config = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
      let resData = await this.axios.post('/imageocr', sendData, config)
      let orcResult = resData.data.words_result.map(e => e.words).join('\n')
      this.ocrDialogDetail.ocrText = orcResult
    })
    this.$bus.$on("recordingOcr", (data) => {
      this.ocrDialogDetail.ocrText = data
      this.ocrDialogDetail.textPlaceholder = ''
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.message
  padding-bottom 65px
.el-card
  .card-header
    display flex
    justify-content space-between
    align-items center
    padding-bottom 2px
    .title
      font-size 1.6rem
      font-weight 700
    .favorite
      color $orangeColor
      font-size 1.4rem
  .card-content
    height 48px
    overflow hidden
    text-overflow ellipsis
    word-break break-all
    display -webkit-box
    -webkit-box-orient vertical
    -webkit-line-clamp 3
    font-size 1.2rem
    padding-bottom 2px
    color $darkGreyColor
  .card-footer
    display flex
    justify-content space-between
    font-size 1rem
    color $lightGreyColor
.message
  text-align center
  margin-top 10px
  letterSpacing(0.1rem)
.function
  display flex
  justify-content space-between
  background-color $whiteColor
  padding 10px 20px
  .images, .recording
    display flex
    align-items center
    span
      padding 0 5px
      font-size 1.3rem
    svg
      font-size 3rem
.ocr-dialog
  .el-image
    margin-bottom 15px
  .recording
    padding-top 50px
    font-size 3.5rem
    text-align center
</style>
