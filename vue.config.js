const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
    }
    Object.assign(config, {
      // 开发生产共同配置
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': resolve('src'),
          'styles': resolve('src/assets/styles')
        }
      }
    })
  },
  // webpack-dev-server 相关配置
  devServer: {
    proxy: {
      '/imageocr': {
        target: `https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token='24.fa80bf8ce4ac7249f62e1fa4c928b5fe.2592000.1605023270.282335-22805053'`,
        pathRewrite: { '^/imageocr': '' },
        changeOrigin: true
      },
      '/v1': {
        target: "",
        pathRewrite: { '^/v1': '/v1' },
        changeOrigin: true
      }
    },
    disableHostCheck: true
  }
}
