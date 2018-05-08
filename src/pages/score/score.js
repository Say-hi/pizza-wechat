// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  getDetail () {
    let that = this
    app.wxrequest({
      url: app.getUrl().myintegra,
      data: {
        session3rd: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          for (let v of res.data.data.list) {
            v.time = new Date(v.time * 1000).toLocaleString()
          }
          that.setData({
            set: res.data.data.set,
            get: res.data.data.get,
            listArr: res.data.data.list
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  // 关闭规则
  close () {
    if (this.data.small) return
    this.setData({
      small: true
    })
    setTimeout(() => {
      this.setData({
        show: false
      })
    }, 500)
  },
  show () {
    this.setData({
      show: true,
      small: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (optiosn) {
    this.setData({
      score: optiosn.score
    })
    this.getDetail()
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
