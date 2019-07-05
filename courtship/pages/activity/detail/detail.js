const app = getApp();
var userDB = require('../../js/user.js');
var activityDB = require('../../js/activityDB.js');
var activityCodeDb = require('../../js/activityCodeDb.js');
var activityUserDB = require('../../js/activityUserDB.js');
const db = wx.cloud.database();
var pageSize = 20;
Page({
  data: {
    showLoading: true,
    activity: '',
    hasMore: false,
    userInfo: app.globalData.userInfo,
    joined: false,
    start: 0,
    activityUserList: []
  },
  onLoad: function(options) {
    var that = this;
    var activityId = options.id;
    if (activityId == null || activityId == "undefined") {
      this.setData({
        showLoading: false
      });
      wx.showToast({
        icon: 'none',
        title: '活动ID为空'
      })
      return;
    }

    // wx.setNavigationBarTitle({
    //   title: "活动详情"
    // });

    // 查询活动详情
    this.getActivity(activityId);

    // 是否参加过活动
    this.checkJoined(activityId);

  },

  formReset: function() {
    console.log('form发生了reset事件')
  },

  // 查询活动详情
  getActivity: function(activityId) {
    var that = this;
    activityDB.getActivityById(activityId, function(data) {
      if (data != null || data != '') {
        that.setData({
          activity: data,
          showLoading: false
        })
        wx.setNavigationBarTitle({
          title: that.data.activity.name
        });
      }
    });
  },

  // 是否参加过活动
  checkJoined: function(activityId) {
    var that = this;
    var openid = app.globalData.openid;
    if (openid != null) {
      activityUserDB.getActivityUser(activityId, openid, function(data) {
        if (data.length > 0) {
          that.setData({
            joined: true
          })
        }
      });
    }
  },

  //参加活动 - 点击参加活动btn
  joinActivity: function(e) {
    var that = this;
    var activity_user = {};
    var userInfo = app.globalData.userInfo;
    if (userInfo == null) {
      that.toastPersonInfoIsNull();
      return;
    }

    var code = e.detail.value.code;
    console.log("coode: ", code);
    activityCodeDb.getActivityCode(that.data.activity._id, function(realCode) {
      if (realCode == null || realCode != code) {
        wx.showToast({
          icon: 'none',
          title: '活动参与码错误'
        })
      }else{
        if (userInfo.hometown == null || userInfo.job == null || userInfo.birthday == null) {
          that.queryUserAndJoin(that.data.activity);
          return;
        }
        //已填写用户信息
        that.doJoin(that.data.activity, userInfo);
      }
    });

  },

  // 校验活动参与码
  checkCode: function(activityId, code, callback) {
    var that = this;
    var openid = app.globalData.openid;
    if (openid != null) {

    }
  },

  //提示个人信息为空
  toastPersonInfoIsNull: function() {
    wx.showToast({
      icon: 'none',
      title: "请先在'我的'填写您的个人信息，才可参与活动"
    })
  },


  //查询用户，添加参与人员
  queryUserAndJoin: function(activity) {
    var that = this;
    //用户信息为空，查询用户
    userDB.getUserByOpenid(app.globalData.openid, function(data) {
      if (data == null || data.length == 0) {
        that.toastPersonInfoIsNull();
      } else {
        var userInfo = data[0];
        if (userInfo.hometown == null || userInfo.job == null || userInfo.birthday == null) {
          that.toastPersonInfoIsNull();
        } else {
          //已填写用户信息
          that.doJoin(activity, userInfo);
        }
      }
    });
  },

  //添加参与人员
  doJoin: function(activity, user) {
    var activity_user = {
      activity: activity,
      user: user
    };
    console.log("activity_user add : ", activity_user);
    var that = this;
    activityUserDB.addActivityUser(activity_user, function(dataId) {
      if (dataId != null) {
        that.setData({
          joined: true
        })
      }
    })
  },




})