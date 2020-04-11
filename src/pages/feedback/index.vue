<template>
    <view class="container">
      <view class="feedback">产品建议</view>
      <view class="textarea">
        <textarea placeholder="请输入您的产品建议"></textarea>
      </view>
      <my-button text="完成" borderRadius="none" />
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
        methods: {
        }
    }
</script>

<style lang="stylus" scoped>
  .container {
    display flex
    height 100vh
    flex-direction column
    .feedback{
      color:rgba(165,165,165,1);
      font-size:22upx;
      line-height:54upx;
      padding 0 40upx
    }
    .textarea{
      flex-grow 100
      padding 0 40upx
      textarea{
        font-size:26upx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(34,34,34,1);
        line-height:50upx;
        height 100%
        width 100%
      }
    }
  }
</style>