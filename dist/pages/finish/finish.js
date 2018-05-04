'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  // 获取订单详情
  getOrderDetail: function getOrderDetail(oId) {
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
            allMoney: res.data.data.price
          });
          res.data.data.time = new Date(res.data.data.time * 1000).toLocaleString();
          res.data.data.pay_time = new Date(res.data.data.pay_time * 1000).toLocaleString();
          that.setData({
            orderInfo: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  call: function call() {
    app.call(app.gs('shop').shop.tel);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.getOrderDetail(options.id);
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
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});
//# sourceMappingURL=finish.js.map
