// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  // 获取订单详情
  getOrderDetail (oId) {
    let that = this
    app.wxrequest({
      url: app.getUrl().detail,
      data: {
        session3rd: app.gs(),
        o_id: oId
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          let addressInfo = {
            userName: res.data.data.name,
            telNumber: res.data.data.phone,
            provinceName: res.data.data.address
          }
          that.setData({
            addressInfo,
            menuArr: res.data.data.detail,
            dispatch_fee: res.data.data.dispatch_fee,
            coupon_price: res.data.data.coupon_price,
            allMoney: res.data.data.price
          })
          res.data.data.time = new Date(res.data.data.time * 1000).toLocaleString()
          res.data.data.pay_time = new Date(res.data.data.pay_time * 1000).toLocaleString()
          that.setData({
            orderInfo: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  call () {
    app.call(app.gs('shop').shop.tel)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getOrderDetail(options.id)
    // TODO: onLoad
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
