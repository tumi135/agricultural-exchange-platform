// pages/products/products.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    pageSize: 8,
    flag: true,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGoods()
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
    this.getGoods()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getGoods: function() {

    var that = this
    if (that.data.flag) {
      that.setData({
        loading: true
      })
      wx.request({
        url: 'https://api.it120.cc/tumi123api/shop/goods/list', //商品列表
        data: {

        },
        success(res) {
          console.log(res)
          var list = res.data.data
          if (list.length < that.data.pageSize) {
            that.setData({
              flag: false
            })
          }
          var myList = [...that.data.list,...list]
          var page = that.data.page + 1
          that.setData({
            list: myList,
            page: page,
            loading: false
          })
        }
      })
    }
  }
})