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
        <!-- 文本 -->
        <div
          v-if="item.type ==='image'"
          class="image"
          @dblclick.once="imageOcr($event,item.key)"
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
        <!-- 图像 -->
        <el-input
          v-else-if="item.type === 'text' || item.type === 'ocrText'"
          :readonly="isRead"
          type="textarea"
          :rows="2"
          autosize
          :placeholder="item.type === 'text' ? '请输入内容':'正在识别中...'"
          v-model="item.value"
        />
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>

export default {
  name: 'Content',
  props: {
    isRead: Boolean
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
          console.log(`x:${Math.abs(x)} y:${Math.abs(y)}`)
          // 触摸点起始点与当前点的距离
          if (Math.abs(x) > 5) return vnode.elm.style.transform = `translateX(${x}px)`
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
      imgTest: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1591797306,3433247737&fm=26&gp=0.jpg',
      contentForm: {
        data:
          [
            {
              type: 'text',
              value: '',
              key: '01'
            },
            {
              type: 'image',
              value: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
              key: '02'
            },
            {
              type: 'audio',
              value: 'test',
              duration: 3,
              key: '03'
            }
          ]
      }
    }
  },
  methods: {
    scrollIntoView () {
      let element = document.querySelector('.content>.el-form>.el-form-item:last-child')
      element.scrollIntoView()
    },
    async addImg (data) {
      await this.contentForm.data.push({
        type: 'image',
        value: data,
        key: Date.now()
      })
      this.scrollIntoView()
    },
    async addAudio (data, duration) {
      let template = {
        type: 'audio',
        // eslint-disable-next-line
        value: (window.URL || webkitURL).createObjectURL(data),
        duration: parseInt(duration / 1000),
        key: Date.now()
      }
      await this.contentForm.data.push(template)
      let returnData = await this.addText('ocrText')
      this.audioKey = returnData.key
      this.scrollIntoView()
      return returnData
    },
    async addText (type = 'text', key = null) {
      let returnPosition = 0
      let data = this.contentForm.data
      let template = {
        type: type,
        value: '',
        key: Date.now()
      }
      if (key) {
        let index = this.contentForm.data.findIndex(e => e.key === key) + 1
        await data.splice(index, 0, template)
        returnPosition = index + 1
      } else {
        let position = await data.push(template)
        returnPosition = position - 1
      }
      this.scrollIntoView()
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
    async imageOcr (event, key) {
      let loading = this.$loading({
        target: event.currentTarget,
        lock: true,
        text: '图像识别中',
        background: 'rgba(0, 0, 0, 0.8)'
      })
      let returnData = await this.addText('ocrText', key)
      let imgUrl = event.currentTarget.querySelector('.el-image>img').src
      let sendData = await this.imageToBase64(imgUrl)
      let config = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
      let resData = await this.axios.post('/imageocr', sendData, config)
      let orcResult = resData.data.words_result.map(e => e.words).join('\n')
      this.contentForm.data[returnData.position].value = orcResult
      loading.close()
    },
    // 语音识别
    async recordingOcr (value = '') {
      let key = this.audioKey
      let index = await this.contentForm.data.findIndex(e => e.key === key)
      this.contentForm.data[index].value = value
      this.audioKey = 0
    },
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
