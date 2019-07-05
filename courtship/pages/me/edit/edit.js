let app = getApp();
var userDb = require('../../js/user.js');
var img = require('../../js/img.js');
var init = require('../../js/init.js');

Page({
  data: {
    birthday: '1990',
    hometown: ['山东省', '', ''],
    houseIndex: 0,
    houseArray: ['请选择', '无房', '北京有房', '北京周边有房', '天津有房', '老家有房', '其他城市有房'],
    photoId: app.globalData.userInfo.photoId,
    userInfo: app.globalData.userInfo
  },

  bindHouseChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      houseIndex: e.detail.value
    })
  },

  bindBirthdayChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      birthday: e.detail.value
    })
  },

  bindHometownChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      hometown: e.detail.value
    })
  },

  onLoad: function(options) {
    var that = this;
    //用户信息为空
    if (that.data.userInfo == "") {
      userDb.getUserByOpenid(app.globalData.openid, function(data) {
        console.log("查询用户信息，data: ", data);
        if (data.length > 0) {
          app.globalData.userInfo = data[0];
          that.setData({
            userInfo: data[0],
            photoId: data[0].photoId
          })
          console.log(app.globalData.userInfo);
          that.initForm();

        }
      });
    }
  },

  // 上传图片
  uploadPhoto: function() {
    var that = this
    img.doUpload(function(res) {
      if (res.statusCode == 200) {
        that.setData({
          photoId: res.fileID
        })
      }
    })
  },

  // 初始化表单
  initForm: function() {
    var birthdayInit = '1990';
    if (app.globalData.userInfo.birthday != null) {
      birthdayInit = app.globalData.userInfo.birthday;
    }
    var hometownInit = ['山东省', '', ''];
    if (app.globalData.userInfo.hometown != null) {
      hometownInit = app.globalData.userInfo.hometown;
    }
    var houseIndexInit = 0;
    if (app.globalData.userInfo.house != null) {
      houseIndexInit = app.globalData.userInfo.house;
    }
    this.setData({
      birthday: birthdayInit,
      hometown: hometownInit,
      houseIndex: houseIndexInit
    });
  },



  // formReset: function () {
  //   console.log('form发生了reset事件')
  // },

  formSubmit: function(e) {
    var that = this;
    var userInfo = e.detail.value;
    if (userInfo.house == "请选择") {
      userInfo.house == null;
    }
    if (that.data.userInfo.photoId != null && that.data.photoId != that.data.userInfo.photoId) {
      //删除存在的照片
      console.log("删除存在的照片");

      img.deletePhoto(that.data.userInfo.photoId, function(res){

      });
    }
    userInfo.photoId = that.data.photoId;
    console.log('更新用户信息：', userInfo);

    //微信昵称
    userInfo.nickName = app.globalData.userInfo.nickName;

    userDb.getUserByOpenid(app.globalData.openid, function(data) {
      if (data.length == 0) {
        //用户为空，添加
        userDb.addUser(userInfo, function(dataId) {
          if (dataId != null) { //添加成功
            userInfo._id = dataId;
            app.globalData.userInfo = userInfo;
            console.log("userInfo: ", app.globalData.userInfo);
            //跳转到我的
            that.toIndex();
          } else {
            that.saveFail();
          }
        });
      } else {
        //用户不为空，修改
        userDb.updateUser(app.globalData, userInfo, function(updateCount) {
          if (updateCount > 0) { //修改成功
            var glbUserInfo = app.globalData.userInfo;
            userInfo.nickName = glbUserInfo.nickName;
            userInfo.avatarUrl = glbUserInfo.avatarUrl;
            userInfo.province = glbUserInfo.province;
            userInfo.city = glbUserInfo.city;
            userInfo.country = glbUserInfo.country;

            app.globalData.userInfo = userInfo;
            // console.log("3333 userInfo: ", app.globalData.userInfo);
            //存入缓存
            init.setToCache('lg_userInfo', userInfo)
            //跳转到我的
            that.toIndex();
          } else {
            that.saveFail();
          }
        });
      }
    });

  },

  //保存成功，跳转到用户
  toIndex: function() {
    console.log("toast success");
    wx.showToast({
      title: '保存成功',
    })
    wx.switchTab({
      url: '../index/index'
    })
  },

  //保存成功，跳转到用户
  saveFail: function() {
    console.log("toast fail");
    wx.showToast({
      icon: 'none',
      title: '保存失败',
    })
  },

})