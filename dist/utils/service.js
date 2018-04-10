'use strict';

/**
 * Created by Administrator on 2017/6/2.
 */
// let baseDomain = 'http://group.lanzhangxiu.cn'
var baseDomain = 'https://weizao.vyvwlkj.cn';
var serviceUrl = {
  login: baseDomain + '/api/public/login',
  sendMobileCode: baseDomain + '/api/public/sendMobileCode',
  uploadPhotos: baseDomain + '/api/public/uploadPhotos',
  indexHotGroup: baseDomain + '/api/index/indexHotGroup',
  indexApplicationLists: baseDomain + '/api/index/indexApplicationLists',
  getGroupLists: baseDomain + '/api/index/getGroupLists',
  getGroupCategoryLists: baseDomain + '/api/group/getGroupCategoryLists',
  userAddGroup: baseDomain + '/api/group/userAddGroup',
  addGroup: baseDomain + '/api/group/addGroup',
  myselfGroupLists: baseDomain + '/api/index/myselfGroupLists',
  createBusinessCard: baseDomain + '/api/user/createBusinessCard',
  myselfGroupIsTop: baseDomain + '/api/index/myselfGroupIsTop',
  userCenterInfo: baseDomain + '/api/user/userCenterInfo',
  groupDetail: baseDomain + '/api/group/groupDetail',
  getMailLists: baseDomain + '/api/group/getMailLists',
  settingGroupMain: baseDomain + '/api/group/settingGroupMain',
  settingGroupUserIsTop: baseDomain + '/api/group/settingGroupUserIsTop',
  saveBusinessCardInfo: baseDomain + '/api/user/saveBusinessCardInfo',
  userInfoDetail: baseDomain + '/api/user/userInfoDetail',
  releaseGroupFriendCircle: baseDomain + '/api/friendcircle/releaseGroupFriendCircle',
  postReleaseGroupFriendCircle: baseDomain + '/api/friendcircle/postReleaseGroupFriendCircle',
  getWeixinArticleInfo: baseDomain + '/api/friendcircle/getWeixinArticleInfo',
  getGroupFriendCircleLists: baseDomain + '/api/friendcircle/getGroupFriendCircleLists',
  addOrCancelLikes: baseDomain + '/api/friendcircle/addOrCancelLikes',
  addComment: baseDomain + '/api/friendcircle/addComment',
  groupFriendCircleDetail: baseDomain + '/api/friendcircle/groupFriendCircleDetail',
  userFindLists: baseDomain + '/api/index/userFindLists',
  getUserGroupFriendCircleLists: baseDomain + '/api/user/getUserGroupFriendCircleLists',
  getLeaveMessageLists: baseDomain + '/api/user/getLeaveMessageLists',
  addLeaveMessage: baseDomain + '/api/user/addLeaveMessage',
  deleteLeaveMessage: baseDomain + '/api/user/deleteLeaveMessage',
  postReward: baseDomain + '/api/user/postReward',
  deleteGroupLists: baseDomain + '/api/group/deleteGroupLists',
  deleteMailUser: baseDomain + '/api/group/deleteMailUser',
  managerAuthorityPage: baseDomain + '/api/group/managerAuthorityPage',
  updateManagerAuthority: baseDomain + '/api/group/updateManagerAuthority',
  changeMainGroup: baseDomain + '/api/group/changeMainGroup',
  updateGroupInfoPage: baseDomain + '/api/group/updateGroupInfoPage',
  postUpdateGroupInfo: baseDomain + '/api/group/postUpdateGroupInfo',
  tuichuGroup: baseDomain + '/api/group/tuichuGroup',
  withdrawalsPage: baseDomain + '/api/user/withdrawalsPage',
  getGroupQrcode: baseDomain + '/api/group/getGroupQrcode',
  setTopFrinedCircle: baseDomain + '/api/friendcircle/setTopFrinedCircle',
  applyWithdrawals: baseDomain + '/api/user/applyWithdrawals',
  accountLogLists: baseDomain + '/api/user/accountLogLists',
  deleteFriendCircle: baseDomain + '/api/friendcircle/deleteFriendCircle',
  renewGroup: baseDomain + '/api/group/renewGroup',
  getUserMessageLists: baseDomain + '/api/user/getUserMessageLists',
  userLookMessage: baseDomain + '/api/user/userLookMessage',
  getGroupBackgroundLists: baseDomain + '/api/group/getGroupBackgroundLists'
};
module.exports = serviceUrl;
//# sourceMappingURL=service.js.map
