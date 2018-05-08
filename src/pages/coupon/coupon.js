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
    couponArr: [
      {
        need: 40,
        del: 20,
        time: '有效期30天',
        title: '阿斯顿发撒旦法'
      },
      {
        need: 50,
        del: 30,
        time: '有效期30天',
        title: '阿斯顿发撒旦法'
      },
      {
        need: 600,
        del: 300,
        time: '有效期30天',
        title: '阿斯顿发撒旦法'
      }
    ]
  },
  getCouponData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().mycoupon,
      data: {
        session3rd: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          for (let m in res.data.data) {
            for (let v of res.data.data[m]) {
              v.start_time = new Date(v.start_time * 1000).toLocaleString()
              v.end_time = new Date(v.end_time * 1000).toLocaleString()
            }
          }
          that.setData({
            couponArr: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  chooseTab (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },
  // 使用优惠卷
  useCoupon (e) {
    app.su('useCoupon', this.data.couponArr.wsy[e.currentTarget.dataset.index])
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
