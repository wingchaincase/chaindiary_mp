import request from './request'
import wxApi from './wx'
import { baseUrl } from './config'

request.setConfig({
  baseUrl: baseUrl,
  debug: true,
  toastError: true
})

request.interceptor.request = (config => {
  const token = wxApi.getStorageSync('token')
  console.info('request: ', config);
  config.header['X-Auth-Token'] = token
  console.log(config)
  return config;
})
request.interceptor.response = ((res, config) => {
  console.log(res)
    if (res.code === 0) {
        res.success = true;
    }
    return res;
})

request.interceptor.fail = ((res, config) => {
    let ret = res;
    console.log(res)
    console.log(config)
    let msg = ''
    if(res.statusCode === 401 && !config.noCheck) {
      wxApi.setStorageSync('token',null)
      uni.reLaunch({
        url: `/pages/entry/index`
      })
    }
    if (res.statusCode === 200) {
        msg = res.data.msg
        ret = res.data
    } else if (res.statusCode > 0) {
        msg = '服务器异常[' + res.statusCode + ']'
    } else {
        msg = res.errMsg
    }
    if (config.toastError) {
        uni.showToast({
          title: msg,
          duration: 2000,
          icon: 'none'
        })
    }
    return ret;
})

export default {
  install : function (Vue, options) {
    Vue.prototype.$http = request
  },
  request
}