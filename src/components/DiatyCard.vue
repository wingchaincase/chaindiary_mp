<template>
  <view class="diaty-card-box">
    <view class="diaty-card" v-if="content">
      <view class="text">{{content}}</view>
      <view class="time">{{date}}</view>
      <i class="iconfont icon icon-kaobeix"></i>
    </view>
    <view class="imgBox" v-if="imgHash" :class="{pureImage: !content}">
      <image v-if="img" :src="img" mode='aspectFill' lazy-load='true'></image>
      <view class="imgText" v-else>图片解密中...</view>
      <view v-if="!content" class="time">{{date}}</view>
    </view>
  </view>
</template>

<script>
  import { NoteCall } from '../utils/serve'
  import { decrypt } from 'eciesjs'
  import aesjs from 'aes-js';
  import secp256k1 from 'secp256k1'
  import sha256 from 'sha256'
  import Vue from 'vue';
	export default {
    props:["content", "date", "imgHash"],
		data() {
			return {
        img: ''
			}
		},
		created() {
      if (this.imgHash) {
        this.getImg(this.imgHash)
      }
    },
    watch: {
      imgHash(newValue, oldValue) {
        if(newValue !== oldValue) {
          if(newValue) {
            this.getImg(newValue)
          } else {
            this.img = ''
          }
        }
      }
    },
		methods: {
      async getImg(hash) {
				if(!hash) return false
				let params = this.getFile(hash)
				const data = await NoteCall(params)
				let contentEnc = new Buffer(data.resourceEnc, "hex")
				this.img =  'data:image/jpeg;base64,' + uni.arrayBufferToBase64(decrypt(this.$store.state.dialryPrivateKey, contentEnc))
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
		}
	};
</script>

<style lang="stylus" scoped>
.diaty-card-box{
  display flex
  border-radius 18upx
  box-shadow 8upx 8upx 66upx 0upx rgba(76,75,89,0.06);
  overflow hidden
  .diaty-card{
    flex-grow 1
    padding 44upx 39upx 30upx 27upx
    box-sizing border-box
    position relative
    background rgba(255,255,255,1)
    .text{
      font-size 26upx
      font-weight:400;
      color rgba(33,33,33,1)
      line-height 50upx
      margin-bottom 32upx
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      word-break break-all
    }
    .time{
      color rgba(165,165,165,1)
      font-size 20upx
      font-weight 400
    }
    .icon{
      position absolute
      right 40upx
      bottom 30upx
      color rgb(232,232,235,1)
    }
  }
  .imgBox{
    flex-shrink 0
    display flex
    justify-content center
    align-items center
    width:305upx;
    height:263upx;
    image{
      height: 100%;
      width: 100%;
      max-height:263upx;
      object-position: 50% 50%;
    }
    &.pureImage{
      position relative
      flex-grow 1
      image{
        max-width:100%;
      }
      .time{
        color:rgba(255,255,255,1)
        font-size 20upx
        font-weight 400
        position absolute
        bottom 35upx
        left 28upx
      }
    }
    .imgText{
      width:100%;
      height:263upx;
      background-color #F6F6F6
      font-size:26upx;
      font-weight:500;
      color:rgba(165,165,165,1);
      line-height:263upx;
      text-align center
    }
  }
}
 
</style>
	
