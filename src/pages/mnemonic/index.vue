<template>
    <view class="container">
      <view class="tipsTitle">请确认助记词</view>
      <view class="tips">请按顺序点选助记词，以确认您正确备份。</view>
      <view class="errorMsg" v-if="showMsg">助记词顺序不正确，请校对</view>
      <view class="mnemonicBox">
        <view class="buttonList">
          <view class="buttonItem" v-for="(key, index) in addList" @tap="deleteItem(index)" :key="index" >
            {{key}}
            <image src="../../static/close.png" mode="" />
          </view>
        </view>
      </view>
      <view class="buttonList">
        <view class="buttonItem" :class="{disabled: addList.indexOf(key) !== -1}" v-for="(key, index) in list" :key="index" @tap="operationItem(key)">{{key}}</view>
      </view>
      <my-button text="下一步" @tap="submite"/>
    </view>
</template>

<script>
  import MyButton from '../../components/MyButton'
  export default {
      data() {
        return {
          showMsg: false,
          addList: []
        }
      },
      components: {
        MyButton
      },
      computed:{
        list() {
          let arr = this.$store.state.memoryWord.split(' ')
          arr = this.shuffle(arr)
          return arr
        }
      },
      methods: {
        submite() {
          if (this.addList.join(' ') === this.$store.state.memoryWord) {
            uni.showModal({
              title: '提示',
              content: '助记词顺序正确',
              confirmText: '返回首页',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  uni.reLaunch({
                      url: '/pages/entry/index'
                    });
                }
              }
            });
          } else {
            this.showMsg = true
          }
        },
        operationItem(key) {
          if (this.addList.indexOf(key) === -1) {
            this.addList.push(key)
          } else {
            let index = this.addList.indexOf(key)
            this.addList.splice(index,1)
          }
          if(this.addList.join('') === this.$store.state.memoryWord.split(' ').slice(0,this.addList.length).join('')) {
            this.showMsg = false
          } else {
            this.showMsg = true
          }
        },
        deleteItem(key) {
          this.addList.splice(key,1)
        },
        shuffle(a) {
          for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
          }
          return a;
        }
      }
  }
</script>

<style lang="stylus" scoped>
  .container {
    display flex
    height 100vh
    flex-direction column
    padding 34upx 47upx 34upx 34upx 
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
    .errorMsg{
      font-size:22upx;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(233,68,95,1);
      line-height:36upx;
    }
    .buttonList{
      padding-left 6upx
      padding-right 5upx
      box-sizing border-box
      margin-bottom 59upx
      margin-top 52upx
      display flex
      flex-wrap wrap
      align-items flex-start
      flex-direction row
      justify-content flex-start
      .buttonItem{
        position relative
        margin-bottom 16upx
        width:195upx;
        height:66upx;
        line-height 66upx
        text-align center
        border:2upx solid rgba(229,229,229,1);
        box-shadow:8upx 8upx 66upx 0upx rgba(76,75,89,0.06), 8px 8px 66px 0px rgba(76,75,89,0.06);
        border-radius:18upx;
        margin-right 33upx
        &:nth-of-type(3n){
          margin-right 0
        }
        &.disabled{
          color:rgba(165,165,165,1);
        }
        image{
          position absolute
          top -6upx
          right -5upx
          width:26upx;
          height:26upx;
          border-radius:50%;
        }
      }
    }
     .mnemonicBox{
      width:100%;
      margin-top 20upx
      padding 29upx 40upx
      box-sizing border-box
      min-height:390upx;
      overflow hidden
      background:rgba(247,247,247,1);
      box-shadow:8upx 8upx 66upx 0upx rgba(76,75,89,0.06);
      border-radius:18upx;
      .buttonList {
        margin 0
        padding 0
        .buttonItem{
          width:179upx;
          margin-right 15upx
        }
      }
    }
  }
</style>