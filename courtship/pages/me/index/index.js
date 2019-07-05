const app = getApp();
var activityDB = require('../../js/activityDB.js');
var userDb = require('../../js/user.js');
var pageSize = 20;
Page({
  data: {
    openid: '',
    hasAdmin: false
  },

  scroll: function (e) {
    //console.log(e)
  },
  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo.hasAdmin != null){
      that.setData({
        hasAdmin: app.globalData.userInfo.hasAdmin
      })
    }else{
      userDb.getUserByOpenid(app.globalData.openid, function (userList) {
        if (userList.length > 0 && userList[0].hasAdmin != null) {
          that.setData({
            hasAdmin: userList[0].hasAdmin
          })
        }
      })
    }



  },


  toMeEdit: function () {
    wx.navigateTo({
      url: '../edit/edit'
    })
  },

  toMeMatch: function () {
    wx.navigateTo({
      url: '../match/match'
    })
  },

  toActivityAdmin: function () {
    wx.navigateTo({
      url: '../admin/activity/list/list'
    })
  },

})