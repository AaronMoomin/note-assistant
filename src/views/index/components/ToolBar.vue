<template>
  <el-container
    class="tool-bar"
    direction="vertical"
  >
    <!-- <div class="top">
      <span>智 能 云 笔 记</span>
    </div> -->
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
        :class="this.state.favorites ? 'active favorites':'favorites'"
        size="mini"
        circle
        :disabled="searchState"
        @click="getData('favorites')"
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
        favorites: false,
        sort: false
      },
      search: {
        name: 'search',
        value: '',
        method: 'getSearchNote'
      },
      favorites: {
        name: 'favorites',
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
      if (_data.name === 'favorites') {
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
      if (value.length === 0) {
        this.state.search = false
        this.$bus.$emit(this.search.method)
      } else {
        this.state.search = true
        this.state.favorites = false
        this.state.sort = false
      }
    }
  },
  created () {
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.top
  text-align center
  font-size 2.2rem
  padding-bottom 5px
.bottom
  display flex
  .el-button
    margin-left 5px
    color $darkGreyColor
    border-color $darkGreyColor
  .favorites.active
    color $orangeColor
    border-color $orangeColor
  .sort.active
    color $blueColor
    border-color $blueColor
</style>
