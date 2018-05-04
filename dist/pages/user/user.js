'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
  },
  call: function call() {
    app.call(this.data.userInfo.kefu_tel);
  },
  getUser: function getUser() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().user,
      data: {
        session3rd: app.gs()
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          that.setData({
            userInfo: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  getCouponData: function getCouponData() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().mycoupon,
      data: {
        session3rd: app.gs()
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          that.setData({
            couponCount: res.data.data.wsy.length
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
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
    this.getCouponData();
    this.getUser();
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
//# sourceMappingURL=user.js.map
