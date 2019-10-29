// pages/askQuestions/askQuestions.js
const app = getApp()
import tool from "../../static/js/tools.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    page: 1,
    pageSize: 6,
    flag: true,
    loading: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getInfo()
    if (!app.globalData.customTabbar) {} else if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      page: 1,
      list: []
    })
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
    this.getInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getInfo: function() {
    var that = this
    if (that.data.flag) {
      that.setData({
        loading: true
      })
      const db = wx.cloud.database()
      db.collection('ask_box').where({
        
      }).orderBy('craeteTime','desc').limit(that.data.pageSize).skip(that.data.pageSize * (that.data.page-1)).get({
          success: function (res) {
            // res.data 是包含以上定义的两条记录的数组

            var list = res.data
            list.forEach(item => {
              var times = tool.translate24Hour(item.craeteTime)
              item.craeteTime = item.craeteTime.toLocaleDateString() + ' ' + times
            })
            if (list.length < that.data.pageSize) {
              that.setData({
                flag: false
              })
            }
            var list = that.data.list.concat(list)
            var page = that.data.page + 1
            that.setData({
              list: list,
              page: page,
              loading: false
            })
          }
        })
    }
  },
  previewImage: function(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.current, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.urls // 需要预览的图片http链接列表
    })
  },
  goToItem: function(event) {
    var item = event.currentTarget.dataset.item
    var id = event.currentTarget.dataset.id
    var comment = event.currentTarget.dataset.comment
    var qItem = JSON.stringify(item)

    try {
      wx.setStorageSync('chooseQuestion', qItem)
    } catch (e) {
      console.log(e)
    }


    wx.navigateTo({
      url: '../questionsItem/questionsItem?id=' + id + '&comment=' + comment,
    })


  }
})