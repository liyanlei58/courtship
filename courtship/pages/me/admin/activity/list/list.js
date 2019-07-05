const app = getApp();
var activityDB = require('../../../../js/activityDB.js');
var pageSize = 20;
Page({
  data: {
    openid: '',
    activityList: [],
    hasMore: false,
    showLoading: true,
    start: 0
  },
  onPullDownRefresh: function() {
    console.log('onPullDownRefresh', new Date())
  },
  scroll: function(e) {
    //console.log(e)
  },
  onLoad: function() {
    var that = this;
  
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      console.log(app.globalData.openid);
    }

  },

  onReady: function () {
    // Do something when page ready.
    console.log("onReady");
  },
  onShow: function () {
    var that = this;
    //查询活动列表
    that.setData({
      activityList: [],
      start: 0
    })
    that.findNextPage();
  },

  //下滑
  scrollToLower: function() {
    var that = this;
    //查询活动列表
    that.findNextPage();
  },

  //查询下一页的数据
  findNextPage: function() {
    var that = this
    activityDB.findActivity(that.data.start, pageSize, function(data) {
      if (data.length == 0) {
        that.setData({
          showLoading: false,
          hasMore: false
        });
      } else {
        if (data.length < pageSize) {
          that.setData({
            showLoading: false,
            activityList: that.data.activityList.concat(data),
            start: that.data.start + data.length,
            hasMore: false
          });
        } else {
          that.setData({
            showLoading: false,
            activityList: that.data.activityList.concat(data),
            start: that.data.start + data.length,
            hasMore: true
          });
        }

      }
    });
  },


  viewDetail: function(e) {
    var ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../detail/detail?id=' + ds.id
    })
  },

  toEdit: function () {
    wx.navigateTo({
      url: '../edit/edit'
    })
  },


})