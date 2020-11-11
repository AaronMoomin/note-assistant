<template>
  <el-container
    class="content"
    direction="vertical"
    v-infinite-scroll="lazyLoad"
    infinite-scroll-distance="100"
    infinite-scroll-delay="400"
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
            v-if="item.favorite"
            class="favorite"
          >
            <icon-font iconCode="icon-shoucang1" />
          </div>
        </div>
        <div class="card-content">
          {{item.summary}}
        </div>
        <div class="card-footer">
          <span class="date">{{formatDate(item.date)}}</span>
          <span class="time">{{formatTime(item.date)}}</span>
        </div>
      </el-card>
    </router-link>
    <div
      class="message"
      v-show="data.length >=10"
    >
      {{lazyLoadDisabled?'没有更多了':'加载中...'}}
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'Content',
  data () {
    return {
      searchKey: '',
      currentPage: 1,
      noteCount: 0,
      index: 0,
      currentGetUrl: '',
      data: [],
      noteList: {
        method: 'get',
        url: {
          asc: 'getNoteList',
          desc: 'getNoteListDesc'
        }
      },
      favoriteNoteList: {
        method: 'get',
        url: {
          asc: 'getFavoriteNote',
          desc: 'getFavoriteNoteDesc'
        }
      },
      searchNoteList: {
        method: 'post',
        url: {
          asc: 'searchNote'
        }
      },
      lazyLoadDisabled: false
    }
  },
  methods: {
    // 初始化
    init () {
      this.getDataList()
    },
    async getDataList (url = this.noteList.url.asc, page = 1, searchKey = this.searchKey) {
      let method = searchKey.length === 0 ? 'get' : 'post'
      let data
      searchKey.length === 0 ? data = {
        params: {
          page: page
        }
      } : data = {
        title: searchKey,
        page: page
      }
      let resData = await this.axios[method](`/v1/${url}`, data)
      if (resData.data.status) {
        let data = resData.data.data
        data.length !== 10 ? this.lazyLoadDisabled = true : this.lazyLoadDisabled = false
        if (page === 1) {
          this.data = data
        } else {
          this.data = this.data.concat(data)
        }
      } else {
        this.$message({
          message: resData.data.msg,
          type: 'error'
        })
      }
    },
    lazyLoad () {
      let url
      if (this.data.length) {
        this.currentGetUrl.length === 0 ? url = this.noteList.url.asc : url = this.currentGetUrl
        this.getDataList(url, this.currentPage + 1)
      }
    },
    formatDate (timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month = new Date(timeStamp).getMonth() + 1
      let day = new Date(timeStamp).getDate() < 10 ? `0${new Date(timeStamp).getDate()}` : new Date(timeStamp).getDate()
      return `${year}-${month}-${day}`
    },
    formatTime (timeStamp) {
      let hours = new Date(timeStamp).getHours()
      let minutes = new Date(timeStamp).getMinutes() < 10 ? `0${new Date(timeStamp).getMinutes()}` : new Date(timeStamp).getMinutes()
      return `${hours}:${minutes}`
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // 收藏
    this.$bus.$on("getFavoriteNote", (data) => {
      let url = null
      data.favorite ? url = this.favoriteNoteList.url.asc : url = this.noteList.url.asc
      this.currentGetUrl = url
      this.currentPage = 1
      this.getDataList(url)
    })
    // 排序
    this.$bus.$on("getNoteListDesc", (data) => {
      let url = null
      if (data.sort) {
        data.favorite ? url = this.favoriteNoteList.url.desc : url = this.noteList.url.desc
      } else {
        data.favorite ? url = this.favoriteNoteList.url.asc : url = this.noteList.url.asc
      }
      this.currentGetUrl = url
      this.currentPage = 1
      this.getDataList(url)
    })
    // 搜索
    this.$bus.$on("getSearchNote", (data) => {
      let url = null
      this.searchKey = data ? data : ''
      data ? url = this.searchNoteList.url.asc : url = this.noteList.url.asc
      this.currentGetUrl = url
      this.currentPage = 1
      this.getDataList(url, this.currentPage, data)
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
    .favorite
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
