<template>
  <el-container
    class="tool-bar"
    direction="vertical"
  >
    <!-- <svg
      width="100vw"
      height="200"
      id="radian"
    >
      <circle
        cx="50vw"
        cy="-400"
        r="540"
        fill="#52AEF9"
      />
    </svg> -->
    <div class="top">
      <span>智能云笔记</span>
    </div>
    <div class="bottom">
      <el-input
        v-model="search.value"
        autocomplete="off"
        @input="searchInput"
        clearable
      >
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
          @click="searchNotes"
        />
      </el-input>
      <el-button
        :class="this.state.favorite ? 'active favorite':'favorite'"
        size="mini"
        circle
        :disabled="searchState"
        @click="getData('favorite')"
      >
        <icon-font iconCode="icon-shoucang1" />
      </el-button>
      <el-button
        :class="this.state.sort ? 'active sort':'sort'"
        size="mini"
        circle
        :disabled="searchState"
        @click="getData('sort')"
      >
        <icon-font iconCode="icon-paixu3" />
      </el-button>
    </div>
  </el-container>
</template>

<script>

export default {
  name: 'ToolBar',
  data () {
    return {
      state: {
        search: false,
        favorite: false,
        sort: false
      },
      search: {
        name: 'search',
        value: '',
        method: 'getSearchNote'
      },
      favorite: {
        name: 'favorite',
        method: 'getFavoriteNote'
      },
      sort: {
        name: 'sort',
        method: 'getNoteListDesc'
      }
    }
  },
  computed: {
    searchState () {
      return this.state.search
    }
  },
  methods: {
    getData (data) {
      let _data = this[data]
      let _state = this.state
      _state[data] = !_state[data]
      this.$bus.$emit(_data.method, _state)

      // 收藏 && 排序 => 取消收藏 排序自动取消
      // 排序 => 点击收藏 排序自动取消
      if (_data.name === 'favorite') {
        if (!_state[_data.name] || (_state[_data.name] && _state['sort'])) {
          _state['sort'] = false
        }
      }
    },
    async searchNotes () {
      let search = this.search
      this.$bus.$emit(search.method, search.value)
    },
    searchInput (value) {
      if (!value) {
        let search = this.search
        this.state.search = false
        this.$bus.$emit(search.method)
      } else {
        this.state.search = true
        this.state.favorite = false
        this.state.sort = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.tool-bar
  height 100px
  #radian
    position absolute
    top 0
    left 0
    z-index 0
  .top
    text-align center
    font-size 2.2rem
    color $whiteColor
    margin-bottom 12px
    letterSpacing 0.7rem
    z-index 1
  .bottom
    display flex
    z-index 1
    .el-button
      margin-left 5px
      color $darkGreyColor
      border-color $darkGreyColor
    .favorite.active
      color $orangeColor
      border-color $orangeColor
    .sort.active
      color $blueColor
      border-color $blueColor
</style>
