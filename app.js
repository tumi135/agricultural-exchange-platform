//app.js
import tool from "./static/js/tools.js";
App({
  onLaunch: async function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    var token = wx.getStorageSync('token')
    var userInfo = wx.getStorageSync('userInfo')
    var checkToken = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.it120.cc/tumi123api/user/check-token?token=' + token,
        success: function (res) {
          // console.log(res)
          resolve(res.data.code)
        }
      })
    })
    if (checkToken == 0) {

      // this.setData({
      //   login: true
      // })
    } else {
      this.goLogin()
    }
    if(userInfo){
      this.globalData.userInfo = JSON.parse(userInfo)
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //低版本兼容
    const version = wx.getSystemInfoSync().SDKVersion
    if (tool.compareVersion(version, '2.5.2') >= 0) {
      this.globalData.customTabbar = true
    } else {
      // 低于2.5.0版本
      this.globalData.customTabbar = false
    }
  },
  globalData: {
    userInfo: null,
    customTabbar: true
  },
  goLogin: function () {
    const that = this
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://api.it120.cc/tumi123api/user/wxapp/login?type=2&code=' + res.code,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              if(res.data.code == 0){
                wx.setStorageSync('token', res.data.data.token)

              }else if(res.data.code == 10000){
                //注册
                wx.request({
                  url: 'https://api.it120.cc/tumi123api/user/wxapp/register/simple?type=2&code=' + res.code,
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (request) {
                    wx.setStorageSync('token', request.data.data.token)
                  }
                })
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})