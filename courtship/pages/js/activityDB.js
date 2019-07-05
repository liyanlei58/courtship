const db = wx.cloud.database();
module.exports = {

  //分页查询活动列表，cb回调函数
  findActivity: function(start, count, callback) {
    // 查询所有的活动
    var dbQuery = db.collection('activity').orderBy('date', 'desc');
    if (start > 0) {
      dbQuery = dbQuery.skip(start);
    }
    dbQuery.limit(count).get().then(res => {
      callback(res.data);
      console.log('[数据库] [查询活动] 成功: ', res);
    }).catch(err => {
      // wx.showToast({
      //   icon: 'none',
      //   title: '查询记录失败'
      // })
      console.error('[数据库] [查询活动] 失败：', err)
    });
  },

  //查询活动详情
  getActivityById: function(activityId, callback) {
    db.collection('activity').doc(activityId).get().then(res => {
      callback(res.data);
      console.log('[数据库] [查询活动详情] 成功: ', res);
    }).catch(err => {
      // wx.showToast({
      //   icon: 'none',
      //   title: '查询活动详情失败'
      // })
      console.error('[数据库] [查询活动详情] 失败：', err)
    });
  },

  //添加活动
  addActivity: function(activity, callback) {
    db.collection('activity').add({
      data: activity
    }).then(res => {
      // 在返回结果中会包含新创建的记录的 _id
      console.log('[数据库] [添加活动] 成功，记录 _id: ', res._id)
      callback(res._id);
    }).catch(err => {
      console.error('[数据库] [添加活动] 失败：', err)
    });
  },

  //修改活动
  updateActivity: function(activity, callback) {
    db.collection('activity').doc(activity._id).update({
      data: activity
    }).then(res => {
      console.log('[数据库] [修改活动信息]，result: ', res.stats.updated)
      callback(res.stats.updated);
    }).catch(err => {
      console.error('[数据库] [修改活动信息] 失败：', err)
    });
  },



  //根据id删除活动
  removeActivityById: function (activityId, callback) {
    db.collection('activity').doc(activityId).remove().then(res => {
      console.log('[数据库] [根据id删除活动] 成功: ', res);
      callback(res.stats.removed);
    }).catch(err => {
      console.error('[数据库] [根据id删除活动] 失败：', err)
    });
  }

}