const app = getApp();
var activityUserDb = require('../../js/activityUserDB.js');
var pageSize = 20;
Page({
  data: {
    activityList: [],
    hasMore: false,
    showLoading: true,
    start: 0
  },
  // onPullDownRefresh: function () {
  //   console.log('onPullDownRefresh', new Date())
  // },
  scroll: function (e) {
    //console.log(e)
  },
  onLoad: function () {
    var that = this;
    //查询活动列表
    that.findNextPage();
  },

  //下滑
  scrollToLower: function () {
    findNextPage();
  },

  //查询下一页的数据
  findNextPage: function () {
    console.log("openid: ", app.globalData.openid);
    var that = this
    activityUserDb.findPageByOpenid(app.globalData.openid, that.data.start, pageSize, function (data) {
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


  viewDetail: function (e) {
    var ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../activityDetail/activityDetail?id=' + ds.id
    })
  },


})