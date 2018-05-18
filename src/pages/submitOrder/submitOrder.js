// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  // 选择地址
  chooseAddress () {
    let that = this
    wx.chooseAddress({
      success (res) {
        if (res.telNumber) { // 获取信息成功
          wx.setStorageSync('addressInfo', res)
          that.setData({
            needSetting: false,
            addressInfo: res
          })
        }
      },
      fail () {
        wx.getSetting({
          success (res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              })
              app.setToast(that, {content: '需授权获取地址信息'})
            }
          }
        })
      }
    })
  },
  // 获取设置
  openSetting () {
    let that = this
    wx.openSetting({
      success (res) {
        // console.log(res)
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          })
          that.chooseAddress()
        }
      }
    })
  },
  // 选择支付方式
  choosePay () {
    if (!this.data.addressInfo) return app.setToast(this, {content: '请选择您的收货地址'})
    let that = this
    wx.showActionSheet({
      itemList: ['余额支付', '微信支付'],
      itemColor: '#333',
      success (res) {
        if (that.data.lostTime) {
          if (res.tapIndex * 1 + 1 === 1) {
            that.payMoney(that.data.orderId)
          } else {
            that.payMoneyBywc(that.data.orderId)
          }
        } else {
          that.orderSubmit(res.tapIndex * 1 + 1)
        }
        wx.removeStorageSync('goodsStorage')
        wx.removeStorageSync('useCoupon')
      }
    })
  },
  // 计算价格
  calculateMoney () {
    this.setData({
      calculateMoney: this.data.useCoupon ? this.data.allMoney * 1 + this.data.dispatch_fee * 1 - this.data.useCoupon.balance : this.data.allMoney * 1 + this.data.dispatch_fee * 1
    })
  },
  // 倒计时
  showLostTime (startTime) {
    console.log(new Date().getTime())
    console.log(new Date(startTime * 1000).toLocaleString())
    let endTime = startTime * 1000 + 900000 // 超时15分钟
    let timer = setInterval(() => {
      if (endTime - new Date().getTime() <= 0) {
        // todo 取消订单
        clearInterval(timer)
        app.setToast(this, {content: '该订单超时支付已取消'})
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
        return
      }
      let lost = parseInt((endTime - (new Date().getTime())) / 1000)
      // let m = parseInt(lost / 60)
      // let s = lost % 60
      this.setData({
        timeText: parseInt(lost / 60) === 0 ? lost % 60 + '秒' : parseInt(lost / 60) + '分' + lost % 60 + '秒'
      })
    }, 100)
  },
  // 获取订单详情
  getOrderDetail (oId, type) {
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
            calculateMoney: res.data.data.price,
            type,
            /*eslint-disable*/
            lostTime: type === 'second' ? true : false
          })
          that.showLostTime(res.data.data.time)
          that.setData({
            orderInfo: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  // 提交订单
  orderSubmit (type) {
    let that = this
    let orderdata = []
    for (let v of this.data.menuArr) {
      if (v.checked) {
        orderdata.push({s_id: v.id || v.s_id, num: v.num})
      }
    }
    app.wxrequest({
      url: app.getUrl().orderBuy,
      data: {
        session3rd: app.gs(),
        name: that.data.addressInfo.userName,
        phone: that.data.addressInfo.telNumber,
        address: that.data.addressInfo.provinceName + that.data.addressInfo.cityName + that.data.addressInfo.countyName + that.data.addressInfo.detailInfo,
        data: orderdata,
        cd_id: that.data.useCoupon ? that.data.useCoupon.cd_id : ''
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          if (type === 2) {
            that.payMoneyBywc(res.data.data)
          } else {
            that.payMoney(res.data.data)
          }
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  payMoney (id) {
    let that = this
    app.wxrequest({
      url: app.getUrl().orderPay,
      data: {
        session3rd: app.gs(),
        o_id: id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          wx.showToast({
            title: '付款成功'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          app.setToast(that, {content: res.data.msg})
          if (that.data.lostTime) return
          setTimeout(() => {
            wx.redirectTo({
              url: `../submitOrder/submitOrder?id=${id}&type=second`
            })
          }, 1500)
        }
      }
    })
  },
  payMoneyBywc (id) {
    let that = this
    app.wxrequest({
      url: app.getUrl().pay,
      data: {
        session3rd: app.gs(),
        o_id: id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === '200') {
          res.data.data.timeStamp = res.data.data.timeStamp.toString()
          res.data.data.success = function (res) {
            if (res.errMsg = 'requestPayment:ok') {
              wx.showToast({
                title: '付款成功'
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            } else {
              app.setToast(that, {content: res.errMsg})
              setTimeout(() => {
                wx.redirectTo({
                  url: `../submitOrder/submitOrder?id=${id}&type=second`
                })
              }, 1500)
            }
          }
          res.data.data.fail = function () {
            app.setToast(that, {content: '支付失败'})
            setTimeout(() => {
              wx.redirectTo({
                url: `../submitOrder/submitOrder?id=${id}&type=second`
              })
            }, 1500)
          }
          app.wxpay(res.data.data)
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
    /*eslint-disable*/
    if (options.type === 'second') {
      this.getOrderDetail(options.id, options.type)
    } else {
      this.setData({
        dispatch_fee: app.gs('shop').shop.dispatch_fee,
        menuArr: app.gs('goodsStorage')
      })
    }
    this.setData({
      orderId: options.id,
      allMoney: options.money || 0,
      sendTime: new Date(new Date().getTime() + 1500000).toLocaleString()
    })
    if (options.time) {
      this.showLostTime(options.time)
    }
    // this.calculateMoney()
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
    if (app.gs('useCoupon')) {
      this.setData({
        useCoupon: app.gs('useCoupon')
      })
    }
    if (app.gs('addressInfo') && !this.data.orderId) {
      this.setData({
        addressInfo: app.gs('addressInfo')
      })
    }
    this.calculateMoney()
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
    wx.removeStorageSync('useCoupon')
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
