'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
    sendMoney: 20
  },
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
    wx.showActionSheet({
      itemList: ['微信支付', '余额支付'],
      itemColor: '#333',
      success: function success(res) {
        console.log(res.tapIndex);
        wx.showToast({
          title: '模拟支付成功'
        });
        wx.redirectTo({
          url: '../order/order'
        });
        wx.removeStorageSync('goodsStorage');
        wx.removeStorageSync('useCoupon');
      }
    });
  },

  // 计算价格
  calculateMoney: function calculateMoney() {
    this.setData({
      calculateMoney: this.data.useCoupon ? this.data.allMoney * 1 + this.data.sendMoney * 1 - this.data.useCoupon.del : this.data.allMoney * 1 + this.data.sendMoney * 1
    });
  },

  // 倒计时
  showLostTime: function showLostTime(startTime) {
    var _this = this;

    var endTime = new Date(startTime).getTime() + 900000; // 超时15分钟
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    /*eslint-disable*/
    // new Date(new Date().getTime() + 1500000)
    this.setData({
      lostTime: options.type === 'second' ? true : false,
      menuArr: app.gs('goodsStorage'),
      sendTime: new Date(new Date().getTime() + 1500000).toLocaleString(),
      allMoney: options.money || 0
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
    if (app.gs('addressInfo')) {
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
