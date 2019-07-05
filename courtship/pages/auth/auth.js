const app = getApp();
var userDb = require('../js/user.js');
var init = require('../js/init.js');
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    
  },

  //获取用户信息
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      var wxUserInfo = e.detail.userInfo;
      //检查是否存在，不存在则添加，存在则修改。插入db
      userDb.getUserByOpenid(app.globalData.openid, function (data) {
        if (data.length == 0) {
          //用户为空，添加
          userDb.addUser(wxUserInfo, function (dataId) {
            if (dataId != null) {//添加成功
              wxUserInfo._id = dataId;
              app.globalData.userInfo = wxUserInfo;
              console.log("userInfo: ", app.globalData.userInfo);
              //用户已经授权过，跳转到首页
              that.toHome();
            } else {
              console.log("add userWxInfo fail");
            }
          });
        } else {
          //用户不为空，修改
          userDb.updateUser(app.globalData, wxUserInfo, function (updateCount) {
            console.log("update wxUserInfo", wxUserInfo);
            if (updateCount > 0) {//修改成功
              var oldUser = data[0];

              oldUser.nickName = wxUserInfo.nickName;
              oldUser.avatarUrl = wxUserInfo.avatarUrl;
              oldUser.province = wxUserInfo.province;
              oldUser.city = wxUserInfo.city;
              oldUser.country = wxUserInfo.country;

              app.globalData.userInfo = oldUser;
              console.log("globalData userInfo: ", app.globalData.userInfo);
              
              //用户已经授权过，跳转到首页
              that.toHome();
            } else {
              console.log("update userWxInfo fail");
            }
          });
        }
      });
      
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },

  //跳转到首页
  toHome: function () {
    //授权成功后，跳转进入小程序首页
    wx.switchTab({
      url: '/pages/activity/list/list'
    })
  }

});