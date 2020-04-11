<template>
  <view class="swiperBox" :class="{paddingBtm: imgList.length > 1}">

    <swiper v-if="imgList.length > 1" :style="{height}" class="swiper" mode='widthFix' circular :interval="interval" :duration="duration" @change="swiperChange">
      <swiper-item  class="swiperItem" v-for="(item, key) in imgList" :key="key">
        <image :id="key" class="imageCard" @load="(e) => {
          imageLoad(e)
          }" @tap="previewImage(key)" v-show="plain && item.base64 && height" :src="item.base64" mode='widthFix' :lazy-load="true" ></image>
        <view class="swiper-image" v-if="!item.base64 || !height">图片解密中...</view>
        <view class="swiper-secret" v-if="!plain">{{item.secret}}</view>
      </swiper-item>
    </swiper>

    <view :style="{height}"  class="swiper"  v-else v-for="(item, key) in imgList" :key="key">
        <image class="imageCard" @tap="previewImage(key)"  v-show="plain && item.base64 && height" :src="item.base64" mode='widthFix' :lazy-load="true"  @load="imageLoad"></image>
        <view class="swiper-image" v-if="!item.base64 && !height">图片解密中...</view>
        <view class="swiper-secret" v-if="!plain">{{item.secret}}</view>
    </view>

    <view class="dots" v-if="imgList.length > 1">
      <view v-for="(item, key) in imgList" :key="key">
        <view class="dot" :class="{ active: key === sweiperIndex }"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['imgList', 'plain'],
  data() {
    return {
      height: '',
      indicatorDots: true,
      interval: 2000,
      duration: 500,
      sweiperIndex: 0,
    }
  },
  methods: {
    swiperChange(e) {
      this.sweiperIndex = e.detail.current
    },
    previewImage(index) {
      this.$emit('previewImage', index)
    },
    imageLoad(e) {
      if(!this.height && (e.currentTarget.id === '0' || !e.currentTarget.id)) {
        var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        ratio = imgwidth / imgheight;
        console.log(imgwidth, imgheight)
        var viewHeight = 750 / ratio;
        var imgheight = viewHeight;
        this.height = imgheight + 'rpx'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .swiperBox{
        position relative
        &.paddingBtm{
          padding-bottom 35px
        }
      }
      .swiper{
        min-height 200px
        .swiperItem{
          display flex
          justify-content center
          align-items center
        }
        image{
          width 750upx;
        }
        .swiper-image{
          width:100%;
          height:200px
          background-color #F6F6F6
          font-size:26upx;
          font-weight:500;
          color:rgba(165,165,165,1);
          line-height:200px
          text-align center
        }
        .swiper-secret{
          width:100%;
          height:100%;
          padding 0 40upx
          box-sizing border-box
          word-break break-all
          background-color #ffffff
          font-size:26upx;
          font-weight:500;
          color:rgba(34,34,34,1);
          line-height:45upx;
          overflow hidden
        }
      }
      .dots{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 15upx;
        display: flex;
        justify-content: center;
        align-items center
        .dot{
          margin: 0 7upx;
          width: 6px;
          height: 6px;
          background:#909090
          border-radius: 100%;
          &.active{
            background: #232323
            width: 9px;
            height: 9px;
          } 
        }
      }
</style>