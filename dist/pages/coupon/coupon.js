'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    needUseCoupon: false,
    page: -1,
    couponArr: []
  },
  getCouponData: function getCouponData() {
    var status = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    var that = this;
    app.wxrequest({
      url: app.getUrl().mycoupon,
      data: {
        session3rd: app.gs(),
        status: status,
        page: ++this.data.page
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              v.start_time = new Date(v.start_time * 1000).toLocaleDateString();
              v.end_time = new Date(v.end_time * 1000).toLocaleDateString();
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

          that.setData({
            couponArr: that.data.couponArr.concat(res.data.data),
            more: res.data.data.length < 10 ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  chooseTab: function chooseTab(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      page: -1,
      couponArr: []
    });
    this.getCouponData(e.currentTarget.dataset.index * 1 + 1);
  },

  // 使用优惠卷
  useCoupon: function useCoupon(e) {
    app.su('useCoupon', this.data.couponArr[e.currentTarget.dataset.index]);
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    /*eslint-disable*/
    this.setData({
      needUseCoupon: options.type === 'order' ? true : false,
      orderMoney: options.money || 0
    });
    this.getCouponData();
    // TODO: onLoad
  },
  onReachBottom: function onReachBottom() {
    if (!this.data.more) return app.setToast(this, { content: '您没有更多的优惠卷啦' });
    this.getCouponData(this.data.currentIndex * 1 + 1);
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
//# sourceMappingURL=coupon.js.map
