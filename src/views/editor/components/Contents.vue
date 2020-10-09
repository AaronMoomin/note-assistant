<template>
  <el-container class="content">
    <!-- <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      v-model="content.textarea"
    >
    </el-input> -->
    <el-form
      :model="contentForm"
      ref="contentForm"
    >
      <el-form-item
        v-for="(text, index) in contentForm.text"
        :key="text.key"
        :prop="'text.' + index + '.value'"
      >
        <el-input
          :readonly="isRead"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="text.value"
        ></el-input>
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script>
export default {
  name: 'Content',
  props: {
    isRead: Boolean
  },
  data () {
    return {
      contentForm: {
        text: [{
          value: ''
        }]
      }
    }
  },
  methods: {
    addText () {
      this.contentForm.text.push({
        value: '',
        key: Date.now()
      })
    }
  },
  mounted () {
    // 监听事件
    this.$bus.$on("addText", () => {
      this.addText()
    })
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
  overflow auto
  .el-form
    width 100%
</style>
