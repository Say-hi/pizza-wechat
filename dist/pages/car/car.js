'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    allMoney: 0
  },
  // 菜单页数量选择
  chooseMenuNum: function chooseMenuNum(e) {
    if (e.currentTarget.dataset.type === 'del') {
      --this.data.menuArr[e.currentTarget.dataset.index].num;
    } else {
      if (!this.data.menuArr[e.currentTarget.dataset.index].num) {
        this.data.menuArr[e.currentTarget.dataset.index].num = 1;
      } else {
        ++this.data.menuArr[e.currentTarget.dataset.index].num;
      }
    }
    this.setData({
      menuArr: this.data.menuArr
    });
    this.calculatorMoney();
  },

  // 确认订单
  confirm: function confirm() {
    wx.navigateTo({
      url: '../submitOrder/submitOrder?money=' + this.data.allMoney
    });
  },

  // 删除当前物品
  del: function del(e) {
    this.data.menuArr.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      menuArr: this.data.menuArr
    });
    this.calculatorMoney();
  },

  // 编辑
  setting: function setting() {
    this.setData({
      editor: !this.data.editor
    });
  },

  // 计算总价格
  calculatorMoney: function calculatorMoney() {
    var allMoney = 0;
    app.su('goodsStorage', this.data.menuArr);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = app.gs('goodsStorage')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        if (v.num && v.checked) {
          allMoney += v.num * v.price;
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

    this.setData({
      allMoney: allMoney
    });
  },

  // 选择所有
  chooseAll: function chooseAll(must) {
    if (must === 'must') {
      // console.log(1)
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.data.menuArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var v = _step2.value;

          v['checked'] = true;
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

      this.setData({
        all: true,
        menuArr: this.data.menuArr
      });
    } else {
      // console.log(2)
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.data.menuArr[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _v = _step3.value;

          _v['checked'] = !this.data.all;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.setData({
        all: !this.data.all,
        menuArr: this.data.menuArr
      });
    }
    this.calculatorMoney();
  },

  // 多项选择
  choose: function choose(e) {
    this.data.menuArr[e.currentTarget.dataset.index].checked = !this.data.menuArr[e.currentTarget.dataset.index].checked;
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = this.data.menuArr.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _step4$value = _slicedToArray(_step4.value, 2),
            i = _step4$value[0],
            v = _step4$value[1];

        if (!v.checked) {
          this.setData({
            all: false,
            menuArr: this.data.menuArr
          });
          this.calculatorMoney();
          return;
        }
        if (i === this.data.menuArr.length - 1) {
          this.setData({
            all: true,
            menuArr: this.data.menuArr
          });
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    this.calculatorMoney();
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
    if (app.gs('goodsStorage')) {
      console.log(2);
      this.setData({
        menuArr: app.gs('goodsStorage')
      });
      this.chooseAll('must');
    } else {
      console.log(1);
      this.setData({
        menuArr: []
      });
    }
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
//# sourceMappingURL=car.js.map
