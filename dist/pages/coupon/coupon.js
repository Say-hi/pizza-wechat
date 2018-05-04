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
    couponArr: [{
      need: 40,
      del: 20,
      time: '有效期30天',
      title: '阿斯顿发撒旦法'
    }, {
      need: 50,
      del: 30,
      time: '有效期30天',
      title: '阿斯顿发撒旦法'
    }, {
      need: 600,
      del: 300,
      time: '有效期30天',
      title: '阿斯顿发撒旦法'
    }]
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
          for (var m in res.data.data) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = res.data.data[m][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var v = _step.value;

                v.start_time = new Date(v.start_time).toLocaleString();
                v.end_time = new Date(v.end_time).toLocaleString();
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
          }
          that.setData({
            couponArr: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  chooseTab: function chooseTab(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    });
  },

  // 使用优惠卷
  useCoupon: function useCoupon(e) {
    app.su('useCoupon', this.data.couponArr.wsy[e.currentTarget.dataset.index]);
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
