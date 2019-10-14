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
      console.log(this.properties.propFather)
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
    seeItem: function (e) {
      wx.navigateTo({
        url: '../article/article?id=' + e.currentTarget.dataset.id,
      })
    },
  }
})
