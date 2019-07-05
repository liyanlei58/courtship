const db = wx.cloud.database()
const _ = db.command

module.exports = {

  //分页查询我的打分列表，cb回调函数
  findPageScoreByOpenid: function (openid, niceScore, start, count, callback) {
    // 查询所有的打分记录
    var dbQuery = db.collection('score').where({
      _openid: openid,
      score: _.gte(niceScore)
    }).orderBy('activity.date', 'desc');
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

  //添加打分 
  addScore: function(score, callback) {
    db.collection('score').add({
      data: score
    }).then(res => {
      // 在返回结果中会包含新创建的记录的 _id
      console.log('[数据库] [添加打分] 成功，记录 _id: ', res._id)
      callback(res._id);
    }).catch(err => {
      console.error('[数据库] [添加打分] 失败：', err)
    });
  },

  //修改分值
  updateScore: function(scoreId, score, callback) {
    // console.log("update score:", score);
    db.collection('score').doc(scoreId).update({
      data: score
    }).then(res => {
      console.log('[数据库] [修改分值]，result: ', res.stats.updated)
      callback(res.stats.updated);
    }).catch(err => {
      console.error('[数据库] [修改分值] 失败：', err)
    });
  },


  //查询打分记录
  findScoreByQuery: function(query, callback) {
    db.collection('score').where(query).get().then(res => {
      console.log('[数据库] [查询打分记录] 成功: ', res);
      callback(res.data);
    }).catch(err => {
      console.error('[数据库] [查询打分记录] 失败：', err)
    });
  },

  //查询打分记录，openid --> toUserId
  findScoreByActivityIdAndOpenidAndUserId: function(activityId, openid, toUserId, callback) {
    db.collection('score').where({
      activity:{
        _id: activityId,
      },
      _openid: openid,
      user:{
        _id: toUserId
      }
    }).get().then(res => {
      console.log('[数据库] [查询打分记录] 成功: ', res);
      callback(res.data);
    }).catch(err => {
      console.error('[数据库] [查询打分记录] 失败：', err)
    });
  },

  //查询同一个活动，同一个人打分的记录数
  findCountByActivityIdAndOpenid: function(activityId, openid, callback) {
    db.collection('score').where({
      activity: {
        _id: activityId,
      },
      _openid: openid
    }).count().then(res => {
      console.log('[数据库] [打分的记录数] 成功: ', res.total);
      callback(res.total);
    }).catch(err => {
      console.error('[数据库] [打分的记录数] 失败：', err)
    });
  },



}