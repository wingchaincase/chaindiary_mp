<template>
  <view class="content">
  </view>
</template>

<script>
import wxApi from '../../utils/wx'
import * as bip39 from 'bip39'
import * as bip32 from 'bip32'
import aesjs from 'aes-js'
import aes from '../../utils/aes'
import date from '../../utils/date'

export default {
  data() {
    return {
      node: {},
      send: ''
    }
  },
  async onLoad() {
    uni.showLoading({
      title: '解密中'
    });
    const key = wxApi.getStorageSync('key')
    let send = wxApi.getStorageSync('send')
    let mySend = wxApi.getStorageSync('mySend')
    if(key && send) {
      send = aes.decrypt(send, key)
      this.$store.commit('setKey', key)
      this.$store.commit('setIsNew', false)
      this.$store.commit('setSend', send)
      const memoryWord = bip39.entropyToMnemonic(send)
      this.$store.commit('setMemoryWord', memoryWord)
      if (mySend) {
        mySend = Buffer.from(mySend)
      } else {
        mySend = bip39.mnemonicToSeedSync(memoryWord)
        wxApi.setStorageSync('mySend', Array.from(mySend))
      }
      this.node = bip32.fromSeed(mySend)
      await Promise.all([this.getIdentity(), this.getDialryKey()])
      uni.reLaunch({
         url: '/pages/entry/index'
      });
    } else {
      uni.reLaunch({
         url: '/pages/navigation/index'
      });
    }
  },
  methods: {
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
  }
}
</script>

<style lang="stylus" scoped>
.content {
  .imageBox{
    width:695upx;
    height:747upx;
    position fixed
    right 0
    top 137upx
    image{
      height 100%
      width 100%
    }
  }
  .buttonBox{
    position absolute
    left 0
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
}
</style>
