<template>
    <view class="container">
        <view class="tips" v-if="!plain">
          「链记」所有数据均加密存储，只有本人能够解密或授权第三方查看明文，确保数据隐私安全。下方为日记加密后存储在存储服务商中的数据。
        </view>
        <view class="title" v-if="!plain && imgList.length > 0">图片</view>
        <view class="uploadImg" v-if="!readOnly">
          <view @tap="previewImage(key)" v-for="(item,key) in imgList" :key="key" class="updateImageItem">
            <image class="uploadImage" v-if="item.base64" :src="item.base64" mode='aspectFill' :lazy-load="true"></image>
            <view class="loadingImage" v-else :src="item.base64" mode='aspectFill' :lazy-load="true">图片解密中...</view>
            <image @tap.stop="deleteImg(key)" class="close" src="../../static/close.png"></image>
          </view>
          <view class="uplaodImgBtn" @tap="chooseImage" v-if="imgList.length < 9">
            <image src="../../static/add.png"></image>
          </view>
        </view>
        <my-swiper :plain="plain" @previewImage="previewImage" :imgList="imgList" v-else-if="imgList.length && readOnly" />
        <picker mode="date" @change="dateChange" :disabled="readOnly">
          <view class="date">{{date.timeTodate('m月d日 . Y',time)}}</view>
        </picker>
       <view>
         <view class="title" v-if="!plain && diarySecret.length > 0">正文</view>
          <editor
            v-if="plain"
            :class="{minHeight: keyboardHeight === 0}"
            :style="{height: editorHeight, minHeight: editorHeight}"
            id="editor"
            class="editorContainer"
            :readOnly="readOnly"
            @statuschange="onStatuschange"
            :placeholder="readOnly ? '' : placeholder"
            @input="onInput"
            @ready="onEditorReady">
          </editor>
          <view class="secret" v-else>
            {{diarySecret}}
          </view>
       </view>
        <view v-if="readOnly" class="format editorBox" :class="{fullScreen}">
          <i class="iconfont icon icon-bianjix" @touchend.stop="onEditor"></i>
          <i class="icon iconfont icon-zux6" v-if="plain" @tap="changePlain"></i>
          <i class="icon iconfont icon-zux5" v-else @tap="changePlain"></i>
          <i class="iconfont icon icon-shanchux" @tap="onDelete"></i>
        </view>
        <view v-else class="">
          <view v-if="keyboardHeight > 0" class="format" :style="{bottom: isIOS ? (keyboardHeight+'px') : 0}">
            <i class="icon iconfont icon-zux4" :class="{bold}" @touchend.stop="blod" ></i>
            <i class="icon iconfont icon-zux3" @tap="blur"></i>
          </view>
          <my-button class="button" :class="{fullScreen}" v-else text="完成" borderRadius="none" @tap="finish"/>
        </view>
    </view>
</template>

