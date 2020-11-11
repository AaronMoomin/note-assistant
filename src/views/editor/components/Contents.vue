<template>
  <el-container class="content">
    <el-form
      ref="contentForm"
      :model="contentForm"
    >
      <el-form-item
        class="slide"
        v-for="(item) in contentForm.data"
        :key="item.key"
        v-slide:swipeleft="removeItem"
        v-slide:swiperight="rightSlide"
      >
        <!-- 图像 -->
        <div
          v-if="item.type ==='image'"
          class="image"
          @click.once="imageOcr($event,item.key)"
        >
          <el-image :src="item.value">
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
        </div>
        <!-- 音频 -->
        <div
          v-else-if="item.type === 'audio'"
          @click="broadcast($event,item.duration)"
          class="audio"
        >
          <div class="icon-broadcast">
            <span class="first"></span>
            <span class="second"></span>
            <span class="third"></span>
          </div>
          <div class="audio-duration">{{item.duration}}''</div>
          <audio :src="item.value" />
        </div>
        <!-- 文本 -->
        <el-input
          v-else-if="item.type === 'text' || item.type === 'ocrText'"
          :readonly="isRead"
          type="textarea"
          :rows="2"
          autosize
          :placeholder="item.type === 'text' || (item.type === 'ocrText' && !item.isOcring ) ? '请输入内容':'正在识别中...'"
          v-model="item.value"
        />
      </el-form-item>
    </el-form>
    <!-- <button @click="contentToPdf">124</button> -->
  </el-container>
</template>

<script>

