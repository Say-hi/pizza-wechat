// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    sizeIndex: 0,
    sizeNum: 1,
    allMoney: 0,
    couponArr: [
      {
        need: 100,
        del: 10,
        id: 12
      },
      {
        need: 100,
        del: 10,
        id: 12
      }
    ],
    menuArr: [
      {
        img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '超级好吃的榴莲',
        sale: '888',
        price: '88.50',
        id: 1,
        sizeArr: []
      },
      {
        img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '超级好吃的榴莲',
        sale: '888',
        price: '88.50',
        id: 2,
        sizeArr: []
      },
      {
        img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '超级好吃的榴莲',
        sale: '888',
        price: '88.50',
        id: 3,
        sizeArr: [
          {
            id: 31,
            size: 10,
            price: 110,
            num: 1
          },
          {
            id: 32,
            size: 40,
            price: 13,
            num: 1
          }
        ]
      },
      {
        img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '超级好吃的榴莲',
        sale: '888',
        price: '88.50',
        id: 4,
        sizeArr: [
          {
            id: 41,
            size: 10,
            price: 110,
            num: 1
          },
          {
            id: 42,
            size: 40,
            price: 13,
            num: 1
          },
          {
            id: 43,
            size: 50,
            price: 13,
            num: 1
          }
        ]
      }
    ],
    // showSizeChoose: fasle,
    src: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
  },
  // 领取优惠卷
  getCoupon (e) {
    let that = this
    app.setToast(that, {image: '../../images/success.png', bgc: '#333', color: '#f30', content: '领取成功'})
  },
  // 菜单页数量选择
  chooseMenuNum (e) {
    if (e.currentTarget.dataset.type === 'del') {
      --this.data.menuArr[e.currentTarget.dataset.index].num
    } else {
      if (!this.data.menuArr[e.currentTarget.dataset.index].num) {
        this.data.menuArr[e.currentTarget.dataset.index].num = 1
      } else {
        ++this.data.menuArr[e.currentTarget.dataset.index].num
      }
    }
    this.setData({
      menuArr: this.data.menuArr
    })
    this.setGoodsStorage()
  },
  // 确定下单
  confirm () {
    wx.navigateTo({
      url: `../submitOrder/submitOrder?money=${this.data.allMoney}`
    })
  },
  // 尺寸选择弹窗
  close (e) {
    if (e.currentTarget.dataset.type === 'addCar') {
      // todo  购物车相关计算逻辑
      this.setGoodsStorage(true)
    }
    this.setData({
      showIndex: e.currentTarget.dataset.index || this.data.showIndex,
      showSizeChoose: !this.data.showSizeChoose,
      sizeNum: 1
    })
  },
  // 将选择的物品放置缓存
  setGoodsStorage (size) {
    let that = this
    let goodsStorage = app.gs('goodsStorage') || []
    if (size) { // 单独规格添加
      // console.log(1)
      if (goodsStorage.length < 1) {
        goodsStorage.push({
          img: that.data.menuArr[that.data.showIndex].img,
          name: that.data.menuArr[that.data.showIndex].name,
          price: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].price,
          id: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].id,
          size: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].size,
          num: that.data.sizeNum
        })
      } else {
        for (let [i, v] of goodsStorage.entries()) {
          if (v.id === that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].id) { // 如果存在
            goodsStorage[i] = {
              img: that.data.menuArr[that.data.showIndex].img,
              name: that.data.menuArr[that.data.showIndex].name,
              price: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].price,
              id: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].id,
              size: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].size,
              num: that.data.sizeNum
            }
            break
          } else if (i === goodsStorage.length - 1) {
            goodsStorage.push({
              img: that.data.menuArr[that.data.showIndex].img,
              name: that.data.menuArr[that.data.showIndex].name,
              price: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].price,
              id: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].id,
              size: that.data.menuArr[that.data.showIndex].sizeArr[that.data.sizeIndex].size,
              num: that.data.sizeNum
            })
          }
        }
      }
    } else {
      // console.log(2)
      // 单独规格选择
      for (let v of this.data.menuArr) {
        if (v.sizeArr.length > 1) continue // 有规格的不添加
        if (v.num >= 0) {
          if (goodsStorage.length >= 1) {
            for (let [i, m] of goodsStorage.entries()) {
              if (m.id === v.id) { // 缓存中存在该项,重新赋值，跳出循环
                goodsStorage[i] = v
                break
              } else if (i === goodsStorage.length - 1) {
                goodsStorage.push(v)
              }
            }
          } else {
            goodsStorage.push(v)
          }
        }
      }
    }
    let num = 0
    for (let [i, v] of goodsStorage.entries()) {
      if (v.num === 0) {
        goodsStorage.splice(i, 1)
      }
      num += v.num
    }
    app.su('goodsStorage', goodsStorage)
    this.calculatorMoney()
    this.setData({
      allCount: num,
      sizeIndex: 0,
      sizeNum: 1
    })
  },
  // 计算总价格
  calculatorMoney () {
    let allMoney = 0
    for (let v of app.gs('goodsStorage')) {
      if (v.num) {
        allMoney += v.num * v.price
      }
    }
    if (allMoney <= 0) {
      wx.removeStorageSync('goodsStorage')
    }
    this.setData({
      allMoney
    })
  },
  // 选择尺寸
  chooseSize (e) {
    this.setData({
      sizeIndex: e.currentTarget.dataset.index,
      sizeNum: 1
    })
  },
  // 尺寸数量选择
  chooseSizeNum (e) {
    if (e.currentTarget.dataset.type === 'del') {
      this.setData({
        sizeNum: --this.data.sizeNum
      })
    } else {
      this.setData({
        sizeNum: ++this.data.sizeNum
      })
    }
  },
  // 顶栏选择
  chooseTab (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    // wx.removeStorageSync('goodsStorage')
    // TODO: onLoad
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    let num = 0
    for (let v of app.gs('goodsStorage')) {
      num += parseInt(v.num)
    }
    this.calculatorMoney()
    if (app.gs('goodsStorage')) {
      if (app.gs('goodsStorage').length >= 1) {
        for (let v of this.data.menuArr) {
          for (let g of app.gs('goodsStorage')) {
            if (g.id === v.id) {
              v.num = g.num
              break
            } else {
              v.num = 0
            }
          }
        }
      } else {
        for (let s of this.data.menuArr) {
          s.num = 0
        }
      }
    } else {
      for (let s of this.data.menuArr) {
        s.num = 0
      }
    }
    this.setData({
      allCount: num,
      menuArr: this.data.menuArr
    })
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