<script>
  const FileSystemManager = wx.getFileSystemManager()
  import endianCode from 'endian-code'  
  import { NoteCall } from '../../utils/serve'
  import { iphones } from '../../utils/config'
  import MyButton from '../../components/MyButton'
  import MySwiper from '../../components/MySwiper'
  import aes from '../../utils/aes'
  import date from '../../utils/date'
  import aesjs from 'aes-js';
  import secp256k1 from 'secp256k1'
  import wxApi from '../../utils/wx'
  import { encrypt, decrypt, PrivateKey } from 'eciesjs'
  import * as bip39 from 'bip39'
  import * as bip32 from 'bip32';
  import sha256 from 'sha256'
  import html2md from 'html-to-md'

  export default {
      data() {
        return {
          imgList: [],
          date,
          diarySecret: '',
          plain: true,
          time: new Date().getTime(),
          fullScreen: false,
          editorCtx:{},
          formats: {},
          content: '',
          readOnly: false,
          placeholder: '写下你的今天...',
          editorHeight: 300,
          keyboardHeight: 0,
          isIOS: false
        }
      },
      computed:{
        bold() {
          return !!this.formats.bold
        },
        size() {
          return endianCode.encode(0x3e8, 4, false)
        }
      },
      components: {
        MyButton,
        MySwiper
      },
      async onLoad(options) {
        if (options.id) {
          let content = wxApi.getStorageSync('diary')
          const diarySecret = wxApi.getStorageSync('diarySecret')
          console.log('this.diarySecret')
          if (diarySecret) {
            this.diarySecret = aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(diarySecret))
          }
          content = JSON.parse(content)
          this.content = content.html
          this.time = content.time
          this.readOnly = true
          let id = Number(options.id).toString(16)
          this.id = endianCode.encode(id, 4, false)
          if (content.imgList && content.imgList.length) {
            this.imgList = content.imgList.map(item => {
              return { attachmentEncHash: item }
            })
            this.getFileLisSync()
          }
        }
        const { platform, safeArea, screenHeight } = wx.getSystemInfoSync()
        this.fullScreen = screenHeight - safeArea.height > 40
        const isIOS = platform === 'ios'
        this.isIOS = isIOS
        this.updatePosition(0)
        let keyboardHeight = 0
        let that = this
        wx.onKeyboardHeightChange(res => {
          if (res.height === keyboardHeight) return
          const duration = res.height > 0 ? res.duration * 1000 : 0
          keyboardHeight = res.height
          setTimeout(() => {
            wx.pageScrollTo({
              scrollTop: 0,
              success() {
                that.updatePosition(keyboardHeight)
                that.editorCtx.scrollIntoView()
              }
            })
          }, duration)
        })
      },
      methods: {
        changePlain() {
          this.plain = !this.plain
          if(!this.plain) {
            uni.setNavigationBarTitle({
              title: '密文'
            });
          } else {
            uni.setNavigationBarTitle({
              title: ''
            });
          }
        },
        async getFileLisSync() {
          if (this.imgList && this.imgList.length) {
            this.imgList.forEach(async (item, index) => {
              const data = await this.getFileSync(item.attachmentEncHash)
              this.$set(this.imgList, index, data)
            })
          }
        },
        async getFileSync(hash) {
          let params = this.getFile(hash)
          const data = await NoteCall(params)
          let contentEnc = new Buffer(data.resourceEnc, "hex")
          return {
            base64: 'data:image/jpeg;base64,' + uni.arrayBufferToBase64(decrypt(this.$store.state.dialryPrivateKey, contentEnc)),
            attachmentEncHash: hash,
            secret: data.resourceEnc
          }
        },
        chooseImage(){
          if (this.imgList.length >= 9) return uni.showToast({ title: '最多上传12张图片',duration: 2000 });
          uni.chooseImage({
            count: 9 - this.imgList.length, //默认9
            sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], //从相册选择
            success: (res) => {
              res.tempFilePaths.map(item => {
                this.imgList.push({
                  base64: item
                }) 
              })
            }
          })
        },
        async saveImg() {
          await Promise.all(this.imgList.map(async item => {
            if(!item.attachmentEncHash) {
              const fileData = FileSystemManager.readFileSync(item.base64)
              let params = this.saveFile(fileData)
              const data = await NoteCall(params, '处理中...')
              item.attachmentEncHash = data.attachmentEncHash
              this.clearFile()
            }
          }))
        },
        clearFile() {
           wx.getSavedFileList({  // 获取文件列表
              success (res) {
                res.fileList.forEach((val, key) => { // 遍历文件列表里的数据
                    // 删除存储的垃圾数据
                  wx.removeSavedFile({
                      filePath: val.filePath
                  });
                })
              }
            })
        },
        deleteImg(key) {
          this.imgList.splice(key, 1)
        },
        previewImage(index) {
          uni.previewImage({
              urls: this.imgList.map(item => item.base64),
              current: index,
              longPressActions: {
                  itemList: ['发送给朋友', '保存图片', '收藏'],
                  success: function(data) {
                    console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
                  },
                  fail: function(err) {
                    console.log(err.errMsg);
                  }
              }
          });
        },
        dateChange(event) {
          this.time = new Date(event.detail.value).getTime()
        },
        getFile(hash) {
          hash = new Buffer(hash, "hex")
          let message = [6, ...hash]
          let signature = sha256(message, { asBytes: true })
          signature = Uint8Array.from(signature)
          let privateKey = new Buffer(this.$store.state.privateKey, "hex")
          const sigObj = secp256k1.ecdsaSign(signature, privateKey)
          let txHex = [...this.$store.state.publicKey, ...sigObj.signature, ...message]
          txHex = aesjs.utils.hex.fromBytes(txHex)
          let blobHex = ''
          return {
            txHex,
            blobHex
          }
        },
        saveFile(content) {
          content = new Buffer(content)
          const data = encrypt(this.$store.state.dialryPublicKey, content)
          let plaintext = sha256(content, { asBytes: true })
          let secret = sha256(data, { asBytes: true })
          let message = [].concat([5], plaintext, secret, this.$store.state.note)
          let signature = sha256(message, { asBytes: true })
          signature = Uint8Array.from(signature)
          let privateKey = new Buffer(this.$store.state.privateKey, "hex")
          const sigObj = secp256k1.ecdsaSign(signature, privateKey)
          let txHex = [...this.$store.state.publicKey, ...sigObj.signature, ...message]
          txHex = aesjs.utils.hex.fromBytes(txHex)
          let blobHex = aesjs.utils.hex.fromBytes(data)
          console.log(aesjs.utils.hex.fromBytes(secret))
          return {
            txHex,
            blobHex
          }
        },
        saveDiary(content) {
          content = new Buffer(content)
          const data = encrypt(this.$store.state.dialryPublicKey, content)
          let plaintext = sha256(content, { asBytes: true })
          let secret = sha256(data, { asBytes: true })
          let message = [].concat([2], plaintext, secret, this.$store.state.note)
          let signature = sha256(message, { asBytes: true })
          signature = Uint8Array.from(signature)
          let privateKey = new Buffer(this.$store.state.privateKey, "hex")
          const sigObj = secp256k1.ecdsaSign(signature, privateKey)
          let txHex = [...this.$store.state.publicKey, ...sigObj.signature, ...message]
          txHex = aesjs.utils.hex.fromBytes(txHex)
          let blobHex = aesjs.utils.hex.fromBytes(data)
          return {
            txHex,
            blobHex
          }
        },
        editorDiary(content) {
          content = new Buffer(content)
          const data = encrypt(this.$store.state.dialryPublicKey, content)
          let plaintext = sha256(content, { asBytes: true })
          let secret = sha256(data, { asBytes: true })
          let message = [].concat([3], this.id, plaintext, secret, this.$store.state.note)
          let signature = sha256(message, { asBytes: true })
          signature = Uint8Array.from(signature)
          let privateKey = new Buffer(this.$store.state.privateKey, "hex")
          const sigObj = secp256k1.ecdsaSign(signature, privateKey)
          let txHex = [...this.$store.state.publicKey, ...sigObj.signature, ...message]
          txHex = new Uint8Array(txHex)
          txHex = aesjs.utils.hex.fromBytes(txHex)
          let blobHex = aesjs.utils.hex.fromBytes(data)
          return {
            txHex,
            blobHex
          }
        },
        deleteDiary() {
          let message = [].concat([4], this.id, this.$store.state.note)
          let signature = sha256(message, { asBytes: true })
          signature = Uint8Array.from(signature)
          let privateKey = new Buffer(this.$store.state.privateKey, "hex")
          const sigObj = secp256k1.ecdsaSign(signature, privateKey)
          let txHex = [...this.$store.state.publicKey, ...sigObj.signature, ...message]
          txHex = aesjs.utils.hex.fromBytes(txHex)
          let blobHex =  '';
          return {
            txHex,
            blobHex
          }
        },
        async finish() {
          uni.showLoading({
            title: '加载中',
            mask: true
          });
          if (this.imgList.length) {
            await this.saveImg()
            const noHasHash = this.imgList.filter(item => !item.attachmentEncHash)
            if (noHasHash.length) return uni.showToast({
              title: '图片上传未完成',
              icon: "none",
              duration: 2000
            });
          }
          this.editorCtx.getContents({
            success: async (e) => {
              let params
              if (!e.text.trim(' ')) {
                if (this.imgList.length > 0) {
                  e.html = ''
                  e.text = ''
                } else {
                  return uni.showToast({
                    title: '输入不能为空！',
                    icon: 'none',
                    duration: 2000
                  });
                }
              }
              console.log(e.html)
              const md = html2md(e.html)
              let imgList = this.imgList.map(item => item.attachmentEncHash)
              let content = JSON.stringify({ html:e.html, text:e.text, time: this.time, imgList: imgList, md})
              if (this.id) {
                params = this.editorDiary(content)
              } else {
                params = this.saveDiary(content)
              }
              const data = await NoteCall(params, '处理中...')
              wxApi.setStorageSync('availableData', true)
              uni.hideLoading();
              uni.navigateBack();
            }
          })
        },
        readOnlyChange() {
          this.readOnly = !this.readOnly
        },
        format(e) {
          let { name, value } = e.target.dataset
          if (!name) return
          this.editorCtx.format(name, value)
        },
        updatePosition(keyboardHeight) {
          const { windowHeight, platform } = wx.getSystemInfoSync()
          let editorHeight = keyboardHeight > 0 ? ((windowHeight - keyboardHeight - 210) + 'px'): '100%'
          this.editorHeight = editorHeight
          this.keyboardHeight = keyboardHeight
        },
        onStatuschange(e) {
          const formats = e.detail
          this.formats = formats
        },
        onEditorReady() {
          uni.createSelectorQuery().select('#editor').context((res) => {
            this.editorCtx = res.context
            this.editorCtx.setContents({
              html: this.content
            })
          }).exec()
        },
        blod(e) {
          this.editorCtx.format('bold')
        },
        onInput() {
          console.log(arguments)
        },
        onEditor() {
          this.plain = true
          this.readOnly = false
        },
        async onDelete() {
          uni.showModal({
            title: '提示',
            content: '确定要删除本条日记吗',
            success: async (res) => {
              if (res.confirm) {
                let params = this.deleteDiary()
                const data = await NoteCall(params)
                wxApi.setStorageSync('availableData', true)
                uni.navigateBack();
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }
      }
  }
</script>

<style lang="stylus" scoped>
    .container {
      position absolute
      left 0
      top 0
      width 100%
      height 100vh
      overflow auto
      padding-bottom: 76px;
      box-sizing: border-box;
      .tips{
        margin 30upx 30upx
        font-size:22upx;
        padding 25upx 40upx 24upx 20upx
        box-sizing border-box
        font-weight:400;
        color:rgba(34,34,34,0.5);
        line-height:30upx;
        background:rgba(247,247,247,1);
        border-radius:18upx;
        overflow hidden
      }
      .title{
        font-size:26upx;
        font-weight:400;
        color:rgba(165,165,165,1);
        line-height:54upx;
        padding-left 30upx
      }
      .date{
        padding: 12px 13px 0 16px;
        font-size 22upx
        font-weight 400
        margin-bottom 15px
        margin-top 10px
        color rgba(165,165,165,1)
      }
      .uploadImg{
        height 92px
        padding 7px 20px
        display flex
        flex-wrap nowrap 
        overflow-x scroll
        scrollbar none 
        .updateImageItem{
          height 90px
          width 90px
          flex-shrink 0
          margin-right 20upx
          position relative
          .uploadImage{
            height 100%
            width 100%
          }
          .loadingImage{
            height 100%
            width 100%
            background-color #F6F6F6
            font-size:26upx;
            text-align center
            color:rgba(165,165,165,1);
            line-height 90px
          }
          .close{
            height 20px
            width 20px
            border-radius 100%
            position absolute
            top -5px
            right -5px
          }
        }
        .uplaodImgBtn{
          height 90px
          width 90px
          flex-shrink 0
          position relative
          border 1px solid #f7f7f7
          image{
            height 45px
            width 45px
            position absolute
            left 0
            right 0
            bottom 0
            top 0
            margin auto
          }
        }
      }
      .editorContainer{
        padding: 0 13px 0 16px;
        width: 100%;
        height: auto;
        color:rgba(34,34,34,1);
        line-height:50upx;
        font-weight:400;
        font-size:26upx;
        box-sizing border-box
        &.minHeight{
          min-height 200px !important
        }
      }
      .secret{
        font-size:26upx;
        font-weight:400;
        color:rgba(34,34,34,1);
        line-height:50upx;
        margin 0 50upx
        box-sizing border-box
        overflow hidden
        word-break: keep-all;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
       .format{
          height: 50px;
          width: 100%;
          position: fixed;
          left: 0;
          right: 100%;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-around;
          border-left: none;
          border-right: none;
          display flex
          background:rgba(255,255,255,1);
          &.editorBox {
            border: 1px solid #ECECEC;
            box-shadow:0upx -1upx 24upx 0upx rgba(76,75,89,0.12);
          }
          &.fullScreen{
            padding-bottom 34px
          }
          .icon{
            flex-grow 1
            height: 75upx;
            font-size 50upx;
            line-height 75upx;
            text-align center
            &.bold{
              font-weight 900
            }
          }
        }
        .button{
          bottom 0
          position fixed 
          width 100vw
          background-color #222
          &.fullScreen{
            padding-bottom 68upx
          }
        }
    }
</style>