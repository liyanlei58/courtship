const db = wx.cloud.database();

module.exports = {

  //是否参加过活动，cb:查询成功的回调函数
  getActivityUser: function (activityId, openid, callback) {
    db.collection('activity_user').where({
      activity: {
        _id: activityId
      },
      _openid: openid
    }).get().then(res => {
      callback(res.data);
      console.log('[数据库] [查询用户是否参加过活动] 成功: ', res);
    }).catch(err => {
      // wx.showToast({
      //   icon: 'none',
      //   title: '查询用户是否参加过活动失败'
      // })
      console.error('[数据库] [查询用户是否参加过活动] 失败：', err)
    });
  },

  //参加活动
  addActivityUser: function(activity_user, callback) {
    db.collection('activity_user').add({
      data: activity_user
    }).then(res => {
      // 在返回结果中会包含新创建的记录的 _id
      console.log('[数据库] [参加活动] 成功，记录 _id: ', res._id)
      callback(res._id);
    }).catch(err => {
      console.error('[数据库] [参加活动] 失败：', err)
      wx.showToast({
        icon: 'none',
        title: '参加活动失败'
      });
    });
  },

  //分页查询参与活动的人员，cb回调函数
  findPageActivityUser: function(activityId, start, count, callback) {
    // 查询参与活动的人员
    var dbQuery = db.collection('activity_user').where({
      activity: {
        _id: activityId
      },
    });
    if (start > 0) {
      dbQuery = dbQuery.skip(start);
    }
    dbQuery.limit(count).get().then(res => {
      callback(res.data);
      console.log('[数据库] [查询参与活动的人员] 成功: ', res);
    }).catch(err => {
      // wx.showToast({
      //   icon: 'none',
      //   title: '查询记录失败'
      // })
      console.error('[数据库] [查询参与活动的人员] 失败：', err)
    });
  },


  //根据openid查询参与活动 - 分页查询用户参加的活动，cb回调函数
  findPageByOpenid: function (openid, start, count, callback) {
    // 分页查询用户参加的活动
    var dbQuery = db.collection('activity_user').where({
      _openid: openid
    });
    if (start > 0) {
      dbQuery = dbQuery.skip(start);
    }
    dbQuery.limit(count).get().then(res => {
      console.log('[数据库] [查询用户参加的活动] 成功: ', res);
      callback(res.data);
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '查询失败'
      })
      console.error('[数据库] [查询用户参加的活动] 失败：', err)
    });
  },

}