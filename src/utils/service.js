/**
 * Created by Administrator on 2017/6/2.
 */
// let baseDomain = 'http://group.lanzhangxiu.cn'
let baseDomain = 'http://pizza.lanzhangxiu.cn/'
let serviceUrl = {
  login: baseDomain + 'api/Login/getLogin',
  menu: baseDomain + 'api/Shop/goodslist',
  user: baseDomain + 'api/User/index'
}
module.exports = serviceUrl
