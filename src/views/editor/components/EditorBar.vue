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
    <recording-popover ref="rcordingPopover">
      <icon-font
        slot="down"
        iconCode="icon-yuyin1"
        class="recording"
        v-longpress="recording"
      />
    </recording-popover>
    <icon-font
      iconCode="icon-bianjiqianbixieshuru2"
      class="text"
      @click.native="text"
    />
  </el-container>
</template>

<script>
import ImageDrawer from './ImageDrawer'
import RecordingPopover from './RecordingPopover'

export default {
  name: 'Editor',
  components: {
    ImageDrawer,
    RecordingPopover,
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
    }
  },
  methods: {
    changMode () {
      this.$emit("changMode", "editor")
    },
    // 图像
    image () {
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
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }
      // 获取录音权限
      // this.$refs.rcordingPopover.recordingInit()
      this.$refs.rcordingPopover.changePopoverState(true)
      // 检查录音权限
      // if (!this.recPermission) {
      //   this.$message({
      //     message: "请授权录音权限",
      //     type: 'warning'
      //   })
      //   return
      // }

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
