// pages/questionsItem/questionsItem.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
import tool from "../../static/js/tools.js";

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseQuestion: {},
    id: null,
    comment: false,
    inputText: null,
    token: null,
    commentShow: false,
    commentList: [],
    page: 1,
    pageSize: 10,
    flag: true,
    loading: false,
    pid: '',
    toNick: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var chooseQuestion = wx.getStorageSync('chooseQuestion')
    if (chooseQuestion) {
      this.setData({
        chooseQuestion: JSON.parse(chooseQuestion),
        id: options.id,
        comment: options.comment
      })
    }

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

    this.getComment()
    this.setData({
      comment: this.data.comment
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  previewImage: function(event) {
    wx.previewImage({
      current: event.currentTarget.dataset.current, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.urls // 需要预览的图片http链接列表
    })
  },

  //获取评论
  getComment: function() {

    var that = this
    var getComment = true
    this.setData({
      loading: true
    })
    const db = wx.cloud.database()
    db.collection('comment').where({
      replayId: that.data.id
    }).orderBy('craeteTime', 'asc').limit(that.data.pageSize).skip(that.data.pageSize * (that.data.page - 1)).get({
      success: function (res) {
        // res.data 是包含以上定义的两条记录的数组

        if (res.data) {
          if (res.data.length < that.data.pageSize) {
            that.setData({
              flag: false
            })
          }
          that.setData({
            commentList: [...that.data.commentList, ...res.data],
            page: that.data.page + 1,
            loading: false
          })
        } else {
          that.setData({
            commentList: false
          })
        }
      }
    })

  },
  //滚动到底部
  scrolltolower: function() {
    if (this.data.flag) {
      this.getComment()
    }

  },

  //输入框的出现
  changeCommentShow: function(event) {

    var id = ''
    var nick = ''
    if (event.currentTarget.dataset.pid) {
      id = event.currentTarget.dataset.pid
      nick = event.currentTarget.dataset.nick
      if (id == 'false') {
        id = ''
        nick = ''
      }
    }
    this.setData({
      commentShow: !this.data.commentShow,
      pid: id,
      toNick: nick
    })
  },
  //编辑发送内容
  inputeidt: function(e) {
    let value = e.detail.value
    this.setData({
      inputText: value
    })
  },
  //发送
  pushComment:  function() {
    var token = wx.getStorageSync('token')
    var userInfo = app.globalData.userInfo
    var reg = /^\s+$/
    var that = this
    var toNick = ''
    if (this.data.inputText != null) {
      if (reg.test(this.data.inputText) || this.data.inputText.length < 1 || this.data.inputText.length > 300) {
        Toast.fail('文字内容过多或过少');
        return
      }
    } else {
      Toast.fail('内容不能为空');
      return
    }

    if (that.data.toNick) {
      toNick = '@' + that.data.toNick + ':'
    }
    var myDate = new Date()
    var times = myDate.toLocaleDateString() + ' ' + tool.translate24Hour(myDate)
    const db = wx.cloud.database()
    const test = db.collection('comment')
    test.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        replayId: that.data.id,
        content: toNick + that.data.inputText,
        userInfo: userInfo,
        craeteTime: times,
      },
      success: function (res) {
        that.updateReplyNum()
        
      },
      fail: function (err) {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        })
      }
    })
  },
  //重置刷新
  reload: function() {
    this.setData({
      commentList: [],
      page: 1,
      pageSize: 10,
      flag: true,
      loading: false,
      pid: '',
      toNick: ''
    })
    this.getComment()
  },
  //检查登录状态
  checkLogin: async function () {
    var token = wx.getStorageSync('token')

    var checkToken = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.it120.cc/tumi123api/user/check-token?token=' + token,
        success: function (res) {

          resolve(res.data.code)
        }
      })
    })

    if (!app.globalData.userInfo || checkToken != 0) {
      Dialog.confirm({
        title: '请先登录',
        zIndex: 1001
        // message: '去登录'
      }).then(() => {
        wx.switchTab({
          url: '../my/my'
        })
      }).catch(() => {
        // on cancel
      })
    } else {
      this.pushComment()
    }
  },
  updateReplyNum: function () {
    //  输出成功插入后的id以及其他信息
    const db = wx.cloud.database()
    db.collection('ask_box').doc(this.data.id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        replyNum: db.command.inc(1)
      },
      success: function (res) {
        wx.showModal({
          title: '发送成功',
          showCancel: false,
          success(res) {
            wx.switchTab({
              url: '../askQuestions/askQuestions'
            })
          }
        })
      }
    })
  }
})