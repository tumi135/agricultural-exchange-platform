//index.js
//获取应用实例
const app = getApp()
import tool from "../../static/js/tools.js";
Page({
  data: {
    active: 0,
    swiperList: [],
    newsList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    page: 1,
    pageSize: 8,
    flag: true,
    loading: false
  },
  onLoad: function() {
    var that = this
    wx.request({
      url: 'https://www.fastmock.site/mock/26ec56645b0706b8e9a68a60854b6a00/ncp/swiper', //轮播图
      success(res) {
        that.setData({
          swiperList: res.data.data
        })
      }
    })
    this.getInfo()
  },
  onShow: function() {
    if (!app.globalData.customTabbar) {

    } else if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0 
      })
    }
  },
  //触发底部
  onReachBottom: function() {
    this.getInfo()
  },
  getInfo: function() {
    var that = this
    if (that.data.flag) {
      that.setData({
        loading: true
      })
      wx.request({
        url: 'https://api.it120.cc/tumi123api/cms/news/list?page=' + that.data.page + '&pageSize=' + that.data.pageSize, //最新消息
        data: {

        },
        success(res) {
          var list = res.data.data
          if (list.length < that.data.pageSize) {
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
  //轮播图链接跳转
  swiperNavigateTo: function(e) {
    console.log(e.currentTarget.dataset.url)
    // wx.navigateTo({
    //   url: e.currentTarget.dataset.url
    // })
  }

})