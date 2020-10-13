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
    <image-drawer ref="imageDrawer" />
    <el-popover
      placement="bottom"
      width="200"
      trigger="manual"
      content="正在录音中..."
      v-model="visible"
    >
      <icon-font
        iconCode="icon-yuyin1"
        class="recording"
        v-longpress="recording"
        slot="reference"
      />
    </el-popover>
    <icon-font
      iconCode="icon-bianjiqianbixieshuru2"
      class="text"
      @click.native="text"
    />
  </el-container>
</template>

<script>
import ImageDrawer from './ImageDrawer'

export default {
  name: 'Editor',
  components: {
    ImageDrawer
  },
  directives: {
    // 长按指令
    longpress: {
      bind: function (el, binding, vnode) {
        let pressTimer = null

        // 创建计时器
        let start = (e) => {
          if (e.type === 'click' && e.button !== 0) return false
          if (pressTimer === null) {
            pressTimer = setTimeout((e) => {
              binding.value(e)
            }, 200)
          }
        }

        // 取消计时器
        let cancel = () => {
          // 检查是否有正在运行的计时器
          if (pressTimer !== null) {
            vnode.context.visible = false
            clearTimeout(pressTimer)
            pressTimer = null
          }
        }

        // 添加事件监听器
        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);

        // 取消计时器
        el.addEventListener("click", cancel);
        el.addEventListener("mouseout", cancel);
        el.addEventListener("touchend", cancel);
        el.addEventListener("touchcancel", cancel);
      }

    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    changMode () {
      this.$emit("changMode", "editor")
    },
    // 图像
    image () {
      console.log(this.$refs.ImageDrawer)
      this.$refs.imageDrawer.changeDrawerState()
      this.$nextTick(() => {
        let cameraUpload = document.querySelector('.camera-upload>.el-upload>input')
        cameraUpload.setAttribute('capture', 'capture')
        cameraUpload.setAttribute('accept', 'image/*')
        let albumUpload = document.querySelector('.album-upload>.el-upload>input')
        albumUpload.setAttribute('accept', 'image/*')
      })
    },
    // 录音
    recording () {
      this.visible = true
      if (navigator.vibrate) return navigator.vibrate(100)
    },
    // 文本
    text () {
      this.$bus.$emit('addText')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.editor-bar
  -webkit-user-select none
  -moz-user-select none
  -ms-user-select none
  user-select none
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
</style>
