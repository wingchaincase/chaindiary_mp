<template>
	<view class="content">
		<view class="new-diaty" @tap="goEditor()">
    	<view class="newday">写写今天发生了什么</view>
			<view class="time">{{date.timeTodate('m月d日 . Y',now)}}</view>
    </view>
		<view class="diatyList">
			<view v-for="(item, key) in list" :key="key">
			<view class="dateBox" >
				<view class="date">{{item.date}}</view>
				<view class="count">{{item.list.length}}篇日记</view>
			</view>
			<view class="list">
				<view class="item" v-for="(diaty, index) of item.list" :key="index">
					<diaty-card
						@tap="goEditor(diaty.noteId, diaty.contentEncHash, diaty.content, diaty.contentEnc)"
						:content="diaty.content.text"
						:date="date.timeTodate('m月d日 . Y', diaty.content.time)"
						:imgHash="diaty.content.imgList && diaty.content.imgList[0]"
					/>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>

	import endianCode from 'endian-code'  
	import aesjs from 'aes-js';
	import date from '../../utils/date'
	import { decrypt } from 'eciesjs'
	import aes from'../../utils/aes'
	import * as bip39 from 'bip39'
	import secp256k1 from 'secp256k1'
	import * as bip32 from 'bip32';
	import wxApi from '../../utils/wx'
	import { NoteCall } from '../../utils/serve'
	import sha256 from 'sha256'
	import DiatyCard from '../../components/DiatyCard.vue'
	export default {
		data() {
			return {
				date,
				onNavigation: true,
				send: '',
				fullScreen: false,
				now: new Date().getTime(),
				list: [],
			}
		},
		components: {
			DiatyCard
		},
		async onLoad() {
			const { platform, safeArea, screenHeight } = wx.getSystemInfoSync()
			this.fullScreen = screenHeight - safeArea.height > 40
			let getNonceParams = this.getNonce()
			let note = await NoteCall(getNonceParams)
			note = aesjs.utils.hex.toBytes(note)
			this.$store.commit('setNoteCall', note)
			uni.showLoading({
				title: '解密中'
			});
			const params = this.searchDiary()
			let data = await NoteCall(params)
			let list = this.decryptList(data.list)
			this.list = list
			wxApi.setStorageSync('availableData', '')
			uni.hideLoading();
		},
		async onPullDownRefresh() {
			uni.showLoading({
				title: '解密中'
			});
			this.list = []
			const params = this.searchDiary()
			let data = await NoteCall(params)
			let list = this.decryptList(data.list)
			this.list = list
			wxApi.setStorageSync('availableData', '')
			uni.hideLoading();
			uni.stopPullDownRefresh();
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
		async onShow () {
			this.onNavigation = true
			if (wx.canIUse('hideHomeButton')) {
				wx.hideHomeButton()
			}
			if(wxApi.getStorageSync('availableData')) {
				this.list = []
				uni.showLoading({
					title: '解密中'
				});
				const params = this.searchDiary()
				let data = await NoteCall(params)
				let list = this.decryptList(data.list)
				this.list = list
				wxApi.setStorageSync('availableData', '')
				uni.hideLoading();
			}
		},
		computed:{
			start() {
        return endianCode.encode(0x01, 4, false)
			},
      size() {
        return endianCode.encode(0x3e8, 4, false)
      }
    },
		methods: {
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
			decryptList(list) {
				 let obj = {}
				 let arr = []
				 list.map(item => {
					 let contentEnc = new Buffer(item.contentEnc, "hex")
					 let content = decrypt(this.$store.state.dialryPrivateKey, contentEnc).toString()
					 item.content = JSON.parse(content)
					 let date = this.date.timeTodate('m月 . Y', item.content.time)
					 let dateTime = new Date(this.date.timeTodate('d日m月 . Y', item.content.time)).getTime()
					 let index = arr.findIndex(item => item.date === date)
					 if (index !== -1) {
						 arr[index].list.push(item)
					 } else {
						 arr.push({dateTime, date, list: [item]})
					 }
				 })
				 arr = arr.map(item => {
					 item.list = item.list.sort((a,b) => b.content.time - a.content.time)
					 return item
				 })
				 arr = arr.sort((a,b) => b.dateTime - a.dateTime)
				 return arr
			},
			searchDiary() {
				let message = [].concat([1], this.start, this.size)
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
			goEditor (id,hash,content, diarySecret){
				if(!this.onNavigation) return
				this.onNavigation = false
				if (id && content) {
					wxApi.setStorageSync('diary',JSON.stringify(content))
				  if(!content.text) {
						wxApi.setStorageSync('diarySecret','')
					} else {
						wxApi.setStorageSync('diarySecret',diarySecret)
					}
					uni.navigateTo({
						url: `/pages/editor/index?id=${id}&hash=${hash}`
					})
				} else {
					uni.navigateTo({
						animationType: 'pop-in',
						url: `/pages/editor/index`
					})
				}
			},
			goMime() {
				uni.reLaunch({
					url: `/pages/me/index`
				})
			}
		}
	};
</script>

<style lang="stylus" scoped>
 .content{
	 padding 37upx 40upx 0 41upx
	 height 100vh
	 overflow auto
	 background-color #f7f7f7
	 box-sizing border-box
	 .diatyList{
		 margin-bottom 120upx
	 }
	 .new-diaty{
		 padding 43upx 28upx 31upx 28upx
		 background #ffffff
		 box-sizing border-box
		 color rgba(165,165,165,1)
		 box-shadow 8upx 16upx 66upx 0px rgba(76,75,89,0.06)
		 margin-bottom 67upx
		 border-radius 16upx
		 .newday{
			 height 81upx
			 font-size 26upx
			 font-weight 500
		 }
		 .time{
			 font-size 20upx
		 }
	 }
	 .dateBox{
		 .date{
			 color #222222
			 font-size 36upx
			 font-weight:900;
		 }
		 .count{
			 font-size 20upx
			 color #A5A5A5
			 margin-top 10upx
			 margin-bottom 17upx
		 }
	 }
	 .list{
		 .item{
			 margin-bottom 40upx
		 }
	 }
	 .fixedFooter {
		&.fullScreen{
			padding-bottom 68upx
		}
		position fixed
		width 100vw
		bottom 0
		left 0
		height:107upx;
		background:rgba(255,255,255,1);
		box-shadow:0upx -1upx 24upx 0upx rgba(76,75,89,0.12);
		display flex
		justify-content space-around
		.icon{
			flex-grow 1
			text-align center
			font-size 24px
			color #A0A0A0
			padding-top 29upx
			padding-bottom 27upx
			&.active{
				color #000000
			}
		}
	 }
 }
</style>
	
