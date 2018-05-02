'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerArr: [{
      img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      url: '../asdf/adsf'
    }, {
      img: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      url: '../asdf/adsf'
    }, {
      img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      url: '../asdf/adsf'
    }],
    indicatorColor: '#7c7c7c',
    indicatorActiveColor: '#000000',
    indicatorColor2: '#d0d0d0',
    indicatorActiveColor2: '#d0d0d0',
    show: true,
    shopInfo: [{
      i: 'icon-dizhi',
      l: '门店地址',
      r: '广州市天河区车陂龙口大街1号楼'
    }, {
      i: 'icon-dianhua',
      l: '预约电话',
      r: '13378692079'
    }, {
      i: 'icon-shijian01',
      l: '营业时间',
      r: '8:00-2:00'
    }]
  },
  // 关闭新人礼包
  close: function close() {
    var _this = this;

    if (this.data.small) return;
    this.setData({
      small: true
    });
    setTimeout(function () {
      _this.setData({
        show: false
      });
    }, 500);
  },

  // 打电话
  calls: function calls() {
    app.call(this.data.shopInfo[1].r);
  },
  setShopInfo: function setShopInfo() {
    var shops = app.gs('shop');
    this.data.shopInfo[0].r = shops.shop.address;
    this.data.shopInfo[1].r = shops.shop.tel;
    this.data.shopInfo[2].r = shops.shop.work_time;
    this.setData({
      shopInfo: this.data.shopInfo,
      shopIntroduce: shops.shop.content,
      bannerArr: shops.img,
      newcoupon: shops.coupon
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad() {
    app.wxlogin(this.setShopInfo, '');
    // console.dir(app.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    console.log(' ---------- onReady ----------');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    console.log(' ---------- onShow ----------');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    console.log(' ---------- onHide ----------');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    console.log(' ---------- onUnload ----------');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    console.log(' ---------- onPullDownRefresh ----------');
  }
});
//# sourceMappingURL=index.js.map
