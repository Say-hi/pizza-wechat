// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    needUseCoupon: false,
    page: -1,
    couponArr: []
  },
  getCouponData (status = 1) {
    let that = this
    app.wxrequest({
      url: app.getUrl().mycoupon,
      data: {
        session3rd: app.gs(),
        status,
        page: ++this.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          for (let v of res.data.data) {
            v.start_time = new Date(v.start_time * 1000).toLocaleDateString()
            v.end_time = new Date(v.end_time * 1000).toLocaleDateString()
          }
          that.setData({
            couponArr: that.data.couponArr.concat(res.data.data),
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
      page: -1,
      couponArr: []
    })
    this.getCouponData(e.currentTarget.dataset.index * 1 + 1)
  },
  // 使用优惠卷
  useCoupon (e) {
    app.su('useCoupon', this.data.couponArr[e.currentTarget.dataset.index])
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    /*eslint-disable*/
    this.setData({
      needUseCoupon: options.type === 'order' ? true : false,
      orderMoney: options.money || 0
    })
    this.getCouponData()
    // TODO: onLoad
  },
  onReachBottom () {
    if (!this.data.more) return app.setToast(this, {content: '您没有更多的优惠卷啦'})
    this.getCouponData(this.data.currentIndex * 1 + 1)
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
    // TODO: onPullDownRefresh
  }
})
