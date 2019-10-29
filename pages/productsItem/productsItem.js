// pages/productsItem/productsItem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId: '',
    goodsInfo: {},
    typeInfo: {},
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    show: false,
    close: false,
    amount: 1,
    typeRowNum: 0,
    clickingBox: [],
    canNotClickBox: [],
    myChoose: {},
    typeV: [],
    infoList: [],
    data: {
      "source": "农产品"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    var that = this

    var goodsBaseInfo = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.it120.cc/tumi123api/shop/goods/detail?id=' + options.goodsId,
        success: function(res) {
          var info = res.data.data.basicInfo
          info.content = res.data.data.content
          info.pics = res.data.data.pics
          resolve(info)
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
    var typeInfo = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://www.fastmock.site/mock/26ec56645b0706b8e9a68a60854b6a00/ncp/goodType?id=' + options.goodsId,
        success: function(res) {
          var type = res.data.data
          type.tree.forEach((item) => {
            var len = Math.ceil(item.v.length / 2)
            item.rowNum = len
          })

          resolve(type)
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
    var typeV = []
    var infoList = typeInfo.list.filter(item => {
      if (item.stock_num && item.stock_num > 0){
        return true
      }
    })
    typeInfo.tree.forEach((item) => {
      item.v.forEach(oitem => {
        oitem.k_s = item.k_s
        typeV.push(oitem)
      })
    })

    that.setData({
      goodsInfo: goodsBaseInfo,
      goodsId: options.goodsId,
      typeInfo: typeInfo,
      typeV: typeV,
      infoList: infoList
    })

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  swiperNavigateTo: function(e) {
    var item = e.currentTarget.dataset.item
    var that = this
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: that.data.goodsInfo.swiper // 需要预览的图片http链接列表
    })
  },


  //弹框出现或关闭
  toShowClose: function() {
    this.setData({
      show: !this.data.show
    })
  },


  //数量变化
  onNumChange(event) {
    var that = this

    // this.setData({
    //   amount: event.detail,
    //   data: {
    //     "source": "农产品",
    //     "params": "goodsId=" + that.data.goodsId + "&typeId=" + chooseItem.id + "&num=" + event.detail
    //   }
    // })
  },
  //点中某一规格
  chooseType: function(event) {
    var chooseKS = event.currentTarget.dataset.ks
    var nowClick = event.currentTarget.dataset.item
    var clickingBox = this.data.clickingBox
    var newClickingBox = []
    nowClick.k_s = chooseKS

    //如果只有一种类型规格
    if (this.data.typeInfo.tree.length == 1) {
      newClickingBox.push(nowClick)
      this.setData({
        clickingBox: newClickingBox
      })
      this.findMyType(newClickingBox)
      return
    }



    //检查是否是不可选的
    var canNotClickCheck = this.data.canNotClickBox.some(item => {
      return item.id == nowClick.id
    })
    if (canNotClickCheck) {
      return false
    }

    //该规格该属性是否已经被选中
    var check = clickingBox.some((item) => {
      return item.id == nowClick.id
    })

    if (check) {
      this.setData({
        myChoose:[]
      })
      clickingBox.map((item) => {
        if (item.id !== nowClick.id) {
          newClickingBox.push(item)
        }
      })
      if (newClickingBox.length > 0) {
        this.filterFn(newClickingBox, newClickingBox[newClickingBox.length - 1])
      } else {
        this.setData({
          clickingBox: [],
          canNotClickBox: [],
        })
      }
    } else {
      //该规格是否有已经选择了其他属性
      var sameRowCheck = clickingBox.some((item) => {
        if (item.k_s == nowClick.k_s) {
          return true
        }
      })
      if (sameRowCheck) {

        clickingBox.map((item, index) => {
          if (item.k_s != nowClick.k_s) {
            newClickingBox.push(item)
          }
        })

      } else {
        newClickingBox = clickingBox

      }
      newClickingBox.push(nowClick)
      this.filterFn(newClickingBox, nowClick)

    }
  },

  // //判断有哪些规格不能用
  filterFn: function(newClickingBox, nowClick) {
    var typeList = this.data.infoList
    var typeV = JSON.parse(JSON.stringify(this.data.typeV))
    var canNotClickBox = []
    var hasNowClickBox = []

    if (newClickingBox.length == this.data.typeInfo.tree.length) {
      canNotClickBox = typeV.filter((item, index) => {
        var flag = true
        for (let i = 0; i < newClickingBox.length; i++) {
          if (newClickingBox[i].id == item.id) {
            flag = false
          }
        }
        return flag
      })
      this.findMyType(newClickingBox)

    } else {
      typeList.forEach((item) => {
        if (item[nowClick.k_s] == nowClick.id) {
          hasNowClickBox.push(item)
        }
      })
      canNotClickBox = typeV.filter((item, index) => {
        var flag = true
        for (let i = 0; i < hasNowClickBox.length; i++) {
          if (item.k_s == nowClick.k_s) {
            flag = false
          }
          if (hasNowClickBox[i].s1 == item.id || hasNowClickBox[i].s2 == item.id || hasNowClickBox[i].s3 == item.id) {
            flag = false
          }
        }
        return flag
      })
    }
    this.setData({
      canNotClickBox: canNotClickBox,
      clickingBox: newClickingBox
    })
  },
  //规格选齐后
  findMyType: function(newClickingBox) {
    var myClickingBox = newClickingBox
    var infoList = this.data.infoList

    var myChoose = infoList.filter(item => {
      // if(item.k_s == 's1' && item.id == )
      var flag = 0
      for (let i = 0; i < myClickingBox.length; i++) {
        if (myClickingBox[i].k_s == 's1' && item.s1 == myClickingBox[i].id) {
          flag++
        }
        if (myClickingBox[i].k_s == 's2' && item.s2 == myClickingBox[i].id) {
          flag++
        }
        if (myClickingBox[i].k_s == 's3' && item.s3 == myClickingBox[i].id) {
          flag++
        }
      }
      return flag == myClickingBox.length
    })
    this.setData({
      myChoose: myChoose[0],
      amount: 1
    })
  }
})