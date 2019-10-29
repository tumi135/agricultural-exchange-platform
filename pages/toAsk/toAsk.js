// pages/toAsk/toAsk.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText: '',
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    address: '定位中...',
    experts: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type = 'experts') {
      this.setData({
        experts: true
      })
    }
    qqmapsdk = new QQMapWX({
      key: 'MNLBZ-QYZWR-G3HW6-WDJ4U-DP7C5-RABG5'
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    const that = this
    //定位
    wx.getLocation({
      type: 'wgs84',
      fail: function(err) {
        that.setData({
          address: ''
        })
      },
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(status, res) {
            if (status !== 0) {
              that.setData({
                address: res.reverseGeocoderResult.address
              })
            } else {
              that.setData({
                address: res.message
              })
            }
          },
          fail: function(error) {
            Toast.fail(error);
            that.setData({
              address: ''
            })
          },

        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  inputeidt: function(e) {
    let value = e.detail.value
    this.setData({
      inputText: value
    })
  },
  //选择图片
  upload: function(e) {
    var that = this
    var key = e.currentTarget.dataset.card
    var len = 9 - this.data.uploaderList.length

    wx.chooseImage({
      count: len,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.doUpload(tempFilePaths)
      }
    })
  },
  clearImg: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var that = this
    var list = this.data.uploaderList
    list.splice(index, 1)
    this.setData({
      uploaderList: list,
      showUpload: true
    })

  },
  chooseLocation: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          address: res.name
        })
      }
    })
  },
  showImg: function(e) {
    var index = parseInt(e.currentTarget.dataset.index)
    var that = this
    wx.previewImage({
      current: that.data.uploaderList[index],
      urls: that.data.uploaderList, // 当前显示图片的http链接
    })
  },
  //完成
  confirm: function() {
    var token = wx.getStorageSync('token')
    var userInfo = app.globalData.userInfo
    var reg = /^\s+$/
    var postJsonString = {
      img: this.data.uploaderList,
      address: this.data.address
    }
    if (reg.test(this.data.inputText) || this.data.inputText.length < 5 || this.data.inputText.length > 300) {
      Toast.fail('文字内容过多或过少');
      return
    }
    if (this.data.experts){
      wx.showModal({
        title: '发送成功,等待审核',
        showCancel: false,
        success(res) {
          wx.switchTab({
            url: '../askQuestions/askQuestions'
          })
        }
      })
      return
    }

    const db = wx.cloud.database()
    const test = db.collection('ask_box')
    test.add({
      // data 字段表示需新增的 JSON 数据
      data: {

        content: this.data.inputText,
        imgs: this.data.uploaderList,
        address: this.data.address,
        userInfo: userInfo,
        craeteTime: db.serverDate(),
        replyNum: 0
      },
      success: function(res) {
        //  输出成功插入后的id以及其他信息
        console.log(res)
        wx.showModal({
          title: '发送成功',
          showCancel: false,
          success(res) {
            wx.switchTab({
              url: '../askQuestions/askQuestions'
            })
          }
        })
      },
      fail: function(err) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        })
      }
    })



  },
  //取消
  cancel: function() {
    wx.switchTab({
      url: '/pages/askQuestions/askQuestions'
    })
  },
  // 上传图片
  doUpload: function(tempFilePaths) {
    const that = this
    const filePath = tempFilePaths[0]
    const date = new Date()
    // 上传图片
    const cloudPath = 'ask_' + date.getTime() + filePath.match(/\.[^.]+?$/)[0]

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        console.log('[上传文件] 成功：', res)
        const list = [...that.data.uploaderList, res.fileID]

        that.setData({
          uploaderList: list
        })
      },
      fail: e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: 'none',
          title: '上传失败',
        })
      },
      complete: () => {
        tempFilePaths.shift()
        if (that.data.uploaderList.length >= 9) {
          that.setData({
            showUpload: false
          })
        }
        console.log(tempFilePaths)
        if (tempFilePaths.length > 0) {
          this.doUpload(tempFilePaths)
        } else {
          wx.hideLoading()
        }

      }
    })
  },
})