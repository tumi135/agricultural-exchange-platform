// pages/experts/experts.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    experName: '',
    experPhone: '',
    obverse: "",//身份证正面
    reverse: '',//身份证方面
    certificate: ''//资格证书
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  send: function () {
    if (!this.data.experName){
      Toast.fail('请输入姓名');
      return
    }
    if (!this.data.experPhone) {
      Toast.fail('请输入电话');
      return
    }
    if (!this.data.obverse) {
      Toast.fail('请上传身份证正面图');
      return
    }
    if (!this.data.reverse) {
      Toast.fail('请上传身份证反面图');
      return
    }
    if (!this.data.certificate) {
      Toast.fail('请上传资格证书图');
      return
    }
    
    
  },
  //绑定输入数据
  inputeidt: function (e) {
    let key = e.currentTarget.dataset.item
    let value = e.detail.value
    let map = {}
    map[key] = value
    this.setData(map)
  },
  getCard: function (e) {
    var that = this
    var key = e.currentTarget.dataset.card
    wx.chooseImage({
      count: 1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        let map = {}
        map[key] = tempFilePaths
        console.log(tempFilePaths)
        that.setData(map)

        // wx.uploadFile({
        //   url: 'https://elm.cangdu.org/v1/addimg/food',
        //   filePath: tempFilePaths,
        //   name: key,
        //   success: function (res){
        //       console.log(res)
        //   },
        //   fail: function (err){
        //     console.log(err)
        //   }
        // })
      }
    })
  }
})