// pages/askQuestions/askQuestions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    page: 1,
    pageSize: 9,
    flag: true,
    loading: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getInfo()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getInfo: function () {
    var that = this
    if (that.data.flag) {
      that.setData({
        loading: true
      })
      wx.request({
        url: 'https://www.fastmock.site/mock/26ec56645b0706b8e9a68a60854b6a00/ncp/askList', //招商引资消息
        data: {
          page: that.data.page,
          pageSize: that.data.pageSize
        },
        success(res) {
          var list = res.data.data.list
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
  previewImage: function (event){
    wx.previewImage({
      current: event.currentTarget.dataset.current, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.urls // 需要预览的图片http链接列表
    })
  }
})