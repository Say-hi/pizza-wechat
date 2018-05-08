'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'setPhone',
    text: '获取验证码'
  },
  getCode: function getCode(phone) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().getcode,
      data: {
        session3rd: app.gs(),
        phone: phone
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          that.lostTime();
          wx.showToast({
            title: '请查收验证码'
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  confirm: function confirm(e) {
    var that = this;
    if (e.detail.target.dataset.type === 'code') {
      if (app.checkMobile(e.detail.value.phone)) return app.setToast(this, { content: '请输入正确的11位手机号' });
      this.getCode(e.detail.value.phone);
    } else {
      if (app.checkMobile(e.detail.value.phone)) return app.setToast(this, { content: '请输入正确的11位手机号' });
      if (!e.detail.value.code) return app.setToast(this, { content: '请输入验证码' });
      app.wxrequest({
        url: app.getUrl().bind,
        data: {
          session3rd: app.gs(),
          phone: e.detail.value.phone,
          code: e.detail.value.code
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.code === '200') {
            wx.showToast({
              title: '绑定成功'
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 1000);
          } else {
            app.setToast(that, { content: res.data.msg });
          }
        }
      });
    }
  },

  // 倒计时
  lostTime: function lostTime() {
    var that = this;
    var time = 60;
    // todo 请求验证码
    var timer = setInterval(function () {
      if (time <= 1) {
        that.setData({
          disabled: false,
          text: '\u91CD\u53D1\u9001\u9A8C\u8BC1\u7801'
        });
        return clearInterval(timer);
      }
      that.setData({
        disabled: true,
        text: --time + '\u79D2\u540E\u91CD\u53D1\u9001'
      });
    }, 1000);
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
//# sourceMappingURL=setPhone.js.map
