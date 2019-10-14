// pages/investment/investment.js
import tool from "../../static/js/tools.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [],
    page: 1,
    pageSize: 8,
    flag: true,
    loading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInfo()
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
    this.getInfo()
  },
  getInfo: function() {
    var that = this
    if(that.data.flag){
      that.setData({
        loading: true
      })
      wx.request({
        url: 'https://www.fastmock.site/mock/26ec56645b0706b8e9a68a60854b6a00/ncp/investmentList', //招商引资消息
        data: {
          page: that.data.page,
          pageSize: that.data.pageSize
        },
        success(res) {
          var list = res.data.data.list
          if (list.length < that.data.pageSize){
            that.setData({
              flag: false
            })
          }
          var list = that.data.newsList.concat(list)
          var page = that.data.page + 1
          that.setData({
            newsList: list,
            page: page,
            loading: false
          })
        }
      })
    }
    
  },
  changeLike: tool.debounce(function(event) {
    //请求数据
    var that = this
    var ev = event.currentTarget.dataset
    //测试
    var list = that.data.newsList
    var changeItem = list[ev.index]
    if (changeItem.myLike) {
      changeItem.likeNum--
    } else {
      changeItem.likeNum++
    }
    changeItem.myLike = !changeItem.myLike
    list.splice(ev.index, 1, changeItem)
    that.setData({
      newsList: list
    })
  }, 500),
  seeItem: function(e) {
    wx.navigateTo({
      url: '../questionsItem/questionsItem?id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})