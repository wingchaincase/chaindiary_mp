import { baseUrl } from './config'
const getRandomValues = require('polyfill-crypto.getrandomvalues')

const checkSession = function () {
  return   wx.checkSession({
        success () {
          //session_key 未过期，并且在本生命周期一直有效
          resolve()
        },
        fail () {
          reject()
        }
      })
  }

const login = function () {
  return new Promise((resolve, reject) => {
      wx.login({
          success (res) {
            console.log(res)
            if (res.code) {
              resolve(res.code)
            } else {
              reject(res.errMsg)
            }
          },
          fail(error) {
            console.log(error)
          }
        })
  })
}
const getUserInfo = function () {
  return new Promise((resolve, reject) => {
      wx.getUserInfo({
          success (res) {
            console.log(res)
            if (res.code) {
              resolve(res.code)
            } else {
              reject(res.errMsg)
            }
          }
        })
  })
}
const scanCode = function () {
  return new Promise((resolve, reject) => {
    wx.scanCode({
      success(value) {
        resolve(value.result)
      }
    })
  })
}
const getStorageSync= function (key) {
  let result
  if(baseUrl === '************') {
    key = 'test' + key
  }
  try {
    result = wx.getStorageSync(key)
  } catch (e) {
    result = ''
  }
  return result
}
const setStorageSync= function (key,value) {
  let result
  if(baseUrl === '************') {
    key = 'test' + key
  }
  try {
    result = wx.setStorageSync(key, value)
  } catch (e) {
    result = ''
  }
  return result
}


export default {
  login,
  checkSession,
  getUserInfo,
  scanCode,
  setStorageSync,
  getStorageSync
}