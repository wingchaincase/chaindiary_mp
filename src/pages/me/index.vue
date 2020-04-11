<template>
	<view class="meBox">
		<view class="header">
      <view class="head">
        <image :src="avatarUrl" ></image>
      </view>
      <view class="name">
        {{nickName}}
      </view>
    </view>
    <view class="content">
      <view class="list border">
        <my-cell :head="true" title="存储服务商" @tap="goStorage" icon="icon-zux2"/>
        <my-cell :head="true" title="备份WingID" :border="true" icon="icon-icon-test8" @tap="goBackUp"/>
      </view>
      <view class="list">
        <my-cell :head="true" title="功能介绍" icon="icon-icon-test7" @tap="goIntroduction"/>
        <my-cell openType="feedback" :head="true" title="意见反馈" icon="icon-icon-test9"/>
      </view>
    </view>
	</view>
</template>

<script>
  import Vue from 'vue';
  import wxApi from '../../utils/wx'
  import MyCell from '../../components/MyCell.vue'
	export default Vue.extend({
		data() {
			return {
        avatarUrl: '',
        nickName: '',
        fullScreen: false
			}
		},
		components: {
      MyCell
		},
		onLoad() {
      const { safeArea, screenHeight } = wx.getSystemInfoSync()
      this.fullScreen = screenHeight - safeArea.height > 40
      let userInfo = wxApi.getStorageSync('userInfo')
      userInfo = JSON.parse(userInfo)
      this.avatarUrl = userInfo.avatarUrl
      this.nickName = userInfo.nickName
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
		methods: {
      goNavigation() {
        uni.reLaunch({
					url: `/pages/entry/index`
				})
      },
      goIntroduction() {
        uni.navigateTo({
					url: `/pages/introduction/index`
				})
      },
      goStorage() {
        uni.navigateTo({
					url: `/pages/storage/index`
				})
      },
      goBackUp() {
        uni.navigateTo({
					url: `/pages/backUp/index`
				})
      },
      goFeedback() {
        uni.navigateTo({
					url: `/pages/feedback/index`
				})
      }
		}
	});
</script>

<style lang="stylus" scoped>
  .meBox{
    background #f0f0f0
    min-height 100vh
    display flex
    flex-direction column
    .header{
      padding 29upx 0 45upx 27upx
      box-sizing border-box
      display flex
      align-items center
      .head{
        image{
          width:120upx;
          height:120upx;
          border-radius:50%;
        }
        margin-right 25upx
      }
      .name{
        font-size:36upx;
        font-weight:900;
        color:rgba(34,34,34,1);
      }
    }
    .content{
      flex-grow 1
      background #fff
      border-radius 30upx 30upx 0 0
      padding 0 27upx 0 29upx
      box-sizing border-box
      overflow hidden
      .list{
        padding 17upx 0 19upx 0
        box-sizing border-box
        &.border{
          border-bottom:1upx solid rgba(230,230,230,1);
        }
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
	
