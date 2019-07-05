const app = getApp();
var scoreDb = require('../../js/score.js');
var pageSize = 20;
Page({
  data: {
    scoreList: [],
    hasMore: false,
    showLoading: true,
    start: 0
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
    scoreDb.findPageScoreByOpenid(app.globalData.openid, app.globalData.niceScore, that.data.start, pageSize, function (data) {
      if (data.length == 0) {
        that.setData({
          showLoading: false,
          hasMore: false
        });
      } else {
        if (data.length < pageSize) {
          that.setData({
            showLoading: false,
            scoreList: that.data.scoreList.concat(data),
            start: that.data.start + data.length,
            hasMore: false
          });
        } else {
          that.setData({
            showLoading: false,
            scoreList: that.data.scoreList.concat(data),
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
      url: '../person/person?personOpenid=' + ds.id
    })
  },


})