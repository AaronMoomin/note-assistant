<template>
  <el-container class="content">
    <el-form
      ref="contentForm"
      :model="contentForm"
    >
      <el-form-item
        v-for="(item) in contentForm.data"
        :key="item.key"
      >
        <el-input
          v-if="item.type === 'text' || item.type === 'ocrText'"
          :readonly="isRead"
          type="textarea"
          :rows="2"
          autosize
          :placeholder="item.type === 'ocrText' ? '正在识别中...':'请输入内容'"
          v-model="item.value"
        ></el-input>
        <div
          v-else-if="item.type ==='image'"
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
  data () {
    return {
      imgTest: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1591797306,3433247737&fm=26&gp=0.jpg',
      contentForm: {
        data:
          [
            {
              type: 'text',
              value: ''
            },
            {
              type: 'image',
              value: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
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
    async addText (type = 'text', key = null) {
      let position
      let data = this.contentForm.data
      let template = {
        type: type,
        value: '',
        key: Date.now()
      }
      if (key) {
        let index = this.contentForm.data.findIndex(e => e.key === key) + 1
        await data.splice(index, 0, template)
        position = index + 1
      } else {
        position = await data.push(template)
      }
      this.scrollIntoView()
      return position - 1
    },
    async addImg (data) {
      await this.contentForm.data.push({
        type: 'image',
        value: data,
        key: Date.now()
      })
      this.scrollIntoView()
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
      let position = await this.addText('ocrText', key)
      let imgUrl = event.currentTarget.querySelector('.el-image>img').src
      let sendData = await this.imageToBase64(imgUrl)
      let config = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
      let resData = await this.axios.post('/imageocr', sendData, config)
      let orcResult = resData.data.words_result.map(e => e.words).join('\n')
      this.contentForm.data[position].value = orcResult
      loading.close()
    }
  },
  mounted () {
    // 监听事件
    this.$bus.$on("addText", () => {
      this.addText()
    })
    this.$bus.$on("addImg", data => {
      this.addImg(data)
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
  overflow auto
  .el-form
    width 100%
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
</style>
