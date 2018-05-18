'use strict';

// 获取全局应用程序实例对象
var app = getApp();

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
  show: function show() {
    this.setData({
      show: !this.data.show
    });
  },
  charge: function charge(e) {
    if (e.detail.value.money <= 0 || !e.detail.value.money) return app.setToast(this, { content: '请输入充值金额' });
    var that = this;
    app.wxrequest({
      url: app.getUrl().pay,
      data: {
        session3rd: app.gs(),
        money: e.detail.value.money
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          res.data.data.timeStamp = res.data.data.timeStamp.toString();
          res.data.data.success = function (res) {
            if (res.errMsg === 'requestPayment:ok') {
              wx.showToast({
                title: '充值成功'
              });
              that.setData({
                show: false
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                });
              }, 1000);
            } else {
              app.setToast(that, { content: res.errMsg });
            }
          };
          res.data.data.fail = function () {
            wx.showToast({
              title: '充值失败'
            });
          };
          app.wxpay(res.data.data);
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  getDetail: function getDetail() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().mymoney,
      data: {
        session3rd: app.gs(),
        page: ++that.data.page
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

              v.time = new Date(v.time * 1000).toLocaleString();
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
            listArr: that.data.listArr.concat(res.data.data),
            more: res.data.data.length < 10 ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  getrechargeSet: function getrechargeSet() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().rechargeSet,
      data: {
        session3rd: app.gs()
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          that.setData({
            chargeArr: res.data.data
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
  onLoad: function onLoad(options) {
    this.setData({
      m: options.m
    });
    this.getrechargeSet();
    this.getDetail();
    // TODO: onLoad
  },
  onReachBottom: function onReachBottom() {
    if (!this.data.more) return app.setToast(this, { content: '您没有更多的交易信息啦' });
    this.getDetail();
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
//# sourceMappingURL=money.js.map
