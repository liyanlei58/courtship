let app = getApp();
var activityDB = require('../../../../js/activityDB.js');
var util = require('../../../../js/util.js');
Page({
  data: {
    activity: {},
    date: util.formatDay(new Date()),
    isAdd: true
  },

  bindDateChange: function(e) {
    //日期
    this.setData({
      date: e.detail.value
    });
  },

  onLoad: function(options) {
    var that = this;
    var activityId = options.id;
    if (activityId != null && activityId != "undefined" && activityId != "") {
      //编辑活动
      activityDB.getActivityById(activityId, function(data) {
        console.log("查询活动信息，data: ", data);
        if (data.length > 0) {
          that.setData({
            activity: data[0],
            isAdd: false
          })
          console.log(that.data.activity);
          // wx.setNavigationBarTitle({
          //   title: that.data.activity.name
          // });
        }
      });
    }
    that.initForm();
  },

  // 初始化表单
  initForm: function() {
    
  },

  formSubmit: function(e) {
    var that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var activity = e.detail.value;

    console.log('更新活动信息：', activity);
    if (that.data.isAdd) { //添加活动
      activityDB.addActivity(activity, function(dataId) {
        if (dataId != null) { //添加成功
          //跳转到活动列表页面
          that.toActivityList();
        } else {
          that.saveFail();
        }
      });
    } else { //修改活动
      activityDB.updateActivity(activity, function(updateCount) {
        if (updateCount > 0) { //修改成功
          //跳转到活动列表页面
          that.toActivityList();
        } else {
          that.saveFail();
        }
      });
    }

  },

  formReset: function() {
    console.log('form发生了reset事件')
  },

  //保存成功，跳转到活动列表页面
  toActivityList: function() {
    wx.showToast({
      title: '保存成功',
    })
    wx.navigateTo({
      url: '../list/list'
    })
  },

  //保存失败
  saveFail: function() {
    wx.showToast({
      icon: 'none',
      title: '保存失败',
    })
  },

})