'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  // 选择地址
  chooseAddress: function chooseAddress() {
    var that = this;
    wx.chooseAddress({
      success: function success(res) {
        if (res.telNumber) {
          // 获取信息成功
          wx.setStorageSync('addressInfo', res);
          that.setData({
            needSetting: false,
            addressInfo: res
          });
        }
      },
      fail: function fail() {
        wx.getSetting({
          success: function success(res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              });
              app.setToast(that, { content: '需授权获取地址信息' });
            }
          }
        });
      }
    });
  },

  // 获取设置
  openSetting: function openSetting() {
    var that = this;
    wx.openSetting({
      success: function success(res) {
        // console.log(res)
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          });
          that.chooseAddress();
        }
      }
    });
  },

  // 选择支付方式
  choosePay: function choosePay() {
    if (!this.data.addressInfo) return app.setToast(this, { content: '请选择您的收货地址' });
    var that = this;
    wx.showActionSheet({
      itemList: ['微信支付', '余额支付'],
      itemColor: '#333',
      success: function success(res) {
        if (that.data.lostTime) {} else {
          that.orderSubmit(res.tapIndex);
        }
        wx.removeStorageSync('goodsStorage');
        wx.removeStorageSync('useCoupon');
      }
    });
  },

  // 计算价格
  calculateMoney: function calculateMoney() {
    this.setData({
      calculateMoney: this.data.useCoupon ? this.data.allMoney * 1 + this.data.dispatch_fee * 1 - this.data.useCoupon.balance : this.data.allMoney * 1 + this.data.dispatch_fee * 1
    });
  },

  // 倒计时
  showLostTime: function showLostTime(startTime) {
    var _this = this;

    console.log(new Date().getTime());
    console.log(new Date(startTime * 1000).toLocaleString());
    var endTime = startTime * 1000 + 900000; // 超时15分钟
    var timer = setInterval(function () {
      if (endTime - new Date().getTime() <= 0) {
        // todo 取消订单
        clearInterval(timer);
        app.setToast(_this, { content: '该订单超时支付已取消' });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          });
        }, 1500);
        return;
      }
      var lost = parseInt((endTime - new Date().getTime()) / 1000);
      // let m = parseInt(lost / 60)
      // let s = lost % 60
      _this.setData({
        timeText: parseInt(lost / 60) === 0 ? lost % 60 + '秒' : parseInt(lost / 60) + '分' + lost % 60 + '秒'
      });
    }, 100);
  },

  // 获取订单详情
  getOrderDetail: function getOrderDetail(oId, type) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().detail,
      data: {
        session3rd: app.gs(),
        o_id: oId
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          var addressInfo = {
            userName: res.data.data.name,
            telNumber: res.data.data.phone,
            provinceName: res.data.data.address
          };
          that.setData({
            addressInfo: addressInfo,
            menuArr: res.data.data.detail,
            dispatch_fee: res.data.data.dispatch_fee,
            coupon_price: res.data.data.coupon_price,
            calculateMoney: res.data.data.price,
            type: type,
            /*eslint-disable*/
            lostTime: type === 'second' ? true : false
          });
          that.showLostTime(res.data.data.time);
          that.setData({
            orderInfo: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },

  // 提交订单
  orderSubmit: function orderSubmit() {
    var that = this;
    var orderdata = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.data.menuArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        if (v.checked) {
          orderdata.push({ s_id: v.id || v.s_id, num: v.num });
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
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
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          // console.log(res)
          console.log(res.data.data);
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    /*eslint-disable*/
    if (options.type === 'second') {
      this.getOrderDetail(options.id, options.type);
    } else {
      this.setData({
        dispatch_fee: app.gs('shop').shop.dispatch_fee,
        menuArr: app.gs('goodsStorage')
      });
    }
    this.setData({
      orderId: options.id,
      allMoney: options.money || 0,
      sendTime: new Date(new Date().getTime() + 1500000).toLocaleString()
    });
    if (options.time) {
      this.showLostTime(options.time);
    }
    // this.calculateMoney()
    // TODO: onLoad
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    // TODO: onReady
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    if (app.gs('useCoupon')) {
      this.setData({
        useCoupon: app.gs('useCoupon')
      });
    }
    if (app.gs('addressInfo') && !this.data.orderId) {
      this.setData({
        addressInfo: app.gs('addressInfo')
      });
    }
    this.calculateMoney();
    // TODO: onShow
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // TODO: onHide
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    wx.removeStorageSync('useCoupon');
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});
//# sourceMappingURL=submitOrder.js.map
