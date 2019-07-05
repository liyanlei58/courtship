const app = getApp();
var userDb = require('../../js/user.js')
Page({
  data: {
    houseArray: ['请选择', '无房', '北京有房', '北京周边有房', '天津有房', '老家有房', '其他城市有房'],
    userInfo: app.globalData.userInfo
  },
  onLoad: function () {
    var that = this;
    //用户信息为空
    if(this.data.userInfo == ""){
      userDb.getUserByOpenid(app.globalData.openid, function (data) {
        console.log("查询用户信息，data: ", data);
        if (data.length > 0) {
          app.globalData.userInfo = data[0];
          that.setData({
            userInfo: data[0]
          })
          //设置导航栏title
          // wx.setNavigationBarTitle({
          //   title: that.data.userInfo.nickName
          // });
          
        }
      });
    }
    
  },

  toEdit: function (e) {
    wx.navigateTo({
      url: '../edit/edit'
    })
  }
})
