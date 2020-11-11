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
      >
        <!-- 图像 -->
        <div
          v-if="item.type ==='image'"
          class="image"
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
          class="audio"
          @click="broadcast($event,item.duration)"
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
          type="textarea"
          :rows="2"
          autosize
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
    noteData: Object
  },
  data () {
    return {
      contentForm: this.noteData
    }
  },
  methods:{
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
