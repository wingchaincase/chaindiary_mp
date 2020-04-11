<template>
  <view class="container">
    <view class="title">请选择数据存储服务商</view>
    <view class="cardList">
      <view class="card">
        <view class="imgBox">
          <view class="icon iconfont icon-Ax"></view>
        </view>
        <view class="info">
          <view class="name">默认存储</view>
          <view class="content">链飞科技基于区块链技术提供的隐私数据存储服务</view>
          <image src="../../static/select.png" mode="" />
        </view>
      </view>
      <view class="card">
        <view class="imgBox">
          <view class="icon iconfont icon-Ax1"></view>
        </view>
        <view class="info" @tap="showTips">
          <view class="name">私有部署</view>
          <view class="content">用户使用自己的设备提供数据存储服务</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    showTips() {
      uni.showModal({
        content: '即将上线',
        showCancel: false,
        confirmText: '我知道了',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
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
.container{
  height 100vh
  background #F7F7F7
  padding-top 140upx
  padding-left 41upx
  padding-right 40upx
  box-sizing border-box
  .title{
    margin-bottom 79upx
    text-align center
    font-size:36upx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(27,27,27,1);
    line-height:54upx;
  }
  .card{
    position relative
    padding 47upx 89upx 40upx 41upx
    box-sizing border-box
    display flex
    align-items center
    margin-bottom 40upx
    background:rgba(255,255,255,1);
    box-shadow:8upx 8upx 66upx 0upx rgba(76,75,89,0.06);
    border-radius:18upx;
    .imgBox{
      height 87upx
      width 87upx
      margin-right 49upx
      .icon{
        font-size 87upx
        color #222222
      }
    }
    .info{
      image{
        position absolute
        width:32upx;
        height:32upx;
        right: 30upx;
        top 50%
        transform translateY(-50%)
      }
      .name{
        font-size:30upx;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(34,34,34,1);
        line-height:50upx; 
        margin-bottom 7upx
      }
      .content{
        font-size:22upx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(165,165,165,1);
        line-height:28upx;
      }
    }
  }
}
</style>