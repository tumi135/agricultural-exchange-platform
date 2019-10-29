// component/list_item/list_item.js
import tool from "../../static/js/tools.js";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    newsList: Array,
    propFather: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function () { 
  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeLike: tool.debounce(function (event) {
      //请求数据
      var that = this
      var ev = event.currentTarget.dataset
      //测试
      var list = that.data.newsList
      var changeItem = list[ev.index]
      if (changeItem.myLike) {
        changeItem.usefulNumber--
      } else {
        changeItem.usefulNumber++
      }
      changeItem.myLike = !changeItem.myLike
      list.splice(ev.index, 1, changeItem)

      var a = {}
      a['newsList[' + ev.index + ']'] = changeItem
      that.setData(a)


      // that.setData({
      //   newsList: list
      // })

      var token = wx.getStorageSync('token')



      // wx.request({
      //   url: 'https://api.it120.cc/tumi123api/cms/news/useful?id=' + ev.id + '&token=' + token, //招商引资消息
      //   data: {

      //   },
      //   success: function (res){
      //     console.log(res)
      //   }
      // })
      // wx.request({
      //   url: 'https://api.it120.cc/tumi123api/cms/news/useful/logs?id=' + ev.id + '&token=' + token, //招商引资消息
      //   data: {

      //   },
      //   success: function (res){
      //     console.log(res)
      //   }
      // })





    }, 500),
    seeItem: function (e) {
      wx.navigateTo({
        url: '../article/article?id=' + e.currentTarget.dataset.id,
      })
    },
  }
})
