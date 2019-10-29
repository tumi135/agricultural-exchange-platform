// component/fotter/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    popTitle: String,
    popPath: String,
    popData: Object
  },


  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () { 
    console.log(this.properties.popData)
    console.log(this.properties.popPath)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleContact(e) {
      console.log(e.detail.path)
      console.log(e.detail.query)
    }
  }
})