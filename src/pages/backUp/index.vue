<template>
	<view class="container">
    <view class="tips">
      <view class="iconBox">
        <view class="icon icon-zhujici_tishix iconfont"></view>
      </view>
      <view class="tipsTitle">
        备份提示
      </view>
      <view class="tipsSecTitle">获得助记词等于拥有个人数据</view>
      <view class="tipsContent">- 助记词由英文单词组成，请抄写并妥善保管</view>
      <view class="tipsContent">- 助记词丢失，无法找回，请务必备份助记词</view>
    </view>
    <view class="buttonBox">
      <my-button text="下一步" @tap="goMnemonicTips"></my-button>
    </view>
	</view>
</template>

<script>
  import MyButton from '../../components/MyButton.vue'
	export default {
		data() {
			return {
			}
		},
		components: {
      MyButton
		},
		onLoad() {

		},
		methods: {
      goMnemonicTips() {
        uni.navigateTo({
          url: '/pages/mnemonicTips/index'
        })
      }
		}
	}
</script>

<style lang="stylus" scoped>
  .container{
    padding 40upx
    background: #F7F7F7;
    height 100vh
    box-sizing border-box
    .tips{
      width: 100%;
      height: 469upx;
      background: rgba(255,255,255,1);
      box-shadow: 8upx 8upx 66upx 0upx rgba(76,75,89,0.06);
      border-radius: 18upx;
      padding 70upx 32upx
      box-sizing border-box
      .iconBox{
        height 92upx
        display flex
        align-items center
        justify-content center
        margin-bottom 70upx
        .icon{
          font-size 92upx
          color #000000
        }
      }
      .tipsTitle{
        font-size 36upx
        color rgba(34,34,34,1);
        line-height:50upx;
        margin-bottom 6upx
        font-weight:bold;
      }
      .tipsSecTitle{
        font-size:26upx;
        color:rgba(34,34,34,1);
        line-height:50upx;
      }
      .tipsContent{
        font-size:22upx;
        color:rgba(165,165,165,1);
        line-height:36upx;
      }
    }
    .buttonBox{
      margin-top 40upx
    }
  }
</style>
	
