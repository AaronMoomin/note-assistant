<template>
  <svg
    class="icon"
    aria-hidden="true"
  >
    <use :xlink:href="'#'+iconCode"></use>
  </svg>
</template>
   
<script>
// import '@/assets/iconfont/iconfont.js'

export default {
  name: "IconFont",
  props: {
    iconCode: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="stylus" scoped>
.icon
  width 1em
  height 1em
  vertical-align -0.15em
  fill currentColor
  overflow hidden
</style>