module.exports = {
  //转义性别
  formatGender: function(userInfo, callback) {
    if (userInfo.gender != null && userInfo.gender == 2) {
      userInfo.gender = '女';
    } else {
      userInfo.gender = '男';
    }
    callback(userInfo);
  },

  //添加用户 - 自定义用户信息
  addUser: function(userInfo, callback) {
    if(userInfo.createTime == null){
      userInfo.createTime = new Date();
      userInfo.updateTime = new Date();
    }
    this.formatGender(userInfo, function(userInfo) {
      const db = wx.cloud.database()
      db.collection('sys_user').add({
        data: userInfo
      }).then(res => {
        // 在返回结果中会包含新创建的记录的 _id
        console.log('[数据库] [添加用户 - 自定义用户信息] 成功，记录 _id: ', res._id)
        callback(res._id);
      }).catch(err => {
        console.error('[数据库] [添加用户 - 自定义用户信息] 失败：', err)
      });
    })

  },

  //修改用户信息
  updateUser: function(globalData, userInfo, callback) {
    userInfo.updateTime = new Date();
    this.formatGender(userInfo, function(userInfo) {
      console.log("updateUser define:", userInfo);
      const db = wx.cloud.database()
      db.collection('sys_user').doc(globalData.userInfo._id).update({
        data: userInfo
      }).then(res => {
        console.log('[数据库] [修改用户信息]，result: ', res.stats.updated)
        callback(res.stats.updated);
      }).catch(err => {
        console.error('[数据库] [修改用户信息] 失败：', err)
      });
    })

  },

  //查询用户详情
  getUserByOpenid: function(userOpenid, callback) {
    const db = wx.cloud.database()
    db.collection('sys_user').where({
      _openid: userOpenid
    }).get().then(res => {
      console.log('[数据库] [查询用户详情 by openid] 成功: ', res);
      callback(res.data);
    }).catch(err => {
      console.error('[数据库] [查询用户详情 by openid] 失败：', err)
    });
  },

  //查询用户详情
  getUserInfoById: function(userId, callback) {
    const db = wx.cloud.database()
    db.collection('sys_user').where({
      _id: userId
    }).get().then(res => {
      console.log('[数据库] [查询用户详情] 成功: ', res);
      // var data = res.data;
      // if (data != null) {
      //   globalData.userInfo = data;
      // }
      callback(res.data);
    }).catch(err => {
      console.error('[数据库] [查询用户详情] 失败：', err)
    });

  },


}