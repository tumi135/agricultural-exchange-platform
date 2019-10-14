// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: "#979797",
    selectedColor: "#1195db",
    list: [{
        "selectedIconPath": "/static/img/shouye.png",
        "iconPath": "/static/img/shouye_no.png",
        "pagePath": "/pages/index/index",
        "text": "首页"
      },{
        "selectedIconPath": "/static/img/tiwen.png",
        "iconPath": "/static/img/tiwen_no.png",
        "pagePath": "/pages/askQuestions/askQuestions",
        "text": "提问"
      },{
        "selectedIconPath": "/static/img/wode.png",
        "iconPath": "/static/img/wode_no.png",
        "pagePath": "/pages/my/my",
        "text": "我的"
      }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})