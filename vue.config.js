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
        target: "https://notes.sxisa.com",
        pathRewrite: { '^/imageocr': '/imageocr' },
        changeOrigin: true
      },
      '/v1': {
        target: "http://112.74.205.153:8080",
        pathRewrite: { '^/v1': '/v1' },
        changeOrigin: true
      }
    },
    disableHostCheck: true
  },
  pwa: {
    themeColor: "#52AEF9",
    msTileColor: "#52AEF9",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    iconPaths: {
      favicon32: 'public/img/icons/favicon-32x32.png',
      favicon16: 'public/img/icons/favicon-16x16.png',
      appleTouchIcon: 'public/img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'public/img/icons/safari-pinned-tab.svg',
      msTileImage: 'public/img/icons/msapplication-icon-144x144.png'
    },
    workboxOptions: {
      // InjectManifest 模式下 swSrc 是必填的。
      swSrc: 'src/service-worker.js',
      // ...其它 Workbox 选项...
    }
  }
}
