const app = getApp();
var userDb = require('../../js/user.js')

Page({
  data: {
    houseArray: ['请选择', '无房', '北京有房', '北京周边有房', '天津有房', '老家有房', '其他城市有房'],

    person: {},
    score: {},
    activity: {}
  },
  onLoad: function(options) {
    var that = this;
    var personOpenid = options.personOpenid;
    
    if (personOpenid == null || personOpenid == "") {
      wx.showToast({
        icon: 'none',
        title: '人员ID为空'
      })
      return;
    }
    
    //获取人员信息
    that.getPersonByOpenid(personOpenid);

  },

  //获取人员信息
  getPersonByOpenid: function(personOpenid, activityId) {
    var that = this;
    userDb.getUserByOpenid(personOpenid, function(data) {
      if (data.length > 0) {
        that.setData({
          person: data[0]
        })

        //设置导航标题
        // that.setNavTitle(that.data.person.nickName);

      }
    });
  },

  //设置导航标题
  setNavTitle: function(nickName) {
    var title = nickName;
    if (title != null && title != '') {
      title = "打分 - " + title;
    }
    wx.setNavigationBarTitle({
      title: title
    });
  },



})