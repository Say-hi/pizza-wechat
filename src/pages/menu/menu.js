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
    allMoney: 0
  },
  // 领取优惠卷
  getCoupon (e) {
    let that = this
    app.setToast(that, {image: '../../images/success.png', bgc: '#333', color: '#f30', content: '领取成功'})
  },
  // 菜单页数量选择
  chooseMenuNum (e) {
    if (e.currentTarget.dataset.type === 'del') {
      --this.data.menuArr[this.data.currentIndex].list[e.currentTarget.dataset.index].num
    } else {
      if (!this.data.menuArr[this.data.currentIndex].list[e.currentTarget.dataset.index].num) {
        this.data.menuArr[this.data.currentIndex].list[e.currentTarget.dataset.index].num = 1
      } else {
        ++this.data.menuArr[this.data.currentIndex].list[e.currentTarget.dataset.index].num
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
      showIndex: e.currentTarget.dataset.index.toString() || this.data.showIndex,
      showSizeChoose: !this.data.showSizeChoose,
      sizeNum: 1
    })
  },
  // 将选择的物品放置缓存
  setGoodsStorage (size) {
    let that = this
    let goodsStorage = app.gs('goodsStorage') || []
    if (size) { // 单独规格添加
      if (goodsStorage.length < 1) {
        goodsStorage.push({
          img: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].src,
          name: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].goodsname,
          price: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].price,
          id: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].s_id || 0,
          size: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].spec_name,
          num: that.data.sizeNum
        })
      } else {
        for (let [i, v] of goodsStorage.entries()) {
          if (v.id === that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].s_id) { // 如果存在
            goodsStorage[i] = {
              img: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].src,
              name: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].goodsname,
              price: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].price,
              id: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].s_id,
              size: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].spec_name,
              num: that.data.sizeNum
            }
            break
          } else if (i === goodsStorage.length - 1) {
            goodsStorage.push({
              img: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].src,
              name: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].goodsname,
              price: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].price,
              id: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].s_id,
              size: that.data.menuArr[that.data.currentIndex].list[that.data.showIndex].spec[that.data.sizeIndex].spec_name,
              num: that.data.sizeNum
            })
          }
        }
      }
    } else {
      // 单独规格选择
      for (let v of this.data.menuArr[this.data.currentIndex].list) {
        if (v.spec.length >= 1) continue // 有规格的不添加
        if (v.num >= 0) {
          if (goodsStorage.length >= 1) {
            for (let [i, m] of goodsStorage.entries()) {
              if (m.id === v.g_id || m.g_id === v.g_id) { // 缓存中存在该项,重新赋值，跳出循环
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
      currentIndex: e.currentTarget.dataset.index,
      t_id: e.currentTarget.dataset.id
    })
  },
  // 获取菜单
  getMenuData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().menu,
      data: {
        session3rd: app.gs()
      },
      success (res) {
        if (res.data.code === '200') {
          wx.hideLoading()
          let menuTabArr = []
          for (let i in res.data.data) {
            if (res.data.data[i].t_id) {
              menuTabArr.push({name: res.data.data[i].typename, t_id: res.data.data[i].t_id})
            }
          }
          that.setData({
            menuArr: res.data.data,
            t_id: menuTabArr[0].t_id,
            menuTabArr
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.getMenuData()
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
    let timer = ''
    timer = setTimeout(() => {
      if (this.data.menuArr) {
        for (let v of app.gs('goodsStorage')) {
          num += parseInt(v.num)
        }
        this.calculatorMoney()
        if (app.gs('goodsStorage')) {
          if (app.gs('goodsStorage').length >= 1) {
            for (let outv in this.data.menuArr) {
              if (outv !== 'coupon') {
                for (let v of this.data.menuArr[outv].list) {
                  for (let g of app.gs('goodsStorage')) {
                    if (g.g_id === v.g_id) {
                      v.num = g.num
                      break
                    } else {
                      v.num = 0
                    }
                  }
                }
              }
            }
          } else {
            for (let s in this.data.menuArr) {
              if (s !== 'coupon') {
                for (let m of this.data.menuArr[s].list) {
                  m.num = 0
                }
              }
            }
          }
        } else {
          for (let s in this.data.menuArr) {
            if (s !== 'coupon') {
              for (let m of this.data.menuArr[s].list) {
                m.num = 0
              }
            }
          }
        }
        this.setData({
          allCount: num,
          menuArr: this.data.menuArr
        })
      } else {
        timer()
      }
    }, 100)
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
