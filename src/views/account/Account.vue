<template>
  <transition
    name="slide-fade"
    mode="out-in"
  >
    <component
      class="account"
      :is="mode"
      @changMode="changMode"
    />
  </transition>
</template>

<script>
import Login from './components/Login'
import Register from './components/Register'

export default {
  name: 'Account',
  components: {
    Login,
    Register
  },
  data () {
    return {
      mode: 'login'
    }
  },
  methods: {
    changMode (data) {
      this.mode = data
    }
  }
}
</script>

<style lang="stylus" scoped>
.slide-fade-enter-active
  transition all 0.4s ease-in-out
.slide-fade-leave-active
  transition all 0.3s cubic-bezier(1, 0.5, 0.8, 1)
.slide-fade-enter, .slide-fade-leave-to
  transform translateX(320px)
  opacity 0
</style>
