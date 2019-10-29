// pages/article/article.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId: '',
    article: {},
    path:'',
    data: {
      "source":"售前咨询"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var path = this.route + '?id=options.id'
    console.log(path)
  
    wx.request({
      url: 'https://api.it120.cc/tumi123api/cms/news/detail?id=' + options.id, 
      // data: { id: options.id},
      success(res) {
console.log(res)
        that.setData({
          article: res.data.data,
          path: path
        })
      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})