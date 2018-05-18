// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  call () {
    app.call(this.data.userInfo.kefu_tel)
  },
  getUser () {
    let that = this
    app.wxrequest({
      url: app.getUrl().user,
      data: {
        session3rd: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          that.setData({
            userInfo: res.data.data,
            userPhone: res.data.data.phone ? res.data.data.phone.replace(res.data.data.phone.substr(3, 4), '****') : ''
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.setData({
      img: app.gs('shop').shop.img
    })
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
    // this.getCouponData()
    this.getUser()
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