export default {
  name: 'Content',
  props: {
    isRead: Boolean,
    noteData: Object
  },
  directives: {
    //滑动指令
    slide: {
      bind: function (el, binding, vnode) {
        let startX, startY, endX, endY
        let dx, dy
        let x, y = 0
        let touchType = binding.arg
        let direction = null
        let key = vnode.data.key

        // 判断滑动方向
        function getSlideDirection (startX, startY, endX, endY) {

          dy = Math.abs(startY - endY)
          dx = Math.abs(endX - startX)
          let result = null

          // 滑动水平距离过短/高度过长 失效
          if (dx < 50 || dy > 100) {
            x = 0
            vnode.elm.style.transform = `translateX(${x}px)`
            return result
          }

          // 判断水平向左还是向右
          if (dx > dy) return (endX > startX) ? result = 'swiperight' : result = 'swipeleft'
          return result
        }

        // 被激活的触摸点
        el.addEventListener('touchstart', function (e) {
          startX = e.touches[0].pageX
          startY = e.touches[0].pageY
        }, false)

        el.addEventListener('touchmove', function (e) {
          x = e.touches[0].pageX - startX
          y = e.touches[0].pageY - startY
          // 触摸点起始点与当前点的距离
          if (Math.abs(x) > 15 && Math.abs(y) < 50) return vnode.elm.style.transform = `translateX(${x}px)`
        })

        // 消失的触摸点
        el.addEventListener('touchend', function (e) {
          endX = e.changedTouches[0].pageX
          endY = e.changedTouches[0].pageY
          direction = getSlideDirection(startX, startY, endX, endY)

          switch (direction) {
            case 'swipeleft': {
              if (touchType === 'swipeleft') {
                binding.value(el, dx, key)
              }
              break
            }
            case 'swiperight': {
              if (touchType === 'swiperight') {
                binding.value(el, dx, key)
              }
              break
            }
          }
        }, false)
      }
    },
  },
  data () {
    return {
      audioKey: 0,
      contentForm: this.noteData,
      sendDataDetail: {
        add: {
          url: 'addNote',
          method: 'post'
        },
        edtor: {
          url: 'editorNote',
          method: 'put'
        }
      }
    }
  },
  methods: {
    scrollIntoView () {
      let element = document.querySelector('.content>.el-form>.el-form-item:last-child')
      element.scrollIntoView()
    },
    // 添加图像
    async addImg (data) {
      let resData = await this.contentForm.data.push({
        type: 'image',
        value: data,
        key: Date.now()
      })
      this.imageOcr(undefined, undefined, data, resData)
    },
    // 添加音频
    async addAudio (data, duration) {
      let template = {
        type: 'audio',
        // eslint-disable-next-line
        value: data,
        duration: parseInt(duration / 1000),
        key: Date.now()
      }
      await this.contentForm.data.push(template)
      let returnData = await this.addText('ocrText')
      this.audioKey = returnData.key
      return returnData
    },
    // 添加文本
    async addText (type = 'text', key = null, position = null) {
      let returnPosition = 0
      let data = this.contentForm.data
      let template = {
        type: type,
        value: '',
        key: Date.now()
      }
      if (type === 'ocrText') {
        template.isOcring = true
      }
      if (key) {
        let index = this.contentForm.data.findIndex(e => e.key === key) + 1
        await data.splice(index, 0, template)
        returnPosition = index
      }
      else if (position) {
        await data.splice(position, 0, template)
        returnPosition = position
      }
      else if (!key && !position) {
        let position = await data.push(template)
        returnPosition = position - 1
      }
      return {
        position: returnPosition,
        key: template.key
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
    // 图像识别
    async imageOcr (event, key, imgUrl = '', position = null) {
      let loading
      if (!position) {
        loading = this.$loading({
          target: event.currentTarget,
          lock: true,
          text: '图像识别中',
          background: 'rgba(0, 0, 0, 0.8)'
        })
      }
      let returnData = await this.addText('ocrText', key, position)
      if (imgUrl.length === 0) {
        imgUrl = event.currentTarget.querySelector('.el-image>img').src
      }
      let sendData = await this.imageToBase64(imgUrl)
      let config = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
      let resData = await this.axios.post('/imageocr', sendData, config)
      let orcResult = resData.data.words_result.map(e => e.words).join('\n')
      let ocrText = this.contentForm.data[returnData.position]
      if (ocrText.type === 'ocrText') {
        ocrText.value = orcResult
        ocrText.isOcring = false
      }
      if (!position) {
        loading.close()
      }

    },
    // 语音识别
    async recordingOcr (value = '') {
      let key = this.audioKey
      let index = await this.contentForm.data.findIndex(e => e.key === key)
      let ocrText = this.contentForm.data[index]

      ocrText.value = value
      ocrText.isOcring = false
      this.audioKey = 0
    },
    // 删除内容
    async removeItem (el, dx, key) {
      let elClientWidth = Math.abs(el.clientWidth)
      if (dx > elClientWidth * 0.3) {
        let index
        let data = this.contentForm.data
        el.style.transform = `translateX(${-(elClientWidth + 10)}px)`
        index = data.findIndex(e => e.key === key)
        setTimeout(function () {
          data.splice(index, 1)
        }, 200)
      } else {
        el.style.transform = `translateX(0)`
      }
    },
    async rightSlide (el) {
      el.style.transform = `translateX(0)`
    },
    // 播放语音
    async broadcast (e, duration) {
      let eDom = e.currentTarget
      let toggleActive = () => {
        eDom.classList.toggle("active")
      }
      eDom.querySelector('audio').play()
      toggleActive()
      setTimeout(toggleActive, (duration * 1000))
    },
    // 发送数据
    async sendData () {
      let mode
      let data = JSON.parse(JSON.stringify(this.contentForm))

      data.date = Date.now()
      typeof this.$route.params.id === 'undefined' ? mode = 'add' : mode = 'edtor'
      let resData = await this.axios[this.sendDataDetail[mode].method](`/v1/${this.sendDataDetail[mode].url}`, data)
      if (resData.data.status) {
        if (typeof this.$route.params.id === 'undefined') {
          this.$bus.$emit("addNoteId", resData.data.data.id)
        }
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '保存失败',
          type: 'error'
        })
      }
    }
  },
  mounted () {
    // 监听事件
    this.$bus.$on("addImg", data => {
      this.addImg(data)
    })
    this.$bus.$on("addAudio", (data, duration) => {
      this.addAudio(data, duration)
    })
    this.$bus.$on("recordingOcr", (data) => {
      this.recordingOcr(data)
    })
    this.$bus.$on("addText", () => {
      this.addText()
    })
    this.$bus.$on("sendData", () => {
      this.sendData()
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.content
  background-color $whiteColor
  border-radius 4px
  height 100%
  padding 10px
  overflow-x hidden
  overflow-y auto
  .el-form
    width 100%
  .slide
    transform translateZ(0)
    transition transform 0.2s ease-in 0ms
    .el-image
      width 100%
      .image-slot
        display flex
        justify-content center
        align-items center
        border-radius 4px
        width 100%
        height 100px
        background-color $greyColor
        i
          font-size 2rem
    .audio
      -webkit-touch-callout none
      -webkit-user-select none
      -moz-user-select none
      -ms-user-select none
      user-select none
      height 45px
      line-height 45px
      width 150px
      border-radius 4px
      box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
      display flex
      justify-content space-around
      align-items center
      .icon-broadcast
        width 30px
        height 30px
        position relative
        overflow hidden
        transform rotate(135deg)
        >span
          border 2px solid $darkBlueColor
          border-radius 50%
          position absolute
        .first
          width 3px
          height 3px
          background #cccccc
          top 27px
          left 27px
        .second
          width 15px
          height 15px
          top 21px
          left 21px
        .third
          width 24px
          height 24px
          top 15px
          left 15px
        @keyframes fadeInOut
          0%
            opacity 0
            /* 初始状态 透明度为0 */
          100%
            opacity 1
            /* 结尾状态 透明度为1 */
      .audio-duration
        font-size 12px
.active>.icon-broadcast>.first
  animation fadeInOut 1s infinite 2.4s
.active>.icon-broadcast>.second
  animation fadeInOut 1s infinite 1.6s
.active>.icon-broadcast>.third
  animation fadeInOut 1s infinite 0.8s
</style>
