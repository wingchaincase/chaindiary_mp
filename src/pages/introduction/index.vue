<template>
  <view class="box">
    <view class="agreementBox">
      <view>「链记」是一款基于区块链技术实现，专注保护数据隐私的图文编辑应用，用于写日记、笔记、文章，安全易用。</view>
      <view><view class="strong"><view></view>如何保护数据隐私？</view>
      <view>- 所有数据加密存储，只有用户自己能够解密查看内容。</view>
      <view>- 即使数据泄露，窃取者只能看到没有意义的乱码内容。</view></view>
      <view><view class="strong"><view></view>如何做到数据永不丢失？</view>
      <view>- 自主选择数据存储服务商，防止开发者停服而导致数据丢失。</view>
      <view>- 将WingID导入支持WingID规范的应用，即可查看、编辑内容。</view></view>
      <view><view class="strong"><view></view>什么是WingID？</view>
      <view>- WingID由12个单词组成，代表你的身份和数据所有权。</view></view>
      <view><view class="strong"><view></view>WingID能做什么？</view>
      <view>- 加密存储你的数据，解密查看你的数据。</view>
      <view>- 告别重复注册账号，一个WingID即可体验各种应用。</view>
      <view>- 经用户授权后，同一WingID登录的不同应用之间能够相互访问数据。</view></view>
      <view><view class="strong"><view></view>如何切换存储服务商？</view>
      <view>- 只需要在应用上简单点选，即可选择加密数据存储的服务商。</view>
      <view>- 后续将推出用户自己提供存储服务的功能。</view></view>
      <view class="strong"><view></view></view>
      <view>「链记」将不断完善，为用户提供更好的用户体验。如果您有更好的建议，可以随时联系我们哦~</view>
    </view>
  </view>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
.box
  height 100vh
  overflow-y scroll
.agreementBox
  font-size 26upx
  padding 40upx
  line-height 50upx
  color #38393a
  .strong
    font-size 26upx
    font-weight 800
    view{
      height 26upx
    }
</style>