// component/popup/popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    popShow: {
      type: Boolean,
      observer: function(newVal, oldVal, changedPath) {
        if(newVal){
          this.setData({
            show: true
          })
        }else{
          this.close()
        }
      }
    },
    popHeight: String
  },
  
  attached: function () {
    // 在组件实例进入页面节点树时执行
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    close: false,
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close: function() {
      var that = this
      this.setData({
        close: true
      })
      setTimeout(function() {
        that.setData({
          show: false,
          close: false
        })
      }, 400)
    },
  }
})