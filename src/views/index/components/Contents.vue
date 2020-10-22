<template>
  <el-container
    class="content"
    direction="vertical"
    v-infinite-scroll="lazyLoad"
    infinite-scroll-distance="100"
    :infinite-scroll-disabled="lazyLoadDisabled"
  >
    <router-link
      v-for="item in data"
      :key="item.id"
      :to="'/editor/'+item.id"
    >
      <el-card>
        <div class="card-header">
          <div class="title">
            {{item.title}}
          </div>
          <div
            v-if="item.favorites"
            class="favorites"
          >
            <icon-font iconCode="icon-shoucang1" />
          </div>
        </div>
        <div class="card-content">
          {{item.abstract}}
        </div>
        <div class="card-footer">
          <span class="date">{{item.date}}</span>
          <span class="time">{{item.time}}</span>
        </div>
      </el-card>
    </router-link>
    <div class="message">
      {{lazyLoadDisabled?'没有更多了':'加载中...'}}
    </div>

  </el-container>
</template>

<script>
export default {
  name: 'Content',
  data () {
    return {
      search: '',
      currentPage: 1,
      noteCount: 0,
      index: 0,
      currentGetUrl: '',
      data: [
        {
          id: 1,
          favorites: true,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 2,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 3,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 4,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 5,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 6,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 7,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 8,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 9,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 10,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 11,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 12,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        },
        {
          id: 13,
          favorites: false,
          title: '测试',
          abstract: '这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字,这是一段测试文字',
          date: '2020-10-05',
          time: '下午6:36'
        }
      ],
      noteList: {
        asc: 'getNoteList',
        desc: 'getNoteListDesc'
      },
      favoriteNoteList: {
        asc: 'getFavoriteNote',
        desc: 'getFavoriteNoteDesc'
      },
      searchNoteList: {
        asc: 'getSearchNoteList'
      }
    }
  },
  computed: {
    lazyLoadDisabled () {
      return this.data.length === this.noteCount
    }
  },
  methods: {
    // 初始化
    init () {
      this.getNoteList()
    },
    // page === 0 时 代表获取所有页数笔记
    async getDataList (url = this.noteList.asc, page = 1, searchData = null) {
      let data = {
        params: {
          page: page
        }
      }
      if (searchData) {
        data.params.searchData = searchData
      }
      let resData = await this.axios.get(`/v1/${url}`, data)
      if (resData.data.status) {
        this.data.push(resData.data.data.data)
        this.noteCount = resData.data.data.noteCount
      } else {
        this.$message({
          message: resData.data.msg,
          type: 'error'
        })
      }
    },
    lazyLoad () {
      let url
      this.currentGetUrl.length === 0 ? url = this.noteList.asc : url = this.currentGetUrl
      this.getDataList(url, this.$isServer + 1)
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 收藏
    this.$bus.$on("getFavoriteNote", (data) => {
      let url = null
      data.favorites ? url = this.favoriteNoteList.asc : url = this.noteList.asc
      this.currentGetUrl = url
      this.getDataList(url)
    })
    // 排序
    this.$bus.$on("getNoteListDesc", (data) => {
      let url = null
      if (data.sort) {
        data.favorites ? url = this.favoriteNoteList.desc : url = this.noteList.desc
      } else {
        data.favorites ? url = this.favoriteNoteList.asc : url = this.noteList.asc
      }
      this.getDataList(url)
    })
    // 搜索
    this.$bus.$on("getSearchNote", (data) => {
      let url = null
      data ? url = this.searchNoteList.asc : url = this.noteList.asc
      this.getDataList(url, 0, data)
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.el-card
  margin-bottom 8px
  .card-header
    display flex
    justify-content space-between
    align-items center
    padding-bottom 2px
    .title
      font-size 1.6rem
      font-weight 700
    .favorites
      color $orangeColor
      font-size 1.4rem
  .card-content
    height 48px
    overflow hidden
    text-overflow ellipsis
    word-break break-all
    display -webkit-box
    -webkit-box-orient vertical
    -webkit-line-clamp 3
    font-size 1.2rem
    padding-bottom 2px
    color $darkGreyColor
  .card-footer
    display flex
    justify-content space-between
    font-size 1rem
    color $lightGreyColor
.message
  text-align center
  margin-top 10px
  letterSpacing(0.1rem)
</style>
