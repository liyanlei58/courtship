const app = getApp();
var activityDB = require('../../../../js/activityDB.js');
var activityCodeDb = require('../../../../js/activityCodeDb.js');
var util = require('../../../../js/util.js');

const db = wx.cloud.database();
var pageSize = 20;
Page({
  data: {
    showLoading: true,
    activity: '',
    code: ''
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

  // 生成活动参与码
  generateCode: function(e) {
    var that = this;
    activityCodeDb.generateActivityCode(that.data.activity._id, function (code) {
      if (code != null) {
        that.setData({
          code: code
        })
      }
    });
  },


  // 删除活动
  removeActivity: function (e) {
    var that = this;
    activityDB.getActivityById(that.data.activity._id, function (activityExist) {
      if (activityExist == null){
        wx.showToast({
          icon: 'none',
          title: '活动不存在'
        })
      }else{
        var now = util.formatDay(new Date());
        if (activityExist.date <= now){
          wx.showToast({
            icon: 'none',
            title: '活动已结束，不可以删除'
          })
        }else{
          activityDB.removeActivityById(that.data.activity._id, function (count) {
            if (count == 0) {
              wx.showToast({
                icon: 'none',
                title: '删除失败'
              })
            } else {
              wx.showToast({
                title: '删除成功'
              })
              wx.redirectTo({
                url: '../list/list'
              })
            }
          });
        }
      }
    })
    
  },

  


})