'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderArr: [],
    currentIndex: 0,
    needshowindex: -1,
    page: 0
  },
  getOrderData: function getOrderData() {
    var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var that = this;
    app.wxrequest({
      url: app.getUrl().myorder,
      data: {
        session3rd: app.gs(),
        page: page,
        status: status
      },
      success: function success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.code === '200') {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              var allMoney = 0;
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = v.detail[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var i = _step2.value;

                  allMoney += i.num * i.price;
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }

              v['allMoney'] = allMoney;
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
            orderArr: that.data.orderArr.concat(res.data.data),
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
      page: 0,
      orderArr: []
    });
    this.getOrderData(0, this.data.currentIndex ? this.data.currentIndex : '');
  },
  delOrder: function delOrder(e) {
    wx.showToast({
      title: '模拟删除'
    });
  },
  orderOperation: function orderOperation(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().delOrder,
      data: {
        session3rd: app.gs(),
        o_id: e.currentTarget.dataset.id,
        status: e.currentTarget.dataset.type * 1
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === '200') {
          that.data.orderArr.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            orderArr: that.data.orderArr
          });
          wx.showToast({
            title: '操作成功'
          });
        } else {
          app.setToast(that, { content: res.data.msg });
        }
      }
    });
  },
  cuidan: function cuidan() {
    app.call(app.gs('shop').shop.tel);
  },
  showAll: function showAll(e) {
    this.setData({
      needshowindex: e.currentTarget.dataset.index
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    this.getOrderData();
    // TODO: onLoad
  },
  onReachBottom: function onReachBottom() {
    if (!this.data.more) return app.setToast(this, { content: '您没有更多的订单啦' });
    // let that = this
    this.getOrderData(++this.data.page, this.data.currentIndex ? this.data.currentIndex : '');
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
    this.setData({
      page: 0,
      orderArr: []
    });
    this.getOrderData(0, this.data.currentIndex ? this.data.currentIndex : '');
    // TODO: onPullDownRefresh
  }
});
//# sourceMappingURL=order.js.map
