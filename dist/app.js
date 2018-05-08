'use strict';

// const wechat = require('./utils/wechat')
// const Promise = require('./utils/bluebird')
/*eslint-disable*/
var useUrl = require('./utils/service');
var wxParse = require('./wxParse/wxParse');
// const bgMusic = wx.getBackgroundAudioManager()
// const updateManager = wx.getUpdateManager()
//
// updateManager.onCheckForUpdate(function (res) {
//   // 请求完新版本信息的回调
//   console.log(res.hasUpdate)
// })
//
// updateManager.onUpdateReady(function () {
//   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
//   updateManager.applyUpdate()
// })
// updateManager.onUpdateFailed(function () {
//   // 新的版本下载失败
// })
// const QQMapWX = require('./utils/qmapsdk')
// const qqmapsdkkey = '5YBBZ-LHYWP-NVGD6-LHZB3-GTWYK-TQBRO'
// let qqmapsdk
// const Moment = require('./utils/moment')
// Moment.locale('en', {
//   relativeTime : {
//     future: '差 %s',
//     past:   '%s前',
//     s:  '几秒',
//     m:  '一分钟',
//     mm: '%d分钟',
//     h:  '一小时',
//     hh: '%d小时',
//     d:  '一天',
//     dd: '%d天',
//     M:  '一个月',
//     MM: '%d月',
//     y:  '一年',
//     yy: '%d年'
//   }
// })
// bindload="wxParseImgLoad"
// moment.locale('zh-cn')
App({
  data: {
    name: '披萨点餐小程序',
    basedomain: 'http://group.lanzhangxiu.cn'
  },
  call: function call() {
    var phoneNumber = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '13378692079';

    wx.makePhoneCall({
      phoneNumber: phoneNumber
    });
  },

  // 获取消息数目
  gML: function gML(that) {
    var _that = that;
    var _this = this;
    _this.wxrequest({
      url: useUrl.getUserMessageLists,
      data: {
        session_key: _this.gs(),
        page: 1,
        date_time: new Date().getFullYear() + '-' + (new Date().getMonth() * 1 + 1 < 10 ? '0' + (new Date().getMonth() * 1 + 1) : new Date().getMonth() * 1 + 1) + '-' + (new Date().getDate() * 1 < 10 ? '0' + new Date().getDate() : new Date().getDate())
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === 200) {
          var count = 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              if (parseInt(v.is_look) === 0) {
                count++;
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

          _that.setData({
            messageCount: count
          });
        } else {
          _this.setToast(that, { content: res.data.message });
        }
      }
    });
  },

  // 富文本解析
  WP: function WP(title, type, data, that, image) {
    wxParse.wxParse(title, type, data, that, image);
  },

  // 解析时间
  moment: function moment(time) {
    return Moment(time, 'YYYYMMDD HH:mm:ss').fromNow();
  },

  // 发起微信支付
  wxpay: function wxpay(obj) {
    var objs = {
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType || 'MD5',
      paySign: obj.paySign,
      success: obj.success || function (res) {
        console.log('未传入success回调函数', res);
      },
      fail: obj.fail || function (err) {
        console.log('未传入fail回调函数,err:', err.errMsg);
      },
      complete: obj.complete || function () {}
    };
    wx.requestPayment(objs);
  },

  // 选择图片上传
  wxUploadImg: function wxUploadImg(cb) {
    var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var _that = this;
    wx.chooseImage({
      count: count,
      success: function success(res) {
        wx.showLoading({
          title: '图片上传中'
        });
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = res.tempFilePaths[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var v = _step2.value;

            wx.uploadFile({
              url: useUrl.uploadPhotos,
              filePath: v,
              name: 'file',
              formData: {
                session_key: _that.gs(),
                file: 'file'
              },
              success: function success(res) {
                // console.log(res)
                var imgUrl = JSON.parse(res.data).data.res_file;
                wx.hideLoading();
                if (cb) {
                  cb(imgUrl);
                }
              }
            });
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
      }
    });
  },

  // 上传媒体文件
  wxUpload: function wxUpload(obj) {
    var s = {
      url: obj.url,
      filePath: obj.filePath,
      name: obj.name || 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: obj.formData,
      success: obj.success || function (res) {
        console.log('未传入成功回调函数', res);
      },
      fail: obj.fail || function (res) {
        console.log('为传入失败回调函数', res);
      },
      complete: obj.complete || function () {}
    };
    wx.uploadFile(s);
  },

  // 请求数据
  wxrequest: function wxrequest(obj) {
    var that = this;
    wx.showLoading({
      title: '请求数据中...'
      // mask: true
    });
    wx.request({
      url: obj.url || useUrl.user,
      method: obj.method || 'POST',
      data: obj.data || {},
      header: {
        // 'content-type': obj.header || 'application/x-www-form-urlencoded'
        'content-type': obj.header || 'application/json'
      },
      success: obj.success || function () {
        console.log('未传入success回调函数');
      },
      fail: obj.fail || function (err) {
        console.log('未传入fail回调函数,err:' + err.errMsg);
      },
      complete: obj.complete || function (res) {
        // console.log(res)
        // sessionId 失效
        if (res.data.code === '000') {
          setTimeout(function () {
            if (!that.gs()) {
              var page = getCurrentPages();
              wx.login({
                success: function success(res) {
                  if (res.code) {
                    wx.getUserInfo({
                      lang: 'zh_CN',
                      success: function success(res2) {
                        console.log(res2);
                        that.wxrequest({
                          url: useUrl.login,
                          data: {
                            code: res.code,
                            res2: res2
                            // iv: res2.iv,
                            // encryptedData: res2.encryptedData
                          },
                          success: function success(res3) {
                            console.log(1);
                            wx.setStorageSync('session_key', res3.data.data.session3rd);
                            wx.setStorageSync('shop', res.data.data);
                            page[page.length - 1 >= 0 ? page.length - 1 : 0].onLoad(page[page.length - 1 >= 0 ? page.length - 1 : 0].options);
                          }
                        });
                      },
                      fail: function fail(err) {
                        wx.showToast({
                          title: '用户拒绝授权'
                        });
                      }
                    });
                  } else {
                    wx.showToast({
                      title: '请删除小程序后，重新打开并授权'
                    });
                  }
                }
              });
            } else {
              wx.login({
                success: function success(res) {
                  if (res.code) {
                    wx.getUserInfo({
                      lang: 'zh_CN',
                      success: function success(res2) {
                        that.wxrequest({
                          url: useUrl.login,
                          data: {
                            code: res.code,
                            res2: res2
                            // iv: res2.iv,
                            // encryptedData: res2.encryptedData
                          },
                          success: function success(res3) {
                            console.log(2);
                            wx.setStorageSync('session_key', res3.data.data.session3rd);
                            wx.setStorageSync('shop', res.data.data);
                            obj.data.session3rd = that.gs();
                            that.wxrequest(obj);
                          }
                        });
                      },
                      fail: function fail(err) {
                        wx.showToast({
                          title: '用户拒绝授权'
                        });
                      }
                    });
                  } else {
                    wx.showToast({
                      title: '请删除小程序后，重新打开并授权'
                    });
                  }
                }
              });
            }
          }, 300);
        }
      }
    });
  },

  // 用户登陆
  wxlogin: function wxlogin(loginSuccess, params) {
    var that = this;
    // if (wx.getStorageSync('session_key')) {
    //   let checkObj = {
    //     url: useUrl.user,
    //     data: {
    //       session3rd: wx.getStorageSync('session_key')
    //     },
    //     success (res) {
    //       wx.hideLoading()
    //       // session失效
    //       if (res.data.code === '000') {
    //         console.log('session_key失效')
    //         // 无条件获取登陆code
    //         wx.login({
    //           success (res) {
    //             // console.log(res)
    //             let code = res.code
    //             // 获取用户信息
    //             let obj = {
    //               success (data) {
    //                 wx.setStorageSync('userInfo', data.userInfo)
    //                 // let iv = data.iv
    //                 // let encryptedData = data.encryptedData
    //                 let recommendId = ''
    //                 if (params) {
    //                   recommendId: params.id
    //                 }
    //                 // let res2 = []
    //                 // for (let i in data.userInfo) {
    //                 //   // console.log(i)
    //                 //   let obj = {}
    //                 //   obj[i] = data.userInfo[i]
    //                 //   res2.push(obj)
    //                 // }
    //                 // 获取session_key
    //                 let objs = {
    //                   url: useUrl.login,
    //                   data: {
    //                     pid: recommendId || 1,
    //                     code: code,
    //                     res2: data
    //                     // iv: iv,
    //                     // encryptedData: encryptedData
    //                   },
    //                   header: 'application/json',
    //                   success (res) {
    //                     // let session_key = 'akljgaajgoehageajnafe'
    //                     // console.log(res)
    //                     wx.setStorageSync('session_key', res.data.data.session3rd)
    //                     wx.setStorageSync('shop', res.data.data)
    //                     // console.log(session)
    //                     // if (loginSuccess) {
    //                     if (loginSuccess) {
    //                       loginSuccess(params)
    //                     }
    //                   }
    //                 }
    //                 that.wxrequest(objs)
    //               },
    //               fail (res) {
    //                 console.log(res)
    //                 wx.showToast({
    //                   title: '您未授权小程序,请授权登陆'
    //                 })
    //               }
    //             }
    //             that.getUserInfo(obj)
    //           },
    //           fail (err) {
    //             console.log('loginError' + err)
    //           }
    //         })
    //       } else {
    //         console.log('session_key有效')
    //         if (loginSuccess) {
    //           loginSuccess(params)
    //         }
    //       }
    //     }
    //   }
    //   that.wxrequest(checkObj)
    // } else {
    console.log('无条件获取登陆code');
    // 无条件获取登陆code
    wx.login({
      success: function success(res) {
        // console.log(res)
        var code = res.code;
        // 获取用户信息
        var obj = {
          success: function success(data) {
            wx.setStorageSync('userInfo', data.userInfo);
            // let iv = data.iv
            // let encryptedData = data.encryptedData
            var recommendId = '';
            // console.log('params', params)
            if (params) {
              recommendId = params.id * 1;
            }
            // console.log('recommendId', recommendId)
            // 获取session_key
            // console.log(data.userInfo)
            // let res2 = []
            // for (let i in data.userInfo) {
            //   // console.log(i)
            //   let obj = {}
            //   obj[i] = data.userInfo[i]
            //   res2.push(obj)
            // }
            // console.log(res2)
            var objs = {
              url: useUrl.login,
              data: {
                pid: recommendId || 1,
                code: code,
                res2: data
                // iv,
                // encryptedData
              },
              header: 'application/json',
              success: function success(session) {
                // console.log(objs)
                wx.hideLoading();
                // let s = 'DUGufWMOkMIolSIXLajTvCEvXAYQZwSpnafUVlSagdNEReVSRDAECzwEVAtFbPWg'
                wx.setStorageSync('session_key', session.data.data.session3rd);
                wx.setStorageSync('shop', session.data.data);
                // wx.setStorageSync('session_key', s)
                if (loginSuccess) {
                  loginSuccess(params);
                }
              }
            };
            that.wxrequest(objs);
          },
          fail: function fail() {
            wx.showToast({
              title: '您未授权小程序,请授权登陆'
            });
          }
        };
        that.getUserInfo(obj);
      },
      fail: function fail(err) {
        console.log('loginError' + err);
      }
    });
    // }
  },

  // 获取缓存session_key
  gs: function gs(key) {
    return wx.getStorageSync(key || 'session_key');
  },

  // 设置页面是否加载
  setMore: function setMore(params, that) {
    if (params.length === 0) {
      that.setData({
        more: false
      });
    } else {
      that.setData({
        more: true
      });
    }
  },

  // 获取用户信息
  getUserInfo: function getUserInfo(obj) {
    wx.getUserInfo({
      withCredentials: obj.withCredentials || true,
      lang: obj.lang || 'zh_CN',
      success: obj.success || function (res) {
        console.log('getUserInfoSuccess', res);
      },
      fail: obj.fail || function (res) {
        console.log('getUserInfoFail', res);
      }
    });
  },

  // 获取用户缓存信息
  gu: function gu(cb) {
    if (wx.getStorageSync('userInfo')) {
      return wx.getStorageSync('userInfo');
    } else {
      var obj = {
        success: function success(res) {
          // console.log(res)
          wx.setStorageSync('userInfo', res.userInfo);
          if (cb) {
            cb();
          }
        }
      };
      return this.getUserInfo(obj);
    }
  },

  // 设置用户的缓存信息
  su: function su(key, obj) {
    wx.setStorageSync(key, obj);
  },

  // 获取消息数量
  getMessageCount: function getMessageCount(that) {
    var self = this;
    var _this = that;
    var gmc = {
      url: useUrl.getNotReadMessage,
      data: {
        session_key: self.gs()
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.code === 200) {
          _this.setData({
            mCount: res.data.data.count
          });
        }
      }
    };
    this.wxrequest(gmc);
  },

  // 输入内容
  inputValue: function inputValue(e, that, cb) {
    var value = e.detail.value;
    var type = e.currentTarget.dataset.type;
    if (type === 'loginInput') {
      that.setData({
        loginInput: value // 登录输入
      });
    } else if (type === 'pwd') {
      that.setData({
        pwd: value // 密码输入
      });
      if (cb) {
        cb(that);
      }
    } else if (type === 'money') {
      that.setData({
        money: value
      });
      if (cb) {
        cb(that);
      }
    } else if (type === 'name') {
      that.setData({
        name: value // 姓名
      });
    } else if (type === 'phone') {
      that.setData({
        phone: value // 手机号码
      });
    } else if (type === 'idCard') {
      that.setData({
        idCard: value // 身份证号码
      });
    } else if (type === 'contentTwo') {
      that.setData({
        contentTwo: value // 翻译
      });
    } else if (type === 'buddingText') {
      that.setData({
        buddingText: value // 我要配音
      });
    } else if (type === 'content') {
      that.setData({
        content: value
      });
    } else if (type === 'contentOne') {
      that.setData({
        contentOne: value
      });
    }
  },

  // 跳转绘本详情
  goHBdetail: function goHBdetail(e) {
    wx.navigateTo({
      url: '../hbDetail/hbDetail?id=' + e.currentTarget.dataset.id + '&title=' + e.currentTarget.dataset.title
    });
  },

  // 手机号码验证
  checkMobile: function checkMobile(mobile) {
    if (!/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile)) {
      return true;
    }
  },

  // 信息弹窗
  setToast: function setToast(that, toast, time) {
    var defaultToast = {
      image: '../../images/jiong.png',
      show: true,
      bgc: '#fff',
      color: '#000'
    };
    Object.assign(defaultToast, toast);
    that.setData({
      toast: defaultToast
    });
    setTimeout(function () {
      defaultToast.show = false;
      that.setData({
        toast: defaultToast
      });
    }, time || 1500);
  },

  // 设置公众号弹窗
  setGzh: function setGzh(that, gzh) {
    var defaultToast = {
      image: '../../images/gzh.png',
      name: '群消息',
      show: true
    };
    Object.assign(defaultToast, gzh);
    wx.setClipboardData({
      data: defaultToast.name
    });
    that.setData({
      gzh: defaultToast
    });
  },

  // 关闭公众号弹窗
  closeGzh: function closeGzh(that) {
    that.data.gzh.show = false;
    that.setData({
      gzh: that.data.gzh
    });
  },

  // 预览图片
  showImg: function showImg(e, imgArr) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: imgArr[index],
      urls: imgArr
    });
  },

  // 跳转方式判断
  gn: function gn(url) {
    if (getCurrentPages().length >= 5) {
      wx.redirectTo({
        url: url
      });
    } else {
      wx.navigateTo({
        url: url
      });
    }
  },

  // 设置顶部文字
  setBar: function setBar(text) {
    wx.setNavigationBarTitle({
      title: text
    });
  },

  // 逆地址解析
  getLocation: function getLocation(that, type, cb) {
    this.reverseGeocoder(that, type, cb);
  },

  // 获取请求路劲
  getUrl: function getUrl() {
    return useUrl;
  },

  // 跳转搜索
  search: function search(type, content) {
    wx.navigateTo({
      url: '../heightBudding/heightBudding?type=' + type + '&content=' + content
    });
  },

  // 逆地址解析执行
  // reverseGeocoder (that, type = true, cb) {
  //   let _that = this
  //   qqmapsdk = new QQMapWX({
  //     key: qqmapsdkkey
  //   })
  //   console.log(type)
  //   let obj = {
  //     success (res) {
  //       if (cb) {
  //         cb(res)
  //       }
  //       that.setData({
  //         address: res.result.address,
  //         location: res.result.location
  //       })
  //     },
  //     fail (res) {
  //       if (!type) {
  //         return wx.showToast({
  //           title: '未选择获取地址位置'
  //         })
  //       }
  //       wx.showToast({
  //         title: '请授权后再次点击'
  //       })
  //       setTimeout(function () {
  //         let settingObj = {
  //           success (res) {
  //             // 授权失败
  //             if (!res.authSetting['scope.userLocation']) {
  //               wx.showToast({
  //                 title: '请允许获取您的地理位置信息',
  //                 mask: true
  //               })
  //               setTimeout(function () {
  //                 return _that.reverseGeocoder(that, cb)
  //               }, 1000)
  //             } else {
  //               // 授权成功
  //               return _that.reverseGeocoder(that, cb)
  //             }
  //           },
  //           fail (res) {
  //             console.log(res)
  //           }
  //         }
  //         wx.openSetting(settingObj)
  //       }, 1000)
  //     }
  //   }
  //   qqmapsdk.reverseGeocoder(obj)
  // },
  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function onLaunch() {
    //     console.log(`
    //   ┏┛┻━━━┛┻┓
    //   ┃｜｜｜｜｜｜｜┃
    //   ┃　　　━　　　┃
    //   ┃　┳┛　┗┳　┃
    //   ┃　　　　　　　┃
    //   ┃　　　┻　　　┃
    //   ┃　　　　　　　┃
    //   ┗━┓　　　┏━┛
    //   　　┃　史　┃
    //   　　┃　诗　┃
    //   　　┃　之　┃
    //   　　┃　宠　┃
    //   　　┃　　　┗━━━━━━┓
    //   　　┃　　　神兽坐镇　　　┣━━┓
    //   　　┃　　　永不宕机　　　┃
    //   　　┗┓┓┏━┳┓┏━━━┛
    //   　　　┃┫┫　┃┫┫
    //   　　　┗┻┛　┗┻┛
    // `)
    // console.log(' ========== Application is launched ========== ')
    // this.wxlogin()
  },

  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function onShow() {
    // console.log(' ========== Application is showed ========== ')
  },

  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function onHide() {
    // console.log(' ========== Application is hid ========== ')
  }
});
//# sourceMappingURL=app.js.map
