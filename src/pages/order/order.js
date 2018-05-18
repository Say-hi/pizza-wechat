// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderArr: [],
    currentIndex: 0,
    needshowindex: -1,
    page: 0
  },
  getOrderData (page = 0, status = '') {
    let that = this
    app.wxrequest({
      url: app.getUrl().myorder,
      data: {
        session3rd: app.gs(),
        page,
        status
      },
      success (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.code === '200') {
          for (let v of res.data.data) {
            let allMoney = 0
            for (let i of v.detail) {
              allMoney += i.num * i.price
            }
            v['allMoney'] = allMoney
          }
          that.setData({
            orderArr: that.data.orderArr.concat(res.data.data),
            more: res.data.data.length < 10 ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  chooseTab (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      page: 0,
      orderArr: []
    })
    this.getOrderData(0, this.data.currentIndex ? this.data.currentIndex : '')
  },
  delOrder (e) {
    wx.showToast({
      title: '模拟删除'
    })
  },
  orderOperation (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().delOrder,
      data: {
        session3rd: app.gs(),
        o_id: e.currentTarget.dataset.id,
        status: e.currentTarget.dataset.type * 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          that.data.orderArr.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            orderArr: that.data.orderArr
          })
          wx.showToast({
            title: '操作成功'
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  cuidan () {
    app.call(app.gs('shop').shop.tel)
  },
  showAll (e) {
    this.setData({
      needshowindex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.getOrderData()
    // TODO: onLoad
  },
  onReachBottom () {
    if (!this.data.more) return app.setToast(this, {content: '您没有更多的订单啦'})
    // let that = this
    this.getOrderData(++this.data.page, this.data.currentIndex ? this.data.currentIndex : '')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.setData({
      page: 0,
      orderArr: []
    })
    this.getOrderData(0, this.data.currentIndex ? this.data.currentIndex : '')
    // TODO: onPullDownRefresh
  }
})
