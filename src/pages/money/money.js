// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    listArr: [],
    page: -1
  },
  show () {
    this.setData({
      show: !this.data.show
    })
  },
  charge (e) {
    if (e.detail.value.money <= 0 || !e.detail.value.money) return app.setToast(this, {content: '请输入充值金额'})
    let that = this
    app.wxrequest({
      url: app.getUrl().pay,
      data: {
        session3rd: app.gs(),
        money: e.detail.value.money
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          res.data.data.timeStamp = res.data.data.timeStamp.toString()
          res.data.data.success = function (res) {
            if (res.errMsg === 'requestPayment:ok') {
              wx.showToast({
                title: '充值成功'
              })
              that.setData({
                show: false
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              app.setToast(that, {content: res.errMsg})
            }
          }
          res.data.data.fail = function () {
            wx.showToast({
              title: '充值失败'
            })
          }
          app.wxpay(res.data.data)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getDetail () {
    let that = this
    app.wxrequest({
      url: app.getUrl().mymoney,
      data: {
        session3rd: app.gs(),
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          for (let v of res.data.data) {
            v.time = new Date(v.time * 1000).toLocaleString()
          }
          that.setData({
            listArr: that.data.listArr.concat(res.data.data),
            more: res.data.data.length < 10 ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getrechargeSet () {
    let that = this
    app.wxrequest({
      url: app.getUrl().rechargeSet,
      data: {
        session3rd: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          that.setData({
            chargeArr: res.data.data
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
  onLoad (options) {
    this.setData({
      m: options.m
    })
    this.getrechargeSet()
    this.getDetail()
    // TODO: onLoad
  },
  onReachBottom () {
    if (!this.data.more) return app.setToast(this, {content: '您没有更多的交易信息啦'})
    this.getDetail()
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
