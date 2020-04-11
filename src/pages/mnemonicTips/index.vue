<template>
    <view class="container">
      <view class="mnemonicTipsBox">
        <view class="tipsTitle">备份助记词</view>
        <view class="tips">请按顺序抄写助记词，确保备份正确</view>
        <view class="buttonList">
          <view class="buttonItem" v-for="(key, index) in list" :key="index">
            {{key}}
            <text>{{index+1}}</text>
          </view>
        </view>
        <view class="tips">- 助记词由英文单词组成，请抄写并妥善保管</view>
        <view class="tips">- 助记词丢失，无法找回，请务必备份助记词</view>
      </view>
      <view class="buttonBox"><my-button text="已确认备份" @tap="goMnemonic"/></view>
    </view>
</template>

<script>
  import MyButton from '../../components/MyButton'
    export default {
        data() {
          return {
          }
        },
        components: {
          MyButton
        },
        computed:{
          list() {
            return this.$store.state.memoryWord.split(' ')
          }
        },
        methods: {
          goMnemonic() {
            uni.navigateTo({
               url: '/pages/mnemonic/index'
            });
          }
        }
    }
</script>

<style lang="stylus" scoped>
  .container {
    display flex
    height 100vh
    flex-direction column
    padding 40upx 41upx 40upx 40upx
    box-sizing border-box
    background #F7F7F7
    .mnemonicTipsBox{
      background:rgba(255,255,255,1);
      box-shadow:8upx 8upx 66upx 0upx rgba(76,75,89,0.06);
      border-radius:18upx;
      padding 41upx
      box-sizing border-box
      .tipsTitle{
        font-size:36upx;
        font-family:PingFang SC;
        font-weight:bold;
        color:rgba(34,34,34,1);
        line-height:50upx;
      }
      .tips{
        font-size:26upx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(165,165,165,1);
        line-height:50upx;
      }
    }
    .buttonList{
      padding-left 6upx
      padding-right 5upx
      box-sizing border-box
      margin-bottom 40upx
      margin-top 47upx
      display flex
      flex-wrap wrap
      .buttonItem{
        margin-bottom 16upx
        width:180upx;
        height:66upx;
        line-height 66upx
        text-align center
        border:2upx solid rgba(229,229,229,1);
        box-sizing border-box
        box-shadow:8upx 8upx 66upx 0upx rgba(76,75,89,0.06), 8px 8px 66px 0px rgba(76,75,89,0.06);
        border-radius:18upx;
        margin-right: 15upx
        position relative
        &:nth-of-type(3n){
          margin-right 0
        }
        text{
          font-size:18upx;
          top: 11upx
          right 14upx
          position absolute
          font-family:PingFang SC;
          color:rgba(165,165,165,1);
          line-height 18upx
        }
      }
    }
    .buttonBox{
      margin-top 42upx
    }
  }
</style>