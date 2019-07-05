const app = getApp();
var matchDao = require('../../js/match.js');
var pageSize = 20;
Page({
  data: {
    matchList: [],
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
    matchDao.findMatchByUserId(app.globalData.userInfo._id, that.data.start, pageSize, function (data) {
      if (data.length == 0) {
        that.setData({
          showLoading: false,
          hasMore: false
        });
      } else {
        if (data.length < pageSize) {
          that.setData({
            showLoading: false,
            matchList: that.data.matchList.concat(data),
            start: that.data.start + data.length,
            hasMore: false
          });
        } else {
          that.setData({
            showLoading: false,
            matchList: that.data.matchList.concat(data),
            start: that.data.start + data.length,
            hasMore: true
          });
        }

      }
    });
  },

  getTargetScore: function (match, scoreAId, callback) {
    var scoreA = null;
    var scoreB = null;
    if (scoreAId == match.score1._id) { //A
      scoreA = matchDel.score1;
      scoreB = matchDel.score2;
    } else {
      scoreA = matchDel.score2;
      scoreB = matchDel.score1;
    }
    callback(scoreA, scoreB);
  },

  viewDetail: function (e) {
    var ds = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/activity/person/person?personOpenid=' + ds.id + '&activityId=' + ds.title
    })
  },


})