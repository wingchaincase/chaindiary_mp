<template>
  <view>
    <button
      @tap="go"
      class="my-cell"
      :class="{border}"
      :open-type="openType"
    >
      <i v-if="icon" class="iconfont icon" :class="[icon]"></i>
      <text class="text" :style="{ color: color }">{{title}}</text>
      <image v-if="!hide" class="myicon" src="../static/sanjiao.png"></image>
    </button>
  </view>
</template>

<script>
export default {
  props: ['icon', 'title', 'link', 'color', 'openType', 'hide',  ],
  methods: {
    go() {
      if (this.link) {
        uni.navigateTo({
          url: this.link
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.my-cell
  height 106upx
  font-size 26upx
  display flex
  overflow hidden
  font-family:PingFang SC;
  color:rgba(33,33,33,1);
  font-weight:bold;
  align-items center
  position: relative;
  padding-left: 0;
  padding-right: 0;
  box-sizing: border-box;
  text-align: left ;
  text-decoration: none;
  line-height: normal;
  border-radius: none ;
  overflow: hidden;
  background-color: #fff;
  &::after {
    display none
    content " "
  }
  .text
    flex-grow 1
  .myicon
    height 24upx
    width 24upx
    flex-grow 0
    flex-shrink 0
  .icon
    font-size 16px
    margin-right 32upx
    color #212121
</style>