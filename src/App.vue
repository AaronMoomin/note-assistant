<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  mounted () {
    // 判断是否为微信
    let isWeiXin = () => { return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1 }
    if (isWeiXin()) {
      this.$alert('为了更好的使用体验 请在浏览器中打开', '温馨提示', {
        confirmButtonText: '确定',
      })
    }
    // 禁止Safari缩放
    let lastTime = 0
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    })
    document.addEventListener('touchend', function (event) {
      var nowTime = (new Date()).getTime()
      if (nowTime - lastTime <= 300) {
        event.preventDefault();
      }
      lastTime = nowTime
    }, false)
    document.addEventListener('gesturestart', function (event) {
      event.preventDefault();
    })
  }
}
</script>

<style lang="stylus">
@import '~styles/global.styl'
#app
  height 100%
  background-color $lightBlueColor
</style>
