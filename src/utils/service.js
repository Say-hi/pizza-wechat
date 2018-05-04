/**
 * Created by Administrator on 2017/6/2.
 */
// let baseDomain = 'http://group.lanzhangxiu.cn'
let baseDomain = 'http://pizza.lanzhangxiu.cn/'
let serviceUrl = {
  login: baseDomain + 'api/Login/getLogin',
  menu: baseDomain + 'api/Shop/goodslist',
  user: baseDomain + 'api/User/index',
  myorder: baseDomain + 'api/User/my_order',
  delOrder: baseDomain + 'api/User/edit_order',
  detail: baseDomain + 'api/User/detail',
  orderBuy: baseDomain + 'api/Shop/buy',
  mycoupon: baseDomain + 'api/User/my_coupon'
}
module.exports = serviceUrl
