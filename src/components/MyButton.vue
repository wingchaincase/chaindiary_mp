<template>
  <view class="button" :style="{ borderRadius: (borderRadius ? borderRadius : '9px') }">
      {{text}}
  </view>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props:[
    'text', 'borderRadius'
  ],
  methods:{
  }
}
</script>

<style lang="stylus" scoped>
.button
 font-size:30upx;
 color:rgba(255,255,255,1);
 padding 37upx 0
 text-align center
 background:rgba(34,34,34,1);
 box-shadow:8upx 8upx 66upx 0upx rgba(76,75,89,0.06), 8px 8px 66px 0px rgba(76,75,89,0.06);
</style>