<template>
  <el-popover
    placement="top"
    width="200"
    trigger="manual"
    v-model="visible"
    popper-class="recording-popover"
    @show="recordingInit"
    @after-enter="waveview"
    @hide="recStop"
  >
    <div class="wave-view"></div>
    <span slot="reference">
      <slot name="down"></slot>
    </span>
  </el-popover>
</template>
   
<script>
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/wav'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'
//由于大部分情况下ios-weixin的支持需要用到amr解码器，应当把amr引擎也加载进来
import 'recorder-core/src/engine/beta-amr'
import 'recorder-core/src/engine/beta-amr-engine'

export default {
  name: "RecordingPopover",
  data () {
    return {
      visible: false,
      recPermission: false,
      type: "wav",
      bitRate: 16,
      sampleRate: 16000,
      rec: 0,
      duration: 0,
      powerLevel: 0,
      ws: "",
      len: 0,
      handlerInterval: "",
      APPID: '5f745081',
      API_SECRET: '1913beee8aebdc57ebbecfb985cf7d36',
      API_KEY: '510773fedfb0d70a05612fc01da78caf',
      language: 'zh_cn',
      accent: 'mandarin',
      // 记录音频数据
      audioData: [],
      // 记录听写结果
      resultText: '',
      uploadSettings: {
        detail: {
          // 上传地址
          action: 'https://upload-z2.qiniup.com',
          domain: 'https://notes.cdn.librejo.cn/',
          token: ''
        }
      },
    }
  },
  methods: {
    // 获取上传token
    async getToken () {
      let resData = await this.axios.post('/v1/getToken')
      this.uploadSettings.detail.token = resData.data.data
    },
    // 改变弹出框状态
    changePopoverState (data) {
      this.visible = data
    },
    // 超时提醒
    overtimeMessage () {
      this.$message({
        message: '录音时长不得超过60s',
        type: 'warning'
      })
    },
    // 录音初始化
    async recordingInit () {
      let _this = this
      // 构造函数，拿到Recorder的实例，然后可以进行请求获取麦克风权限和录音
      let rec = this.rec = Recorder({
        // 输出类型
        type: _this.type,
        // 比特率
        bitRate: _this.bitRate,
        // 采样率
        sampleRate: _this.sampleRate,
        // 接收到录音数据时的回调函数
        onProcess: function (buffers, powerLevel, duration, sampleRate) {
          // 已缓冲时长
          _this.duration = duration;
          // 当前缓冲的音量级别0-100
          _this.powerLevel = powerLevel;
          _this.wave.input(buffers[buffers.length - 1], powerLevel, sampleRate)
        }
      })

      //定时8秒后打开弹窗，用于监测浏览器没有发起权限请求的情况
      this.dialogInt = setTimeout(function () {
        _this.showDialog()
      }, 5000);

      // 请求打开录音资源
      rec.open(
        // success
        function () {
          _this.changePopoverState(true)
          _this.recPermission = true
          _this.dialogCancel()
          // 开始录音
          _this.recStart()
        },
        // fail
        function () {
          _this.dialogCancel()
          _this.$message({
            message: `授权失败:权限请求被拒绝`,
            type: 'error'
          })
        }
      )
    },
    recStart () {
      this.rec.start()
    },
    recStop () {
      let _this = this

      this.rec.stop(
        async function (blob, duration) {
          // 切割数据
          let cutData = new FileReader()
          cutData.readAsArrayBuffer(blob)
          _this.audioData = []
          cutData.onload = () => {
            _this.len = new Int8Array(cutData.result).length / 1280
            for (let i = 0; i <= _this.len; i++) {
              _this.audioData.push(new Int8Array(cutData.result).slice(1280 * i, (i + 1) * 1280))
            }
          }

          let url = _this.getHandShakeParams()
          _this.ws = new WebSocket(url)
          _this.ws.onopen = () => {
            setTimeout(() => {
              _this.webSocketSend()
            }, 500)
          }

          await _this.getToken()
          let uploadData = new FormData
          uploadData.append('token', _this.uploadSettings.detail.token)
          uploadData.append('file', blob)
          let resData = await _this.axios.post(_this.uploadSettings.detail.action, uploadData)
          let audioUrl = _this.uploadSettings.detail.domain + resData.data.key
          _this.$bus.$emit('addAudio', audioUrl, duration)

          _this.ws.onmessage = (e) => {
            let jsonData = JSON.parse(e.data)
            if (jsonData.code == 0) {
              // 握手成功
              let data = _this.getRecognitionResult(jsonData)
              _this.$bus.$emit('recordingOcr', data)
            } else if (jsonData.code == 2) {
              // 连接发生错误
              console.log("出错了:", jsonData)
            }
          }
        },
        function (s) {
          _this.$message({
            message: `录制失败:${s}`,
            type: 'error'
          })
        }, true)
      clearInterval(this.handlerInterval)
    },
    // 相关方法
    waitDialogClickFn () {
      this.dialogCancel()
      this.$message({
        message: "打开失败：权限请求被忽略，用户主动点击的弹窗",
        type: 'error'
      })
    },
    waitDialogClick () {
      this.dialogCancel()
      this.waitDialogClickFn()
    },
    // 移动端检测录音权限
    showDialog () {
      if (!/mobile/i.test(navigator.userAgent)) {
        return
      }
      this.$alert('录音功能需要麦克风权限,请允许!', '提示', {
        confirmButtonText: '确定'
      })
    },
    dialogCancel () {
      clearTimeout(this.dialogInt)
    },
    // 音波特效
    waveview () {
      this.wave = Recorder.WaveView({
        elem: ".el-popover>.wave-view",
        lineWidth: 2,
        linear1: [0, "rgba(150,96,238,1)", 0.5, "rgba(55,89,189,1)", 1, "rgba(53,199,253,1)"],
        linear2: [0, "rgba(209,130,255,0.6)", 1, "rgba(53,199,255,0.6)"],
        linearBg: [0, "rgba(255,255,255,0.2)", 1, "rgba(54,197,252,0.2)"]
      })
      let popover = document.querySelector('.el-popover.recording-popover')
      popover.style.top = `${parseInt(popover.style.top) - 20}px`
    },
    // 识别结果
    getRecognitionResult (resultData) {
      let resultText = ""
      let jsonData = resultData
      let data = jsonData.data.result
      let str = ''
      let ws = data.ws
      for (let i = 0; i < ws.length; i++) {
        str = str + ws[i].cw[0].w
      }
      resultText += str
      if (jsonData.code !== 0) {
        this.ws.close()
      }
      return resultText
    },
    toBase64 (buffer) {
      let binary = ''
      let bytes = new Uint8Array(buffer)
      let len = bytes.byteLength
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      return window.btoa(binary)
    },
    webSocketSend () {
      let appId = this.APPID
      let language = this.language
      let accent = this.accent
      let audioData = this.audioData
      let i = 0
      let params = {
        common: {
          app_id: appId,
        },
        business: {
          language: language, //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
          domain: 'iat',
          accent: accent, //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
          vad_eos: 5000,
          dwa: 'wpgs', //为使该功能生效，需到控制台开通动态修正功能（该功能免费）
        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
          audio: this.toBase64(audioData[i]),
        },
      }
      this.ws.send(JSON.stringify(params))
      this.handlerInterval = setInterval(() => {
        // websocket未连接
        if (this.ws.readyState !== 1) {
          this.audioData = []
          clearInterval(this.handlerInterval)
          return
        }
        if (Object.values(this.audioData).length === 0) {
          this.ws.send(
            JSON.stringify({
              data: {
                status: 2,
                format: 'audio/L16;rate=16000',
                encoding: 'raw',
                audio: '',
              },
            })
          )
          this.audioData = []
          clearInterval(this.handlerInterval)
          return false
        }
        this.ws.send(
          JSON.stringify({
            data: {
              status: 1,
              format: 'audio/L16;rate=16000',
              encoding: 'raw',
              audio: this.toBase64(audioData[i]),
            },
          })
        )
        i++
        if (i > this.len) {
          this.len = 0
          i = 0
          clearInterval(this.handlerInterval)
          this.ws.send(
            JSON.stringify({
              data: {
                status: 2,
                format: 'audio/L16;rate=16000',
                encoding: 'raw',
                audio: '',
              },
            })
          )
          return false
        }
      }, 40)
    },
    getHandShakeParams () {
      let url = 'wss://iat-api.xfyun.cn/v2/iat'
      let host = 'iat-api.xfyun.cn'
      let apiKey = this.API_KEY
      let apiSecret = this.API_SECRET
      let date = new Date().toGMTString()
      let algorithm = 'hmac-sha256'
      let headers = 'host date request-line'
      let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`
      let signatureSha = this.$cryptoJS.HmacSHA256(signatureOrigin, apiSecret)
      let signature = this.$cryptoJS.enc.Base64.stringify(signatureSha)
      let authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
      let authorization = btoa(authorizationOrigin)
      url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
      return url
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/global.styl'
.wave-view
  height 20px
  width 200px
  box-sizing border-box
  display inline-block
  vertical-align bottom
  -webkit-touch-callout none
  -webkit-user-select none
  -moz-user-select none
  -ms-user-select none
  user-select none
</style>