<template>
  <el-container
    class="bar"
    direction="horizontal"
  >
    <router-link
      to="/index"
      active-class="bar-active"
    >
      <icon-font
        iconCode="icon-zhuye"
        class="home"
      />
    </router-link>
    <router-link
      to="/editor"
      active-class="bar-active"
    >
      <icon-font
        iconCode="icon-add-fill"
        class="add"
      />
    </router-link>
    <router-link
      to="/user"
      active-class="bar-active"
    >
      <icon-font
        iconCode="icon-geren"
        class="user"
      />
    </router-link>
  </el-container>
</template>

<script>
export default {
  name: 'Bar',
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.bar
  justify-content space-around
  align-items center
  background-color $whiteColor
  padding 0.5rem 0
  border-radius 30px
  box-shadow 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  .bar-active>svg
    color $blueColor
  .home, .user
    font-size 2rem
    color $darkBlueColor
    &:hover
      color $blueColor
  .add
    font-size 3.8rem
    color $blueColor
</style>
