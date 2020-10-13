<template>
    <div>
        <button @click="startBtn">开始录音</button>
        <button @click="stopBtn">停止录音</button>
        <textarea id="resultBox"></textarea>
    </div>
</template>

<script>
    import Recorder from 'recorder-core'
    import 'recorder-core/src/engine/wav'
    import 'recorder-core/src/engine/mp3-engine'
    //由于大部分情况下ios-weixin的支持需要用到amr解码器，应当把amr引擎也加载进来
    import 'recorder-core/src/engine/beta-amr'
    import 'recorder-core/src/engine/beta-amr-engine'
    export default {
        name: "test",
        data(){
            return{
                buffer: [],
                newBuffer:[],
                soundList:"",
                len:0,
                rec: Recorder({
                    type:"wav",
                    sampleRate:16000,
                    bitRate:16,
                    // onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate){}
                }),
                ws:"",
                handlerInterval:"",
                appId :'5f745081',
                apiKey :'936e14cf473536f146338f1cf0ba0270'
            }
        },
        mounted() {
            var that = this
            var recOpen=function(){//一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
                that.rec.open(function(){
                    console.log("已打开录音，可以点击开始了")
                    //rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
                },function(msg,isUserNotAllow){//用户拒绝未授权或不支持
                    // clearTimeout(t);
                    console.log((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg, 1)
                })
            }
            recOpen()
        },
        methods:{
            /**开始录音**/
            recStart(){//打开了录音后才能进行start、stop调用
                this.newBuffer = []
                this.rec.start()

            },
            setResult (data) {
                console.log("调用了setResult")
                let rtasrResult = []
                var currentText = document.getElementById("resultBox").innerHTML
                rtasrResult[data.seg_id] = data
                rtasrResult.forEach(i => {
                    let str = ""
                    str += (i.cn.st.type == 0) ? "|最终|" : "|中间|"
                    i.cn.st.rt.forEach(j => {
                        j.ws.forEach(k => {
                            k.cw.forEach(l => {
                                str += l.w
                            })
                        })
                    })
                    if (currentText.length == 0) {
                        if(str.substring(0,4) == "|最终|"){
                            this.soundList= this.soundList+(str.split("|最终|"))
                        }else{
                            // eslint-disable-next-line no-empty
                            if (!(/|中间|/g.test(str))){
                                this.soundList= this.soundList+((currentText+str).split("|最终|"))
                            }
                        }
                    } else {
                        if (/|中间|/g.test((currentText+"<br>"+str))){
                            if (str.substring(0,4)== "|最终|"){
                                this.soundList= this.soundList+(str.split("|最终|"))
                            }
                        }else {
                            this.soundList= this.soundList+(str.split("|最终|"))
                        }
                    }
                    console.log(this.soundList);
                    console.log(str);
                    document.getElementById("resultBox").innerHTML = this.soundList
                    var ele = document.getElementById("resultBox")
                    ele.scrollTop = ele.scrollHeight;
                })
            },
            /**结束录音**/
            recStop(){
                this.rec.stop((blob,duration) => {
                    //  var voiceToTextRes = ""
                    this.showRecordingBox = false
                    console.log(blob,window.URL.createObjectURL(blob),"时长:"+duration+"ms");
                    //this.rec.close();
                    // 释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
                    // this.rec=null;
                        var audio=document.createElement("audio");
                        audio.controls=true;
                        document.body.appendChild(audio);
                        // //简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
                        audio.src=window.URL.createObjectURL(blob);
                        audio.play();
                    var reader=new FileReader();
                    reader.onloadend=()=>{
                        var voiceRes = reader.result;
                        var VoiceData = new Int8Array(voiceRes)
                        this.len = VoiceData.length/1280
                        for(var i=0;i<=this.len;i++){
                            this.buffer.push(VoiceData.slice(1280*i,(i+1)*1280))
                            this.newBuffer.push(Object.values(JSON.parse(JSON.stringify(this.buffer))[i]))
                        }
                        console.log(new Int8Array(this.newBuffer[0]))
                        console.log(this.newBuffer[0])
                    }
                    var url = 'wss://rtasr.xfyun.cn/v1/ws'
                    var urlParam = this.getHandShakeParams()
                    url = `${url}${urlParam}`
                    this.ws = new WebSocket(url)
                    this.ws.onopen = ()=>{
                        var i=0
                        setTimeout(()=>{
                            if (this.ws.readyState !== 1) {
                                return
                            }
                            this.ws.send(new Int8Array(this.newBuffer[i]))
                            this.handlerInterval = setInterval(()=>{
                                // console.log("开始" + i + "次")
                                if (this.ws.readyState !== 1) {
                                    clearInterval(this.handlerInterval)
                                    return
                                }
                                this.ws.send(new Int8Array(this.newBuffer[i]))
                                if (i>this.len){
                                    clearInterval(this.handlerInterval)
                                    this.ws.send("{\"end\": true}")
                                    console.log("发送结束标识");
                                    this.len = 0
                                    i=0
                                }
                                i++
                            },40)
                        },500)
                    }
                    this.ws.onmessage = (e)=>{
                        let jsonData = JSON.parse(e.data)
                        console.log(jsonData);
                        if (jsonData.action == "started") {
                            // 握手成功
                            console.log("握手成功")
                            console.log(e.data)
                        } else if (jsonData.action == "result") {
                            // 转写结果
                            console.log("这是结果")
                            console.log(JSON.parse(jsonData.data))
                            this.setResult(JSON.parse(jsonData.data))
                        } else if (jsonData.action == "error") {
                            // 连接发生错误
                            console.log("出错了:",jsonData);
                        }
                    }
                    reader.readAsArrayBuffer(blob);
                },function(msg){
                    console.log("录音失败:"+msg);
                    this.rec.close(); //可以通过stop方法的第3个参数来自动调用close
                    // this.rec=null;
                });
            },
            startBtn(){
                console.log('start')
                this.recStart()
            },
            stopBtn(){
                console.log('stop')
                this.recStop()
                clearInterval(this.handlerInterval)
            },
            getHandShakeParams(){
                var appId = this.appId
                var secretKey = this.apiKey
                var ts = Math.floor(new Date().getTime()/1000)
                var signa = this.$md5(appId + ts)
                var signatureSha = this.$cryptoJS.HmacSHA1(signa, secretKey)
                var signature = this.$cryptoJS.enc.Base64.stringify(signatureSha)
                signature = encodeURIComponent(signature)
                return "?appid=" + appId + "&ts=" + ts + "&signa=" +signature + "&punc="+0;
            }
        }
    }
</script>

<style scoped>

</style>