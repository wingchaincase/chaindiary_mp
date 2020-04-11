<template>
  <view class="content">
    <view class="imageBox">
      <image src="../../static/navigation.png" mode="" />
      <button class="buttonBox" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getuserinfo" :withCredentials="true">
        登录体验
      </button>
    </view>
    <view class="footer">基于链飞区块链技术的日记应用 链飞科技提供技术支持</view>
  </view>
</template>

<script>
import MyButton from '../../components/MyButton'
import wxApi from '../../utils/wx'
import { loginApi, NoteCall } from '../../utils/serve'
import { appId } from '../../utils/config'
import { encrypt, decrypt, PrivateKey } from 'eciesjs'
import aes from '../../utils/aes'
import aesjs from 'aes-js'
import sha256 from 'sha256'
import html2md from 'html-to-md'
import secp256k1 from 'secp256k1'
import * as bip39 from 'bip39'
import * as bip32 from 'bip32';
import { introduction } from '../../utils/config'
export default {
  data() {
    return {
      code: '',
      appId,
      iv: '',
      node: {},
      encryptedData: '',
      time: new Date().getTime(),
      introduction,
    }
  },
  components: {
    MyButton
  },
  onShow () {
    if (wx.canIUse('hideHomeButton')) {
      wx.hideHomeButton()
    }
  },
  onShareAppMessage: function (ops) {
    return {
      title: `最安全的日记软件`,
      path: `/pages/index/index`,
　　　 imageUrl: '../../static/share.png',     //自定义图片路径
      success: function (res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
  async onLoad() {
    wx.clearStorage()
    const code = await wxApi.login()
    this.code = code
  },
  methods: {
    remove0x(hex) {
      if (hex.startsWith("0x") || hex.startsWith("0X")) {
          return hex.slice(2);
      }
      return hex;
    },
    getIdentity () {
        return new Promise((resolve, reject) => {
          let child = this.node.derivePath("m/44'/4097'/0'/0")
          this.$store.commit('setPublicKey', child.publicKey)
          this.$store.commit('setPrivateKey', child.privateKey)
          resolve(child.publicKey)
        })
			},
			getDialryKey () {
        return new Promise((resolve, reject) => {
          let child = this.node.derivePath("m/44'/4097'/1'/0")
          this.$store.commit('setDialryPublicKey', child.publicKey)
          this.$store.commit('setDialryPrivateKey', child.privateKey)
          resolve(child.publicKey)
        })
			},
    async getuserinfo (value) {
      let mySend = wxApi.getStorageSync('mykey')
      wxApi.setStorageSync('userInfo', value.detail.rawData)
      // 生成 公私钥对
      const k1 = new PrivateKey()
      this.publicKey = this.remove0x(k1.publicKey.toHex())
      this.iv = value.detail.iv
      this.encryptedData = value.detail.encryptedData
      let data = await loginApi({
        appid: this.appId,
        code: this.code,
        encryptedData: this.encryptedData,
        iv: this.iv,
        seedPublicKeyHex: this.publicKey
      })
      this.$store.commit('setIsNew', data.isNew)
      const cypher = new Buffer(data.seedEncHex, "hex");
      const plain = decrypt(k1.secret, cypher).toString("hex");
      const { key } = aes.getKeyAndIv()
      const send = aes.encrypt(plain, key)
      this.$store.commit('setKey', key)
      this.$store.commit('setSend', send)
      wxApi.setStorageSync('key', key)
      wxApi.setStorageSync('send', send)
      uni.showLoading({
        title: '正在创建WingID'
      });
      this.send = send
      const memoryWord = bip39.entropyToMnemonic(plain)
      console.log(memoryWord)
      this.$store.commit('setMemoryWord', memoryWord)
      if(mySend) {
        mySend = Buffer.from(mySend)
      } else {
        mySend = bip39.mnemonicToSeedSync(memoryWord)
        wxApi.setStorageSync('mySend', Array.from(mySend))
      }
      this.node = bip32.fromSeed(mySend)
      await Promise.all([this.getIdentity(), this.getDialryKey()])
      if (data.isNew) {
        let getNonceParams = this.getNonce()
        let note = await NoteCall(getNonceParams)
        note = aesjs.utils.hex.toBytes(note)
        this.$store.commit('setNoteCall', note)
        const md = html2md(introduction.html)
        let content = JSON.stringify({ html:introduction.html, text:introduction.text, time: this.time,  md})
        const params = this.saveDiary(content)
        const result = await NoteCall(params, '处理中...')
      }
      uni.reLaunch({
        url: '/pages/entry/index'
      });
    },
    getNonce() {
      let message = [].concat([0])
      let signature = sha256(message, { asBytes: true })
      signature = Uint8Array.from(signature)
      const sigObj = secp256k1.ecdsaSign(signature, this.$store.state.privateKey)
      let txHex = [...this.$store.state.publicKey, ...sigObj.signature, ...message]
      txHex = aesjs.utils.hex.fromBytes(txHex)
      return {
        txHex,
        blobHex: ""
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
  }
}
</script>

<style lang="stylus" scoped>
.content {
  position relative
  height 100vh
  .imageBox{
    width:695upx;
    height:747upx;
    position absolute
    right 0
    top 137upx
    image{
      height 100%
      width 100%
    }
  }
  .buttonBox{
    position absolute
    left 35upx
    bottom 0
    width:276upx;
    height:100upx;
    background:rgba(34,34,34,1);
    box-shadow:8upx 8upx 66upx 0upx rgba(76,75,89,0.06), 8upx 8upx 66upx 0upx rgba(76,75,89,0.06);
    border-radius:18upx;
    line-height	100upx
    overflow hidden
    color #ffffff
    font-size:30upx;
  }
  .footer{
    position absolute
    width:305upx;
    height:46upx;
    font-size:22upx;
    font-family:PingFang SC;
    color:rgba(165,165,165,1);
    line-height:30upx;
    bottom 40upx
    margin: auto;
    left: 0;
    right: 0;
    text-align center
  }
}
</style>
